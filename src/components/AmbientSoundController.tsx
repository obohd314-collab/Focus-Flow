import * as React from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { AMBIENT_SOUNDS } from '@/src/constants';
import { ThemeConfig } from '@/src/types';

interface AmbientSoundControllerProps {
  theme: ThemeConfig;
  selectedSoundId: string;
  onSelectSound: (id: string) => void;
}

export default function AmbientSoundController({
  theme,
  selectedSoundId,
  onSelectSound,
}: AmbientSoundControllerProps) {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    const sound = AMBIENT_SOUNDS.find(s => s.id === selectedSoundId);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (sound && sound.url) {
      audioRef.current = new Audio(sound.url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(e => console.log('Audio autoplay blocked', e));
    }

    return () => {
      audioRef.current?.pause();
    };
  }, [selectedSoundId]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2 px-2">
        <Music className={cn("w-4 h-4", theme.colors.text)} />
        <span className={cn("text-[10px] uppercase tracking-widest font-bold opacity-40", theme.colors.text)}>
          Deep focus Audio
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {AMBIENT_SOUNDS.map((sound) => (
          <button
            key={sound.id}
            onClick={() => onSelectSound(sound.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center space-x-2",
              selectedSoundId === sound.id
                ? `bg-${theme.colors.accent} text-white shadow-lg scale-105`
                : cn("bg-black/5 hover:bg-black/10 opacity-70", theme.colors.text)
            )}
          >
            {selectedSoundId === sound.id ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3 opacity-30" />}
            <span>{sound.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
