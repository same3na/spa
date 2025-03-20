import { motion } from "framer-motion";

const PlayingIndicator = ({ isPlaying }: {isPlaying:boolean}) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4].map((bar, index) => (
        <motion.span
          key={index}
          className="w-1 h-4 bg-green-500 rounded"
          animate={{
            scaleY: isPlaying ? [0.5, 1, 0.5] : 0.5,
          }}
          transition={
            isPlaying
            ? {
                duration: 0.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }
            : { duration: 0 } // No transition when stopped
          }

        />
      ))}
    </div>
  );
};

export default PlayingIndicator
