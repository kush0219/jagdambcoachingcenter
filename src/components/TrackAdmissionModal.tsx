// src/components/TrackAdmissionModal.tsx
import React, { useState } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  User,
  GraduationCap,
  Calendar,
  Building
} from 'lucide-react';
import { Admission } from '../types.ts';

interface TrackAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackAdmissionModal: React.FC<TrackAdmissionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [appNumber, setAppNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Admission | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appNumber.trim()) {
      setError('Please enter your Application Number (e.g. JCC-2026-0001)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/admissions/${encodeURIComponent(appNumber.trim())}`);
      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = null;
      }

      if (res.ok && data) {
        setResult(data);
      } else {
        setError(data?.error || 'No admission record found with this application number.');
      }
    } catch (err) {
      setError('Failed to reach server. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: Admission['status']) => {
    switch (status) {
      case 'enrolled':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
            Enrolled & Batch Allocated
          </span>
        );
      case 'approved':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
            Application Approved
          </span>
        );
      case 'under_review':
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full">
            Under Document Verification
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
            Not Selected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded-full">
            Application Pending Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#0f2942] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Search className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-bold font-heading">
              Track Admission Application
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleTrack} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Enter Application Reference Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={appNumber}
                onChange={(e) => setAppNumber(e.target.value.toUpperCase())}
                placeholder="e.g. JCC-2026-0001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 uppercase focus:outline-hidden focus:border-orange-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shrink-0 transition-colors disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Demo search tip: Try <code>JCC-2026-0001</code> to view sample approved admission.
            </p>
          </form>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Application Number</p>
                  <p className="text-sm font-black text-[#0f2942] font-heading">{result.applicationNumber}</p>
                </div>
                {getStatusBadge(result.status)}
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{result.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Parent / Guardian:</span>
                  <span className="font-semibold">{result.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Course Selected:</span>
                  <span className="font-bold text-orange-600">{result.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Grade / Std:</span>
                  <span>{result.grade}</span>
                </div>
                {result.batchPreference && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Timing:</span>
                    <span className="font-medium text-slate-800">{result.batchPreference}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-[11px] text-slate-500">
                  <span>Application Date:</span>
                  <span>{new Date(result.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <a
                  href={`tel:7378311900`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  <span>Need help? Call Center Helpline 7378311900</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
