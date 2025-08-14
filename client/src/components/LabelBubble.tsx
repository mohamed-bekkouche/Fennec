import { motion } from "framer-motion";
interface IProps {
  content: string;
  styles: string;
  borderColor: string;
  animationDuration?: number;
  animationDelay?: number;
}

const LabelBubble = ({
  content,
  styles,
  borderColor,
  animationDuration = 0,
  animationDelay = 0,
}: IProps) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        translateY: "10px",
      }}
      animate={{
        opacity: 1,
        translateY: "0px",
      }}
      transition={{
        duration: animationDuration,
        delay: animationDelay,
      }}
      className={`absolute text-sm lg:text-[1rem] rounded-2xl py-2 px-3 ${styles}`}
    >
      <span>{content}</span>
      <span
        className={`absolute bottom-0 left-1/2 -translate-x-1/2  translate-y-5 block w-0 h-0 border-10 border-transparent ${borderColor}`}
      >
        {" "}
      </span>
    </motion.div>
  );
};

export default LabelBubble;
