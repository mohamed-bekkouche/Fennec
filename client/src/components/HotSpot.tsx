import { motion } from "framer-motion";
interface IHotSpotProps {
  left: number;
  top: number;
  id: string;
  action: (i: string) => void;
}

const HotSpot = ({ top, left, id, action }: IHotSpotProps) => {
  return (
    <div
      onClick={() => action(id)}
      style={{ left: `${left}%`, top: `${top}%` }}
      className="absolute z-10 w-10 h-10  flex items-center justify-center cursor-pointer"
    >
      <motion.div
        animate={{ scale: [0.9, 1.2, 0.9] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}

        className="w-10 h-10 rounded-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_30%,_rgba(255,255,255,0.7)_100%)]"
      ></motion.div>
      <div className="w-2/6 h-2/6 bg-white rounded-full"> </div>
    </div>
  );
};

export default HotSpot;
