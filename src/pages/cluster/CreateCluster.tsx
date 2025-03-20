import { createCluster } from "@/api/clusters";
import { Artist, getSongIdsByArtists, getSongsArtist } from "@/api/songs";
import MultipleSelect from "@/components/form/MultipleSelectComponent";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function CreateCluster() {
  const navigate = useNavigate();

  const [description, setDescription] = useState<string>(""); // State to hold input value
  const [cluster_nb, setClusterNb] = useState<number>(2)
  const [error, setError] = useState<string>("");
  const [songIds, setSongIds] = useState<string[]>([])
  const [artistIds, setArtistIds] = useState<string[]>([])
  const [artistList, setArtists] = useState<Artist[]>([])

  const handleSubmit = async () => {
    try {
      await createCluster({song_ids: songIds, description: description, cluster_nb: cluster_nb})

      // Go to clusters page
      navigate(`/clusters`)

    } catch (error:any) {
      console.log(error.message)
      setError(error.message)
    }
  }

  const getArtists = async() => {
    const data = await getSongsArtist()
    setArtists(data)
  }

  const getSongIds = useCallback(async() => {
    const data = await getSongIdsByArtists({artist_ids: artistIds})
    setSongIds(data)
  }, [artistIds])

  useEffect(() => {
    getArtists()
  }, []); // Empty dependency array ensures it runs only once on mount
  
  useEffect(() => {
    getSongIds()
  }, [artistIds]); // Empty dependency array ensures it runs only once on mount
  


  return (
    <div className="mt-10 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Cluster</h2>

      <div className="grid grid-cols-2">
        <div className="">
          {error && (
            <p className="mb-4 text-red-600 text-center font-medium">{error}</p>
          )}
          <div className="mb-4">
            {/* <label htmlFor="description" className="block font-medium mb-2">
              Description
            </label> */}
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-transparent px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter description"
            />
          </div>
          <div className="mb-4">
            <input
              type="number"
              id="cluster_nb"
              value={cluster_nb}
              onChange={(e) => setClusterNb(parseInt(e.target.value))}
              className="bg-transparent px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <MultipleSelect
              label="Artists"
              items={artistList}
              onFilterChange={(filter: Array<Artist>) => {setArtistIds(filter.map(f => (f.id)))}}
            />
          </div>


          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create Cluster
          </button>
        </div>
      </div>
    </div>
  );
}