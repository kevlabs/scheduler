import React from 'react';

import DayListItem from 'components/DayListItem';

export default function DayList({ days, day, setDay }) {
  return (
    <ul>
      {days.map(({ id, name, spots }) => (<DayListItem {...{ key: id, name, spots, selected: day === name, setDay }} />))}
    </ul>
  );
}