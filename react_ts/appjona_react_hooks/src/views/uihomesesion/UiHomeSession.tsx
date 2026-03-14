// UiHomeSession.tsx
// Visual component for the session view — UI designer's responsibility
import React from 'react';
import BorderLayout from '../../uilayouts/BorderLayout';
import Header from '../../uiutils/Header';
import Footer from '../../uiutils/Footer';

interface UiHomeSessionProps {
  name: string;
  email: string;
  onLogout: () => void;
}

export const UiHomeSession: React.FC<UiHomeSessionProps> = ({ name, email, onLogout }) => {
  return (
    <BorderLayout
      north={<Header />}
      south={<Footer />}
      center={
        <div className="max-w-sm mx-auto p-4 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Welcome, {name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Active session: {email}
          </p>
          <button
            onClick={onLogout}
            className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5"
          >
            Logout
          </button>
        </div>
      }
    />
  );
};
