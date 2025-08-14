import type React from "react";
import { motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useState } from "react";

interface IFaqCardProps {
  question: string;
  children: React.ReactNode;
}

const FaqCard = ({ question, children }: IFaqCardProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <motion.div
      variants={{
        initial: { height: "64px" },
        animate: { height: "fit-content" },
      }}
      initial="initial"
      animate={isOpen ? "animate" : "initial"}
      className="bg-white overflow-hidden w-full md:w-full max-w-4xl mx-auto mb-5 text-off-black rounded-sm"
    >
      <div className="h-16 md:text-normal text-sm flex justify-between items-center p-4 font-semibold">
        <p> {question} </p>
        <span
          onClick={() => setIsOpen(!isOpen)}
          className="bg-cold-gray p-1.5 rounded-full flex content-center text-sm cursor-pointer"
        >
          {" "}
          {isOpen ? <FaMinus /> : <FaPlus />}
        </span>
      </div>
      <div className="p-4 pt-0 font-normal text-xs md:text-[0.825rem]">
        {children}
      </div>
    </motion.div>
  );
};

export default FaqCard;
