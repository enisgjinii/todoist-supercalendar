
import { CalendarOptions } from '@fullcalendar/core';

export const getCalendarOptions = (
  calendarView: string,
  weekendsVisible: boolean,
  businessHours: boolean,
  calendarEvents: any[],
  handlers: {
    eventClick: (info: any) => void;
    eventMouseEnter: (info: any) => void;
    eventMouseLeave: (info: any) => void;
    dateClick: (info: any) => void;
  }
): CalendarOptions => ({
  plugins: ["dayGrid", "timeGrid", "interaction", "list"],
  initialView: calendarView,
  events: calendarEvents,
  eventClick: handlers.eventClick,
  eventMouseEnter: handlers.eventMouseEnter,
  eventMouseLeave: handlers.eventMouseLeave,
  dateClick: handlers.dateClick,
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
  },
  weekends: weekendsVisible,
  businessHours: businessHours ? {
    daysOfWeek: [1, 2, 3, 4, 5],
    startTime: '09:00',
    endTime: '17:00',
  } : false,
  nowIndicator: true,
  dayMaxEvents: true,
  eventTimeFormat: { 
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    hour12: false
  },
  slotLabelFormat: {
    hour: "2-digit" as const,
    minute: "2-digit" as const,
    hour12: false
  },
  height: "700px",
  slotMinTime: "06:00:00",
  slotMaxTime: "22:00:00",
  allDaySlot: true,
  slotDuration: "00:30:00",
  snapDuration: "00:15:00",
  editable: true,
  droppable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEventRows: true,
  views: {
    timeGrid: {
      dayMaxEventRows: 6
    }
  },
  // New features
  weekNumbers: true,
  weekNumberFormat: { week: 'numeric' },
  fixedWeekCount: false,
  showNonCurrentDates: false,
  eventDisplay: 'block',
  eventOverlap: false,
  eventResizableFromStart: true,
  eventDurationEditable: true,
  nextDayThreshold: '00:00:00',
  forceEventDuration: true,
  displayEventEnd: true,
  dragRevertDuration: 500,
  dragScroll: true,
  dayPopoverFormat: { month: 'long', day: 'numeric', year: 'numeric' },
  moreLinkClick: 'popover',
  navLinks: true
})
