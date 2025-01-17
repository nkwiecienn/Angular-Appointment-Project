import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarSlotBlockComponent } from '../calendar-slot-block/calendar-slot-block.component';
import { RouterModule } from '@angular/router';
import { SlotService } from '../../services/slot.service';
import { DaySchedule } from '../models/day-schedule';
import { TimeSlot } from '../models/time-slot';
import { AbsenceService } from '../../services/absence.service';
import { Absence } from '../../absence/models/absence';
import { Availability } from '../../availability/models/availability';
import { AvailabilityService } from '../../services/availability.service';
import { ReservationComponent } from '../../reservation/reservation.component';

interface GeneratedSlot {
  date: string;
  startTime: string;
  endTime: string;
  isReserved: boolean;
  isPast: boolean;
  reservationId?: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, CalendarSlotBlockComponent, ReservationComponent],
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  startOfWeek: Date = new Date();
  weekDays: DaySchedule[] = [];
  absences: Absence[] = [];
  allAvailabilities: Availability[] = [];
  startHour = 8;
  numHours = 6;
  slotLength = 30;
  slotIndexes: number[] = [];
  todayStr = '';

  constructor(private slotService: SlotService,
    private absenceService: AbsenceService,
    private availabilityService: AvailabilityService
  ) {}

  ngOnInit(): void {
    this.todayStr = new Date().toISOString().split('T')[0];
    this.startOfWeek = getMondayOf(new Date());

    // Inicjalizacja slotów
    this.slotService.initializeSlots().subscribe(() => {
      this.loadWeekData();
    });

    this.absenceService.getAbsences().subscribe((absences) => {
      this.absences = absences;
      this.loadWeekData();
    });

    this.availabilityService.getAvailabilities().subscribe((availabilities) => {
      this.allAvailabilities = availabilities; // Przypisanie danych do zmiennej
      this.loadWeekData(); // Załaduj dane kalendarza po załadowaniu dostępności
    });
  }

  // loadWeekData(): void {
  //   const totalSlots = (this.numHours * 60) / this.slotLength; 
  //   this.slotIndexes = Array.from({ length: totalSlots }, (_, i) => i);
  
  //   const startOfWeekStr = this.startOfWeek.toISOString().split('T')[0];
  //   const slotsForWeek = this.slotService.getSlotsForWeek(startOfWeekStr); // Filtrowanie slotów w pamięci

  //   const daysMap = new Map<string, DaySchedule>();

  //   // Grupuj sloty według daty
  //   slotsForWeek.forEach((slot) => {
  //     if (!daysMap.has(slot.date)) {
  //       daysMap.set(slot.date, {
  //         date: slot.date,
  //         dayOfWeek: getDayOfWeek(new Date(slot.date).getDay()),
  //         reservedCount: 0,
  //         slots: []
  //       });
  //     }
  //     const day = daysMap.get(slot.date)!;
  //     day.slots.push({
  //       ...slot,
  //       isPast: new Date(slot.date + 'T' + slot.startTime) < new Date()
  //     });
  //     if (slot.isReserved) {
  //       day.reservedCount++;
  //     }
  //   });

  //   // Ustaw dane w kolejności tygodniowej
  //   this.weekDays = generateWeekDays(this.startOfWeek, Array.from(daysMap.values()));
  // }

  loadWeekData(): void {
    const totalSlots = (this.numHours * 60) / this.slotLength; 
    this.slotIndexes = Array.from({ length: totalSlots }, (_, i) => i);
  
    const startOfWeekStr = this.startOfWeek.toISOString().split('T')[0];
    const slotsForWeek = this.slotService.getSlotsForWeek(startOfWeekStr); // Pobierz zarezerwowane sloty
    const reservedSlotsMap = new Map<string, GeneratedSlot>();
  
    // Mapa zarezerwowanych slotów (klucz = "date|startTime")
    slotsForWeek.forEach((slot) => {
      const key = `${slot.date}|${slot.startTime}`;
      reservedSlotsMap.set(key, slot);
    });
  
    // Generuj sloty dla każdego dnia tygodnia
    this.weekDays = generateWeekDays(this.startOfWeek, []).map((day) => {
      const generatedSlots: GeneratedSlot[] = [];
  
      for (let i = 0; i < totalSlots; i++) {
        const slotStartMinutes = this.startHour * 60 + i * this.slotLength;
        const slotEndMinutes = slotStartMinutes + this.slotLength;
  
        const slotStartStr = formatHHMM(slotStartMinutes);
        const slotEndStr = formatHHMM(slotEndMinutes);
  
        const slotKey = `${day.date}|${slotStartStr}`;
  
        // Sprawdź, czy slot jest zarezerwowany
        const reservedSlot = reservedSlotsMap.get(slotKey);
  
        const slot: GeneratedSlot = reservedSlot
          ? {
              ...reservedSlot,
              isPast: new Date(day.date + 'T' + slotStartStr) < new Date(),
            }
          : {
              date: day.date,
              startTime: slotStartStr,
              endTime: slotEndStr,
              isReserved: false,
              isPast: new Date(day.date + 'T' + slotStartStr) < new Date(),
            };
  
        generatedSlots.push(slot);
      }
  
      return {
        ...day,
        slots: generatedSlots,
        reservedCount: generatedSlots.filter((s) => s.isReserved).length,
      };
    });
  }
  

  goToPreviousWeek() {
    this.startOfWeek.setDate(this.startOfWeek.getDate() - 7);
    this.loadWeekData();
  }

  goToNextWeek() {
    this.startOfWeek.setDate(this.startOfWeek.getDate() + 7);
    this.loadWeekData();
  }

  goToPreviousHours() {
    this.startHour -= this.numHours;
    if (this.startHour < 0) {
      this.startHour = 0;
    }
    this.loadWeekData();
  }
  goToNextHours() {
    this.startHour += this.numHours;
    if (this.startHour + this.numHours > 24) {
      this.startHour = 24 - this.numHours; 
      if (this.startHour < 0) this.startHour = 0;
    }
    this.loadWeekData();
  }

  displaySlotLabel(slotIndex: number): string {
    const slotStartMinutes = (this.startHour * 60) + (slotIndex * this.slotLength);
    return formatHHMM(slotStartMinutes);
  }

  isCurrentDay(day: DaySchedule): boolean {
    return day.date === this.todayStr;
  }

  isCurrentTime(slotIndex: number, day: DaySchedule): boolean {
    if (day.date !== this.todayStr) return false;

    const slotStartMinutes = (this.startHour * 60) + (slotIndex * this.slotLength);
    const slotEndMinutes = slotStartMinutes + this.slotLength;

    const now = new Date();
    const nowM = now.getHours() * 60 + now.getMinutes();

    return (nowM >= slotStartMinutes && nowM < slotEndMinutes);
  }

  isAbsent(day: DaySchedule): boolean {
    return this.absences.some((absence) => absence.day === day.date);
  }

  public isAvailable(slotIndex: number, day: DaySchedule): boolean {

    const slotStartMinutes = this.startHour * 60 + (slotIndex * this.slotLength);
    const slotEndMinutes   = slotStartMinutes + this.slotLength;

    const slotStartStr = formatHHMM(slotStartMinutes);
    const slotEndStr   = formatHHMM(slotEndMinutes);

    const [yyyy, mm, dd] = day.date.split('-').map(Number);
    const dayDate = new Date(yyyy, mm - 1, dd);
    const dayOfWeek = dayDate.getDay(); 

    for (const avail of this.allAvailabilities) {
      if (avail.type === 'single-day') {
        if (avail.day === day.date) {
          if (anyTimeRangeCovers(slotStartStr, slotEndStr, avail.timeRanges)) {
            return true;
          }
        }
      }
      else if (avail.type === 'range') {
        if (isDateInRange(day.date, avail.dateFrom!, avail.dateTo!)) {
          if (avail.daysOfWeek && avail.daysOfWeek.includes(dayOfWeek)) {
            if (anyTimeRangeCovers(slotStartStr, slotEndStr, avail.timeRanges)) {
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  public isSlotClickable(slotIndex: number, day: DaySchedule): boolean {
    const slot = day.slots[slotIndex];
    return slot && !slot.isReserved && !slot.isPast && this.isAvailable(slotIndex, day) && !this.isAbsent(day);
  }

  private publicAreSlotsAvailable(slotIndex: number, day: DaySchedule, length: number = 30): boolean {
    const slotsRequired = Math.ceil(length / 30);

    for (let i = 0; i < slotsRequired; i++) {
      const currentSlotIndex = slotIndex + i;
      const slot = day.slots[currentSlotIndex];

      if (!slot || slot.isReserved || !this.isAvailable(currentSlotIndex, day) || this.isAbsent(day)) {
        return false;
      }
    }

    return true;
  }

  selectedSlot: { date: string, startTime: string } | null = null;
  currentSlotIndexDay: { slotIndex: number, day: DaySchedule } | null = null;

  onSlotClick(slotIndex: number, day: DaySchedule): void {
    if (this.isSlotClickable(slotIndex, day)) {
      this.selectedSlot = { date: day.date, startTime: this.displaySlotLabel(slotIndex) };
      this.currentSlotIndexDay = { slotIndex, day };
    }
  }

  areSlotsAvailable(length: number): boolean {
    if(this.currentSlotIndexDay?.slotIndex == null) return false;
    if(this.currentSlotIndexDay?.day == null) return false;

    return this.publicAreSlotsAvailable(this.currentSlotIndexDay.slotIndex, this.currentSlotIndexDay.day, length);
  }

  closeReservationForm(): void {
    this.selectedSlot = null;
  }
}

function getMondayOf(date: Date): Date {
  const cloned = new Date(date);
  const day = cloned.getDay();
  const diffToMonday = (day === 0) ? 6 : (day - 1);
  cloned.setDate(cloned.getDate() - diffToMonday);
  return cloned;
}

function generateWeekDays(startOfWeek: Date, days: DaySchedule[]): DaySchedule[] {
  const result: DaySchedule[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    const dateStr = day.toISOString().split('T')[0];

    let found = days.find(d => d.date === dateStr);
    if (!found) {
      found = {
        date: dateStr,
        dayOfWeek: getDayOfWeek(day.getDay()),
        reservedCount: 0,
        slots: []
      };
    }
    result.push(found);
  }
  return result;
}

function getDayOfWeek(dayNumber: number): string {
  const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  return days[dayNumber] || '???';
}

function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return padZero(h) + ':' + padZero(m);
}

function padZero(num: number): string {
  return (num < 10) ? '0' + num : '' + num;
}

function anyTimeRangeCovers(
  slotStart: string,
  slotEnd: string,
  timeRanges: { start: string; end: string }[]
): boolean {
  for (const range of timeRanges) {
    if (
      slotStart >= range.start && // Slot zaczyna się po lub w tym samym czasie co początek zakresu
      slotEnd <= range.end       // Slot kończy się przed lub w tym samym czasie co koniec zakresu
    ) {
      return true;
    }
  }
  return false;
}

function isDateInRange(day: string, from: string, to: string): boolean {
  const dayDate = new Date(day);
  const fromDate = new Date(from);
  const toDate = new Date(to);

  return dayDate >= fromDate && dayDate <= toDate;
}
