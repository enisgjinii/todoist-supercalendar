
export const calendarStyles = `
  .fc {
    --fc-border-color: rgba(0,0,0,0.1);
    --fc-today-bg-color: rgba(107, 70, 193, 0.1);
    --fc-event-border-color: transparent;
    --fc-event-selected-overlay-color: rgba(107, 70, 193, 0.2);
  }
  .fc .fc-toolbar {
    background-color: white;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 16px;
  }
  .fc .fc-toolbar-title {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(to right, #6b46c1, #3182ce);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .fc-event {
    border-radius: 4px;
    padding: 2px 4px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  .fc-event:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  .fc-day-today {
    border: 2px solid #6b46c1 !important;
    border-radius: 8px;
    background: rgba(107, 70, 193, 0.05) !important;
  }
  .fc-day-today .fc-daygrid-day-number {
    background: #6b46c1;
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
  }
  .fc .fc-button {
    background: white;
    border: 1px solid rgba(0,0,0,0.1);
    color: #333;
    font-weight: 500;
    text-transform: capitalize;
    padding: 6px 12px;
    transition: all 0.2s ease;
  }
  .fc .fc-button:hover {
    background: rgba(107, 70, 193, 0.1);
    border-color: #6b46c1;
    color: #6b46c1;
  }
  .fc .fc-button-primary:not(:disabled).fc-button-active,
  .fc .fc-button-primary:not(:disabled):active {
    background: #6b46c1;
    border-color: #6b46c1;
    color: white;
  }
  .priority-1 { background-color: #ef4444; color: white; }
  .priority-2 { background-color: #f97316; color: white; }
  .priority-3 { background-color: #eab308; color: white; }
  .priority-4 { background-color: #3b82f6; color: white; }
  .completed { opacity: 0.6; }
  .completed::after {
    content: '✓';
    margin-left: 4px;
  }
  @media (max-width: 640px) {
    .fc .fc-toolbar {
      flex-direction: column;
      gap: 8px;
    }
    .fc .fc-toolbar-title {
      font-size: 1.25rem;
    }
  }
`
