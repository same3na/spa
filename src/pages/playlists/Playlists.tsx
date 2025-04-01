import { getPlaylists, Playlist } from "@/api/playlists";
import { Artist } from "@/api/songs";
import TableBtn from "@/components/table/TableBtnComponent";
import Table from "@/components/table/TableComponent";
import { ListMusic } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Playlists() {
  const navigate = useNavigate();

  const fetchPlaylists = async(_page: number, _search: string, _limit: number) => {
    const data = await getPlaylists()

    return { data: data, total: 10 };
  }

  return (
    <div>
      <Table<Playlist>
        columns={[
          { key: "id", label: "ID" },
          { key: "custom", label: "Name", render: (row: Playlist) => (
            <div className="cursor-pointer" onClick={() => {navigate(`/playlists/${row.id}`)}}>{row.slug}</div>
          )},
          { key: "custom", label: "Artists", render: (row: Playlist) => (
            <span>{row.artists && row.artists.map((artist: Artist) => ( artist.name + ", " ))}</span>
          )},
          { key: "has_all_songs", label: "Has All Songs" },
          { key: "custom", label: "Action", render: (_row: Playlist) => (
            <button 
              // onClick={(e) => navigate(`/classifications/${playlist.id}/playlist/create`)} 
              className="px-3 py-1 text-xsm rounded cursor-pointer mx-2 transition-all hover:bg-gray-600"
            >
              <ListMusic />
            </button>
            )}
        ]}
        fetchData={fetchPlaylists}
        tableBtns={[
          <TableBtn
            label="Create Playlist"
            btnClass="bg-blue-600 hover:bg-blue-700 "
            onButtonClick={() => navigate("/playlist/create")}
          />
        ]}
      />
    </div>
  )
}