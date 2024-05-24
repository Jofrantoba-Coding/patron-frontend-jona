import React from 'react';
import '../resources/css/BorderLayout.css';

interface BorderLayoutProps {
  north?: React.ReactNode;
  south?: React.ReactNode;
  east?: React.ReactNode;
  west?: React.ReactNode;
  center?: React.ReactNode;
}

const BorderLayout: React.FC<BorderLayoutProps> = ({ north, south, east, west, center }) => {
  return (
    <div className="border-layout">
      {north && <div className="border-layout-north">{north}</div>}
      <div className="border-layout-middle">
        {west && <div className="border-layout-west">{west}</div>}
        <div className="border-layout-center">{center}</div>
        {east && <div className="border-layout-east">{east}</div>}
      </div>
      {south && <div className="border-layout-south">{south}</div>}
    </div>
  );
};

export default BorderLayout;