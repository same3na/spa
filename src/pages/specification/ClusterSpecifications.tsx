import { useState, useEffect } from 'react';
import { Specification, getSpecifications as getSpecificationsApi, deleteSpecification as deleteSpecificationApi } from '@/api/clusters';
import { Trash } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function ClusterSpecifications() {
  const [specifications, setSpecifications] = useState<any>(null); // State to hold input value
  const navigate = useNavigate();
  
  const { cluster_id } = useParams(); // Extract the dynamic route parameter

  if (!cluster_id) return
  
  const getSpecifications = async () => {
    const data = await getSpecificationsApi(cluster_id)
    setSpecifications(data);
  }

  const deleteSpecification = async(specfication: Specification) => {
    await deleteSpecificationApi(specfication.id)
    getSpecifications()
  }

  useEffect(() => {
    getSpecifications()
  }, [cluster_id])
  
  return (
    <div className=''>
      <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition" onClick={() => {navigate(`/clusters/${cluster_id}/specifications/create/`)}}>
        Add Specification
      </button>


      {specifications && (
        <table className="min-w-full border border-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">ID</th>
              <th className="px-4 py-2 text-left text-gray-300">Type</th>
              <th className="px-4 py-2 text-left text-gray-300">Delete</th>
            </tr>
          </thead>
          <tbody>
            {specifications.map((item:Specification) => (
              <tr key={item.id} className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer">
                <td className="px-4 py-2 text-gray-300" onClick={ () => {navigate(`/specifications/${item.id}`)}}>{item.id}</td>
                <td className="px-4 py-2 text-gray-300" onClick={ () => {navigate(`/specifications/${item.id}`)}}>{item.type}</td>
                <td className="px-4 py-2 text-gray-300">
                <button
                  onClick={() => {
                    deleteSpecification(item)
                  }}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white transition-all duration-300 
                            hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-md"
                >
                  <Trash className="w-5 h-5" />
                  Delete
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}