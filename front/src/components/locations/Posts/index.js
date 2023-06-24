import dynamic from "next/dynamic";

const DynamicLocation = dynamic(() => import("./PostsLocation"), {
  ssr: false,
});

const PostLocationDynamic = ({ latitude, longitude, radius, onLatitudeChange, onLongitudeChange, onRadiusChange }) => {
  return (
    <div>
      <DynamicLocation
        onLatitudeChange={onLatitudeChange}
        onLongitudeChange={onLongitudeChange}
        onRadiusChange={onRadiusChange}
      />
    </div>
  );
};

export default PostLocationDynamic;
