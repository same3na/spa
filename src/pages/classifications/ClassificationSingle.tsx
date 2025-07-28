import { useNavigate, useParams } from "react-router-dom";
import { getPlaylist, Song } from "@/api/songs";
import {
  ClassificationDetail,
  getClassificationDetail as getClassificationDetailApi
} from "@/api/classifications";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import SongTableComponent from "@/components/table/SongTableComponent";
import { usePlayer } from "@/context/PlayerContext";
import TableBtn from "@/components/table/TableBtnComponent";

export default function ClassificationSingle() {
  const { id } = useParams();
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [classification, setClassification] = useState<ClassificationDetail | null>(null);
  const [songsFilter, setSongsFilter] = useState<SongsFilter | null>(null)
  const { setSong, setPlaylist } = usePlayer();
  
  const navigate = useNavigate();

  if (!id) return null;

  const getDetails = async () => {
    const data: ClassificationDetail = await getClassificationDetailApi(id);

    // Transform features for chart
    const features = data.classification.features;
    const transformed = Object.entries(features).map(([key, value]) => ({
      name: key,
      value: Number(value),
    }));
    setChartData(transformed);

    setClassification(data);
  };

  const playRandomSongs = async () => {
    // first get playlist then play the first song
    const data = await getPlaylist({ song_id: undefined, artist_ids: songsFilter?.artists, feature_filter: songsFilter?.criterias, in_song_ids: classification?.classification.songs });
    setPlaylist(data)
    if (data.length > 0) {
      setSong(data[0])
    }
  }

  useEffect(() => {
    getDetails();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-900 text-white px-8 py-12">
      {/* Title & Description */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">
          {classification?.classification.name || "Loading..."}
        </h1>
        <p className="text-gray-300 max-w-4xl">
          {classification?.classification.description || "No description available."}
        </p>

        {/* AI Generated badge */}
        <div className="mt-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold 
              ${classification?.classification.is_ai_generated
                ? 'bg-purple-600 text-purple-100'
                : 'bg-gray-700 text-gray-300'
              }`}
          >
            {classification?.classification.is_ai_generated ? "AI Generated" : "Custom"}
          </span>
        </div>
      </header>

      {/* Chart */}
      <section className="bg-gray-800 rounded-lg p-8 shadow-lg mb-12 w-full">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <ReferenceLine y={0} stroke="#000" />
              <Bar dataKey="value" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Artists */}
      <section className="bg-gray-800 rounded-lg p-8 shadow-lg w-full">
        <h2 className="text-2xl font-semibold mb-4">Artists</h2>
        {classification?.artists?.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classification.artists.map((artist) => (
              <li
                key={artist.artist.id}
                className="flex justify-between items-center px-4 py-3 bg-gray-700 rounded hover:bg-gray-600"
              >
                <span className="font-medium">{artist.artist.name}</span>
                <span className="text-sm text-gray-300">{artist.total}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No artists found.</p>
        )}
      </section>

      {/* Songs */}
      <section className="bg-gray-800 rounded-lg p-8 shadow-lg w-full mt-12">
        <SongTableComponent
          songIds={classification?.classification.songs}
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
          ]}
          onFilterChange={setSongsFilter}
          tableBtns={[
            <TableBtn 
              label={"Play Random"} 
              btnClass={"bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow"} 
              onButtonClick={() => playRandomSongs()} />,
          ]}
        />
      </section>
    </div>
  );
}
