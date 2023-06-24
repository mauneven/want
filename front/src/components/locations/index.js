import dynamic from "next/dynamic";
import Location from "./Location";

const DynamicLocation = dynamic(() => import("./Location"), { ssr: false });

const WantPostMap = ({ onLatitudeChange, onLongitudeChange }) => {
  return (
    <div>
      <DynamicLocation
        onLatitudeChange={onLatitudeChange}
        onLongitudeChange={onLongitudeChange}
      />
    </div>
  );
};

export default WantPostMap;