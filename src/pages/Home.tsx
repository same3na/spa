import { Artist } from "@/api/search";
import { getPlaylist, getSongs, getSongsArtist, Song } from "@/api/songs";
import FilterSongsComponent from "@/components/FilterSongsComponent";
import Table from "@/components/table/TableComponent";
import TableFilter from "@/components/table/TableFilterComponent";
import {SongFilter} from "@/components/FilterSongsComponent";
import { usePlayer } from "@/context/PlayerContext";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const { setSong, setPlaylist } = usePlayer();
  const [artists, setArtists] = useState<string[]>([])
  const [filters, setFilters] = useState<Array<React.ReactNode>>([])
  const [featureFilters, setFeatureFilters] = useState<SongFilter[]>([])

  const navigate = useNavigate();

  const constructFilters = async () => {
    const data = await getSongsArtist()

    setFilters([
      <TableFilter
        label="Artists"
        items={data}
        onFilterChange={(filter: Array<Artist>) => {
          setArtists(filter.map(f => (f.id)))
        }}
      />  
    ])
  };
  
  const fetchSongs = useCallback(async (page: number, search: string, limit: number) => {

    const data:any = await getSongs({page, limit, search, artistIds: artists, featureFilter: featureFilters})

    return { data: data.data, total: data.total };
  }, [artists, featureFilters]);

  const fetchPlaylist = useCallback(async(song_id: string, artist_ids: string[]) => {
    const data = await getPlaylist({ song_id, artist_ids, feature_filter: featureFilters })
    setPlaylist(data)
  }, [featureFilters])

  const onPlaySongClick = async(song:Song) => {
    setSong(song)
    fetchPlaylist(song.id, artists)
  }

  const onFilterChange = (filters:SongFilter[]) => {
    setFeatureFilters(filters)
  }

  useEffect(() => {
    constructFilters()
  }, []); // Empty dependency array ensures it runs only once on mount


  return (
    <div className="">
      <FilterSongsComponent 
        onFilterChange={onFilterChange}
      />
      <Table<Song>
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
              className={"inline-flex items-center rounded-md text-xs font-medium ring-1 ring-inset p-1 " + (row.analyze_success.Bool  === true ? "bg-green-50 text-green-700 ring-green-600/20" : row.analyze_success.Valid === null ? "bg-blue-50 text-blue-700 ring-blue-700/10" : "bg-red-50 text-red-700 ring-red-600/10")}>
                {row.analyze_success.Bool  === true ? "Success" : row.analyze_success.Valid  === false ? "Pending" : "Failed"}
            </span>
          )},
          { key: "custom", label: "Action", render: (row: Song) => (
            <button 
              disabled={row.analyze_success.Bool  === true ? false : true}
              className="rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
              type="button"
              onClick={() => {
                onPlaySongClick(row)
              }}
            >Play</button>
          )}
        ]}
        fetchData={fetchSongs}
        tableFilters={filters}
      />
    </div>
  );
}
