import React from "react";

import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";

import useAplicationData from 'hooks/useApplicationData';
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors';

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
