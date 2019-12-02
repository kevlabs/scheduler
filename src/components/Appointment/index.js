import React, { useEffect } from 'react';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Form from 'components/Appointment/Form';
import Status from 'components/Appointment/Status';
import Error from 'components/Appointment/Error';
import Confirm from 'components/Appointment/Confirm';
import useVisualMode from 'hooks/useVisualMode';
import 'components/Appointment/styles.scss';
import { statement } from '@babel/template';

export default function Appointment({ id, time, interview, interviewers, bookInterview, cancelInterview }) {

  // declare views enum
  const views = {
    EMPTY: 'EMPTY',
    SHOW: 'SHOW',
    CREATE: 'CREATE',
    EDIT: 'EDIT',
    SAVING: 'SAVING',
    DELETING: 'DELETING',
    CONFIRM: 'CONFIRM',
    ERROR_SAVING: 'ERROR SAVING',
    ERROR_DELETING: 'ERROR DELETING'
  }
  
  const view = useVisualMode(interview ? views.SHOW : views.EMPTY);

  useEffect(() => {
    if (interview && view.mode === views.EMPTY) view.transition(views.SHOW);
    if (interview === null && view.mode === views.SHOW) view.transition(views.EMPTY);
   }, [interview, view, views]);
  
  // save appointment
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    view.transition(views.SAVING)
    bookInterview(id, interview)
      .then(() => view.transition(views.SHOW))
      .catch(err => view.transition(views.ERROR_SAVING, true));
  };

  // cancel appointment
  const cancel = (id) => {
    view.transition(views.DELETING, true)
    cancelInterview(id)
      .then(() => view.transition(views.EMPTY))
      .catch(err => view.transition(views.ERROR_DELETING, true));
  };

  // generic cancel
  const onCancel = () => view.back();

  // empty
  const onAdd = () => view.transition(views.CREATE);

  // form
  const onSave = (name, interviewer) => save(name, interviewer);

  // show
  const onEdit = () => view.transition(views.EDIT);
  const onDelete = () => view.transition(views.CONFIRM);

  // error
  const onClose = onCancel;

  // confirm
  const onConfirm = () => cancel(id);

  return (
    <article className='appointment' data-testid='appointment'>
      <Header {...{ time }} />
      { view.mode === views.EMPTY && <Empty {...{ onAdd }} />}
      { view.mode === views.SHOW && interview && <Show {...{ ...interview, onEdit, onDelete }} />}
      { view.mode === views.CREATE && <Form {...{ interviewers, onCancel, onSave }} />}
      { view.mode === views.EDIT && <Form {...{ name: interview.student, interviewer: interview.interviewer, interviewers, onCancel, onSave }} />}
      { view.mode === views.SAVING && <Status message='Saving...' />}
      { view.mode === views.DELETING && <Status message='Deleting...' />}
      { view.mode === views.ERROR_SAVING && <Error {...{ message: 'Error while saving', onClose }} />}
      { view.mode === views.ERROR_DELETING && <Error {...{ message: 'Error while deleting', onClose }} />}
      { view.mode === views.CONFIRM && <Confirm {...{ message: 'Are you sure?', onCancel, onConfirm }} />}
    </article>
  );

}