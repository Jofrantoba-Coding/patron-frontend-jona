import { LocaleProvider } from '../i18n/LocaleProvider';
import { AppRouter } from './AppRouter';

export function App() {
  return (
    <LocaleProvider>
      <AppRouter />
    </LocaleProvider>
  );
}
