import type { ReactNode } from 'react';

export interface BorderLayoutProps {
  north?: ReactNode;
  south?: ReactNode;
  east?: ReactNode;
  west?: ReactNode;
  center: ReactNode;
}

export function BorderLayout({ north, south, east, west, center }: BorderLayoutProps) {
  return (
    <div className="border-layout">
      {north ? <header className="border-layout__north">{north}</header> : null}
      {west ? <aside className="border-layout__west">{west}</aside> : null}
      <main className="border-layout__center">{center}</main>
      {east ? <aside className="border-layout__east">{east}</aside> : null}
      {south ? <footer className="border-layout__south">{south}</footer> : null}
    </div>
  );
}
