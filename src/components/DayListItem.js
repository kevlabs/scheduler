import React from 'react';
import classNames from 'classnames';

import 'components/DayListItem.scss';

export default function DayListItem({ id, name, spots, selected, setDay }) {
  return (
    <li key={id} className={classNames('day-list__item', { 'day-list__item--selected': selected, 'day-list__item--full': spots === 0 })} onClick={() => setDay && setDay(name)}>
      <h2 className='text--regular'>{name}</h2>
      <h3 className='text--light'>{(spots && `${spots} spot${(spots > 1 && 's') || ''} remaining`) || 'no spots remaining'}</h3>
    </li>
  );
}