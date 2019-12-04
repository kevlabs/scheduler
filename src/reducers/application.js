// action types enum
export const ActType = {
  SET_DAY: 0,
  APPLICATION_DATA: 1,
  UPDATE_INTERVIEW: 2
};

// reducer to manage application state
export default function reducer (state, action) {
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

      // update spots available
      const add = (!interview && 1) || (!state.appointments[id].interview && -1) || 0;
      if (add) {
        const index = state.days.findIndex(({appointments}) => appointments.includes(id));
        const days = state.days.map((day, i) => (i === index && { ...day, spots: day.spots + add }) || day);
        return { ...state, appointments, days };
      }

      return { ...state, appointments };
    }
  }[action.type];

  if (!actionToRun) throw Error(`Tried to reduce with unsupported action of type ${action.type}.`);
  
  return actionToRun(action.payload);

}