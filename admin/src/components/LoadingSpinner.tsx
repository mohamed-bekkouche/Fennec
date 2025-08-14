import { LuLoaderCircle } from "react-icons/lu";
const LoadingSpinner = () => {
  return (
    <div className="w-full h-full bg-off-black flex justify-center items-center">
      <LuLoaderCircle className=" spin text-5xl text-off-white" />
    </div>
  );
};

export default LoadingSpinner;
