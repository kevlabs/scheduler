import React from "react";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";

import useAplicationData from 'hooks/useApplicationData';
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors';

// test data
// const days = [
//   {
//     id: 1,
//     name: "Monday",
//     spots: 2,
//   },
//   {
//     id: 2,
//     name: "Tuesday",
//     spots: 5,
//   },
//   {
//     id: 3,
//     name: "Wednesday",
//     spots: 0,
//   },
// ];

// const appointments = [
//   {
//     id: 1,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 2,
//     time: "12pm",
//   },
//   {
//     id: 3,
//     time: "3pm",
//     interview: {
//       student: "John Doe",
//       interviewer: {
//         id: 3,
//         name: "Jack Sparrow",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png",
//       }
//     }
//   },
//   {
//     id: 5,
//     time: "5pm",
//     interview: {
//       student: "Jane Paris",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   }

// ];

export default function Application(props) {
 
  const { state, setDay, bookInterview, cancelInterview } = useAplicationData();
  
  return (
    <main className="layout">
      <section className="sidebar">
      <img
        className="sidebar--centered"
        src="images/logo.png"
        alt="Interview Scheduler"
      />
      <hr className="sidebar__separator sidebar--centered" />
      <nav className="sidebar__menu">
        <DayList
          {...{ days: state.days, day: state.day, setDay }}
        />
      </nav>
      <img
        className="sidebar__lhl sidebar--centered"
        src="images/lhl.png"
        alt="Lighthouse Labs"
      />
      </section>
      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map(appointment => <Appointment key={appointment.id} {...{...appointment, interview: getInterview(state, appointment.interview), interviewers: getInterviewersForDay(state, state.day), bookInterview, cancelInterview }} />)}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
