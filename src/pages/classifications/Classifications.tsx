
import { getPlaylist } from "@/api/songs";
import { Classification, getClassifications as getClassificationsApi, aiSyncClassifications as aiSyncClassificationsApi } from "@/api/classifications"
import TableBtn from "@/components/table/TableBtnComponent";
import Table from "@/components/table/TableComponent"
import { ListMusic } from "lucide-react";
import { usePlayer } from "@/context/PlayerContext";

export default function Classifications() {
  const { setSong, setPlaylist } = usePlayer();
  
 
  const fetchClassifications = async (_page: number, _search: string, _limit: number) => {
    const data = await getClassificationsApi()
    return { data: data, total: 10 };
  }

  const playRandomSongs = async (classification: Classification) => {
    // first get playlist then play the first song
    const data = await getPlaylist({ in_song_ids: classification.songs })
    setPlaylist(data)
    if (data.length > 0) {
      setSong(data[0])
    }
  }

  return (
    <div>
      <Table<Classification>
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "Name"},
          { key: "description", label: "Description"},

          { key: "custom", label: "Action", render: (_row: Classification) => (
            <button 
              onClick={() => playRandomSongs(_row)} 
              className="px-3 py-1 text-xsm rounded cursor-pointer mx-2 transition-all hover:bg-gray-600"
            >
              <ListMusic />
            </button>
            )}
        ]}
        fetchData={fetchClassifications}
        tableBtns={[
          <TableBtn
            label="Ai Generate Classifications"
            btnClass="bg-blue-600 hover:bg-blue-700 "
            onButtonClick={() => aiSyncClassificationsApi()}
          />
        ]}
      />
    </div>
  )
}