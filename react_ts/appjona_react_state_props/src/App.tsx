import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UiHome } from './views/uihome/UiHome';

const uiHome = new UiHome();

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<UiHome />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
   
  );
}

export default App;