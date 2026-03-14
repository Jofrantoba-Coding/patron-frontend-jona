import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UiHome } from './views/uihome/UiHome';
import { UiHomeSessionView } from './views/uihomesesion/UiHomeSessionView';
import ProtectedRoute from './protectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<UiHome />} />
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/homesesion' element={<UiHomeSessionView />} />
        </Route>
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
