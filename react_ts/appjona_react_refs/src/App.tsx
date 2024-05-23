import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './protectedRoute'
import { UiIniciarSesionImpl } from './views/uiiniciarsesion/UiIniciarSesionImpl';
import { UiHomePageImpl } from './views/UiHomePage/UiHomePage.implement';

const uiIniciarSesionImpl = new UiIniciarSesionImpl();
const uiHomePageImpl = new UiHomePageImpl();

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={uiIniciarSesionImpl.render()} />
        <Route path='/register' element={uiIniciarSesionImpl.render()} />
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/' element={uiHomePageImpl.render()} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
   
  );
}

export default App;