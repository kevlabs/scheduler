import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    days: [],
    day: 'Monday',
    appointments: []
  });

  const setDay = (day) => setState(prev => ({ ...prev, day }));

  useEffect(function fetchDays() {
    Promise.all([axios.get('api/days'), axios.get('api/appointments'), axios.get('api/interviewers')])
      .then(([{ data: days }, { data: appointments }, { data: interviewers }]) => setState(prev => ({ ...prev, days, appointments, interviewers })))
      .catch(err => console.log(`Error: ${err.message}`));
  }, []);

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // push appointment to db and update state if successful
    return axios.put(`api/appointments/${id}`, appointment)
      .then(() => setState(prev => ({ ...prev, appointments })));
  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // delete interview from db and update state if successful
    return axios.delete(`api/appointments/${id}`)
      .then(() => setState(prev => ({ ...prev, appointments })));
  }

  return { state, setDay, bookInterview, cancelInterview };

};