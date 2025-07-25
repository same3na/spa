import { getSearch, Search, addSongs as addSongsApi } from "@/api/search";
import { removeArtistSearchFromGroup } from "@/api/groups";
import { useNavigate } from "react-router-dom";
import Table from "@/components/table/TableComponent";
import { Check, Loader, X } from "lucide-react";
import TableBtn from "@/components/table/TableBtnComponent";

export default function SearchPage() {

  const navigate = useNavigate();

  const fetchSearchRecords = async (): Promise<{ data: Search[]; total: number }> => {
    const data = await getSearch()

    return { data: data, total: data.length }
  };

  const addSongs = async(artist_id: string) => {
    await addSongsApi({artist_id})
    navigate('/')
  }

  const removeSearch = async (search_id: string) => {
    await removeArtistSearchFromGroup({ search_id: search_id })
  }

  return (
    <div>
      <Table<Search>
        columns={[
          { key: "artist_name", label: "Artist Name" },
          { key: "total_songs", label: "Total Songs" },
          { key: "custom", label: "Search Status", render: (row: Search) => (
            <div className="inline-flex items-center rounded-md text-xs font-medium  p-1">
              { row.search_succeeded.valid != true ? (
                <div className="flex items-center justify-center">
                  <Loader className="animate-spin w-6 h-6 text-blue-500" />
                </div>              
              ) : (
                <div>
                    <span 
                      className={(row.search_succeeded.bool == true  ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/10")}>
                        {row.search_succeeded.bool == true  ? <Check /> : <X />}
                    </span>
                </div>
              )}
            </div>

          )},
          { key: "custom", label: "Add Songs", render: (row: Search) => (
            <div>
              {row.download_succeeded.valid != true ? (
                <div>
                  <button 
                    disabled={row.search_succeeded.valid != true} 
                    className={`text-white font-semibold py-1 px-2 rounded-sm shadow transition-all text-sm ${row.search_succeeded.valid != true ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'}`} 
                    onClick={() => addSongs(row.artist_reference)}>Add Songs</button>
                </div>
              ) : (
                <div>
                    <span 
                      className={(row.search_succeeded.bool == true  ? "bg-green-50 text-green-700 ring-green-600/20" : "bg-red-50 text-red-700 ring-red-600/10")}>
                        {row.search_succeeded.bool == true  ? <Check /> : <button className="cursor-pointer" onClick={() => addSongs(row.artist_reference)}> <X /> Retry </button>  }
                    </span>
                </div>
              )}
            </div>
          )},
          { key: "custom", label: "Actions", render: (row: Search) => (
            <div className="flex items-center space-x-2">
              <button 
                className="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold py-1 px-2 rounded-sm shadow transition-all text-sm" 
                onClick={() => removeSearch(row.id)}>Remove</button>
            </div>
          )},
        ]}
        tableBtns={[
          <TableBtn 
            label={"Add New Artist"} 
            btnClass={"bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow"} 
            onButtonClick={() => navigate('/search/artists')} />
        ]}
        fetchData={fetchSearchRecords}
      />
    </div>
  );
}
