import { getPlaylistSongIds } from "@/api/playlists";
import { Artist, getPlaylist, getSongs, getSongsArtist, Song } from "@/api/songs";
import Table from "@/components/table/TableComponent";
import { usePlayer } from "@/context/PlayerContext";
import { Minus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select, { StylesConfig } from 'react-select'

export default function ClassificationCreate() {

  const navigate = useNavigate();

  const { setSong, setPlaylist } = usePlayer();

  const [classificationSlug, setClassificationSlug] = useState<string>("")
  const [error, setError] = useState<string>("");
  const [feature, setFeature] = useState<any|null>(null);
  const [operation, setOperation] = useState<any|null>(null);
  const [operationOptions, setOperationOptions] = useState<any[]>([])
  const [featureValueOpts, setFeatureValueOpts] = useState<any[]>([])
  const [featureValue, setFeatureValue] = useState<number|any[]|null>()
  const [classificationCriterias, setClassificationCriterias] = useState<any[]>([])

  const [isAllSongs, setIsAllSongs] = useState<boolean>(false)
  const [artistList, setArtists] = useState<Artist[]>([])
  const [playlistArtists, setPlatlistArtists] = useState<any[]>([])
  const [previewSongIds] = useState<string[]>([])
  const [playlistMaxNb, setPlaylistMaxNb] = useState<number>(50)

  const [playlistSongIds, setPlaylistSongIds] = useState<string[]>([])

  const features = [
    {
      value: "mood",
      label: "Mood"
    },
    {
      value: "genre",
      label: "Genre"
    },
    {
      value: "aggressive",
      label: "Aggressive"
    },
    {
      value: "engagement",
      label: "Engagement"
    },
    {
      value: "happy",
      label: "Happy"
    },
    {
      value: "relaxed",
      label: "Relaxed"
    },
    {
      value: "sad",
      label: "Sad"
    }
  ]

  // Define custom styles for Dark Mode
  const darkModeStyles: StylesConfig<{ value: string; label: string }, false> = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1f2937", // Gray-800
      borderColor: "#374151", // Gray-700
      color: "#fff",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#4b5563", // Gray-600
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937", // Gray-800
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#374151" // Gray-700
        : isFocused
        ? "#4b5563" // Gray-600 on hover
        : "transparent",
      color: "#fff",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
    }),
    input: (base) => ({
      ...base,
      color: "#fff", // Ensures search text is white
    }),
  };
  
  const setFeatureOperations = () => {
    let operations = []
    if (feature && (feature.value == "mood" || feature.value == "genre") ) {
      operations = [
        { value: 'in', label: 'In' },
        { value: 'notin', label: 'Not In' },
      ]
    } else {
      operations = [
        { value: '<', label: 'Less Then' },
        { value: '>', label: 'Greater Then' },
      ]
    }
    setOperationOptions(operations)
  }

  const setFeatureValues = () => {
    if (!feature) return;
    if (!["mood", "genre"].includes(feature.value)) return;

    let valueOptions = []
    if (feature.value == "mood") {
      valueOptions = ["action","adventure","advertising","background","ballad","calm","children","christmas","commercial","cool","corporate","dark","deep","documentary","drama","dramatic","dream","emotional","energetic","epic","fast","film","fun","funny","game","groovy","happy","heavy","holiday","hopeful","inspiring","love","meditative","melancholic","melodic","motivational","movie","nature","party","positive","powerful","relaxing","retro","romantic","sad","sexy","slow","soft","soundscape","space","sport","summer","trailer","travel","upbeat","uplifting"]
    } else {
      valueOptions = ["60s","70s","80s","90s","acidjazz","alternative","alternativerock","ambient","atmospheric","blues","bluesrock","bossanova","breakbeat","celtic","chanson","chillout","choir","classical","classicrock","club","contemporary","country","dance","darkambient","darkwave","deephouse","disco","downtempo","drumnbass","dub","dubstep","easylistening","edm","electronic","electronica","electropop","ethno","eurodance","experimental","folk","funk","fusion","groove","grunge","hard","hardrock","hiphop","house","idm","improvisation","indie","industrial","instrumentalpop","instrumentalrock","jazz","jazzfusion","latin","lounge","medieval","metal","minimal","newage","newwave","orchestral","pop","popfolk","poprock","postrock","progressive","psychedelic","punkrock","rap","reggae","rnb","rock","rocknroll","singersongwriter","soul","soundtrack","swing","symphonic","synthpop","techno","trance","triphop","world","worldfusion"]
    }

    setFeatureValueOpts(valueOptions)
  }

  const onAddCriteria = () => {
    if (!feature || !operation || !featureValue) {
      return
    }

    setClassificationCriterias((prevState) => {
      const newState = [...prevState]
      newState.push({
        feature: feature.value,
        operation: operation.value,
        value: Array.isArray(featureValue) ? featureValue.map((ele) => (ele.value)).join(',') : featureValue
      })

      setOperation(null)
      setFeatureValue(null)
      setFeature(null)  
      
      return newState
    })

  }

  const onPreview = async () => {
    if (classificationCriterias.length == 0) {
      return
    }
    try {
      const data = await getPlaylistSongIds({has_all_songs: isAllSongs, song_ids: previewSongIds, playlist_max_nb: playlistMaxNb, criterias: classificationCriterias})
      setPlaylistSongIds(data)  
    } catch(error:any) {
      setError(error.response.data.message)
    }
  }

  const getArtists = async() => {
    const data = await getSongsArtist()
    setArtists(data)
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

  const removeCriteriaFromClassification = (e:any, criteria:any) => {
    e.stopPropagation()

    setClassificationCriterias((prevState) => {
      const newState = prevState.filter((ele:any) => ele.feature != criteria.feature)
      return newState
    })
  }

  useEffect(() => {
    setOperation(null)
    setFeatureValue(null)
    setFeatureOperations()
    setFeatureValues()
  }, [feature])

  useEffect(() => {
    getArtists()
  }, [])

  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="">
        <h2 className="text-white text-2xl font-semibold pb-4">Create Classification</h2>

        {error && (
          <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-2">
            Slug
          </label>
          <input
            type="text"
            id="name"
            value={classificationSlug}
            onChange={(e) => setClassificationSlug(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Slug"
          />
        </div>

        <div className="mb-4">
          <h2 className="text-white text-xl font-semibold pb-4">Criterias</h2>
          {classificationCriterias.map((criteria:any) => (
            <div key={criteria.feature}>
              <div className="font-semibold text-gray-300 hover:bg-gray-700 p-2 rounded-md max-w-full">
                <input type="checkbox" id="toggle1" className="peer hidden" />
                <label htmlFor="toggle1" className="cursor-pointer block">
                  <div className="flex items-center">

                    {criteria.feature}

                    <button
                      onClick={(e) => removeCriteriaFromClassification(e, criteria)} 
                      className="px-3 py-1 text-xsm rounded cursor-pointer mx-2 transition-all hover:bg-gray-800"
                    >
                      <Minus />
                    </button>

                  </div>

                </label>
                <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out peer-checked:max-h-50 peer-checked:overflow-scroll">
                  <div className="mt-2 p-4 rounded-md bg-black">
                    <pre>
                      {JSON.stringify(criteria, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* <div>
            <pre>
              {JSON.stringify(classificationCriterias, null, 2)}
            </pre>
          </div> */}
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
                fetchData={fetchSongs}
                // tableFilters={filters}
              />
            </div>
          )}

      </div>

      <div>
        <h2 className="text-white text-xl font-semibold pb-4">Add Criteria</h2>

        <div className="mb-4">
          <label htmlFor="feature-select" className="block font-medium mb-2">
            Feature:
          </label>
          <Select
            value={feature}
            onChange={(ele) => setFeature(ele)}
            options={features} 
            styles={darkModeStyles}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="feature-select" className="block font-medium mb-2">
            Operation:
          </label>
          <Select 
            value={operation}
            onChange={(ele) => {setOperation(ele)}}
            options={operationOptions} 
            styles={darkModeStyles}
          />
        </div>


        <div className="mb-4">
          <label htmlFor="feature-value" className="block font-medium mb-2">
            Value:
          </label>

          {feature && ["mood", "genre"].includes(feature.value) ? (
            <Select
              // @ts-ignore
              isMulti
              value={featureValue}
              onChange={(ele) => setFeatureValue(ele)}
              options={featureValueOpts.map((item) => ({value: item, label: item}))} 
              styles={darkModeStyles}
            />
          ): (
            <div>
              <input
                type="text"
                id="feature-value"
                value={featureValue ? featureValue : 0}
                onChange={(e) => setFeatureValue(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Feature Value"
              />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={onAddCriteria}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Add Criteria
          </button>

          <div className="bg-gray-700 p-4 mt-8">
            <h2 className="text-white text-xl font-semibold pb-4">Preview</h2>

            <div className="mb-4">
              <label htmlFor="max_song_nb" className="block font-medium mb-2">
                Max Song Number
              </label>
              <input
                type="number"
                id="max_song_nb"
                value={playlistMaxNb}
                onChange={(e) => setPlaylistMaxNb(parseInt(e.target.value))}
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
                <label htmlFor="art" className="block font-medium mb-2">
                  Artists
                </label>

                <Select
                  // @ts-ignore
                  isMulti
                  value={playlistArtists}
                  onChange={(ele) => setPlatlistArtists(ele)}
                  options={artistList.map((item) => ({value: item.id, label: item.name}))} 
                  styles={darkModeStyles}
                />

              </div>
            )}

            <button
              onClick={onPreview}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}