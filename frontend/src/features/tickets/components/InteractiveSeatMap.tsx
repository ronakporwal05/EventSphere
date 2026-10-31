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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl bg-white text-black border-3 border-black rounded-3xl shadow-[10px_10px_0px_#000] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#f5ce32] border-b-3 border-black flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-black bg-black text-[#f5ce32] rounded uppercase border border-black shadow-[1px_1px_0px_#000]">
                SEAT SELECTION
              </span>
              <h3 className="text-sm font-black uppercase text-black tracking-tight">Interactive Seat & Stage Selector</h3>
            </div>
            <p className="text-xs font-bold text-neutral-800 mt-0.5 truncate max-w-md">{eventTitle}</p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Seat Map"
            className="p-1.5 bg-black text-white hover:bg-neutral-800 rounded-xl border-2 border-black transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Stage & Legend Strip */}
        <div className="p-3 bg-[#fbfbf9] border-b-2 border-black flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-[#e5d4ff] border-2 border-black" />
              <span className="text-black">Diamond VIP (₹3,499)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-[#fef08a] border-2 border-black" />
              <span className="text-black">Gold Executive (₹1,999)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-[#98d8ef] border-2 border-black" />
              <span className="text-black">Silver General (₹1,499)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-neutral-200 border-2 border-neutral-400" />
              <span className="text-neutral-400">Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md bg-black text-[#f5ce32] border-2 border-black flex items-center justify-center text-[9px]">
                ✓
              </span>
              <span className="text-black">Selected</span>
            </div>
          </div>
        </div>

        {/* Seat Grid Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 flex flex-col items-center bg-[#fbfbf9]">
          {/* Main Stage Graphic */}
          <div className="w-full max-w-xl flex flex-col items-center space-y-1">
            <div className="w-full h-9 rounded-b-2xl bg-[#f5ce32] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <span className="text-xs font-black uppercase tracking-widest text-black">
                🎤 MAIN STAGE & KEYNOTE LED DISPLAY 🎤
              </span>
            </div>
            <span className="text-[10px] text-neutral-600 uppercase tracking-widest font-black">
              Auditorium Front · All Eyes This Way
            </span>
          </div>

          {/* Seating Grid */}
          <div className="space-y-2 select-none">
            {rows.map(({ row, tier, price }) => (
              <div key={row} className="flex items-center gap-2">
                <span className="w-5 text-center text-xs font-mono font-black text-black">{row}</span>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: totalSeatsPerRow }, (_, idx) => {
                    const seatNum = idx + 1;
                    const seatId = `${row}-${seatNum}`;
                    const isOccupied = occupiedSet.has(seatId);
                    const isSelected = selectedSeats.some((s) => s.id === seatId);

                    let tierColor = 'border-2 border-black bg-[#98d8ef] hover:bg-[#7dd3fc] text-black';
                    if (tier === 'Diamond VIP') {
                      tierColor = 'border-2 border-black bg-[#e5d4ff] hover:bg-[#d8b4fe] text-black';
                    } else if (tier === 'Gold Executive') {
                      tierColor = 'border-2 border-black bg-[#fef08a] hover:bg-[#fde047] text-black';
                    }

                    if (isOccupied) {
                      tierColor = 'border-2 border-neutral-300 bg-neutral-200 text-neutral-400 cursor-not-allowed opacity-60';
                    } else if (isSelected) {
                      tierColor = 'border-2 border-black bg-black text-[#f5ce32] font-black shadow-[2px_2px_0px_#f5ce32] scale-110';
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
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg text-[10px] font-mono font-black flex items-center justify-center transition-all ${tierColor}`}
                        >
                          {isSelected ? '✓' : seatNum}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                <span className="w-5 text-center text-xs font-mono font-black text-black">{row}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Seats Bottom Action Bar */}
        <div className="p-4 bg-white border-t-3 border-black flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-neutral-600 block text-[11px] font-black uppercase">Selected Seats:</span>
            {selectedSeats.length === 0 ? (
              <span className="text-neutral-500 font-bold italic">No seats selected. Click any available seat above.</span>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                {selectedSeats.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded-lg bg-[#f5ce32] text-black border-2 border-black text-[10px] font-mono font-black shadow-[1px_1px_0px_#000]"
                  >
                    {s.id} (₹{s.price})
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] uppercase font-black text-neutral-500 block">Total Amount</span>
              <span className="text-2xl font-black font-mono text-black leading-tight">
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="button"
              disabled={selectedSeats.length === 0}
              onClick={handleProceed}
              className="px-6 py-3 bg-[#f5ce32] hover:bg-yellow-400 text-black border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-40 shadow-[3px_3px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-2"
            >
              <span>Confirm & Pay ({selectedSeats.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
