import PropertyForm from "../../form"

const ViewProperty = async ({ params }: { params: Promise<{ propertyid: string }> }) => {
  const { propertyid } = await params;

  return (
    <div className="w-full h-full space-y-4">
      <h1 className="text-xl font-semibold font-inter">View Property</h1>
      <PropertyForm propertyId={propertyid} readOnly />
    </div>
  )
}

export default ViewProperty
