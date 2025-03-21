import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import IntroductionSection from "../components/IntroductionSection";
import CodingEnvironment from "../components/CodingEnvironment";
import RealTimeEvaluationFeedback from "../components/RealTimeEvaluationFeedback";
import InstantFeedbackSection from "../components/InstantFeedbackSection";

const HomePage: React.FC = () => {
  // Ensure page starts at the top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Ref for the Coding Environment to enable smooth scrolling on "Start Challenge"
  const codingEnvRef = useRef<HTMLDivElement>(null);

  const handleStartChallenge = () => {
    if (codingEnvRef.current) {
      codingEnvRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#FFFFFF] text-[#333333] font-sans min-h-screen">
      {/* Global Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-16">
        {/* Introduction Hero Section with onStartChallenge callback */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <IntroductionSection onStartChallenge={handleStartChallenge} />
        </motion.div>

        {/* Coding Environment Section */}
        <section ref={codingEnvRef} className="mt-8">
          <CodingEnvironment />
        </section>

        {/* Real-Time Evaluation Feedback Section */}
        <section className="mt-8">
          <RealTimeEvaluationFeedback />
        </section>

        {/* Instant Feedback Section */}
        <section className="mt-8">
          <InstantFeedbackSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-4 mt-8">
        <p className="text-sm text-gray-700">
          &copy; {new Date().getFullYear()} WebDev Eval. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;