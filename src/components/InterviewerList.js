import React from 'react';

import InterviewerListItem from 'components/InterviewerListItem';
import 'components/InterviewerList.scss';

export default function InterviewerList({ interviewers, interviewer, setInterviewer }) {
  return (
    <section className='interviewers'>
      <h4 className='interviewers__header text--light'>Interviewer</h4>
      <ul className='interviewers__list'>
        {interviewers.map(({ id, name, avatar }) => (<InterviewerListItem {...{ key: id, id, name, avatar, selected: interviewer === id, setInterviewer: () => setInterviewer(id) }} />))}
      </ul>
    </section>
  );
}