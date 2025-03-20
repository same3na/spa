
import { useParams } from 'react-router-dom';
import SpecificationForm from '@/components/form/PageForms/SpecificationFormComponent';

export default function SpecificationCreate() {
  const { cluster_id } = useParams(); // Extract the dynamic route parameter

  if (! cluster_id) return

  return (
    <div className="">
      <SpecificationForm 
        clusterId={cluster_id}        
      />
    </div>
  )
}