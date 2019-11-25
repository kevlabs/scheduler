import React from 'react';
import classNames from 'classnames';

import 'components/InterviewerListItem.scss';

export default function InterviewerListItem({ id, name, avatar, selected, setInterviewer }) {
  return (
    <li className={classNames('interviewers__item', { 'interviewers__item--selected': selected })} onClick={() => setInterviewer && setInterviewer(id)}>
      <img
        className='interviewers__item-image'
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>
  );
}