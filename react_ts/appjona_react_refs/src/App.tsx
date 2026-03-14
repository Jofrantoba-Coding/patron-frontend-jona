import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoute';
import { UiIniciarSesionView } from './views/uiiniciarsesion/UiIniciarSesionView';
import { UiHomeSessionView } from './views/uihomesesion/UiHomeSessionView';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<UiIniciarSesionView />} />
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/homesesion' element={<UiHomeSessionView />} />
        </Route>
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
