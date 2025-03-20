
import { Classification, getClassifications as getClassificationsApi } from "@/api/playlists"
import TableBtn from "@/components/table/TableBtnComponent";
import Table from "@/components/table/TableComponent"
import { ListMusic } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Classifications() {
  const navigate = useNavigate();
 
  const fetchClassifications = async (page: number, search: string, limit: number) => {
    const data = await getClassificationsApi()
    return { data: data, total: 10 };
  }

  return (
    <div>
      <Table<Classification>
        columns={[
          { key: "id", label: "ID" },
          { key: "custom", label: "Name", render: (row: Classification) => (
            <div className="cursor-pointer" onClick={() => {navigate(`/song-criterias/${row.id}`)}}>{row.slug}</div>
          )},
          { key: "custom", label: "Action", render: (row: Classification) => (
            <button 
              // onClick={(e) => navigate(`/classifications/${playlist.id}/playlist/create`)} 
              className="px-3 py-1 text-xsm rounded cursor-pointer mx-2 transition-all hover:bg-gray-600"
            >
              <ListMusic />
            </button>
            )}
        ]}
        fetchData={fetchClassifications}
        tableBtns={[
          <TableBtn
            label="Create Classification"
            btnClass="bg-blue-600 hover:bg-blue-700 "
            onButtonClick={() => navigate("/classification/create")}
          />
        ]}
      />
    </div>
  )
}