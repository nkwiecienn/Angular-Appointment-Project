import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarSlotBlockComponent } from '../calendar-slot-block/calendar-slot-block.component';
import { RouterModule } from '@angular/router';
import { SlotService } from '../../services/slot.service';
import { ReservationService } from '../../services/reservation.service';
import { DaySchedule } from '../models/day-schedule';
import { AbsenceService } from '../../services/absence.service';
import { AvailabilityService } from '../../services/availability.service';
import { Absence } from '../../absence/models/absence';
import { Availability } from '../../availability/models/availability';
import { Reservation } from '../../reservation/models/reservation';
import { TimeSlot } from '../models/time-slot';
import { ReservationComponent } from '../../reservation/reservation.component';
import { RoleService } from '../../services/role.service';

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
  reservations: Reservation[] = [];
  startHour = 8;
  numHours = 6;
  slotLength = 30;
  slotIndexes: number[] = [];
  todayStr = '';

  constructor(
    private slotService: SlotService,
    private reservationService: ReservationService,
    private absenceService: AbsenceService,
    private availabilityService: AvailabilityService,
    public roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.todayStr = new Date().toISOString().split('T')[0];
    this.startOfWeek = getMondayOf(new Date());
    this.reservationService.loadReservations(); 

    // Pobierz dane wymagane do generowania kalendarza
    this.loadData();
  }

  private loadData(): void {
    this.absenceService.getAbsences().subscribe((absences) => {
      this.absences = absences;
      this.loadWeekData();
    });

    this.availabilityService.getAvailabilities().subscribe((availabilities) => {
      this.allAvailabilities = availabilities;
      this.loadWeekData();
    });

    this.reservationService.getReservations().subscribe((reservations) => {
      this.reservations = reservations;
      this.loadWeekData();
    });
  }

  private loadWeekData(): void {
    const totalSlots = (this.numHours * 60) / this.slotLength; 
    this.slotIndexes = Array.from({ length: totalSlots }, (_, i) => i);

    // Generuj dane dla każdego dnia tygodnia
    this.weekDays = generateWeekDays(this.startOfWeek, []).map((day) => {
      const dailyReservations = this.reservations.filter((res) => res.date === day.date);
      const slots = this.slotService.generateSlotsForDay(
        day.date,
        dailyReservations,
        this.startHour,
        this.startHour + this.numHours,
        this.slotLength
      );

      return {
        ...day,
        slots: slots,
        reservedCount: slots.filter((s) => s.isReserved).length,
      };
    });
  }

  goToPreviousWeek(): void {
    this.startOfWeek.setDate(this.startOfWeek.getDate() - 7);
    this.loadWeekData();
  }

  goToNextWeek(): void {
    this.startOfWeek.setDate(this.startOfWeek.getDate() + 7);
    this.loadWeekData();
  }

  goToPreviousHours(): void {
    this.startHour -= this.numHours;
    if (this.startHour < 0) {
      this.startHour = 0;
    }
    this.loadWeekData();
  }

  goToNextHours(): void {
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
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return nowMinutes >= slotStartMinutes && nowMinutes < slotStartMinutes + this.slotLength;
  }

  isAbsent(day: DaySchedule): boolean {
    return this.absences.some((absence) => absence.day === day.date);
  }

  isAvailable(slotIndex: number, day: DaySchedule): boolean {
    const slotStartMinutes = this.startHour * 60 + slotIndex * this.slotLength;
    const slotEndMinutes = slotStartMinutes + this.slotLength;

    const slotStartStr = formatHHMM(slotStartMinutes);
    const slotEndStr = formatHHMM(slotEndMinutes);

    const dayOfWeek = new Date(day.date).getDay();
    return this.allAvailabilities.some((avail) => {
      if (avail.type === 'single-day' && avail.day === day.date) {
        return anyTimeRangeCovers(slotStartStr, slotEndStr, avail.timeRanges);
      }
      if (
        avail.type === 'range' &&
        isDateInRange(day.date, avail.dateFrom!, avail.dateTo!) &&
        avail.daysOfWeek?.includes(dayOfWeek)
      ) {
        return anyTimeRangeCovers(slotStartStr, slotEndStr, avail.timeRanges);
      }
      return false;
    });
  }

  public isSlotClickable(slotIndex: number, day: DaySchedule): boolean {
    const slot = day.slots[slotIndex];
    return slot && !slot.isReserved && !slot.isPast && this.isAvailable(slotIndex, day) && !this.isAbsent(day) && this.roleService.isPatient();
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
  const diffToMonday = day === 0 ? 6 : day - 1;
  cloned.setDate(cloned.getDate() - diffToMonday);
  return cloned;
}

function generateWeekDays(startOfWeek: Date, days: DaySchedule[]): DaySchedule[] {
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    const dateStr = day.toISOString().split('T')[0];
    const foundDay = days.find((d) => d.date === dateStr);
    return (
      foundDay || {
        date: dateStr,
        dayOfWeek: getDayOfWeek(day.getDay()),
        reservedCount: 0,
        slots: [],
      }
    );
  });
}

function getDayOfWeek(dayNumber: number): string {
  const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
  return days[dayNumber] || '???';
}

function formatHHMM(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function anyTimeRangeCovers(
  slotStart: string,
  slotEnd: string,
  timeRanges: { start: string; end: string }[]
): boolean {
  return timeRanges.some((range) => slotStart >= range.start && slotEnd <= range.end);
}

function isDateInRange(day: string, from: string, to: string): boolean {
  const dayDate = new Date(day);
  return dayDate >= new Date(from) && dayDate <= new Date(to);
}
