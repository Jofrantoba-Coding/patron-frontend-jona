// UiHome.tsx
// Visual template component — UI designer's responsibility
import { Component } from 'react';
import { UiIniciarSesionView } from '../uiiniciarsesion/UiIniciarSesionView';
import BorderLayout from '../../uilayouts/BorderLayout';
import Header from '../../uiutils/Header';
import Footer from '../../uiutils/Footer';

export class UiHome extends Component {
  render() {
    return (
      <BorderLayout
        north={<Header />}
        south={<Footer />}
        center={<UiIniciarSesionView />}
      />
    );
  }
}
