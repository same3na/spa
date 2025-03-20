import { Cluster, Song as ClusterSong, getSingleCluster, Specification, createSpecification as createSpecificationApi, updateSpecification as updateSpecificationApi } from '@/api/clusters';
import { getSongs, Song } from '@/api/songs';
import Table from '@/components/table/TableComponent';
import { usePlayer } from '@/context/PlayerContext';
import { ArrowRight, Play, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';


interface ClusterFormProps {
  clusterId: string; 
  specification?: Specification; // If present, it's editing; otherwise, it's creating.
}

export default function SpecificationForm({ clusterId, specification }: ClusterFormProps) {

  const [type, setType] = useState<string>(specification ? specification.type : "");
  const [clasSongIds, setClasSongIds] = useState<string[]>(specification ? specification.song_ids : []);
  const [clusterSongIds, setClusterSongIds] = useState<string[]>([])

  const {song: playingSong , setSong, setPlaylist, isPlaying} = usePlayer();

  const navigate = useNavigate();

  const getClusterSongIds = async () => {
    const cluster:Cluster = await getSingleCluster(clusterId)
    const songIds = cluster.songs.map((s:ClusterSong) => s.id)

    setClusterSongIds(songIds)

  }

  const getSongsByIds = async(Ids:string[], page: number, search: string, limit: number) => {
    if (Ids.length == 0) {
      return { data: [], total: 0}      
    }

    const data = await getSongs({page, limit, search, ids: Ids})
    return {data: data.data, total: data.total}
  }

  const fetchCluterSongs = useCallback(async (page: number, search: string, limit: number): Promise<{ data: Song[]; total: number }> => {
    return await getSongsByIds(clusterSongIds, page, search, limit)
  }, [clusterSongIds]);

  const fetchClassificationSongs = useCallback(async (page: number, search: string, limit: number): Promise<{ data: Song[]; total: number }> => {
    return await getSongsByIds(clasSongIds, page, search, limit)
  }, [clasSongIds]);

  const addSongToSpec = (song:Song) => {
    setClasSongIds((prevState) => {
      const updatedState = [...prevState]
      updatedState.push(song.id)

      return updatedState
    })
  }

  const removeSongFromSpec = (song:Song) => {
    setClasSongIds(prevState => prevState.filter(id => id !== song.id));
  }

  const isSongPlaying = (song:Song):boolean => {
    if (!playingSong) return false
    return playingSong.id === song.id && isPlaying
  }

  const createSpecification = async () => {
    await createSpecificationApi({type, song_ids: clasSongIds, cluster_id: clusterId})
    navigate(`/clusters/${clusterId}/specifications`)
  }

  const updateSpecification = async () => {
    if (!specification) return
    await updateSpecificationApi({specification_id: specification.id, type, song_ids: clasSongIds})
    navigate(`/clusters/${clusterId}/specifications`)
  }

  const handleSubmit = async () => {
    if (specification) {
      updateSpecification()
    } else {
      createSpecification()
    }
  }

  const onPlaySong = async (song:Song) => {
    // play only the current song and the playlist should be empty
    // No playlist
    setSong(song)
    setPlaylist([])
  }

  useEffect(() => {
    getClusterSongIds()
  }, [clusterId])


  return (
    <div className="pt-10 p-4">
      <div className="flex justify-between">
        <div className="mb-4">
          {/* <label htmlFor="description" className="block font-medium mb-2">
            Description
          </label> */}
          <input
            type="text"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-transparent px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter Type"
          />
        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 rounded-lg hover:bg-blue-600 transition text-white py-2 px-4 rounded-lg transition duration-200"
          >
            {specification ? "Edit" : "Create"} Specification
          </button>

          </div>
        </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className=''>
          <Table<Song> 
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Title" },
              { key: "custom", label: "Action", render: (row: Song) => (
                <div className='flex space-x-4'>
                  <button
                    disabled={isSongPlaying(row)}
                    className="rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
                    type="button"
                    onClick={() => {
                      onPlaySong(row)
                    }}
                  ><Play className="w-6 h-6" /></button>

                  <button 
                    className="rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
                    disabled={clasSongIds.includes(row.id)}
                    type="button"
                    onClick={() => {
                      addSongToSpec(row)
                    }}
                  ><ArrowRight className="w-6 h-6" /></button>

                </div>
              )}    
            ]} 
            fetchData={fetchCluterSongs}
          />
        </div>

        <div className=''>
          <Table<Song> 
            columns={[
              { key: "id", label: "ID" },
              { key: "title", label: "Title" },
              { key: "custom", label: "Action", render: (row: Song) => (
                <div className='flex space-x-4'>
                  <button
                    disabled={isSongPlaying(row)}
                    className="rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
                    type="button"
                    onClick={() => {
                      onPlaySong(row)
                    }}
                  ><Play className="w-6 h-6" /></button>

                  <button 
                    className="rounded bg-slate-800 py-1 px-2.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" 
                    // disabled={clasSongIds.includes(row.id)}
                    type="button"
                    onClick={() => {
                      removeSongFromSpec(row)
                    }}
                  ><X className="w-6 h-6" /></button>

                </div>
              )}    
            ]} 
            fetchData={fetchClassificationSongs}
          />
        </div>
      </div>
    </div>
  )
}