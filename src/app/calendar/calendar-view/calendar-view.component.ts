import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { DaySchedule } from '../models/day-schedule';
import { CalendarSlotBlockComponent } from '../calendar-slot-block/calendar-slot-block.component';
import { AvailabilityService } from '../../services/availability.service';
import { Availability } from '../../availability/models/availability';
import { RouterModule } from '@angular/router';
import { AbsenceService } from '../../services/absence.service';
import { Absence } from '../../absence/models/absence';

interface GeneratedSlot {
  startTime: string;
  endTime: string;
  isReserved: boolean;
  isPast: boolean;
  type?: string;
  reservationDetails?: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CalendarSlotBlockComponent
  ],
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})

export class CalendarViewComponent implements OnInit {
  startOfWeek: Date = new Date();
  weekDays: DaySchedule[] = [];
  allAvailabilities: Availability[] = [];
  absences: Absence[] = [];

  startHour = 8;
  numHours = 6;
  slotLength = 30;
  slotIndexes: number[] = [];

  private allDaysFromJson: DaySchedule[] = [];

  todayStr = '';

  constructor(
    private calendarService: CalendarService,
    private availabilityService: AvailabilityService,
    private absenceService: AbsenceService
  ) {}

  ngOnInit(): void {
    this.todayStr = new Date().toISOString().split('T')[0];
    this.startOfWeek = getMondayOf(new Date());

    this.availabilityService.getAvailabilities().subscribe((availabilities) => {
      this.allAvailabilities = availabilities;

      // Pętla działa poprawnie na załadowanych danych
      for (const avail of this.allAvailabilities) {
        console.log(avail);
      }
    });

    this.absenceService.getAbsences().subscribe((absences) => {
      this.absences = absences;
    });

    this.loadSchedule();
  }

  loadSchedule(): void {
    this.calendarService.getSchedule().subscribe(data => {
      this.allDaysFromJson = data.days || [];
      this.loadWeekData();
    });
  }


