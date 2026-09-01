// src/components/ContactView.tsx
import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface ContactViewProps {
  setActiveTab: (tab: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ setActiveTab }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Admission Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !message) {
      setError('Please fill in your name, phone number, and message.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: email || `${phone}@student.local`,
          phone,
          subject,
          message,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to submit message. Please try again.');
      }
    } catch (err: any) {
      setError('Network error. Please check your connection and retry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-12 pb-16">
      {/* Banner */}
      <section className="bg-[#0f2942] text-white py-12 px-4 sm:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-heading">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            <button onClick={() => setActiveTab('home')} className="hover:text-orange-400">Home</button>
            <span className="mx-2">›</span>
            <span className="text-orange-400">Contact Us</span>
          </p>
        </div>
      </section>

      {/* Main Contact Grid (matches reference 08. Contact Us Page) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards + Center Details */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  GET IN TOUCH
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f2942] mt-1 font-heading">
                  Visit or Call Our Center
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  We are glad to welcome parents and students for counseling and batch enrollments.
                </p>
              </div>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href="tel:7378311900"
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/70 border border-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Phone & WhatsApp</p>
                    <p className="text-sm font-extrabold text-[#0f2942] group-hover:text-orange-600 transition-colors">
                      7378311900
                    </p>
                    <p className="text-xs text-slate-500">Mon to Sat: 7:00 AM - 7:00 PM</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:jagdambcoachingcenter@gmail.com"
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 hover:bg-orange-50/70 border border-slate-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Official Email</p>
                    <p className="text-xs sm:text-sm font-bold text-[#0f2942] truncate group-hover:text-blue-600 transition-colors">
                      jagdambcoachingcenter@gmail.com
                    </p>
                    <p className="text-xs text-slate-500">Queries answered within 24 hours</p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Center Address</p>
                    <p className="text-xs sm:text-sm font-bold text-[#0f2942]">
                      Toki, Ambelohal, Tal. Gangapur, Dist. Chhatrapati Sambhajinagar, Maharashtra - 431109
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Landmark: Near Grampanchayat Road</p>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">Website & Portal</p>
                    <p className="text-xs sm:text-sm font-bold text-[#0f2942]">
                      www.jagdambcoachingcenter.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send Us A Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  MESSAGE US
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0f2942] mt-1 font-heading">
                  Send an Inquiry
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Have a question regarding batches, fees, or curriculum? Fill out the form below.
                </p>
              </div>

              {success ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-950 font-heading">
                    Thank you! Your message has been sent.
                  </h3>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto">
                    Our center administration has received your message and will call you on your phone number shortly.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 font-medium">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Patil"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. parent@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Subject / Program
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 font-medium"
                      >
                        <option value="Admission Inquiry">Admission Inquiry</option>
                        <option value="Jagdamb Proactive Abacus">Jagdamb Proactive Abacus</option>
                        <option value="Navodaya Entrance Exam">Navodaya Entrance Exam (5th)</option>
                        <option value="Scholarship Exam (4th & 7th)">Scholarship Exam (4th & 7th)</option>
                        <option value="Mental Math Speed Program">Mental Math Speed Program</option>
                        <option value="Fee Structure & Timings">Fee Structure & Timings</option>
                        <option value="Other Query">Other Query</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Message / Details *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please let us know your child's grade and what information you are seeking..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Send Message Now'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
