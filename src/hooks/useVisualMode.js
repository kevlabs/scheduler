import { useState } from 'react';

export default function useVisualMode(initialMode) {

  const [mode, setMode] = useState([initialMode]);
  const transition = (newMode, replace = false) => setMode(prev => (replace && [...prev.slice(0, -1), newMode]) || [...prev, newMode]);
  const back = () => setMode(prev => (prev.length > 1 && prev.slice(0, -1)) || prev);

  return { mode: mode[mode.length - 1], transition, back };
}