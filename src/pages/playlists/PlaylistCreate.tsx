import { Classification, getPlaylistSongIds, getClassifications as getClassificationsApi } from "@/api/playlists";
import { Artist, getPlaylist, getSongs, getSongsArtist, Song } from "@/api/songs";
import MultipleSelect from "@/components/form/MultipleSelectComponent";
import Table from "@/components/table/TableComponent";
import { usePlayer } from "@/context/PlayerContext";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PlaylistCreate() {
  const navigate = useNavigate();

  const { setSong, setPlaylist } = usePlayer();

  const [classifications, setClassifications] = useState<Classification[]>([])
  const [error, setError] = useState<string>("");
  const [playlistName, setPlaylistName] = useState<string>("");
  const [playlistMaxSongNb, setPlaylistMaxSongNb] = useState<number>(50)
  const [playlistClassifications, setPlaylistClassifications] = useState<any[]>([])
  const [isAllSongs, setIsAllSongs] = useState<boolean>(false)
  const [artistList, setArtists] = useState<Artist[]>([])
  const [_artistIds, setArtistIds] = useState<string[]>([])
  const [playlistSongIds, setPlaylistSongsIds] = useState<string[]>([])

  const getClassifications = async () => {
    const data = await getClassificationsApi()
    console.log("criterias: ", data)
    setClassifications(data)
  }

  const addClassificationToPlaylist = (e:any, classification:Classification) => {
    e.stopPropagation()

    // check first if the criteria exists
    const alreadyExists = playlistClassifications.find((c:any) => (c.id === classification.id))

    if (alreadyExists) return

    setPlaylistClassifications((prevState) => {
      const newState = [...prevState]
      newState.push({weight: 0, ...classification})
      return newState
    })
  }

  const changeClassificationWeight = (index:number, weight:number) => {
    setPlaylistClassifications((prevState) => {
      const newState = [...prevState]
      newState[index].weight = weight
      return newState
    })
  }

  const getArtists = async() => {
    const data = await getSongsArtist()
    setArtists(data)
  }
  
  const handleViewPlaylist = async() => {
    const requestFilters = playlistClassifications.map((playlistClas) => {
      return {
        weight: playlistClas.weight,
        filters: playlistClas.criterias
      }
    })

    try {
      const data = await getPlaylistSongIds({has_all_songs: isAllSongs, song_ids:[], criterias: requestFilters, playlist_max_nb: playlistMaxSongNb})

      setPlaylistSongsIds(data)

    } catch (error:any) {
      console.log(error.message)
      setError(error.message)
    }
  }

  const fetchSongs = useCallback(async (page: number, search: string, limit: number) => {

    const data:any = await getSongs({page, limit, search, ids: playlistSongIds})

    return { data: data.data, total: data.total };
  }, [playlistSongIds]);
  
  const onPlaySongClick = async(song:Song) => {
    setSong(song)
    fetchPlaylist(song.id)
  }

  const fetchPlaylist = async(song_id: string) => {
    const data = await getPlaylist({ song_id, in_song_ids: playlistSongIds })
    setPlaylist(data)
  }
  

  useEffect(() => {
    getClassifications()
    getArtists()
  }, [])

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        <h2 className="text-white text-2xl font-semibold pb-4">Create Playlist</h2>

        {error && (
          <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="max_song_nb" className="block font-medium mb-2">
            Max Song Number
          </label>
          <input
            type="number"
            id="max_song_nb"
            value={playlistMaxSongNb}
            onChange={(e) => setPlaylistMaxSongNb(parseInt(e.target.value))}
            className="px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder=""
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isAllSongs}
              onChange={() => setIsAllSongs(!isAllSongs)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-white">All Songs</span>
          </label>          
        </div>

        {!isAllSongs && (
          <div className="mb-4">
            <MultipleSelect
              label="Artists"
              items={artistList}
              onFilterChange={(filter: Array<Artist>) => {setArtistIds(filter.map(f => (f.id)))}}
            />
          </div>
        )}


        <div className="mt-6">
          <h4 className="text-white text-xl font-semibold pb-4">Playlist Classifications</h4>
          <table className="min-w-full border border-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-gray-300">Slug</th>
                <th className="px-4 py-2 text-left text-gray-300">Weight</th>
              </tr>
            </thead>
            <tbody>
              {playlistClassifications.map((classification:any, index) => (
                <tr key={classification.id} className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer">
                  <td className="px-4 py-2 text-gray-300">{classification.slug}</td>
                  <td className="px-4 py-2 text-gray-300">
                    <input
                      type="number"
                      id="weight"
                      value={classification.weight}
                      onChange={(e) => {changeClassificationWeight(index, parseFloat(e.target.value))}}
                      className="px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Weight"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-2 mt-10">
          <div>
            <button
              onClick={handleViewPlaylist}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            >
              View Playlist
            </button>
          </div>
        </div>

        {playlistSongIds.length > 0 && (
          <div className="">
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
              // tableFilters={filters}
            />
          </div>
        )}

      </div>
      <div className="relative">
        <div className="flex items-center pb-4">
          <h2 className="text-white text-2xl font-semibold ">Classifications</h2>
          <button
            onClick={() => navigate("/classifications")}
            className="rounded-full cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition duration-200 px-3 py-1 mx-2"
            >Manage</button>
        </div>

        <div className="top-0 left-0 w-full sticky bg-gray-800 h-screen w-full">
          {classifications.map((classification:Classification) => (
            <div key={classification.id}>
              <div className="font-semibold text-gray-300 hover:bg-gray-700 p-2 rounded-md max-w-full">
                <input type="checkbox" id="toggle1" className="peer hidden" />
                <label htmlFor="toggle1" className="cursor-pointer block">
                  <div className="flex items-center">

                    {classification.slug}

                    <button 
                      onClick={(e) => addClassificationToPlaylist(e, classification)} 
                      className="px-3 py-1 text-xsm rounded cursor-pointer mx-2 transition-all hover:bg-gray-800"
                    >
                      <Plus />
                    </button>

                  </div>

                </label>
                <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out peer-checked:max-h-50 peer-checked:overflow-scroll">
                  <div className="mt-2 p-4 rounded-md bg-black">
                    <pre>
                      {JSON.stringify(classification.criterias, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}