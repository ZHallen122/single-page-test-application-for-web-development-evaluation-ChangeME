import React, { FC } from 'react';
import { Code } from 'lucide-react';
import { motion } from 'framer-motion';

interface IntroductionSectionProps {
  onStartChallenge?: () => void;
}

const IntroductionSection: FC<IntroductionSectionProps> = ({ onStartChallenge }) => {
  const handleStartChallenge = () => {
    if (onStartChallenge) {
      onStartChallenge();
    } else {
      console.log('Start Challenge clicked');
    }
  };

  return (
    <section
      id="introduction"
      className="bg-[#FFFFFF] text-[#333333] w-full px-4 py-12 md:py-16 flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto"
      >
        <Code className="w-12 h-12 text-[#4A90E2]" />
        <h1 className="font-sans text-[28px] font-bold">
          Welcome to the Web Development Evaluation
        </h1>
        <p className="font-sans text-[16px]">
          Demonstrate your coding skills with our real-time coding challenge. Start your evaluation and showcase your expertise in HTML, CSS, and JavaScript.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStartChallenge}
          className="bg-[#4A90E2] text-white min-h-[50px] rounded-full px-8 py-2 mt-4 shadow transition-transform duration-200 cursor-pointer"
        >
          Start Challenge
        </motion.button>
      </motion.div>
    </section>
  );
};

export default IntroductionSection;