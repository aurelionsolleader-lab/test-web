import React from 'react';

const FerroSpace = ({ 
  theme = 'dark',
}: { 
  theme?: 'dark' | 'light',
}) => {
  // Ultra-spiky and still params
  const params = "MASS=1.00&REST_DENS=1.80&GAS_CONST=40.00&VISC=5.50&RADIUS=1.10&STRENGTH=15.00";

  return (
    <div className={`w-full h-full relative ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#ffffff]'}`}>
      <iframe
        src={`/ferrofluid/dist/index.html?${params}`}
        className="w-full h-full border-0 outline-none"
        title="Ferrofluid Simulation by Robert Leitl"
      />
    </div>
  );
};

export default FerroSpace;

