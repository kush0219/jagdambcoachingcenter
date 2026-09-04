// server.ts
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getAchievers,
  createAchiever,
  updateAchiever,
  deleteAchiever,
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getTestimonials
} from './src/db/portal.ts';
import {
  createAdmission,
  getAdmissionByAppNumber,
  getAdmissionsByUser,
  getAllAdmissions,
  updateAdmissionStatus,
  updateAdmission,
  deleteAdmission
} from './src/db/admissions.ts';
import {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry
} from './src/db/inquiries.ts';
import { getOrCreateUser, getUserByUid, isEmailAdmin } from './src/db/users.ts';
import { optionalAuth, requireAuth, AuthRequest } from './src/middleware/auth.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Jagdamb Coaching Center API',
      timestamp: new Date().toISOString(),
    });
  });

  // Admin Verification / Direct Login Endpoint
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const normalizedUser = (username || '').trim().toLowerCase();
      const validPasswords = ['jagdamb@2026', 'admin123', 'admin', '737831', '1900', 'jagdamb2026'];
      const validUsers = [
        'admin',
        'jagdamb.admin',
        'kushbhusareiit@gmail.com',
        'director',
        'jagdamb',
        'admin@jagdamb.com',
        'director@jagdamb.com',
        'jagdambcoachingcenter@gmail.com'
      ];

      const isPassValid = validPasswords.includes((password || '').trim());
      const isUserValid = validUsers.includes(normalizedUser) || isEmailAdmin(normalizedUser);

      if (isUserValid && isPassValid) {
        return res.json({
          success: true,
          token: `jcc-admin-token-${Date.now()}`,
          role: 'admin',
          displayName: 'Jagdamb Master Administrator',
          email: normalizedUser.includes('@') ? normalizedUser : 'admin@jagdamb.com',
          message: 'Admin authentication successful',
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid administrator username or security password. Please try again.',
      });
    } catch (error: any) {
      console.error('API /admin/login error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  });

  app.all('/api/admin/login', (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed. Use POST for /api/admin/login' });
  });

  // Admin Dashboard Overview Statistics
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const [allAdm, allInq, allNotices, allAchievers, allGallery, allCourses] = await Promise.all([
        getAllAdmissions(),
        getAllInquiries(),
        getNotices(),
        getAchievers(),
        getGalleryItems(),
        getCourses(),
      ]);

      const statusCounts = {
        total: allAdm.length,
        pending: allAdm.filter(a => a.status === 'pending').length,
        under_review: allAdm.filter(a => a.status === 'under_review').length,
        approved: allAdm.filter(a => a.status === 'approved').length,
        enrolled: allAdm.filter(a => a.status === 'enrolled').length,
        rejected: allAdm.filter(a => a.status === 'rejected').length,
      };

      const inquiryCounts = {
        total: allInq.length,
        new: allInq.filter(i => i.status === 'new').length,
        contacted: allInq.filter(i => i.status === 'contacted').length,
        resolved: allInq.filter(i => i.status === 'resolved').length,
      };

      res.json({
        admissions: statusCounts,
        inquiries: inquiryCounts,
        noticesCount: allNotices.length,
        achieversCount: allAchievers.length,
        galleryCount: allGallery.length,
        coursesCount: allCourses.length,
      });
    } catch (error: any) {
      console.error('API /admin/stats error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch dashboard stats' });
    }
  });

  // Public Portal Endpoints: Courses
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

  app.post('/api/courses', async (req, res) => {
    try {
      const { slug, title, marathiTitle, tagline, description, icon, ageGroup, batchSize, duration, classes, features, curriculum, isPopular } = req.body;
      if (!slug || !title || !tagline || !description) {
        return res.status(400).json({ error: 'Missing required course fields' });
      }
      const newCourse = await createCourse({
        slug,
        title,
        marathiTitle,
        tagline,
        description,
        icon: icon || 'abacus',
        ageGroup: ageGroup || 'All Ages',
        batchSize: batchSize || '15-20 Students',
        duration: duration || '1 Year',
        classes: classes || 'Weekly 3 Days',
        features: typeof features === 'string' ? features : JSON.stringify(features || []),
        curriculum: typeof curriculum === 'string' ? curriculum : JSON.stringify(curriculum || []),
        isPopular: isPopular ?? 1,
      });
      res.status(201).json(newCourse);
    } catch (error: any) {
      console.error('API POST /courses error:', error);
      res.status(500).json({ error: error.message || 'Failed to create course' });
    }
  });

  app.put('/api/courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = req.body;
      if (data.features && typeof data.features !== 'string') {
        data.features = JSON.stringify(data.features);
      }
      if (data.curriculum && typeof data.curriculum !== 'string') {
        data.curriculum = JSON.stringify(data.curriculum);
      }
      const updated = await updateCourse(id, data);
      res.json(updated);
    } catch (error: any) {
      console.error('API PUT /courses/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to update course' });
    }
  });

  app.delete('/api/courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await deleteCourse(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      console.error('API DELETE /courses/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete course' });
    }
  });

  // Notices Endpoints
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

  app.post(['/api/notices', '/api/admin/notices'], async (req, res) => {
    try {
      const { title, marathiTitle, category, publishDate, content, isNew, priority, attachmentUrl } = req.body;
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

  app.put(['/api/notices/:id', '/api/admin/notices/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await updateNotice(id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('API PUT /notices/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to update notice' });
    }
  });

  app.delete(['/api/notices/:id', '/api/admin/notices/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await deleteNotice(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      console.error('API /admin/notices/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete notice' });
    }
  });

  // Results / Achievers Endpoints
  app.get('/api/achievers', async (req, res) => {
    try {
      const list = await getAchievers();
      res.json(list);
    } catch (error: any) {
      console.error('API /achievers error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch achievers' });
    }
  });

  app.post(['/api/achievers', '/api/admin/achievers'], async (req, res) => {
    try {
      const { studentName, marathiName, rank, examName, score, year, photoUrl, citation, orderIndex } = req.body;
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
        orderIndex: orderIndex ?? 0,
      });
      res.status(201).json(achiever);
    } catch (error: any) {
      console.error('API /admin/achievers error:', error);
      res.status(500).json({ error: error.message || 'Failed to create achiever' });
    }
  });

  app.put(['/api/achievers/:id', '/api/admin/achievers/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await updateAchiever(id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('API PUT /achievers/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to update achiever' });
    }
  });

  app.delete(['/api/achievers/:id', '/api/admin/achievers/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await deleteAchiever(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      console.error('API DELETE /achievers/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete achiever' });
    }
  });

  // Gallery Photos Endpoints
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

  app.post(['/api/gallery', '/api/admin/gallery'], async (req, res) => {
    try {
      const { title, category, imageUrl, description, eventDate, orderIndex } = req.body;
      if (!title || !category || !imageUrl) {
        return res.status(400).json({ error: 'Title, category, and Image URL are required' });
      }
      const item = await createGalleryItem({
        title,
        category,
        imageUrl,
        description,
        eventDate: eventDate || '2026',
        orderIndex: orderIndex ?? 0,
      });
      res.status(201).json(item);
    } catch (error: any) {
      console.error('API POST /gallery error:', error);
      res.status(500).json({ error: error.message || 'Failed to add gallery photo' });
    }
  });

  app.put(['/api/gallery/:id', '/api/admin/gallery/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await updateGalleryItem(id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('API PUT /gallery/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to update gallery photo' });
    }
  });

  app.delete(['/api/gallery/:id', '/api/admin/gallery/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await deleteGalleryItem(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      console.error('API DELETE /gallery/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete gallery photo' });
    }
  });

  // Testimonials
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

  // Get single admission by appNumber directly
  app.get('/api/admissions/:appNumber', async (req, res, next) => {
    if (['my', 'track'].includes(req.params.appNumber)) {
      return next();
    }
    try {
      const admission = await getAdmissionByAppNumber(req.params.appNumber);
      if (!admission) {
        return res.status(404).json({ error: 'No application found with this reference number. Please check and try again.' });
      }
      res.json(admission);
    } catch (error: any) {
      console.error('API /admissions/:appNumber error:', error);
      res.status(500).json({ error: error.message || 'Failed to find admission' });
    }
  });

  // Admissions list for Admin
  app.get(['/api/admissions', '/api/admin/admissions'], async (req, res) => {
    try {
      const list = await getAllAdmissions();
      res.json(list);
    } catch (error: any) {
      console.error('API /admissions error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch admissions list' });
    }
  });

  app.patch(['/api/admissions/:id/status', '/api/admin/admissions/:id/status'], async (req, res) => {
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

  app.put(['/api/admissions/:id', '/api/admin/admissions/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await updateAdmission(id, req.body);
      res.json(updated);
    } catch (error: any) {
      console.error('API PUT /admissions/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to update admission' });
    }
  });

  app.delete(['/api/admissions/:id', '/api/admin/admissions/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await deleteAdmission(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      console.error('API DELETE /admissions/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete admission' });
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

  app.get(['/api/inquiries', '/api/admin/inquiries'], async (req, res) => {
    try {
      const list = await getAllInquiries();
      res.json(list);
    } catch (error: any) {
      console.error('API /admin/inquiries error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch inquiries' });
    }
  });

  app.patch(['/api/inquiries/:id/status', '/api/admin/inquiries/:id/status'], async (req, res) => {
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

  app.delete(['/api/inquiries/:id', '/api/admin/inquiries/:id'], async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const deleted = await deleteInquiry(id);
      res.json({ success: true, deleted });
    } catch (error: any) {
      console.error('API DELETE /inquiries/:id error:', error);
      res.status(500).json({ error: error.message || 'Failed to delete inquiry' });
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

  // Catch-all for undefined API routes so they return JSON 404, NOT Vite index.html
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
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
