// server.ts
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getCourses, getCourseBySlug, getNotices, createNotice, deleteNotice, getAchievers, createAchiever, getGalleryItems, getTestimonials } from './src/db/portal.ts';
import { createAdmission, getAdmissionByAppNumber, getAdmissionsByUser, getAllAdmissions, updateAdmissionStatus } from './src/db/admissions.ts';
import { createInquiry, getAllInquiries, updateInquiryStatus } from './src/db/inquiries.ts';
import { getOrCreateUser, getUserByUid } from './src/db/users.ts';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Jagdamb Coaching Center API',
      timestamp: new Date().toISOString(),
    });
  });

  // Public Portal Endpoints
  app.get('/api/courses', async (req, res) => {
    try {
      const list = await getCourses();
      res.json(list);
    } catch (error: any) {
      console.error('API /courses error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch courses' });
    }
  });

  app.get('/api/courses/:slug', async (req, res) => {
    try {
      const course = await getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json(course);
    } catch (error: any) {
      console.error('API /courses/:slug error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch course details' });
    }
  });

  app.get('/api/notices', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const list = await getNotices(category);
      res.json(list);
    } catch (error: any) {
      console.error('API /notices error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch notices' });
    }
  });

  app.get('/api/achievers', async (req, res) => {
    try {
      const list = await getAchievers();
      res.json(list);
    } catch (error: any) {
      console.error('API /achievers error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch achievers' });
    }
  });

  app.get('/api/gallery', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const list = await getGalleryItems(category);
      res.json(list);
    } catch (error: any) {
      console.error('API /gallery error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch gallery items' });
    }
  });

  app.get('/api/testimonials', async (req, res) => {
    try {
      const list = await getTestimonials();
      res.json(list);
    } catch (error: any) {
      console.error('API /testimonials error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch testimonials' });
    }
  });

  // Admission Submissions (Public or Authenticated)
  app.post('/api/admissions', optionalAuth, async (req: AuthRequest, res) => {
    try {
      const {
        studentName,
        parentName,
        email,
        phone,
        whatsapp,
        grade,
        course,
        schoolName,
        previousScore,
        address,
        batchPreference,
        notes,
      } = req.body;

      if (!studentName || !parentName || !phone || !grade || !course || !address) {
        return res.status(400).json({ error: 'Missing required admission fields' });
      }

      const admission = await createAdmission({
        studentName,
        parentName,
        email: email || (req.user?.email || ''),
        phone,
        whatsapp,
        grade,
        course,
        schoolName,
        previousScore,
        address,
        batchPreference,
        notes,
        userUid: req.user?.uid,
      });

      res.status(201).json({
        success: true,
        message: 'Admission form submitted successfully!',
        admission,
      });
    } catch (error: any) {
      console.error('API /admissions error:', error);
      res.status(500).json({ error: error.message || 'Failed to submit admission' });
    }
  });

  // Track Application by Application Number (e.g. JCC-2026-...)
  app.get('/api/admissions/track/:appNumber', async (req, res) => {
    try {
      const admission = await getAdmissionByAppNumber(req.params.appNumber);
      if (!admission) {
        return res.status(404).json({ error: 'No application found with this reference number. Please check and try again.' });
      }
      res.json(admission);
    } catch (error: any) {
      console.error('API /admissions/track error:', error);
      res.status(500).json({ error: error.message || 'Failed to track application' });
    }
  });

  // Authenticated Student's Own Applications
  app.get('/api/admissions/my', requireAuth, async (req: AuthRequest, res) => {
    try {
      const userUid = req.user!.uid;
      const list = await getAdmissionsByUser(userUid);
      res.json(list);
    } catch (error: any) {
      console.error('API /admissions/my error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch user applications' });
    }
  });

  // Inquiries / Contact Form
  app.post('/api/inquiries', async (req, res) => {
    try {
      const { fullName, email, phone, subject, message } = req.body;
      if (!fullName || !phone || !message) {
        return res.status(400).json({ error: 'Please provide full name, phone number, and message' });
      }
      const inquiry = await createInquiry({
        fullName,
        email: email || 'not-provided@jagdamb.com',
        phone,
        subject: subject || 'General Inquiry',
        message,
      });
      res.status(201).json({
        success: true,
        message: 'Thank you for reaching out! Our coaching team will contact you shortly.',
        inquiry,
      });
    } catch (error: any) {
      console.error('API /inquiries error:', error);
      res.status(500).json({ error: error.message || 'Failed to submit message' });
    }
  });

  // User Profile Sync
  app.post('/api/users/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = await getOrCreateUser({
        uid: req.user!.uid,
        email: req.user!.email || '',
        displayName: req.user!.name || req.body.displayName || '',
        photoUrl: req.user!.picture || req.body.photoUrl || '',
        phone: req.body.phone || '',
        role: req.body.role || 'student',
      });
      res.json(user);
    } catch (error: any) {
      console.error('API /users/sync error:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Admin / Management endpoints
  app.get('/api/admin/admissions', async (req, res) => {
    try {
      const list = await getAllAdmissions();
      res.json(list);
    } catch (error: any) {
      console.error('API /admin/admissions error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch admissions list' });
    }
  });

  app.patch('/api/admin/admissions/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      const updated = await updateAdmissionStatus(id, status);
      res.json(updated);
    } catch (error: any) {
      console.error('API /admin/admissions/:id/status error:', error);
      res.status(500).json({ error: error.message || 'Failed to update admission status' });
    }
  });

  app.get('/api/admin/inquiries', async (req, res) => {
    try {
      const list = await getAllInquiries();
      res.json(list);
    } catch (error: any) {
      console.error('API /admin/inquiries error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch inquiries' });
    }
  });

  app.patch('/api/admin/inquiries/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      const updated = await updateInquiryStatus(id, status);
      res.json(updated);
    } catch (error: any) {
      console.error('API /admin/inquiries/:id/status error:', error);
      res.status(500).json({ error: error.message || 'Failed to update inquiry status' });
    }
  });

  app.post('/api/admin/notices', async (req, res) => {
    try {
      const { title, marathiTitle, category, publishDate, content, isNew, priority } = req.body;
      if (!title || !category || !content) {
        return res.status(400).json({ error: 'Missing required notice fields' });
      }
      const notice = await createNotice({
        title,
        marathiTitle,
        category,
        publishDate: publishDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        content,
        isNew: isNew ?? 1,
        priority: priority || 'normal',
      });
      res.status(201).json(notice);
    } catch (error: any) {
      console.error('API /admin/notices error:', error);
      res.status(500).json({ error: error.message || 'Failed to create notice' });
    }
  });

  app.delete('/api/admin/notices/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await deleteNotice(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      console.error('API /admin/notices/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete notice' });
    }
  });

  app.post('/api/admin/achievers', async (req, res) => {
    try {
      const { studentName, marathiName, rank, examName, score, year, photoUrl, citation } = req.body;
      if (!studentName || !rank || !examName || !year) {
        return res.status(400).json({ error: 'Missing required achiever fields' });
      }
      const achiever = await createAchiever({
        studentName,
        marathiName,
        rank,
        examName,
        score,
        year,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
        citation,
      });
      res.status(201).json(achiever);
    } catch (error: any) {
      console.error('API /admin/achievers error:', error);
      res.status(500).json({ error: error.message || 'Failed to create achiever' });
    }
  });

  // Vite Middleware Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jagdamb Coaching Center Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
