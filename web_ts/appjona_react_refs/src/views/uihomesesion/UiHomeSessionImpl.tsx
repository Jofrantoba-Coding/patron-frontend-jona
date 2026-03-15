// UiHomeSessionImpl.tsx
// Implementation class for the session view — integrator's responsibility
import { Component } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { UiHomeSession } from './UiHomeSession';

interface UiHomeSessionImplProps {
  navigate: NavigateFunction;
}

export class UiHomeSessionImpl extends Component<UiHomeSessionImplProps> {

  logout(): void {
    localStorage.removeItem('jona_authenticated');
    localStorage.removeItem('jona_token');
    localStorage.removeItem('jona_user');
    this.props.navigate('/login');
  }

  render() {
    const userRaw = localStorage.getItem('jona_user');
    const user = userRaw ? JSON.parse(userRaw) : { name: '', email: '' };

    return (
      <UiHomeSession
        name={user.name as string}
        email={user.email as string}
        onLogout={() => this.logout()}
      />
    );
  }
}
