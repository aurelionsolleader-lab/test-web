import React from 'react';

const FerroSpace = ({ 
  theme = 'dark',
}: {
  theme?: 'dark' | 'light',
}) => {
  const params = `debug=true&MASS=0.50&REST_DENS=0.37&GAS_CONST=40.00&VISC=2.44&STEPS=2&RADIUS=0.90&STRENGTH=17.62&background=${theme === 'dark' ? '000000' : 'f5f5f7'}`;

  return (
    <div className={`w-full h-full relative ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#f5f5f7]'}`}>
      <iframe
        src={`https://robert-leitl.github.io/ferrofluid/dist/?${params}`}
        className="w-full h-full border-0 outline-none"
        title="Ferrofluid Simulation"
        style={{ filter: 'contrast(1.15) brightness(1.05) saturate(1.1)' }}
        key={theme}
      />
      
      {/* Hide Settings Panel (Top Right) */}
      <div className={`absolute top-0 right-0 w-[350px] h-full z-20 pointer-events-none ${theme === 'dark' ? 'bg-transparent' : 'bg-transparent'}`}>
        <div className={`absolute top-0 right-0 w-full h-[65%] ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#f5f5f7]'} pointer-events-auto`} />
      </div>

      {/* Hide Github Link (Bottom Right) */}
      <div className={`absolute bottom-0 right-0 w-40 h-16 z-20 pointer-events-auto ${theme === 'dark' ? 'bg-[black]' : 'bg-[#f5f5f7]'}`} />
      
      {/* Hide Microphone button (Bottom Center) */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-32 z-20 pointer-events-auto ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#f5f5f7]'}`} 
           style={{ clipPath: 'circle(50% at 50% 100%)' }} />

      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
};

export default FerroSpace;

