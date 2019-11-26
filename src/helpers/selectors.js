export function getAppointmentsForDay(state, name) {
  // get apointment Ids for day
  const day = (state.days || []).find(day => day.name === name);

  // get appointment details
  return day ? Object.values(state.appointments || {}).filter(appointment => (day.appointments || []).includes(appointment.id)) : [];
}