
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
) => ({
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
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  },
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
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
  }
})
