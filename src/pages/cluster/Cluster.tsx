import { useEffect, useState } from "react";
import { Cluster, deleteCluster, getClusters as getClustersApi } from "@/api/clusters";
import { Filter, Scale, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Clusters() {
  const [clusters, setClusters] = useState<any>([]); // State to hold input value
  const navigate = useNavigate();

  const getClusters = async () => {
    const data = await getClustersApi()
    setClusters(data);
  }

  const onDelete = async(id:string) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this record?");

    if (!isConfirmed) {
      return
    }

    await deleteCluster(id)
    getClusters()

  }

  useEffect(() => {
    getClusters()
  }, []); // Watch state updates
  
  return (
    <div className="">
      <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition" onClick={() => {navigate(`/clusters/create/`)}}>
        Add Cluster
      </button>

      {clusters && (
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">ID</th>
              <th className="px-4 py-2 text-left text-gray-300">Description</th>
              <th className="px-4 py-2 text-left text-gray-300">Cluster Number</th>
              <th className="px-4 py-2 text-left text-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {clusters.map((item:Cluster) => (
              <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer">
                <td className="px-4 py-2 text-gray-300">{item.id}</td>
                <td className="px-4 py-2 text-gray-300">{item.description}</td>
                <td className="px-4 py-2 text-gray-300">{item.cluster_nb}</td>
                <td className="px-4 py-2 text-gray-300">
                  <div className="flex gap-4">
                    <button
                      onClick={() => {

                        onDelete(item.id); // Call the delete function
                      }}
                      className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white transition-all duration-300 
                                hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-md"
                    >
                      <Trash className="w-5 h-5" />
                    </button>

                    <button
                      onClick={ () => {navigate(`/clusters/${item.id}`)}}
                      className="group relative rounded-xl bg-red-600 px-4 py-2 text-white transition-all duration-300 
                                hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-md"
                    >
                      <Scale className="w-5 h-5" />
                    </button>

                    <button
                      onClick={ () => {navigate(`/clusters/${item.id}/specifications`)}}
                      className="group relative rounded-xl bg-red-600 px-4 py-2 text-white transition-all duration-300 
                                hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-md"
                    >
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
