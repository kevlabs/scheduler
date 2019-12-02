import React, { useState } from 'react';

import Button from 'components/Button';
import InterviewerList from 'components/InterviewerList';

export default function Form({interviewers, onCancel, onSave, ...props }) {
  const [name, setName] = useState(props.name || '');
  const [interviewer, setInterviewer] = useState((props.interviewer && props.interviewer.id) || null);
  const [error, setError] = useState('');

  const validate = (name, interviewer) => {
    if (!name) return setError("Student name cannot be blank");
    // if (!interviewer) return setError("Interviewer cannot be blank");
    onSave(name, interviewer);
  };

  const reset = () => {
    setName('');
    setInterviewer(null);
  }

  const cancel = (evt) => {
    evt.preventDefault();
    reset();
    onCancel && onCancel();
  }

  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        <form autoComplete="off" onSubmit={(evt) => evt.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            data-testid="student-name-input"
            onChange={(evt) => setName(evt.currentTarget.value)}
          />
        </form>
        <section className="appointment__validation">{error}</section>
        <InterviewerList { ...{ interviewers, interviewer, setInterviewer }} />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          <Button danger onClick={cancel}>Cancel</Button>
          <Button confirm onClick={() => onSave && validate(name, interviewer)}>Save</Button>
        </section>
      </section>
    </main>
  );

}