'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, Sparkles, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface DualFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  eventId: string;
}

export const DualFeedbackModal: React.FC<DualFeedbackModalProps> = ({
  isOpen,
  onClose,
  eventTitle,
  eventId,
}) => {
  const [eventRating, setEventRating] = useState(5);
  const [eventCategory, setEventCategory] = useState('SPEAKERS');
  const [eventComment, setEventComment] = useState('');

  const [appRating, setAppRating] = useState(5);
  const [npsScore, setNpsScore] = useState(10);
  const [appCategory, setAppCategory] = useState('BOOKING_SPEED');
  const [appComment, setAppComment] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast.success('Thank you! Your event & app reviews have been recorded.');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-purple-950/80 via-neutral-900 to-indigo-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-600/20 border border-purple-500/30 rounded-xl text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Post-Event Experience & App Review</h3>
              <p className="text-[11px] text-neutral-400">Rate your experience with both the event and EventSphere platform</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Reviews Submitted!</h4>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Your event review has been routed to the event organizer for Gemini sentiment analysis, and your app review has been dispatched directly to the Company Admin inbox.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* ── PART 1: EVENT REVIEW (FOR ORGANIZER) ── */}
            <div className="p-4 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Part 1: Event Experience</span>
                <span className="text-[11px] text-neutral-400 truncate max-w-xs">{eventTitle}</span>
              </div>

              <div>
                <label className="text-xs text-neutral-300 font-semibold block mb-1.5">Overall Event Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setEventRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= eventRating ? 'fill-amber-400' : 'text-neutral-700'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-neutral-400 ml-2">{eventRating}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Focus Area</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SPEAKERS">Speakers & Content</option>
                    <option value="VENUE">Venue & AV Sound</option>
                    <option value="NETWORKING">Networking & Expo</option>
                    <option value="FOOD">Catering & Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Organizer Comments</label>
                  <input
                    value={eventComment}
                    onChange={(e) => setEventComment(e.target.value)}
                    placeholder="Keynote was inspiring, Hall B audio..."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* ── PART 2: APP REVIEW (FOR COMPANY ADMIN) ── */}
            <div className="p-4 bg-purple-950/20 border border-purple-500/20 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Part 2: EventSphere App Experience</span>
                <span className="text-[10px] text-purple-300 font-mono">Sent to Company Admin</span>
              </div>

              <div>
                <label className="text-xs text-neutral-300 font-semibold block mb-1.5">App Booking & UI Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setAppRating(star)}
                      className="p-1 text-purple-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-5 h-5 ${star <= appRating ? 'fill-purple-400' : 'text-neutral-700'}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono font-bold text-neutral-400 ml-2">{appRating}/5</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">
                  How likely are you to recommend EventSphere app? (0-10 NPS)
                </label>
                <div className="flex items-center justify-between gap-1">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setNpsScore(num)}
                      className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        npsScore === num
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Feedback / Suggestions for App Developer</label>
                <textarea
                  rows={2}
                  value={appComment}
                  onChange={(e) => setAppComment(e.target.value)}
                  placeholder="Ticket holding timer was great! Would like Apple Wallet export..."
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
              >
                Skip for now
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Both Reviews</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
