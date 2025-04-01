import { Cluster, Song  as ClusterSong, getSingleCluster, setSongFavorite} from "@/api/clusters";
import { getPlaylist, getSongs, Song } from "@/api/songs";
import Table from "@/components/table/TableComponent";
import TableBtn from "@/components/table/TableBtnComponent";

import { useCallback, useEffect, useState } from "react";
import { usePlayer } from "@/context/PlayerContext";
import { Star } from "lucide-react";
import { useParams } from "react-router-dom";


export default function ClusterSingle(){
  const { id } = useParams(); // Extract the dynamic route parameter

  if (!id) {
    return
  }

  const [songsIdsPerCluster, setSongsIdsPerCluster] = useState<Array<Array<string>>>([])
  const [clusterFav, setClusterFav] = useState<{[key: number]: boolean}>({})
  const [songFav, setSongFav] = useState<{[key: string]: boolean}>({})
  const {setSong, setPlaylist} = usePlayer();

  const fetchSongs = useCallback(async (page: number, search: string, limit: number, additional: {cluster: number}): Promise<{ data: Song[]; total: number }> => {
    const songIds = songsIdsPerCluster[additional.cluster]

    const data = await getSongs({page, limit, search, ids: songIds})
    return {data: data.data, total: data.total}

  }, [songsIdsPerCluster]);

  const getCluster = async(id:string) => {

    const data:Cluster = await getSingleCluster(id)

    for (let i = 0; i < data.cluster_nb; i++) {
      setSongsIdsPerCluster(prevState => {
        const updatedClusters:any = [...prevState];
        updatedClusters[i] = data.songs.filter((s) => s.cluster == i).map(s => s.id);
        return updatedClusters
      });
    }


    data.songs.forEach((song:ClusterSong) => {
      setSongFav((prevState) => {
        const updatedState = {...prevState}
        updatedState[song.id] = song.favorite
        return updatedState
      })
    })
  }

  const fetchPlaylist = async(song_id: string, in_song_ids: string[]) => {
    const data = await getPlaylist({ song_id, in_song_ids })
    setPlaylist(data)
  }

  const onPlaySongClick = async(song:Song, cluster: number) => {
    setSong(song)
    fetchPlaylist(song.id, songsIdsPerCluster[cluster])
  }

  const updateSongFavorite = async(songs:{id: string, is_favorite: boolean}[]) => {
    await setSongFavorite({cluster_id:id, songs})
  }

  const FavoriteStar = ({ isFavorite, onToggle }: { isFavorite: boolean; onToggle: () => void }) => {
    return (
      <button onClick={onToggle} className="p-2">
        <Star
          className={`w-6 h-6 transition-colors duration-300 ${
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
          }`}
        />
      </button>
    );
  };

  const ToggleSongFavorite = (song: Song) => {
    if (songFav[song.id] === true) {
      setSongFav((prevState) => {
        const updatedState = {...prevState}
        delete updatedState[song.id]
        return updatedState
      }) 
      
      updateSongFavorite([{
        id: song.id,
        is_favorite: false
      }])

    } else {
      setSongFav((prevState) => {
        const updatedState = {...prevState}
        updatedState[song.id] = true
        return updatedState
      })  

      updateSongFavorite([{
        id: song.id,
        is_favorite: true
      }])

    }
  }

  const ToggleClusterFavorite = (cluster: number) => {

    if (clusterFav[cluster] === true) {
      setClusterFav((prevState) => {
        const updatedState = {...prevState}
        updatedState[cluster] = false
        return updatedState
      })

      const songsPayload = songsIdsPerCluster[cluster].map((song_id:string) => (
        {
          id: song_id,
          is_favorite: false
        }
      ))
      updateSongFavorite(songsPayload)
    } else {
      setClusterFav((prevState) => {
        const updatedState = {...prevState}
        updatedState[cluster] = true
        return updatedState
      })

      const songsPayload = songsIdsPerCluster[cluster].map((song_id:string) => (
        {
          id: song_id,
          is_favorite: true
        }
      ))
      updateSongFavorite(songsPayload)
    }
  }

  useEffect(() => {
    if (!id) return;

    // get cluster by id
    getCluster(id)

  }, [id])


  useEffect(() => {
    Object.keys(clusterFav).forEach((cluster:string) => {
      const songIds = songsIdsPerCluster[Number(cluster)]

      if (clusterFav[Number(cluster)] === true) {
        songIds.forEach((songId:string) => {
          setSongFav((prevState) => {
            const updatedState = {...prevState}
            updatedState[songId] = true
            return updatedState
          })  
        })  
      } else if (clusterFav[Number(cluster)] === false) {
        songIds.forEach((songId:string) => {
          setSongFav((prevState) => {
            const updatedState = {...prevState}
            delete updatedState[songId]
            return updatedState
          })  
        })  
      }

    })
  }, [clusterFav])


  return (
    <div className="grid grid-cols-2 p-4 pt-10">

      {songsIdsPerCluster.map((_songs:string[], outerIndex:number) => (
        <div className="p-4" key={outerIndex}>
          <Table<Song>
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Title" },
              { key: "custom", label: "Fav", render: (row: Song) => (
                <div className="flex items-center space-x-2">
                  <FavoriteStar isFavorite={songFav[row.id] === true} onToggle={() => ToggleSongFavorite(row)} />
                </div>
              )},
              { key: "custom", label: "Action", render: (row: Song) => (
                <button 
                  className="rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
                  type="button"
                  onClick={() => {
                    onPlaySongClick(row, outerIndex)
                  }}
                >Play</button>
              )}    
            ]}
            fetchData={fetchSongs}
            additionalData={{'cluster': outerIndex}}
            tableBtns={[
              <TableBtn
                label={
                  <>
                    <span className="px-4">Toggle Favorites</span>

                    <Star
                    className={`w-6 h-6 transition-colors duration-300 ${
                      clusterFav[outerIndex] === true ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    }`}
                    />
                  </>
                }
                btnClass="hover:bg-gray-800 focus:ring-blue-800"
                onButtonClick={() => ToggleClusterFavorite(outerIndex)}
              />
            ]}
          />
        </div>
      ))}
    </div>
  )

}
