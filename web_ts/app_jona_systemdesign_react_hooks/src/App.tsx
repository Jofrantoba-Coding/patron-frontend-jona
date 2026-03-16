// App.tsx — Level 5: Pages entry point
// Registers routes. Each route maps to a View_Orchestrator (Page).
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { UiHomeView } from './views/uihome/UiHomeView';
import { UiHomeSessionView } from './views/uihomesesion/UiHomeSessionView';
import { UiShowcaseView } from './views/uishowcase/UiShowcaseView';
import { UiMenuShowcaseView } from './views/uimenushowcase/UiMenuShowcaseView';
import ProtectedRoute from './protectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Page: /login → UiHomeView (View_Orchestrator) */}
        <Route path='/login' element={<UiHomeView />} />

        {/* Protected pages — require authentication */}
        <Route path='/' element={<ProtectedRoute />}>
          <Route path='/homesesion' element={<UiHomeSessionView />} />
          <Route path='/showcase' element={<UiShowcaseView />} />
          <Route path='/menu-showcase' element={<UiMenuShowcaseView />} />
        </Route>

        <Route path='*' element={<Navigate to='/login' replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
