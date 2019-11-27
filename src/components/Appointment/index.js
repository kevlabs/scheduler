import React from 'react';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import useVisualMode from 'hooks/useVisualMode';
import 'components/Appointment/styles.scss';
import { statement } from '@babel/template';

export default function Appointment({ id, time, interview, interviewers, bookInterview }) {

  // declare views enum
  const views = {
    EMPTY: 'EMPTY',
    SHOW: 'SHOW',
    CREATE: 'CREATE',
    SAVING: 'SAVING',
    CONFIRM: 'CONFIRM'
  }
  
  const view = useVisualMode(interview ? views.SHOW : views.EMPTY);
  
  // save form
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    view.transition(views.SAVING)
    bookInterview(id, interview).then(() => view.transition(views.SHOW));
  }

  // empty
  const onAdd = () => view.transition(views.CREATE);
  // show
  const onEdit = () => view.transition(views.SAVING);
  const onDelete = () => view.transition(views.CONFIRM);

  // form
  const onCancel = () => view.back();
  const onSave = (name, interviewer) => save(name, interviewer);

  return (
    <article className='appointment'>
      <Header {...{ time }} />
      { view.mode === views.EMPTY && <Empty {...{ onAdd }} />}
      { view.mode === views.SHOW && <Show {...{ ...interview, onEdit, onDelete }} />}
      { view.mode === views.CREATE && <Form {...{ ...interview, interviewers, onCancel, onSave }} />}
      { view.mode === views.SAVING && <Status message='Saving...' />}
    </article>
  );

}