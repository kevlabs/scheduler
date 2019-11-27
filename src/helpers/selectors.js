export function getAppointmentsForDay(state, name) {
  // get apointment Ids for day
  const day = (state.days || []).find(day => day.name === name);
  
  // get appointment details
  return ((day && day.appointments) || []).map(id => state.appointments[id]);
}

export function getInterview(state, interview) {
  return (interview && { ...interview, interviewer: (interview && interview.interviewer && state.interviewers && state.interviewers[interview.interviewer]) || {} }) || null;
}