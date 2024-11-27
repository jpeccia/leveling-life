import { ReactNode } from 'react';

interface VideoBackgroundProps {
  children: ReactNode;
}

export function VideoBackground({ children }: VideoBackgroundProps) {
  return (
    <div className="relative w-full h-full">
      {/* Camada de grade */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0"></div>
      
      {/* Camada de vídeo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-30 z-0"
      >
        <source src="/meadow-evening-moewalls-com.mp4" type="video/mp4" />
      </video>
      
      {/* Conteúdo */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
