import { useState } from 'react';

// hook to manage in-display views and transitions between views
export default function useVisualMode(initialMode) {

  const [mode, setMode] = useState([initialMode]);
  const transition = (newMode, replace = false) => setMode(prev => (replace && [...prev.slice(0, -1), newMode]) || [...prev, newMode]);
  const back = () => setMode(prev => (prev.length > 1 && prev.slice(0, -1)) || prev);

  return { mode: mode[mode.length - 1], transition, back };
}