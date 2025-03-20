import { getSearch, Search } from "@/api/search";
import { useNavigate } from "react-router-dom";
import Table from "@/components/table/TableComponent";

export default function SearchPage() {

  const navigate = useNavigate();

  const fetchSearchRecords = async (): Promise<{ data: Search[]; total: number }> => {
    const data = await getSearch()

    return { data: data, total: data.length }
  };

  return (
    <div>
      <Table<Search>
        columns={[
          { key: "artist_id", label: "Artist ID" },
          { key: "artist_name", label: "Artist Name" },
          { key: "total", label: "Total Album" },
          { key: "error_message", label: "Error Msg" },
          { key: "custom", label: "Progress", render: (row: Search) => (
            <span>{row.total === 0 ? 0 : ((row.current_album_nb / row.total) * 100).toFixed(2)}</span>
          )},
          { key: "custom", label: "STATUS", render: (row: Search) => (
            <span 
              className={"inline-flex items-center rounded-md text-xs font-medium ring-1 ring-inset p-1 " + (row.succeeded ? "bg-green-50 text-green-700 ring-green-600/20" : row.error_message ? "bg-red-50 text-red-700 ring-red-600/10" : "bg-blue-50 text-blue-700 ring-blue-700/10")}>
                {row.succeeded ? "Success" : row.error_message ? "Failed" : "Pending"}
            </span>
          )},
          { key: "custom", label: "SONGS", render: (row: Search) => (
            <button disabled={!row.succeeded} onClick={() => { navigate(`/search/artists/${row.artist_id}`) }}>Songs</button>
          )},

        ]}
        fetchData={fetchSearchRecords}
      />
    </div>
  );
}