  loadWeekData(): void {
    this.weekDays = generateWeekDays(this.startOfWeek, this.allDaysFromJson);

    const totalSlots = (this.numHours * 60) / this.slotLength; 
    this.slotIndexes = Array.from({ length: totalSlots }, (_, i) => i);

    this.weekDays.forEach(day => {
      const dateObj = parseDate(day.date);

      const generatedSlots: GeneratedSlot[] = [];
      for (let i = 0; i < totalSlots; i++) {
        const slotStartMinutes = (this.startHour * 60) + (i * this.slotLength);
        const slotEndMinutes = slotStartMinutes + this.slotLength;

        const slotStartStr = formatHHMM(slotStartMinutes); 
        const slotEndStr   = formatHHMM(slotEndMinutes);

        const slot: GeneratedSlot = {
          startTime: slotStartStr, 
          endTime: slotEndStr,
          isReserved: false,
          isPast: false
        };

        const slotDateTime = new Date(
          dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(),
          parseInt(slotStartStr.split(':')[0], 10),
          parseInt(slotStartStr.split(':')[1], 10)
        );
        if (slotDateTime < new Date()) {
          slot.isPast = true;
        }

        for (const res of day.slots) {
          if (isSlotInReservation(slotStartStr, slotEndStr, res.startTime, res.endTime)) {
            slot.isReserved = true;
            slot.type = res.type;
            slot.reservationDetails = res.reservationDetails;
          }
        }

        generatedSlots.push(slot);
      }

      day.slots = generatedSlots;
      day.reservedCount = generatedSlots.filter(s => s.isReserved).length;
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
   //---------------------  Availability ---------------------

   public isAvailable(slotIndex: number, day: DaySchedule): boolean {
    // 1) Wyznacz godziny start/end slotu
    const slotStartMinutes = this.startHour * 60 + (slotIndex * this.slotLength);
    const slotEndMinutes   = slotStartMinutes + this.slotLength;

    const slotStartStr = formatHHMM(slotStartMinutes); // np. "08:00"
    const slotEndStr   = formatHHMM(slotEndMinutes);   // np. "08:30"

    // 2) Zamień day.date (np. "2025-01-06") na Date, 
    //    by sprawdzić dayOfWeek czy dateFrom <= date <= dateTo itp.
    const [yyyy, mm, dd] = day.date.split('-').map(Number);
    const dayDate = new Date(yyyy, mm - 1, dd);
    const dayOfWeek = dayDate.getDay(); 
    // (niedziela=0, pon=1, ...)

    // 3) Pobierz definicje dostępności z serwisu
    //const allAvailabilities = this.availabilityService.getAvailabilities();

    for (const avail of this.allAvailabilities) {
      if (avail.type === 'single-day') {
        // -> sprawdzamy, czy day.date == avail.day
        if (avail.day === day.date) {
          // -> sprawdź timeRanges
          if (anyTimeRangeCovers(slotStartStr, slotEndStr, avail.timeRanges)) {
            return true; // znaleźliśmy definicję, która pokrywa ten slot
          }
        }
      }
      else if (avail.type === 'range') {
        // -> sprawdzamy, czy dayDate mieści się w [dateFrom, dateTo]
        if (isDateInRange(day.date, avail.dateFrom!, avail.dateTo!)) {
          // -> sprawdzamy, czy dayOfWeek jest w avail.daysOfWeek
          if (avail.daysOfWeek && avail.daysOfWeek.includes(dayOfWeek)) {
            // -> sprawdzamy, czy slot pokrywa się z którymś z timeRanges
            if (anyTimeRangeCovers(slotStartStr, slotEndStr, avail.timeRanges)) {
              return true;
            }
          }
        }
      }
    }

    // 5) Jeśli żadna definicja nie pokrywa
    return false;
  }

  isAbsent(day: DaySchedule): boolean {
    return this.absences.some(absence => absence.day === day.date);
  }
}

function getMondayOf(date: Date): Date {
  const cloned = new Date(date);
  const day = cloned.getDay();
  const diffToMonday = (day === 0) ? 6 : (day - 1);
  cloned.setDate(cloned.getDate() - diffToMonday);
  return cloned;
}

function generateWeekDays(startOfWeek: Date, allDays: DaySchedule[]): DaySchedule[] {
  const result: DaySchedule[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(day.getDate() + i);
    const dateStr = day.toISOString().split('T')[0];

    let found = allDays.find(d => d.date === dateStr);
    if (!found) {
      found = {
        date: dateStr,
        dayOfWeek: getDayOfWeek(day.getDay()),
        reservedCount: 0,
        slots: []
      };
    } else {

      found = {
        ...found,
        dayOfWeek: getDayOfWeek(day.getDay())
      };
    }
    result.push(found);
  }
  return result;
}

function getDayOfWeek(dayNumber: number): string {
  const days = [
    'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa',
    'Czwartek', 'Piątek', 'Sobota'
  ];
  return days[dayNumber] || '???';
}

function parseDate(dateStr: string): Date {
  const [yyyy, mm, dd] = dateStr.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd);
}

function isSlotInReservation(
  slotStart: string, slotEnd: string,
  resStart: string, resEnd: string
): boolean {
  const slotS = hhmmToMinutes(slotStart); 
  const slotE = hhmmToMinutes(slotEnd);
  const resS  = hhmmToMinutes(resStart);
  const resE  = hhmmToMinutes(resEnd);
  
  return (slotS >= resS) && (slotE <= resE);
}

function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
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
  for (const tr of timeRanges) {
    if (isSlotInRange(slotStart, slotEnd, tr.start, tr.end)) {
      return true;
    }
  }
  return false;
}

function isSlotInRange(
  slotS: string,
  slotE: string,
  rangeS: string,
  rangeE: string
): boolean {
  const sS = hhmmToMinutes(slotS);
  const sE = hhmmToMinutes(slotE);
  const rS = hhmmToMinutes(rangeS);
  const rE = hhmmToMinutes(rangeE);
  // Zakładamy, że "mieści się" = slotS >= rangeS i slotE <= rangeE
  return (sS >= rS && sE <= rE);
}

function isDateInRange(dayStr: string, fromStr: string, toStr: string): boolean {
  const dayDate = parseISO(dayStr); 
  const fromDate = parseISO(fromStr);
  const toDate   = parseISO(toStr);
  return (dayDate >= fromDate && dayDate <= toDate);
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}