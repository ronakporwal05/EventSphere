'use client';

import React from 'react';
import { X, Heart, Ticket, Trash2, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { EventbriteCardData } from './EventbriteCard';

interface SavedLikesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  likedEvents: EventbriteCardData[];
  onRemoveLike: (id: string) => void;
  onBookTickets: (event: EventbriteCardData) => void;
}

export const SavedLikesDrawer: React.FC<SavedLikesDrawerProps> = ({
  isOpen,
  onClose,
  likedEvents,
  onRemoveLike,
  onBookTickets,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-black shadow-[10px_0px_0px_#000] flex flex-col justify-between border-l-3 border-black">
          {/* Header */}
          <div className="p-5 bg-[#f5ce32] border-b-3 border-black flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-black text-[#f5ce32] border border-black shadow-[1px_1px_0px_#000]">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
              </div>
              <div>
                <span className="px-2 py-0.5 bg-black text-[#f5ce32] text-[9px] font-black uppercase rounded border border-black">
                  FAVORITES
                </span>
                <h3 className="text-base font-black uppercase tracking-tight text-black mt-0.5">
                  Saved Events
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close Saved Events Drawer"
              className="p-1.5 rounded-xl bg-black text-white hover:bg-neutral-800 border border-black shadow-[2px_2px_0px_#000]"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#fbfbf9]">
            {likedEvents.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000]">
                <div className="w-16 h-16 rounded-2xl bg-[#f5ce32] border-2 border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
                  <Heart className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-black uppercase text-black">
                  No saved events yet
                </h4>
                <p className="text-xs text-neutral-600 font-bold max-w-xs">
                  Click the heart icon on any event card to save it for quick booking.
                </p>
              </div>
            ) : (
              likedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 rounded-2xl border-2 border-black bg-white flex flex-col gap-3 shadow-[4px_4px_0px_#000]"
                >
                  <div className="flex gap-3">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-black"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block">
                        {evt.startDate}
                      </span>
                      <h5 className="text-xs sm:text-sm font-black uppercase text-black line-clamp-2 leading-snug">
                        {evt.title}
                      </h5>
                      <p className="text-[11px] font-bold text-neutral-600 truncate mt-0.5">
                        {evt.venueName}, {evt.city}
                      </p>
                      <span className="text-xs font-black text-black mt-1 block">
                        {evt.formattedPrice}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t-2 border-neutral-100">
                    <button
                      onClick={() => {
                        onClose();
                        onBookTickets(evt);
                      }}
                      className="flex-1 py-2 px-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <Ticket className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Book Pass</span>
                    </button>
                    <button
                      onClick={() => onRemoveLike(evt.id)}
                      className="p-2 text-neutral-500 hover:text-black border-2 border-black rounded-xl hover:bg-rose-100 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t-3 border-black bg-white">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#f5ce32]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
