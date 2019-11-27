import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";

import { getAppointmentsForDay } from 'helpers/selectors';
import { getInterview } from 'helpers/selectors';

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
  const [state, setState] = useState({
    days: [],
    day: 'Monday',
    appointments: []
  });
  // const [days, setDays] = useState([]);
  // const [day, setDay] = useState('Monday');

  const setDay = (day) => setState(prev => ({ ...prev, day }));

  useEffect(function fetchDays() {
    Promise.all([axios.get('api/days'), axios.get('api/appointments'), axios.get('api/interviewers')])
      .then(([{ data: days }, { data: appointments }, { data: interviewers }]) => setState(prev => ({ ...prev, days, appointments, interviewers })))
      .catch(err => console.log(`Error: ${err.message}`));
  }, []);

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
        {getAppointmentsForDay(state, state.day).map(appointment => <Appointment key={appointment.id} {...{...appointment, interview: getInterview(state, appointment.interview)}} />)}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
