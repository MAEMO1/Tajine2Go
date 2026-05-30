"use client";

import { startTransition, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  DayName,
  Dish,
  SlotMode,
  TakeawayException,
  TakeawaySchedule,
  WeeklyMenuWithDish,
} from "@/types/database";

type Props = {
  selectedDate: string;
  takeawayActive: boolean;
  schedule: TakeawaySchedule;
  exceptions: TakeawayException[];
  dishes: Dish[];
  menuItems: WeeklyMenuWithDish[];
};

type EditableDay = {
  day: DayName;
  label: string;
  enabled: boolean;
  slot_mode: SlotMode;
  slots: string;
  open_window: string;
};

const DAY_OPTIONS: { day: DayName; label: string }[] = [
  { day: "monday", label: "Maandag" },
  { day: "tuesday", label: "Dinsdag" },
  { day: "wednesday", label: "Woensdag" },
  { day: "thursday", label: "Donderdag" },
  { day: "friday", label: "Vrijdag" },
  { day: "saturday", label: "Zaterdag" },
  { day: "sunday", label: "Zondag" },
];

function buildEditableDays(schedule: TakeawaySchedule): EditableDay[] {
  return DAY_OPTIONS.map(({ day, label }) => {
    const existing = schedule.days.find((entry) => entry.day === day);

    return {
      day,
      label,
      enabled: !!existing,
      slot_mode: existing?.slot_mode ?? "slots",
      slots: existing?.slots.join(", ") ?? "",
      open_window: existing?.open_window ?? "",
    };
  });
}

