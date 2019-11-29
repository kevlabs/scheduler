import { useEffect, useReducer } from 'react';
import axios from 'axios';

// action types enum
const ActType = {
  SET_DAY: 0,
  APPLICATION_DATA: 1,
  UPDATE_INTERVIEW: 2
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

      [ActType.UPDATE_INTERVIEW]({ id, interview = null }) {

        const appointments = {
          ...state.appointments,
          [id]: {
            ...state.appointments[id],
            interview
          }
        };

        const add = (!interview && 1) || (!state.appointments[id].interview && -1) || 0;

        if (add) {
          const index = state.days.findIndex(({appointments}) => appointments.includes(id));
          const days = state.days.map((day, i) => (i === index && { ...day, spots: day.spots + add }) || day);
          return { ...state, appointments, days };
        }

        return { ...state, appointments };
      }
    }[action.type];

    return actionToRun ? actionToRun(action.payload) : state;

  }, initialState);

  useEffect(() => {
    
    // fetch data
    Promise.all([axios.get('api/days'), axios.get('api/appointments'), axios.get('api/interviewers')])
    .then(([{ data: days }, { data: appointments }, { data: interviewers }]) =>
      dispatch({ type: ActType.APPLICATION_DATA, payload: { days, appointments, interviewers } })
    )
    .catch(err => console.log(`Error: ${err.message}`));
    
    // instantiate ws connection
    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onopen = (event) => {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // construct interview object
        const [id, interview] = (data && data.type === 'SET_INTERVIEW' && [data.id, data.interview]) || [null, null];

        // update local state if server state has changed
        id && updateInterviewState(id, interview);
      };
    };
    return socket.close;

  }, []);

  const setDay = (day) => dispatch({ type: ActType.SET_DAY, payload: { day } });

  // create/edit interview in db - returns a promise
  const bookInterview = (id, interview, sync = true) => axios.put(`api/appointments/${id}`, { ...state.appointments[id], interview });

  // delete interview from db - returns a promise
  const cancelInterview = (id, sync = true) => axios.delete(`api/appointments/${id}`);

  // update state when an interview is created/updated or deleted
  const updateInterviewState = (id, interview) => dispatch({ type: ActType.UPDATE_INTERVIEW, payload: { id, interview } });

  return { state, setDay, bookInterview, cancelInterview };

};