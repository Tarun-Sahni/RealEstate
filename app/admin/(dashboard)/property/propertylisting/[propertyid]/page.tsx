import PropertyForm from "../form"

const EditProperty = async ({ params }: { params: Promise<{ propertyid: string }> }) => {
  const { propertyid } = await params;

  return (
    <div className="w-full h-full space-y-4">
      <h1 className="text-xl font-semibold font-inter">Edit Property</h1>
      <PropertyForm propertyId={propertyid} />
    </div>
  )
}

export default EditProperty
