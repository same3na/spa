// context/PlayerContext.tsx
import { createContext, useContext, useState } from "react";
import { Song } from "@/api/songs";

interface PlayerContextType {
  song: Song | null;
  playlist: Song[];
  isPlaying: boolean;
  setSong: (song: Song) => void;
  setPlaylist: (playlist: Song[]) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [song, setSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Array<Song>>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PlayerContext.Provider value={{ song, playlist, setSong, setPlaylist, isPlaying, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
}
