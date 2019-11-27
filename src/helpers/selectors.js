export function getAppointmentsForDay(state, day) {
  // get apointment Ids for day
  const d = (state.days || []).find(d => d.name === day);
  
  // get appointment details
  return ((d && d.appointments) || []).map(id => state.appointments[id]);
}

export function getInterviewersForDay(state, day) {
  // get interviewer Ids for day
  const d = (state.days || []).find(d => d.name === day);
  
  // get interviewer details
  return ((d && d.interviewers) || []).map(id => state.interviewers[id]);
}

export function getInterview(state, interview) {
  return (interview && { ...interview, interviewer: (interview && interview.interviewer && state.interviewers && state.interviewers[interview.interviewer]) || {} }) || null;
}