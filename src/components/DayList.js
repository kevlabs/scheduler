import React from 'react';

import DayListItem from './DayListItem';

export default function DayList({ days, day, setDay }) {
  return (
    <ul>
      {days.map(({ id, name, spots }) => (<DayListItem {...{id, name, spots, selected: day === name, setDay }} />))}
    </ul>
  );
}