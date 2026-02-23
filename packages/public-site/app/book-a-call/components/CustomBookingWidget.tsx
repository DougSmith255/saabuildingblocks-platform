'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Clock,
  CalendarDays,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Video,
} from 'lucide-react';

// ============================================================================
// Constants
// ============================================================================

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (ET)', short: 'ET' },
  { value: 'America/Chicago', label: 'Central Time (CT)', short: 'CT' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', short: 'MT' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', short: 'PT' },
  { value: 'America/Anchorage', label: 'Alaska Time (AKT)', short: 'AKT' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time (HT)', short: 'HT' },
];

const EXPERIENCE_OPTIONS = [
  '0 Closings',
  '1 - 9 Closings',
  '10+ Closings',
  'Team Leader',
  'Broker Owner',
];

const CAREER_OPTIONS = [
  'Residential Agent',
  'Commercial Agent',
  'Referral Agent',
  'New Construction',
  'Luxury',
  'Land & Ranch',
  'Investing',
  'Part-Time',
  'Full-Time',
];

const COUNTRIES = [
  'United States',
  'Canada',
  'Australia',
  'Brazil',
  'Chile',
  'Colombia',
  'France',
  'Germany',
  'Greece',
  'Hong Kong',
  'India',
  'Italy',
  'Japan',
  'Mexico',
  'New Zealand',
  'Panama',
  'Portugal',
  'Puerto Rico',
  'South Africa',
  'Spain',
  'United Kingdom',
];

const DAY_HEADERS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CARD = 'bg-[#111]/80 backdrop-blur-sm border border-white/[0.08] rounded-2xl';

// ============================================================================
// Types
// ============================================================================

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  experienceLevel: string[];
  careerPlan: string[];
  consent: boolean;
}

type Step = 'calendar' | 'form' | 'submitting' | 'confirmation';

declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props: Record<string, string | number | boolean> }
    ) => void;
  }
}

// ============================================================================
// Helpers
// ============================================================================

function getMonthGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function toDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isPast(year: number, month: number, day: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(year, month, day) < today;
}

function isToday(year: number, month: number, day: number): boolean {
  const t = new Date();
  return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day;
}

function formatTime(iso: string, tz: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: tz,
  });
}

