
import { useParams } from 'react-router-dom';
import SpecificationForm from '@/components/form/PageForms/SpecificationFormComponent';
import { useEffect, useState } from 'react';
import { getSingleSpecification, Specification } from '@/api/clusters';

export default function EditSpecification() {
  const { id } = useParams(); // Extract the dynamic route parameter

  const [specification, setSpecification] = useState<Specification>()

  if (! id) return

  const getSpecification = async () => {
    const data = await getSingleSpecification(id)
    setSpecification(data)
  }

  // get the specfication
  useEffect(() => {
    getSpecification()
  }, [id])

  return (
    <div className="">
      {specification && (
        <SpecificationForm 
          clusterId={specification?.cluster.id}   
          specification={specification}  
        />
      )}
    </div>
  )
}