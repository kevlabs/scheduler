import { useEffect, useReducer } from 'react';
import axios from 'axios';

// action types enum
const ActType = {
  SET_DAY: 0,
  APPLICATION_DATA: 1,
  UPDATE_INTERVIEW: 2,
  UPDATE_SPOTS: 3
};

export default function useApplicationData() {

  const initialState = {
    days: [],
    day: 'Monday',
    appointments: []
  };

  const [state, dispatch] = useReducer((state, action) => {
    const actionToRun =  'type' in action && {
      [ActType.SET_DAY]({ day }) {
        return { ...state, day };
      },

      [ActType.APPLICATION_DATA]({ days, appointments, interviewers }) {
        return { ...state, days, appointments, interviewers };
      },

      [ActType.UPDATE_INTERVIEW]({ appointments }) {
        return { ...state, appointments };
      },

      [ActType.UPDATE_SPOTS]({ add }) {
        const index = state.days.findIndex(({name}) => name === state.day);
        const days = state.days.map((day, i) => (i === index && { ...day, spots: day.spots + add }) || day);
        return { ...state, days };
      }
    }[action.type];

    return actionToRun ? actionToRun(action.payload) : state;

  }, initialState);

  useEffect(function fetchDays() {
    Promise.all([axios.get('api/days'), axios.get('api/appointments'), axios.get('api/interviewers')])
      .then(([{ data: days }, { data: appointments }, { data: interviewers }]) => 
        dispatch({ type: ActType.APPLICATION_DATA, payload: { days, appointments, interviewers } })
      )
      .catch(err => console.log(`Error: ${err.message}`));
  }, []);

  const setDay = (day) => dispatch({ type: ActType.SET_DAY, payload: { day } });

  const bookInterview = (id, interview) => {

    const isNew = !state.appointments[id].interview;
    
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
      .then(() => dispatch({ type: ActType.UPDATE_INTERVIEW, payload: { appointments } }))
      .then(() => isNew && dispatch({ type: ActType.UPDATE_SPOTS, payload: { add: -1 } }));
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
      .then(() => dispatch({ type: ActType.UPDATE_INTERVIEW, payload: { appointments } }))
      .then(() => dispatch({ type: ActType.UPDATE_SPOTS, payload: { add: 1 } }));
  }

  return { state, setDay, bookInterview, cancelInterview };

};