export function PlanningManager({
  selectedDate,
  takeawayActive: initialTakeawayActive,
  schedule,
  exceptions: initialExceptions,
  dishes,
  menuItems,
}: Props) {
  const router = useRouter();
  const [takeawayActive, setTakeawayActive] = useState(initialTakeawayActive);
  const [days, setDays] = useState<EditableDay[]>(() => buildEditableDays(schedule));
  const [scheduleSaving, setScheduleSaving] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);
  const [selectedDishId, setSelectedDishId] = useState("");
  const [newMaxPortions, setNewMaxPortions] = useState("");
  const [menuSaving, setMenuSaving] = useState(false);
  const [menuMessage, setMenuMessage] = useState<string | null>(null);
  const [cutoffHours, setCutoffHours] = useState(String(schedule.cutoff?.hours_before ?? 0));
  const [exceptions, setExceptions] = useState<TakeawayException[]>(initialExceptions);
  const [excDate, setExcDate] = useState("");
  const [excClosed, setExcClosed] = useState(true);
  const [excWindow, setExcWindow] = useState("");
  const [exceptionsSaving, setExceptionsSaving] = useState(false);
  const [exceptionsMessage, setExceptionsMessage] = useState<string | null>(null);

  const activeDishIds = useMemo(
    () => new Set(menuItems.map((item) => item.dish_id)),
    [menuItems],
  );

  const availableDishes = dishes.filter((dish) => !activeDishIds.has(dish.id));

  async function saveSchedule() {
    setScheduleSaving(true);
    setScheduleMessage(null);

    const normalizedDays = days
      .filter((day) => day.enabled)
      .map((day) => ({
        day: day.day,
        slot_mode: day.slot_mode,
        slots: day.slots.split(",").map((slot) => slot.trim()).filter(Boolean),
        open_window: day.open_window.trim(),
      }));

    const responses = await Promise.all([
      fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "takeaway_active",
          value: { active: takeawayActive },
        }),
      }),
      fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "takeaway_schedule",
          value: {
            days: normalizedDays,
            cutoff:
              Number(cutoffHours) > 0
                ? { hours_before: Math.trunc(Number(cutoffHours)) }
                : null,
          },
        }),
      }),
    ]);

    setScheduleSaving(false);
    if (responses.some((response) => !response.ok)) {
      setScheduleMessage("Opslaan van planning mislukt.");
      return;
    }

    setScheduleMessage("Planning opgeslagen.");
    router.refresh();
  }

  function addException() {
    if (!excDate) {
      setExceptionsMessage("Kies een datum.");
      return;
    }
    const entry: TakeawayException = excClosed
      ? { date: excDate, closed: true }
      : {
          date: excDate,
          closed: false,
          slot_mode: "open",
          slots: [],
          open_window: excWindow.trim(),
        };
    setExceptions((current) =>
      [...current.filter((e) => e.date !== excDate), entry].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    );
    setExcDate("");
    setExcWindow("");
    setExcClosed(true);
    setExceptionsMessage(null);
  }

  function removeException(date: string) {
    setExceptions((current) => current.filter((e) => e.date !== date));
  }

  async function saveExceptions() {
    setExceptionsSaving(true);
    setExceptionsMessage(null);

    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "takeaway_exceptions", value: { exceptions } }),
    });

    setExceptionsSaving(false);
    if (!response.ok) {
      setExceptionsMessage("Opslaan van uitzonderingen mislukt.");
      return;
    }
    setExceptionsMessage("Uitzonderingen opgeslagen.");
    router.refresh();
  }

  async function addMenuItem() {
    if (!selectedDishId) {
      setMenuMessage("Kies eerst een gerecht.");
      return;
    }

    setMenuSaving(true);
    setMenuMessage(null);

    const response = await fetch("/api/admin/weekly-menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: selectedDate,
        dish_id: selectedDishId,
        max_portions: newMaxPortions === "" ? null : Number(newMaxPortions),
      }),
    });

    setMenuSaving(false);
    if (!response.ok) {
      const result = await response.json().catch(() => null);
      setMenuMessage(result?.error ?? "Toevoegen mislukt.");
      return;
    }

    setMenuMessage("Gerecht toegevoegd.");
    setSelectedDishId("");
    setNewMaxPortions("");
    router.refresh();
  }

  async function updateMenuItem(itemId: string, maxPortions: string) {
    const response = await fetch(`/api/admin/weekly-menu/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        max_portions: maxPortions === "" ? null : Number(maxPortions),
      }),
    });

    if (!response.ok) {
      setMenuMessage("Bijwerken van porties mislukt.");
      return;
    }

    setMenuMessage("Porties bijgewerkt.");
    router.refresh();
  }

  async function removeMenuItem(itemId: string) {
    const response = await fetch(`/api/admin/weekly-menu/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMenuMessage("Verwijderen van gerecht mislukt.");
      return;
    }

    setMenuMessage("Gerecht verwijderd.");
    router.refresh();
  }

  function setDayValue(dayName: DayName, updates: Partial<EditableDay>) {
    setDays((current) =>
      current.map((day) => (day.day === dayName ? { ...day, ...updates } : day)),
    );
  }

  function handleDateChange(nextDate: string) {
    startTransition(() => {
      router.push(`/admin/planning?date=${nextDate}`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-heading text-3xl text-brand-brown">Planning</h1>
          <p className="mt-2 max-w-2xl text-sm text-brand-brown-s">
            Deze planning stuurt de publieke homepage, menupagina en checkout.
          </p>
        </div>
        <div>
          <label className="text-sm text-brand-brown-m">Datum in beheer</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => handleDateChange(event.target.value)}
            className="mt-1 block rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
        </div>
      </div>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="font-heading text-xl text-brand-bronze">Weekplanning</h2>
            <p className="mt-1 text-sm text-brand-brown-s">
              Activeer besteldagen en definieer tijdsloten of een open venster per weekdag.
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm text-brand-brown">
            <input
              type="checkbox"
              checked={takeawayActive}
              onChange={(event) => setTakeawayActive(event.target.checked)}
              className="h-4 w-4"
            />
            Bestellingen publiek openzetten
          </label>
        </div>

        <div className="mt-6 space-y-4">
          {days.map((day) => (
            <div key={day.day} className="rounded-xl border border-brand-warm2 p-4">
              <div className="grid gap-4 lg:grid-cols-[160px_140px_1fr_180px]">
                <label className="flex items-center gap-3 text-sm text-brand-brown">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={(event) => setDayValue(day.day, { enabled: event.target.checked })}
                    className="h-4 w-4"
                  />
                  {day.label}
                </label>

                <div>
                  <label className="text-xs text-brand-brown-s">Slotmodus</label>
                  <select
                    value={day.slot_mode}
                    onChange={(event) =>
                      setDayValue(day.day, { slot_mode: event.target.value as SlotMode })
                    }
                    disabled={!day.enabled}
                    className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm disabled:bg-brand-warm"
                  >
                    <option value="slots">Slots</option>
                    <option value="open">Open venster</option>
                    <option value="both">Beide</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-brand-brown-s">Slots (komma-gescheiden)</label>
                  <input
                    type="text"
                    value={day.slots}
                    onChange={(event) => setDayValue(day.day, { slots: event.target.value })}
                    disabled={!day.enabled}
                    placeholder="12:00-13:00, 13:00-14:00"
                    className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm disabled:bg-brand-warm"
                  />
                </div>

                <div>
                  <label className="text-xs text-brand-brown-s">Open venster</label>
                  <input
                    type="text"
                    value={day.open_window}
                    onChange={(event) => setDayValue(day.day, { open_window: event.target.value })}
                    disabled={!day.enabled}
                    placeholder="12:00-19:00"
                    className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm disabled:bg-brand-warm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 border-t border-brand-warm2 pt-4">
          <label className="text-sm text-brand-brown-m">
            Bestel-cutoff (uren vóór de service-dag · 0 = geen)
          </label>
          <input
            type="number"
            min="0"
            value={cutoffHours}
            onChange={(event) => setCutoffHours(event.target.value)}
            className="mt-1 block w-40 rounded-lg border border-brand-brown-s px-3 py-2 text-sm focus:border-brand-orange focus:outline-none"
          />
          <p className="mt-1 text-xs text-brand-brown-s">
            Bv. 48 = bestellen sluit 2 dagen vóór de service-dag; daarna rolt het door naar de volgende.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={saveSchedule}
            disabled={scheduleSaving}
            className="rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
          >
            {scheduleSaving ? "Opslaan..." : "Weekplanning opslaan"}
          </button>
          {scheduleMessage && <p className="text-sm text-brand-brown-m">{scheduleMessage}</p>}
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl text-brand-bronze">Datum-uitzonderingen</h2>
        <p className="mt-1 text-sm text-brand-brown-s">
          Overschrijf het weekpatroon voor één datum: gesloten (bv. feestdag) of open met eigen uren.
        </p>

        <div className="mt-4 grid gap-3 rounded-xl bg-brand-warm/40 p-4 lg:grid-cols-[150px_130px_1fr_auto]">
          <div>
            <label className="text-xs text-brand-brown-s">Datum</label>
            <input
              type="date"
              value={excDate}
              onChange={(event) => setExcDate(event.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-brand-brown-s">Type</label>
            <select
              value={excClosed ? "closed" : "open"}
              onChange={(event) => setExcClosed(event.target.value === "closed")}
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm"
            >
              <option value="closed">Gesloten</option>
              <option value="open">Open</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-brand-brown-s">
              {excClosed ? "—" : "Open venster (bv. 12:00-19:00)"}
            </label>
            <input
              type="text"
              value={excWindow}
              onChange={(event) => setExcWindow(event.target.value)}
              disabled={excClosed}
              placeholder="12:00-19:00"
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm disabled:bg-brand-warm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={addException}
              className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover"
            >
              Toevoegen
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {exceptions.length === 0 ? (
            <p className="rounded-xl bg-brand-warm/30 px-4 py-4 text-center text-sm text-brand-brown-s">
              Nog geen uitzonderingen.
            </p>
          ) : (
            exceptions.map((exc) => (
              <div
                key={exc.date}
                className="flex items-center justify-between rounded-xl border border-brand-warm2 px-4 py-3"
              >
                <div className="text-sm text-brand-brown">
                  <span className="font-semibold">{exc.date}</span>
                  {" — "}
                  {exc.closed ? (
                    <span className="text-red-600">Gesloten</span>
                  ) : (
                    <span className="text-brand-brown-m">
                      Open{exc.open_window ? ` · ${exc.open_window}` : ""}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeException(exc.date)}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Verwijderen
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={saveExceptions}
            disabled={exceptionsSaving}
            className="rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
          >
            {exceptionsSaving ? "Opslaan..." : "Uitzonderingen opslaan"}
          </button>
          {exceptionsMessage && <p className="text-sm text-brand-brown-m">{exceptionsMessage}</p>}
        </div>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl text-brand-bronze">Menu voor {selectedDate}</h2>
        <p className="mt-1 text-sm text-brand-brown-s">
          Kies welke gerechten publiek zichtbaar zijn op deze besteldag en stel optionele portielimieten in.
        </p>

        <div className="mt-6 grid gap-4 rounded-xl bg-brand-warm/40 p-4 lg:grid-cols-[1fr_160px_auto]">
          <div>
            <label className="text-xs text-brand-brown-s">Gerecht toevoegen</label>
            <select
              value={selectedDishId}
              onChange={(event) => setSelectedDishId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm"
            >
              <option value="">Selecteer een gerecht</option>
              {availableDishes.map((dish) => (
                <option key={dish.id} value={dish.id}>
                  {dish.name_nl} ({dish.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-brand-brown-s">Max porties</label>
            <input
              type="number"
              min="1"
              value={newMaxPortions}
              onChange={(event) => setNewMaxPortions(event.target.value)}
              placeholder="Onbeperkt"
              className="mt-1 w-full rounded-lg border border-brand-brown-s px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={addMenuItem}
              disabled={menuSaving || availableDishes.length === 0}
              className="rounded-lg bg-brand-orange px-4 py-2 text-sm font-semibold text-white hover:bg-brand-orange-hover disabled:opacity-50"
            >
              Toevoegen
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="rounded-xl border border-brand-warm2 p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-brand-brown">{item.dishes?.name_nl ?? "Onbekend gerecht"}</h3>
                    <span className="rounded bg-brand-warm px-2 py-0.5 text-xs text-brand-brown-s">
                      {item.dishes?.category ?? "onbekend"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-brand-brown-s">
                    Verkocht: {item.portions_sold}
                    {item.max_portions !== null && ` · Over: ${Math.max(item.max_portions - item.portions_sold, 0)}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <div>
                    <label className="text-xs text-brand-brown-s">Max porties</label>
                    <input
                      type="number"
                      min="1"
                      defaultValue={item.max_portions ?? ""}
                      placeholder="Onbeperkt"
                      onBlur={(event) => updateMenuItem(item.id, event.target.value)}
                      className="mt-1 w-32 rounded-lg border border-brand-brown-s px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMenuItem(item.id)}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Verwijderen
                  </button>
                </div>
              </div>
            </div>
          ))}

          {menuItems.length === 0 && (
            <p className="rounded-xl bg-brand-warm/30 px-4 py-6 text-center text-sm text-brand-brown-s">
              Er staan nog geen gerechten op deze datum.
            </p>
          )}
        </div>

        {menuMessage && <p className="mt-4 text-sm text-brand-brown-m">{menuMessage}</p>}
      </section>
    </div>
  );
}
