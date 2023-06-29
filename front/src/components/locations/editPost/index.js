import dynamic from "next/dynamic";

const DynamicLocation = dynamic(() => import("./EditPostLocation"), {
  ssr: false,
});

const EditPostLocationDynamic = ({
  onLatitudeChange,
  onLongitudeChange,
  latitude,
  longitude,
}) => {
  return (
    <div>
      <DynamicLocation
        latitude={latitude}
        longitude={longitude}
        onLatitudeChange={onLatitudeChange}
        onLongitudeChange={onLongitudeChange}
      />
    </div>
  );
};

export default EditPostLocationDynamic;
