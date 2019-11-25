import React from 'react';

import Header from 'components/Appointment/Header';
import 'components/Appointment/styles.scss';

export default function Appointment({ time }) {

  return (
    <article className='appointment'>
      <Header {...{ time }} />

    </article>
  );

}