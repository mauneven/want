import dynamic from "next/dynamic";

const DynamicLocation = dynamic(() => import("./PostDetailsLocation"), {
  ssr: false,
});

const PostDetailsLocationDynamic = ({
  latitude,
  longitude,
}) => {
  return (
    <div>
      <DynamicLocation
        latitude={latitude}
        longitude={longitude}
      />
    </div>
  );
};

export default PostDetailsLocationDynamic;
