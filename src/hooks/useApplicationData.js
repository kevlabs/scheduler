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
          const index = state.days.findIndex(({name}) => name === state.day);
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
        id && (interview ? bookInterview(id, interview, false) : cancelInterview(id, false));
      };
    };
    return socket.close;

  }, []);

  const setDay = (day) => dispatch({ type: ActType.SET_DAY, payload: { day } });

  const bookInterview = (id, interview, sync = true) => {
    // push appointment to db and update state if successful
    return ((sync && axios.put(`api/appointments/${id}`, { ...state.appointments[id], interview })) || Promise.resolve(true))
      .then(() => !sync && dispatch({ type: ActType.UPDATE_INTERVIEW, payload: { id, interview } }));
  }

  const cancelInterview = (id, sync = true) => {
    // delete interview from db and update state if successful
    return ((sync && axios.delete(`api/appointments/${id}`)) || Promise.resolve(true))
      .then(() => !sync && dispatch({ type: ActType.UPDATE_INTERVIEW, payload: { id } }))
  }

  return { state, setDay, bookInterview, cancelInterview };

};