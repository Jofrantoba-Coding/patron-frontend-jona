import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UiHome } from './views/uihome/UiHome';
import ProtectedRoute from './protectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<UiHome />} />
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/' element={<UiHome />} />
        </Route>
        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
