
import { useParams } from "react-router-dom";
import { getSingleSong, SongSingle as SongSingleModel } from "@/api/songs";
import { useEffect, useCallback, useState } from "react";

import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function SongSingle() {
  const { id } = useParams(); // Extract the dynamic route parameter

  if (!id) {
    return
  }

  const [song, setSong] = useState<SongSingleModel | null>(null)


  const COLORS = [
    '#FF6347', // Tomato
    '#FFD700', // Gold
    '#32CD32', // Lime Green
    '#1E90FF', // Dodger Blue
    '#FF1493', // Deep Pink
    '#DA70D6', // Orchid
    '#FF4500', // Orange Red
    '#00FF7F', // Spring Green
  ];
  const getSong = useCallback(async(id:string) => {
    const data: SongSingleModel = await getSingleSong(id)
    setSong(data)
  }, [id])

  useEffect(() => {
    // get cluster by id
    getSong(id)

  }, [id])
  
  return (
    <div>
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
          <div>
            <h2 className="text-center text-white text-2xl font-semibold">Top 5 Music Genres</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={song.features.genres}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"  // Centering the pie chart
                  cy="50%"  // Centering the pie chart
                  outerRadius={150}  // Pie radius
                  label={(entry) => entry.name} //
                >
                  {song.features.genres.map((entry:any, index:any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="text-center">
            <h2 className="text-center text-white text-2xl font-semibold pb-10">Aggressive</h2>
            
            <div className="max-w-xs max-h-xs mx-auto">
              <CircularProgressbar 
                value={song.features.aggressive} // Convert to percentage
                text={`${(song.features.aggressive).toFixed(0)}%`} // Display percentage in the middle
                strokeWidth={10} // Width of the progress circle
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-center text-white text-2xl font-semibold pb-10">Engagement</h2>
            
            <div className="max-w-xs max-h-xs mx-auto">
              <CircularProgressbar 
                value={song.features.engagement} // Convert to percentage
                text={`${(song.features.engagement).toFixed(0)}%`} // Display percentage in the middle
                strokeWidth={10} // Width of the progress circle
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-center text-white text-2xl font-semibold pb-10">Happy</h2>
            
            <div className="max-w-xs max-h-xs mx-auto">
              <CircularProgressbar 
                value={song.features.happy} // Convert to percentage
                text={`${(song.features.happy).toFixed(0)}%`} // Display percentage in the middle
                strokeWidth={10} // Width of the progress circle
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-center text-white text-2xl font-semibold pb-10">Relaxed</h2>
            
            <div className="max-w-xs max-h-xs mx-auto">
              <CircularProgressbar 
                value={song.features.relaxed} // Convert to percentage
                text={`${(song.features.relaxed).toFixed(0)}%`} // Display percentage in the middle
                strokeWidth={10} // Width of the progress circle
              />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-center text-white text-2xl font-semibold pb-10">Sad</h2>
            
            <div className="max-w-xs max-h-xs mx-auto">
              <CircularProgressbar 
                value={song.features.sad} // Convert to percentage
                text={`${(song.features.sad).toFixed(0)}%`} // Display percentage in the middle
                strokeWidth={10} // Width of the progress circle
              />
            </div>
          </div>

          <div>
            <h2 className="text-center text-white text-2xl font-semibold">Top 5 Music Moods</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={song.features.moods}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"  // Centering the pie chart
                  cy="50%"  // Centering the pie chart
                  outerRadius={150}  // Pie radius
                  label={(entry) => entry.name} //
                >
                  {song.features.moods.map((entry:any, index:any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}