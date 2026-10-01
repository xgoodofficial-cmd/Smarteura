import React, { useEffect, useState } from 'react';
import { Clock, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface LiveCounterProps {
  lang: Language;
}

// Fixed start moment: March 31, 2022, 00:00:00 Europe/Vilnius (UTC+3 -> 2022-03-30T21:00:00Z)
const START_TIMESTAMP_MS = Date.UTC(2022, 2, 30, 21, 0, 0);

export const LiveCounter: React.FC<LiveCounterProps> = ({ lang }) => {
  const t = translations[lang].liveCounter;

  const calculateElapsed = () => {
    const now = Date.now();
    const diff = Math.max(0, now - START_TIMESTAMP_MS);

    const totalSeconds = Math.floor(diff / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const days = Math.floor(totalHours / 24);

    return { days, hours, minutes, seconds };
  };

  const [elapsed, setElapsed] = useState(calculateElapsed);

  useEffect(() => {
    // Recalculate precisely every second
    const interval = setInterval(() => {
      setElapsed(calculateElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="live-counter-section"
      className="w-full bg-[#EAF0E9] border-y border-[#D5DED6] py-12 md:py-16 text-[#193E33]"
      aria-label="Company timeline counter"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D5DED6] text-xs font-semibold tracking-wider text-[#123F32] mb-3">
            <ShieldCheck className="w-4 h-4 text-[#123F32]" />
            <span>{t.establishedText}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#193E33]">
            {t.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#586B62]">
            {t.subtitle}
          </p>
        </div>

        {/* Counter Cards */}
        <div
          id="counter-grid"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
          aria-label={`${elapsed.days} days, ${elapsed.hours} hours, ${elapsed.minutes} minutes since establishment`}
        >
          {/* Days */}
          <div
            id="counter-days"
            className="bg-white rounded-xl border border-[#D5DED6] p-5 sm:p-6 text-center shadow-xs"
          >
            <span
              id="days-value"
              className="block font-mono text-3xl sm:text-5xl font-extrabold text-[#123F32] tracking-tight tabular-nums"
              aria-live="off"
            >
              {elapsed.days.toLocaleString()}
            </span>
            <span className="block mt-2 text-xs uppercase tracking-wider font-semibold text-[#586B62]">
              {t.days}
            </span>
          </div>

          {/* Hours */}
          <div
            id="counter-hours"
            className="bg-white rounded-xl border border-[#D5DED6] p-5 sm:p-6 text-center shadow-xs"
          >
            <span
              id="hours-value"
              className="block font-mono text-3xl sm:text-5xl font-extrabold text-[#123F32] tracking-tight tabular-nums"
              aria-live="off"
            >
              {String(elapsed.hours).padStart(2, '0')}
            </span>
            <span className="block mt-2 text-xs uppercase tracking-wider font-semibold text-[#586B62]">
              {t.hours}
            </span>
          </div>

          {/* Minutes */}
          <div
            id="counter-minutes"
            className="bg-white rounded-xl border border-[#D5DED6] p-5 sm:p-6 text-center shadow-xs"
          >
            <span
              id="minutes-value"
              className="block font-mono text-3xl sm:text-5xl font-extrabold text-[#123F32] tracking-tight tabular-nums"
              aria-live="off"
            >
              {String(elapsed.minutes).padStart(2, '0')}
            </span>
            <span className="block mt-2 text-xs uppercase tracking-wider font-semibold text-[#586B62]">
              {t.minutes}
            </span>
          </div>

          {/* Seconds */}
          <div
            id="counter-seconds"
            className="bg-white rounded-xl border border-[#D5DED6] p-5 sm:p-6 text-center shadow-xs"
          >
            <span
              id="seconds-value"
              className="block font-mono text-3xl sm:text-5xl font-extrabold text-[#25664E] tracking-tight tabular-nums"
              aria-live="off"
            >
              {String(elapsed.seconds).padStart(2, '0')}
            </span>
            <span className="block mt-2 text-xs uppercase tracking-wider font-semibold text-[#586B62]">
              {t.seconds}
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#586B62] text-center">
          <Clock className="w-3.5 h-3.5 text-[#96B5A1]" />
          <span>Active European industrial mobilization • Europe/Vilnius standard timeline</span>
        </div>
      </div>
    </section>
  );
};
