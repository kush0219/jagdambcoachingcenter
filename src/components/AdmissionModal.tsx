// src/components/AdmissionModal.tsx
import React, { useState } from 'react';
import {
  X,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Phone,
  Calendar,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: string;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  initialCourse,
}) => {
  const { user } = useAuth();
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [grade, setGrade] = useState('5th Standard');
  const [course, setCourse] = useState(initialCourse || 'Jagdamb Proactive Abacus');
  const [schoolName, setSchoolName] = useState('');
  const [previousScore, setPreviousScore] = useState('');
  const [address, setAddress] = useState('');
  const [batchPreference, setBatchPreference] = useState('Evening (4:30 PM - 6:00 PM)');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !parentName || !phone || !address) {
      setError('Please fill in all mandatory fields (marked with *).');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          parentName,
          email: email || `${phone}@student.local`,
          phone,
          whatsapp: whatsapp || phone,
          grade,
          course,
          schoolName,
          previousScore,
          address,
          batchPreference,
          notes,
          userUid: user?.uid || null,
        }),
      });

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = null;
      }

      if (res.ok && data) {
        setSubmittedData(data);
      } else {
        setError(data?.error || 'Failed to submit admission application.');
      }
    } catch (err: any) {
      setError('Network connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyAppNumber = () => {
    if (!submittedData?.applicationNumber) return;
    navigator.clipboard.writeText(submittedData.applicationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setSubmittedData(null);
    setStudentName('');
    setParentName('');
    setPhone('');
    setWhatsapp('');
    setSchoolName('');
    setAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#0f2942] text-white p-5 sm:p-6 sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-heading">
                Online Admission Form 2026-27
              </h3>
              <p className="text-xs text-orange-300">Jagdamb Coaching Center, Gangapur</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {submittedData ? (
            <div className="space-y-6 text-center animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 font-heading">
                  Admission Application Submitted!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  Congratulations! We have received your application for <strong>{submittedData.studentName}</strong>.
                </p>
              </div>

              {/* Reference Number Card */}
              <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 text-center max-w-md mx-auto">
                <p className="text-[11px] font-bold text-orange-800 uppercase tracking-wider">
                  Your Application Reference Number
                </p>
                <div className="flex items-center justify-center gap-3 mt-1">
                  <span className="text-2xl font-black text-[#0f2942] tracking-wider font-heading">
                    {submittedData.applicationNumber}
                  </span>
                  <button
                    onClick={copyAppNumber}
                    className="p-1.5 rounded-lg bg-white border border-orange-300 hover:bg-orange-100 text-orange-700 transition-colors"
                    title="Copy Application Number"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Please save this number to track your admission status online.
                </p>
              </div>

              {/* Next Steps */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-2">
                <p className="font-bold text-slate-900">Next Steps:</p>
                <p>1. Our academic counselor will call you on <strong>{submittedData.phone}</strong> for batch allocation.</p>
                <p>2. Please visit our center in Toki, Ambelohal for the free demo class and study kit handover.</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/917378311900?text=Hello%20Jagdamb%20Coaching%2C%20I%20have%20submitted%20admission%20form%20for%20${submittedData.studentName}%20(App%20No%3A%20${submittedData.applicationNumber})`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Admission Desk</span>
                </a>
                <button
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Student & Parent Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. Sai Kiran Gayakwad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Kiran Gayakwad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Phone *
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="If different from mobile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Course & Grade Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Desired Course Program *
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 font-medium"
                  >
                    <option value="Jagdamb Proactive Abacus">Jagdamb Proactive Abacus (34 Formulas)</option>
                    <option value="Navodaya Entrance Exam">Navodaya Entrance Exam (5th Std)</option>
                    <option value="Scholarship Exam (4th & 7th)">Scholarship Exam (4th & 7th Std)</option>
                    <option value="Mental Math Program">Mental Math Speed Program</option>
                    <option value="Vedic Maths Masterclass">Vedic Maths Masterclass</option>
                    <option value="Foundation School Maths">Foundation School Maths (Std 1st - 10th)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current Grade / Standard *
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 font-medium"
                  >
                    <option value="1st Standard">1st Standard</option>
                    <option value="2nd Standard">2nd Standard</option>
                    <option value="3rd Standard">3rd Standard</option>
                    <option value="4th Standard">4th Standard (Scholarship)</option>
                    <option value="5th Standard">5th Standard (Navodaya Prep)</option>
                    <option value="6th Standard">6th Standard</option>
                    <option value="7th Standard">7th Standard (Scholarship)</option>
                    <option value="8th Standard">8th Standard</option>
                    <option value="9th Standard">9th Standard</option>
                    <option value="10th Standard">10th Standard</option>
                  </select>
                </div>
              </div>

              {/* School Name & Batch Preference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Current School Name
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Z.P. High School, Ambelohal"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preferred Batch Time
                  </label>
                  <select
                    value={batchPreference}
                    onChange={(e) => setBatchPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500 font-medium"
                  >
                    <option value="Morning (7:30 AM - 9:00 AM)">Morning (7:30 AM - 9:00 AM)</option>
                    <option value="Evening (4:30 PM - 6:00 PM)">Evening (4:30 PM - 6:00 PM)</option>
                    <option value="Weekend Special (Sat & Sun)">Weekend Special (Sat & Sun)</option>
                  </select>
                </div>
              </div>

              {/* Residential Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Residential Village / City Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Village / Town, Landmark, Taluka..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-orange-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-yellow-200" />
                <span>{submitting ? 'Submitting Application...' : 'Submit Admission Application'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
