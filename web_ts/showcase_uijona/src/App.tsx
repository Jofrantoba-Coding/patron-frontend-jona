import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UiShowcase } from './views/uishowcase';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/showcase/ButtonAtom" replace />} />
    <Route path="/showcase/:componentId" element={<UiShowcase />} />
    <Route path="/showcase" element={<Navigate to="/showcase/ButtonAtom" replace />} />
  </Routes>
);

export default App;