function formatDateLong(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateShort(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTzShort(tz: string): string {
  return TIMEZONES.find((t) => t.value === tz)?.short || 'PT';
}

// ============================================================================
// Component
// ============================================================================

export default function CustomBookingWidget({ agentSlug }: { agentSlug?: string }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('calendar');
  const [currentMonth, setCurrentMonth] = useState({ year: 2026, month: 0 });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<string, string[]>>({});
  const [timezone, setTimezone] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'United States',
    state: '',
    experienceLevel: [],
    careerPlan: [],
    consent: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [tzOpen, setTzOpen] = useState(false);

  // ---- Client mount ----
  useEffect(() => {
    const now = new Date();
    setCurrentMonth({ year: now.getFullYear(), month: now.getMonth() });
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const match = TIMEZONES.find((t) => t.value === detected);
      setTimezone(match ? detected : 'America/Los_Angeles');
    } catch {
      setTimezone('America/Los_Angeles');
    }
    setMounted(true);
  }, []);

  // ---- Fetch slots ----
  const fetchSlots = useCallback(async () => {
    if (!timezone) return;
    setLoadingSlots(true);
    setError(null);

    try {
      const start = new Date(currentMonth.year, currentMonth.month, 1);
      const end = new Date(currentMonth.year, currentMonth.month + 1, 0, 23, 59, 59);

      const params = new URLSearchParams({
        startDate: start.getTime().toString(),
        endDate: end.getTime().toString(),
        timezone,
      });

      const res = await fetch(`/api/booking/slots?${params}`);
      if (!res.ok) throw new Error('Failed to load times');

      const data = await res.json();
      const parsed: Record<string, string[]> = {};

      for (const [key, val] of Object.entries(data)) {
        if (
          /^\d{4}-\d{2}-\d{2}$/.test(key) &&
          val &&
          typeof val === 'object' &&
          'slots' in (val as Record<string, unknown>)
        ) {
          parsed[key] = (val as { slots: string[] }).slots;
        }
      }

      setSlots(parsed);
    } catch {
      setError('Unable to load available times. Please try again.');
    } finally {
      setLoadingSlots(false);
    }
  }, [currentMonth, timezone]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // ---- Month navigation ----
  const canGoPrev = useMemo(() => {
    const now = new Date();
    return new Date(currentMonth.year, currentMonth.month) > new Date(now.getFullYear(), now.getMonth());
  }, [currentMonth]);

  const canGoNext = useMemo(() => {
    const now = new Date();
    return new Date(currentMonth.year, currentMonth.month + 1) <= new Date(now.getFullYear(), now.getMonth() + 3);
  }, [currentMonth]);

  const navigateMonth = (dir: -1 | 1) => {
    if (dir === -1 && !canGoPrev) return;
    if (dir === 1 && !canGoNext) return;
    setCurrentMonth((prev) => {
      const d = new Date(prev.year, prev.month + dir);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  // ---- Calendar data ----
  const monthGrid = useMemo(
    () => getMonthGrid(currentMonth.year, currentMonth.month),
    [currentMonth]
  );
  const monthLabel = new Date(currentMonth.year, currentMonth.month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
  const dateSlots = selectedDate ? slots[selectedDate] || [] : [];

  // ---- Form helpers ----
  const updateField = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleMulti = (field: 'experienceLevel' | 'careerPlan', val: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter((v) => v !== val)
        : [...prev[field], val],
    }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim()) errs.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.country) errs.country = 'Required';
    if (!form.state.trim()) errs.state = 'Required';
    if (form.experienceLevel.length === 0) errs.experienceLevel = 'Select at least one';
    if (form.careerPlan.length === 0) errs.careerPlan = 'Select at least one';
    if (!form.consent) errs.consent = 'You must agree to continue';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    if (!validateForm() || !selectedSlot) return;
    setStep('submitting');
    setError(null);

    try {
      const res = await fetch('/api/booking/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          country: form.country,
          state: form.state.trim(),
          experienceLevel: form.experienceLevel.join(', '),
          careerPlan: form.careerPlan.join(', '),
          selectedSlot,
          timezone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      setStep('confirmation');
      window.plausible?.('Booking Submitted', { props: { page: '/book-a-call' } });

      // If booked from an agent's attraction page, notify the agent
      if (agentSlug) {
        fetch('https://saabuildingblocks.com/api/bookings/referral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agentSlug,
            visitorName: `${form.firstName.trim()} ${form.lastName.trim()}`,
            visitorEmail: form.email.trim(),
            visitorPhone: form.phone.trim() || null,
          }),
        }).catch(() => { /* fire-and-forget */ });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('form');
    }
  };

  // ===========================================================================
  // RENDER
  // ===========================================================================

  if (!mounted) {
    return (
      <div className="max-w-[1300px] mx-auto">
        <div className={`${CARD} p-12 md:p-16 text-center`}>
          <Loader2 className="w-8 h-8 text-[#ffd700] animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#dcdbd5]/40">Loading booking calendar...</p>
        </div>
      </div>
    );
  }

  // ---- CALENDAR STEP ----
  if (step === 'calendar') {
    return (
      <div className="max-w-[1300px] mx-auto">
        <div className={`${CARD} p-6 md:p-8 lg:p-10`}>
          <div className="flex flex-col lg:flex-row lg:gap-10">
            {/* ===== LEFT: Info panel ===== */}
            <div className="lg:w-[340px] lg:shrink-0 lg:border-r lg:border-white/[0.06] lg:pr-10 mb-6 lg:mb-0">
              <h2
                className="text-xl md:text-2xl font-bold text-[#e5e4dd]"
                style={{ fontFamily: 'var(--font-amulya)', marginBottom: '1.5rem' }}
              >
                Schedule Your Video Strategy Call
              </h2>
              <p className="text-sm text-[#dcdbd5]/60 leading-relaxed mb-5">
                This session is designed to answer your questions, learn about
                your business, and explore whether working together is the right
                fit.
              </p>

              {/* Meta */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2.5 text-sm text-[#dcdbd5]/50">
                  <Clock className="w-4 h-4 text-[#ffd700]/50" />
                  <span>30 minutes</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#dcdbd5]/50">
                  <Video className="w-4 h-4 text-[#ffd700]/50" />
                  <span>Video call (MS Teams)</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-[#dcdbd5]/50">
                  <CalendarDays className="w-4 h-4 text-[#ffd700]/50" />
                  <span>Mon &ndash; Fri availability</span>
                </div>
              </div>

              {/* Timezone selector (custom dropdown) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTzOpen((v) => !v)}
                  className="flex items-center gap-2 text-sm text-[#dcdbd5]/70 hover:text-[#dcdbd5] transition-colors"
                >
                  <Globe className="w-4 h-4 text-[#dcdbd5]/40" />
                  <span>{TIMEZONES.find((t) => t.value === timezone)?.label || 'Select timezone'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-150 ${tzOpen ? 'rotate-90' : ''}`} />
                </button>
                {tzOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setTzOpen(false)} />
                    <div className="absolute left-0 bottom-full mb-2 z-50 bg-[#1a1a1a] border border-white/[0.1] rounded-lg shadow-xl py-1 min-w-[220px]">
                      {TIMEZONES.map((tz) => (
                        <button
                          key={tz.value}
                          type="button"
                          onClick={() => {
                            setTimezone(tz.value);
                            setSelectedSlot(null);
                            setTzOpen(false);
                          }}
                          className={`
                            w-full text-left px-4 py-2 text-sm transition-colors
                            ${timezone === tz.value
                              ? 'text-[#ffd700] bg-[#ffd700]/10'
                              : 'text-[#dcdbd5]/70 hover:text-[#dcdbd5] hover:bg-white/[0.05]'
                            }
                          `}
                        >
                          {tz.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Error (desktop only - below info) */}
              {error && (
                <div className="hidden lg:flex mt-6 items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* ===== RIGHT: Calendar + slots ===== */}
            <div className="flex-1 min-w-0">
              {/* Divider on mobile */}
              <div className="border-t border-white/[0.06] mb-6 lg:hidden" />

              {/* Month header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateMonth(-1)}
                  disabled={!canGoPrev}
                  className="p-1.5 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-[#e5e4dd] font-[var(--font-taskor)] text-lg">
                  {monthLabel}
                </span>
                <button
                  onClick={() => navigateMonth(1)}
                  disabled={!canGoNext}
                  className="p-1.5 rounded-lg text-[#ffd700] hover:bg-[#ffd700]/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Calendar grid + time slots side-by-side */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Calendar grid */}
                <div className="flex-1 min-w-0">
                  <div className="grid grid-cols-7 mb-2">
                    {DAY_HEADERS.map((d) => (
                      <div
                        key={d}
                        className="text-center text-[10px] uppercase tracking-wider text-[#dcdbd5]/40 font-medium py-1"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {monthGrid.map((day, i) => {
                      if (day === null) return <div key={`empty-${i}`} />;

                      const dateKey = toDateKey(currentMonth.year, currentMonth.month, day);
                      const past = isPast(currentMonth.year, currentMonth.month, day);
                      const today = isToday(currentMonth.year, currentMonth.month, day);
                      const hasSlots = !!slots[dateKey]?.length;
                      const isSelected = selectedDate === dateKey;

                      return (
                        <button
                          key={dateKey}
                          onClick={() => !past && hasSlots && setSelectedDate(dateKey)}
                          disabled={past || !hasSlots}
                          className={`
                            relative w-full aspect-square flex items-center justify-center
                            rounded-full text-sm transition-all duration-150
                            ${isSelected
                              ? 'bg-[#ffd700] text-[#111] font-bold scale-105'
                              : past
                                ? 'text-white/15 cursor-not-allowed'
                                : hasSlots
                                  ? 'text-[#ffd700] hover:bg-[#ffd700]/10 cursor-pointer font-medium'
                                  : 'text-[#dcdbd5]/25 cursor-not-allowed'
                            }
                            ${today && !isSelected ? 'ring-1 ring-[#ffd700]/30' : ''}
                          `}
                          aria-label={`${dateKey}${hasSlots ? ', available' : ''}${isSelected ? ', selected' : ''}`}
                        >
                          {day}
                          {hasSlots && !isSelected && (
                            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#ffd700]/60" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {loadingSlots && (
                    <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#dcdbd5]/40">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Loading available times...
                    </div>
                  )}
                </div>

                {/* Time slots panel */}
                <div className="md:w-[180px] md:border-l md:border-white/[0.06] md:pl-6">
                  {selectedDate ? (
                    <>
                      <p className="text-xs text-[#dcdbd5]/50 mb-3 font-medium uppercase tracking-wider">
                        {new Date(
                          currentMonth.year,
                          currentMonth.month,
                          Number(selectedDate.split('-')[2])
                        ).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {dateSlots.length > 0 ? (
                        <div className="flex flex-row md:flex-col flex-wrap gap-2">
                          {dateSlots.map((slot) => {
                            const active = selectedSlot === slot;
                            return (
                              <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`
                                  px-3 py-2 rounded-lg text-sm font-medium
                                  border transition-all duration-150
                                  ${active
                                    ? 'bg-[#ffd700] text-[#111] border-[#ffd700] font-bold'
                                    : 'border-[#ffd700]/25 text-[#ffd700] hover:bg-[#ffd700]/10 hover:border-[#ffd700]/40'
                                  }
                                `}
                              >
                                {formatTime(slot, timezone)}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-[#dcdbd5]/30 italic">
                          No available times
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-[#dcdbd5]/30 italic md:mt-6">
                      Select a date to see available times
                    </p>
                  )}
                </div>
              </div>

              {/* Continue */}
              <div className="mt-6 pt-5 border-t border-white/[0.06] flex justify-end">
                <button
                  onClick={() => selectedSlot && setStep('form')}
                  disabled={!selectedSlot}
                  className={`
                    font-[var(--font-taskor)] text-sm px-8 py-2.5 rounded-lg
                    transition-all duration-200
                    ${selectedSlot
                      ? 'bg-[#ffd700] text-[#111] hover:bg-[#ffe033] cursor-pointer'
                      : 'bg-white/[0.06] text-white/25 cursor-not-allowed'
                    }
                  `}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Error (mobile) */}
          {error && (
            <div className="lg:hidden mt-4 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---- FORM STEP ----
  if (step === 'form') {
    return (
      <div className="max-w-[700px] mx-auto">
        <div className={`${CARD} p-6 md:p-8`}>
          {/* Back */}
          <button
            onClick={() => setStep('calendar')}
            className="flex items-center gap-1.5 text-sm text-[#ffd700] hover:text-[#ffe033] transition-colors mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Meeting summary */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 mb-6">
            <p className="text-sm font-[var(--font-taskor)] text-[#e5e4dd] mb-1">
              Video Strategy Call
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#dcdbd5]/50">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 30 min
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                {selectedDate && formatDateShort(selectedDate)}
              </span>
              <span>
                {selectedSlot && formatTime(selectedSlot, timezone)} {getTzShort(timezone)}
              </span>
            </div>
          </div>

          <h3 className="text-lg font-[var(--font-taskor)] text-[#e5e4dd] mb-5">
            Enter Your Details
          </h3>

          {error && (
            <div className="mb-5 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" required error={formErrors.firstName}>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  placeholder="First name"
                  className={inputClass(formErrors.firstName)}
                />
              </Field>
              <Field label="Last Name" required error={formErrors.lastName}>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  placeholder="Last name"
                  className={inputClass(formErrors.lastName)}
                />
              </Field>
            </div>

            {/* Email + Phone */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email" required error={formErrors.email}>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass(formErrors.email)}
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="(optional)"
                  className={inputClass()}
                />
              </Field>
            </div>

            {/* Country + State */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Country" required error={formErrors.country}>
                <select
                  value={form.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className={inputClass(formErrors.country)}
                >
                  <option value="" className="bg-[#222]">Select country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#222]">{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="State" required error={formErrors.state}>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="State / Province"
                  className={inputClass(formErrors.state)}
                />
              </Field>
            </div>

            {/* Experience Level */}
            <Field label="Experience Level" required error={formErrors.experienceLevel}>
              <div className="flex flex-wrap gap-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <PillButton
                    key={opt}
                    label={opt}
                    active={form.experienceLevel.includes(opt)}
                    onClick={() => toggleMulti('experienceLevel', opt)}
                  />
                ))}
              </div>
            </Field>

            {/* Career Plan */}
            <Field label="Career Plan" required error={formErrors.careerPlan}>
              <div className="flex flex-wrap gap-2">
                {CAREER_OPTIONS.map((opt) => (
                  <PillButton
                    key={opt}
                    label={opt}
                    active={form.careerPlan.includes(opt)}
                    onClick={() => toggleMulti('careerPlan', opt)}
                  />
                ))}
              </div>
            </Field>

            {/* Consent */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => updateField('consent', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`
                      rounded border-2 transition-all duration-150
                      flex items-center justify-center
                      ${form.consent
                        ? 'bg-[#ffd700] border-[#ffd700]'
                        : formErrors.consent
                          ? 'border-red-500/50'
                          : 'border-white/20 group-hover:border-white/30'
                      }
                    `}
                    style={{ width: 18, height: 18 }}
                  >
                    {form.consent && (
                      <svg className="w-3 h-3 text-[#111]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#dcdbd5]/50 leading-relaxed">
                  I agree to the{' '}
                  <a href="/terms-of-use" target="_blank" className="text-[#ffd700]/70 hover:text-[#ffd700] transition-colors">
                    terms &amp; conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy-policy" target="_blank" className="text-[#ffd700]/70 hover:text-[#ffd700] transition-colors">
                    privacy policy
                  </a>{' '}
                  and consent to receive emails.
                </span>
              </label>
              {formErrors.consent && (
                <p className="text-xs text-red-400 mt-1 ml-7">{formErrors.consent}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full mt-2 font-[var(--font-taskor)] text-sm bg-[#ffd700] text-[#111] hover:bg-[#ffe033] py-3 rounded-lg transition-all duration-200"
            >
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- SUBMITTING ----
  if (step === 'submitting') {
    return (
      <div className="max-w-[700px] mx-auto">
        <div className={`${CARD} p-12 md:p-16 text-center`}>
          <Loader2 className="w-10 h-10 text-[#ffd700] animate-spin mx-auto mb-4" />
          <p className="text-[#dcdbd5]/60 text-sm">Scheduling your call...</p>
        </div>
      </div>
    );
  }

  // ---- CONFIRMATION ----
  return (
    <div className="max-w-[700px] mx-auto">
      <div className={`${CARD} p-8 md:p-12 text-center`}>
        <CheckCircle2 className="w-14 h-14 text-[#00ff88] mx-auto mb-5" />

        <h2 className="text-2xl font-[var(--font-taskor)] text-[#e5e4dd] mb-2">
          You&apos;re All Set!
        </h2>

        <p className="text-sm text-[#dcdbd5]/60 mb-6 max-w-md mx-auto leading-relaxed">
          Your strategy call has been scheduled. You&apos;ll receive a confirmation
          email at <span className="text-[#ffd700]">{form.email}</span> with meeting
          details and a link to join.
        </p>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 mb-6 inline-block text-left">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[#dcdbd5]/70">
              <Video className="w-4 h-4 text-[#ffd700]/60" />
              <span>Video Strategy Call &middot; 30 min</span>
            </div>
            <div className="flex items-center gap-2 text-[#dcdbd5]/70">
              <CalendarDays className="w-4 h-4 text-[#ffd700]/60" />
              <span>{selectedDate && formatDateLong(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-[#dcdbd5]/70">
              <Clock className="w-4 h-4 text-[#ffd700]/60" />
              <span>
                {selectedSlot && formatTime(selectedSlot, timezone)} {getTzShort(timezone)}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#dcdbd5]/40 leading-relaxed max-w-sm mx-auto">
          Congrats! You&apos;re one step closer to massive value at your fingertips.
          We&apos;re excited to meet you.
        </p>

      </div>
    </div>
  );
}

// ============================================================================
// Sub-components (defined OUTSIDE main component to preserve identity)
// ============================================================================

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#dcdbd5]/70 mb-1.5">
        {label}
        {required && <span className="text-[#ffd700]/60 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

function PillButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-1.5 rounded-lg text-xs font-medium
        border transition-all duration-150
        ${active
          ? 'border-[#ffd700]/50 text-[#ffd700] bg-[#ffd700]/10'
          : 'border-white/[0.08] text-[#dcdbd5]/50 bg-white/[0.02] hover:border-white/[0.15] hover:text-[#dcdbd5]/70'
        }
      `}
      role="checkbox"
      aria-checked={active}
    >
      {label}
    </button>
  );
}

function inputClass(error?: string): string {
  return [
    'w-full bg-white/[0.04] border rounded-lg px-3.5 py-2.5 text-sm text-white',
    'placeholder:text-white/20 outline-none transition-all duration-150',
    error
      ? 'border-red-500/40 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
      : 'border-white/[0.08] focus:border-[#ffd700]/40 focus:ring-1 focus:ring-[#ffd700]/15',
  ].join(' ');
}
