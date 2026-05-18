import { useRef, useEffect, useState } from 'react';
import { Sketch } from '../lib/ferrofluid-app/sketch';
import { AudioControl } from '../lib/ferrofluid-app/audio-control';
import { Mic, MicOff } from 'lucide-react';

export default function FerrofluidWebgl() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<any>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    let sketch: any;
    
    // Default params based on URL parameters used in the static app
    const onInit = (instance: any) => {
        instance.simulationParams.MASS = 0.44;
        instance.simulationParams.REST_DENS = 1.01;
        instance.simulationParams.GAS_CONST = 40.0;
        instance.simulationParams.VISC = 1.0;
        instance.pointerParams.RADIUS = 1.1;
        instance.pointerParams.STRENGTH = 27.23;
        instance.simulationParamsNeedUpdate = true;
        instance.pointerParamsNeedUpdate = true;
        instance.run();
    };

    sketch = new Sketch(
      canvasRef.current,
      onInit,
      () => {}, // onEntryAnimationDone
      false // isDev
    );
    sketchRef.current = sketch;

    const handleResize = () => {
      if (sketch) {
        sketch.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleAudio = () => {
    if (!sketchRef.current) return;
    
    if (!sketchRef.current.audioControl) {
      sketchRef.current.audioControl = new AudioControl(false);
      sketchRef.current.audioControl.init();
      sketchRef.current.audioControl.isEnabled = true;
      
      // Monkey patch getValue to respect isEnabled flag
      const originalGetValue = sketchRef.current.audioControl.getValue.bind(sketchRef.current.audioControl);
      sketchRef.current.audioControl.getValue = function() {
        if (!this.isEnabled) return -1;
        return originalGetValue();
      };
      
      setIsAudioEnabled(true);
    } else {
      sketchRef.current.audioControl.isEnabled = !sketchRef.current.audioControl.isEnabled;
      setIsAudioEnabled(sketchRef.current.audioControl.isEnabled);
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-[32px] md:rounded-[48px] group" ref={containerRef}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover touch-none" 
        style={{ display: 'block' }} 
      />
      <div className="absolute top-6 md:top-8 right-6 md:right-8 z-20 mix-blend-difference pointer-events-none md:pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={toggleAudio}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 transition-all pointer-events-auto"
          title={isAudioEnabled ? "Tắt âm thanh" : "Bật tương tác âm thanh"}
        >
          {isAudioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
