import { getPlaylist, Song } from "@/api/songs";
import { SongsFilter } from "@/components/FilterSongsComponent";
import { usePlayer } from "@/context/PlayerContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableBtn from "@/components/table/TableBtnComponent";
import SongTableComponent from "@/components/table/SongTableComponent";


export default function Home() {
  const { setSong, setPlaylist } = usePlayer();
  const [songsFilter, setSongsFilter] = useState<SongsFilter | null>(null)

  const navigate = useNavigate();
  

  const fetchPlaylist = async(song_id?: string) => {
    const data = await getPlaylist({ song_id, artist_ids: songsFilter?.artists, feature_filter: songsFilter?.criterias })
    setPlaylist(data)
  }

  const onPlaySongClick = async(song:Song) => {
    setSong(song)
    fetchPlaylist(song.id)
  }

  const playRandomSongs = async () => {
    // first get playlist then play the first song
    const data = await getPlaylist({ song_id: undefined, artist_ids: songsFilter?.artists, feature_filter: songsFilter?.criterias })
    setPlaylist(data)
    if (data.length > 0) {
      setSong(data[0])
    }
  }

  return (
    <div className="">
      <SongTableComponent
        columns={[
          { key: "id", label: "ID" },
          { key: "custom", label: "Title", render: (row: Song) => (
            <div className="cursor-pointer" onClick={() => {navigate(`/songs/${row.id}`)}}>{row.title}</div>
          )},
          { key: "custom", label: "Artist Name", render: (row: Song) => (
            <span>{row.artist.name}</span>
          )},
          { key: "album_name", label: "Album Name" },
          { key: "custom", label: "Satus" , render: (row: Song) => (
            <span 
              className={"inline-flex items-center rounded-md text-xs font-medium ring-1 ring-inset p-1 " + (row.analyze_success.bool  === true ? "bg-green-50 text-green-700 ring-green-600/20" : row.analyze_success.valid === null ? "bg-blue-50 text-blue-700 ring-blue-700/10" : "bg-red-50 text-red-700 ring-red-600/10")}>
                {row.analyze_success.bool  === true ? "Success" : row.analyze_success.valid  === false ? "Pending" : "Failed"}
            </span>
          )},
          { key: "custom", label: "Action", render: (row: Song) => (
            <button 
              disabled={row.analyze_success.bool  === true ? false : true}
              className="rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
              type="button"
              onClick={() => {
                onPlaySongClick(row)
              }}
            >Play</button>
          )}
        ]}
        tableBtns={[
          <TableBtn 
            label={"Play Random"} 
            btnClass={"bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow"} 
            onButtonClick={() => playRandomSongs()} />,

        ]}
        onFilterChange={setSongsFilter}
      />
    </div>
  );
}
