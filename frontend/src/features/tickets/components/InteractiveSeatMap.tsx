'use client';

import React, { useState } from 'react';
import { Sparkles, Check, X, Shield, Users, Info } from 'lucide-react';
import { toast } from 'sonner';

export interface SelectedSeat {
  id: string;
  row: string;
  number: number;
  tier: 'Diamond VIP' | 'Gold Executive' | 'Silver General';
  price: number;
}

interface InteractiveSeatMapProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  onConfirmSeats: (seats: SelectedSeat[]) => void;
}

export const InteractiveSeatMap: React.FC<InteractiveSeatMapProps> = ({
  isOpen,
  onClose,
  eventTitle,
  onConfirmSeats,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);

  if (!isOpen) return null;

  // Preset occupied seats for realistic booking simulation
  const occupiedSet = new Set([
    'A-4', 'A-5', 'A-6', 'B-1', 'B-2', 'B-11', 'B-12', 'C-6', 'C-7',
    'D-3', 'D-4', 'E-8', 'E-9', 'F-5', 'F-6', 'G-1', 'G-2', 'H-10', 'H-11',
    'I-2', 'I-3', 'J-7', 'K-4', 'K-5', 'L-8', 'M-6', 'N-1', 'N-2', 'N-11'
  ]);

  const rows = [
    { row: 'A', tier: 'Diamond VIP' as const, price: 3499 },
    { row: 'B', tier: 'Diamond VIP' as const, price: 3499 },
    { row: 'C', tier: 'Diamond VIP' as const, price: 3499 },
    { row: 'D', tier: 'Gold Executive' as const, price: 1999 },
    { row: 'E', tier: 'Gold Executive' as const, price: 1999 },
    { row: 'F', tier: 'Gold Executive' as const, price: 1999 },
    { row: 'G', tier: 'Gold Executive' as const, price: 1999 },
    { row: 'H', tier: 'Gold Executive' as const, price: 1999 },
    { row: 'I', tier: 'Silver General' as const, price: 1499 },
    { row: 'J', tier: 'Silver General' as const, price: 1499 },
    { row: 'K', tier: 'Silver General' as const, price: 1499 },
    { row: 'L', tier: 'Silver General' as const, price: 1499 },
    { row: 'M', tier: 'Silver General' as const, price: 1499 },
    { row: 'N', tier: 'Silver General' as const, price: 1499 },
  ];

  const totalSeatsPerRow = 12;

  const toggleSeat = (rowName: string, seatNum: number, tier: any, price: number) => {
    const seatId = `${rowName}-${seatNum}`;
    if (occupiedSet.has(seatId)) {
      toast.error(`Seat ${seatId} is already booked by another attendee.`);
      return;
    }

    const exists = selectedSeats.some((s) => s.id === seatId);
    if (exists) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        toast.warning('Maximum 6 seats can be selected per transaction.');
        return;
      }
      setSelectedSeats((prev) => [
        ...prev,
        { id: seatId, row: rowName, number: seatNum, tier, price },
      ]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to continue.');
      return;
    }
    onConfirmSeats(selectedSeats);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-neutral-900 border border-amber-500/30 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-orange-950/80 via-neutral-900 to-amber-950/80 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded uppercase">
                BookMyShow & District Layout
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight">Interactive Seat & Stage Selector</h3>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 truncate max-w-md">{eventTitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stage & Legend Strip */}
        <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-purple-500/20 border border-purple-500" />
              <span className="text-purple-300 font-semibold">Diamond VIP (₹3,499)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-amber-500/20 border border-amber-500" />
              <span className="text-amber-300 font-semibold">Gold Executive (₹1,999)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-blue-500/20 border border-blue-500" />
              <span className="text-blue-300 font-semibold">Silver General (₹1,499)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-neutral-800 border border-neutral-700" />
              <span className="text-neutral-500">Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-md bg-emerald-500 border border-emerald-400 flex items-center justify-center text-[8px] text-black font-bold">
                ✓
              </span>
              <span className="text-emerald-400 font-semibold">Selected</span>
            </div>
          </div>
        </div>

        {/* Seat Grid Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col items-center">
          {/* Main Stage Graphic */}
          <div className="w-full max-w-xl flex flex-col items-center space-y-1">
            <div className="w-full h-8 rounded-b-3xl bg-gradient-to-r from-amber-500/30 via-orange-500 to-amber-500/30 border-b-2 border-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/10">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-950">
                🎤 MAIN STAGE & KEYNOTE LED DISPLAY 🎤
              </span>
            </div>
            <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
              All eyes this way (Auditorium Front)
            </span>
          </div>

          {/* Seating Grid */}
          <div className="space-y-2 select-none">
            {rows.map(({ row, tier, price }) => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-5 text-center text-xs font-mono font-bold text-neutral-400">{row}</span>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: totalSeatsPerRow }, (_, idx) => {
                    const seatNum = idx + 1;
                    const seatId = `${row}-${seatNum}`;
                    const isOccupied = occupiedSet.has(seatId);
                    const isSelected = selectedSeats.some((s) => s.id === seatId);

                    let tierColor = 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300';
                    if (tier === 'Diamond VIP') {
                      tierColor = 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300';
                    } else if (tier === 'Gold Executive') {
                      tierColor = 'border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300';
                    }

                    if (isOccupied) {
                      tierColor = 'border-neutral-800 bg-neutral-900/60 text-neutral-600 cursor-not-allowed opacity-50';
                    } else if (isSelected) {
                      tierColor = 'border-emerald-400 bg-emerald-500 text-neutral-950 font-bold shadow-md shadow-emerald-500/30 scale-105';
                    }

                    return (
                      <React.Fragment key={seatNum}>
                        {/* Aisle gap between seat 6 and 7 */}
                        {seatNum === 7 && <div className="w-3 sm:w-5" />}

                        <button
                          type="button"
                          disabled={isOccupied}
                          onClick={() => toggleSeat(row, seatNum, tier, price)}
                          title={`Seat ${seatId} (${tier} - ₹${price})`}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg border text-[10px] font-mono flex items-center justify-center transition-all ${tierColor}`}
                        >
                          {isSelected ? '✓' : seatNum}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                <span className="w-5 text-center text-xs font-mono font-bold text-neutral-400">{row}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Seats Bottom Action Bar */}
        <div className="p-4 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-neutral-400 block text-[11px]">Selected Seats:</span>
            {selectedSeats.length === 0 ? (
              <span className="text-neutral-500 italic">No seats selected yet. Click any seat above.</span>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold"
                  >
                    {s.id} (₹{s.price})
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Amount</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceed}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 text-neutral-950 font-extrabold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
            >
              <span>Confirm & Pay ({selectedSeats.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
