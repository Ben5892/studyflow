import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

const Focus = () => {
  const { loading } = useAuth();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState("Classical");
  const [distractionBlocker, setDistractionBlocker] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const soundUrls: Record<string, string> = {
    "Study Music": "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3",
    "Ambient Sounds": "https://cdn.pixabay.com/audio/2022/03/10/audio_4deebf21ca.mp3",
    "Ambient": "https://cdn.pixabay.com/audio/2022/03/10/audio_4deebf21ca.mp3",
    "Classical": "https://cdn.pixabay.com/audio/2022/03/09/audio_4d657fb29f.mp3",
    "Electronic": "https://cdn.pixabay.com/audio/2022/01/18/audio_c68fa84cd7.mp3",
    "Brown Noise": "https://cdn.pixabay.com/audio/2023/10/30/audio_d0d5f2c0af.mp3",
  };

  const soundCategories = [
    ["Study Music", "Ambient Sounds"],
    ["Ambient", "Classical", "Electronic"],
    ["Brown Noise"],
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = soundUrls[selectedSound];
      audioRef.current.loop = true;
      if (isRunning) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [selectedSound]);

  useEffect(() => {
    if (audioRef.current) {
      if (isRunning) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours(hours - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          setIsRunning(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, hours, minutes, seconds]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setHours(0);
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
  };

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <audio ref={audioRef} />
      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Focus</h1>
          <div className="w-10" />
        </div>

        {/* Timer Display */}
        <div className="flex items-center justify-center gap-2 py-8">
          <div className="text-center">
            <div className="text-5xl font-bold bg-[hsl(var(--timer-bg))] rounded-2xl px-6 py-4">
              {formatTime(hours)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Hours</p>
          </div>
          <span className="text-4xl font-bold">:</span>
          <div className="text-center">
            <div className="text-5xl font-bold bg-[hsl(var(--timer-bg))] rounded-2xl px-6 py-4">
              {formatTime(minutes)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Minutes</p>
          </div>
          <span className="text-4xl font-bold">:</span>
          <div className="text-center">
            <div className="text-5xl font-bold bg-[hsl(var(--timer-bg))] rounded-2xl px-6 py-4">
              {formatTime(seconds)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Seconds</p>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex gap-3 justify-center">
          <Button
            onClick={toggleTimer}
            size="lg"
            className="px-12"
          >
            {isRunning ? "Pause" : "Start"}
          </Button>
          <Button
            onClick={resetTimer}
            variant="outline"
            size="lg"
          >
            Reset
          </Button>
        </div>

        {/* Sounds Section */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Sounds</h2>
          {soundCategories.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 flex-wrap">
              {row.map((sound) => (
                <Button
                  key={sound}
                  variant={selectedSound === sound ? "default" : "secondary"}
                  onClick={() => setSelectedSound(sound)}
                  className="flex-1 min-w-fit"
                >
                  {sound}
                </Button>
              ))}
            </div>
          ))}
        </div>

        {/* Distraction Blocker */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Distraction Blocker</h2>
          <div className="flex items-center justify-between bg-accent rounded-lg p-4">
            <span className="font-medium">Block distracting apps</span>
            <Switch
              checked={distractionBlocker}
              onCheckedChange={setDistractionBlocker}
            />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Focus;
