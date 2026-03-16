// BorderLayout.tsx — Level 4: Design Template
// Defines the 5-zone page structure (north, south, east, west, center).
// No business logic — accepts Organisms as ReactNode slots.
import React from 'react';

interface BorderLayoutProps {
  north?: React.ReactNode;
  south?: React.ReactNode;
  east?: React.ReactNode;
  west?: React.ReactNode;
  center?: React.ReactNode;
}

const BorderLayout: React.FC<BorderLayoutProps> = ({ north, south, east, west, center }) => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      {north && (
        <header className="flex-none bg-primary-600 text-white px-token-lg py-token-sm shadow-md">
          {north}
        </header>
      )}
      <div className="flex flex-1 overflow-hidden">
        {west && (
          <aside className="flex-none w-56 bg-neutral-100 border-r border-neutral-200 p-token-md">
            {west}
          </aside>
        )}
        <main className="flex-1 overflow-auto p-token-lg">
          {center ?? <div className="text-neutral-300 text-sm">No content</div>}
        </main>
        {east && (
          <aside className="flex-none w-56 bg-neutral-100 border-l border-neutral-200 p-token-md">
            {east}
          </aside>
        )}
      </div>
      {south && (
        <footer className="flex-none bg-neutral-700 text-white text-center text-xs py-token-sm px-token-lg">
          {south}
        </footer>
      )}
    </div>
  );
};

export default BorderLayout;
