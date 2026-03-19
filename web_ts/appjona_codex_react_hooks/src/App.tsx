import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UiHomeView } from './views/uihome/UiHomeView';
import { UiHomeSessionView } from './views/uihomesesion/UiHomeSessionView';
import { ProtectedRoute } from './protectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<UiHomeView />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/homesesion" element={<UiHomeSessionView />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
