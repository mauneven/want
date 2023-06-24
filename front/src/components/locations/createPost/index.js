import dynamic from "next/dynamic";

const DynamicLocation = dynamic(() => import("./CreatePostLocation"), {
  ssr: false,
});

const CreatePostLocationDynamic = ({ onLatitudeChange, onLongitudeChange }) => {
  return (
    <div>
      <DynamicLocation 
        onLatitudeChange={onLatitudeChange}
        onLongitudeChange={onLongitudeChange}
      />
    </div>
  );
};

export default CreatePostLocationDynamic;
