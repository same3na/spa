
import { useParams } from "react-router-dom";
import { getSingleSong, SongSingle as SongSingleModel } from "@/api/songs";
import { LikeSong, DislikeSong, isLikedSong as isLikedSongApi} from "@/api/user";
import { useEffect, useCallback, useState } from "react";

import 'react-circular-progressbar/dist/styles.css';
import { Star } from "lucide-react";

export default function SongSingle() {
  const { id } = useParams(); // Extract the dynamic route parameter

  if (!id) {
    return
  }
  const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
  const [song, setSong] = useState<SongSingleModel | null>(null)
  const [isLikedSong, setIsLikedSong] = useState<boolean>(false)
  const [musicalKey, setMusicalKey] = useState<string | null>(null)
  const [mode, setMode] = useState<string | null>(null)

  const getSong = useCallback(async(id:string) => {
    const data: SongSingleModel = await getSingleSong(id)
    setSong(data)

    setMusicalKey(data.features.key !== null ? keyNames[data.features.key] : null)
    setMode(data.features.mode === 1 ? "Major" : data.features.mode === 0 ? "Minor" : null)
  }, [id])

  const getIsSongLiked = async(id:string) => {
    const isLiked: boolean = await isLikedSongApi({song_id: id})
    setIsLikedSong(isLiked)
  }

  const setSongLiked = async() => {
    if (!song) {
      return
    }

    if (isLikedSong == true) {
      await DislikeSong({song_id:song.id})
    } else {
      await LikeSong({song_id:song.id})
    }
    

    await getIsSongLiked(song.id)
  }

  useEffect(() => {
    // get cluster by id
    getSong(id)
    getIsSongLiked(id)
  }, [id])
  
  return (
    <div>
      <div className="">
        <button
          onClick={() => setSongLiked()} 
          className="px-3 py-1 text-xsm rounded cursor-pointer mx-2 transition-all hover:bg-gray-800"
        >
          <div className="flex space-x-4">
            {isLikedSong ? (
              <Star color="#FFD700" />
            ) :
              <Star />
            }

            <span>
              {isLikedSong == true ? "Remove Song From Favorite" : "Add Song To Favorite"}
            </span>

          </div>
        </button>

      </div>
      <div className="grid grid-cols-3 gap-4 mt-5 mb-10 justify-items-center">
        <div className="flex items-center">
          <h2 className="text-center text-white text-2xl font-semibold mr-3">Title:</h2>
          <span className="text-white text-xl">{song?.title}</span>
        </div>

        <div className="flex items-center">
          <h2 className="text-center text-white text-2xl font-semibold mr-3">Album:</h2>
          <span className="text-white text-xl">{song?.album_name}</span>
        </div>

        <div className="flex items-center">
          <h2 className="text-center text-white text-2xl font-semibold mr-3">Artist:</h2>
          <span className="text-white text-xl">{song?.artist.name}</span>
        </div>
      </div>

      {song && (
        <div className="grid grid-cols-3 gap-4">
          <div style={{ lineHeight: '1.8', fontFamily: 'monospace' }}>
            <h3 style={{ marginBottom: '8px', fontWeight: 'bold' }}>🎧 Audio Features</h3>
            <div>Acousticness: {song.features.acousticness}</div>
            <div>Danceability: {song.features.danceability}</div>
            <div>Energy: {song.features.energy}</div>
            <div>Instrumentalness: {song.features.instrumentalness}</div>
            <div>Liveness: {song.features.liveness}</div>
            <div>Speechiness: {song.features.speechiness}</div>
            <div>Valence: {song.features.valence}</div>
            <div>Tempo (BPM): {song.features.tempo}</div>
            <div>Key: {musicalKey}</div>
            <div>Mode: {mode}</div>
            <div>Loudness: {song.features.loudness} dB</div>
          </div>
        </div>
      )}
    </div>
  )
}