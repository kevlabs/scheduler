import React from 'react';
import classNames from 'classnames';

import 'components/Button.scss';

export default function Button({ confirm, danger, onClick, disabled, children }) {
   return <button
      className={classNames('button', { 'button--confirm': confirm, 'button--danger': danger })}
      onClick={(evt) => onClick && onClick(evt)}
      disabled={disabled}
   >{children}</button>;
}