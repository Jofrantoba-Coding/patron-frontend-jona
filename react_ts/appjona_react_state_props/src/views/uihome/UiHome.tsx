import React, { Component } from 'react';
import { UiIniciarSesion } from '../uiiniciarsesion/UiIniciarSesion';
import BorderLayout from '../../uilayouts/BorderLayout';
import Header from '../../uiutils/Header';
import Footer from '../../uiutils/Footer';

export class UiHome extends Component {    
    render() {
        return (
          <BorderLayout
      north={<Header />}
      south={<Footer />}
      center={<UiIniciarSesion />}
    />
        );
      }
}