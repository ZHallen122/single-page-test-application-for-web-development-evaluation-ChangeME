import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FeedbackMetric {
  label: string;
  value: number;
}

interface FeedbackData {
  overallScore: number;
  feedback: string;
  metrics: FeedbackMetric[];
}

// Mock data for feedback in case the API fails or returns empty
const mockFeedback: FeedbackData = {
  overallScore: 85,
  feedback: "Great job! Your coding skills are strong. Keep up the good work.",
  metrics: [
    { label: "Accuracy", value: 90 },
    { label: "Efficiency", value: 80 },
    { label: "Best Practices", value: 75 },
  ],
};

const InstantFeedbackSection: React.FC = () => {
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure the page scrolls to top when this component mounts
    window.scrollTo(0, 0);

    const fetchFeedback = async () => {
      try {
        const response = await fetch("/api/feedback");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: FeedbackData = await response.json();

        // If data is empty or undefined, fallback to our mock data
        if (!data || !data.metrics || data.metrics.length === 0) {
          setFeedback(mockFeedback);
        } else {
          setFeedback(data);
        }
      } catch (err: any) {
        console.error("Failed to fetch feedback:", err);
        setError("Failed to load feedback. Displaying default results.");
        setFeedback(mockFeedback);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <section className="px-4 py-8 bg-[#FFFFFF]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto my-8 max-w-4xl"
      >
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold font-sans text-[#333333]">
                Instant Feedback
              </CardTitle>
              {feedback && feedback.overallScore >= 80 ? (
                <CheckCircle className="text-[#50E3C2]" size={24} />
              ) : (
                <AlertCircle className="text-[#F5A623]" size={24} />
              )}
            </div>
          </CardHeader>
          <CardContent className="bg-white px-4 py-6">
            {!feedback ? (
              <p className="text-center text-lg text-[#333333]">
                Loading feedback...
              </p>
            ) : (
              <div className="flex flex-col space-y-6">
                <div>
                  <p className="text-lg font-semibold text-[#333333]">
                    Overall Score:{" "}
                    <span className="text-[#4A90E2]">{feedback.overallScore}%</span>
                  </p>
                  <p className="mt-1 text-base text-[#333333]">
                    {feedback.feedback}
                  </p>
                </div>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={feedback.metrics}>
                      <XAxis
                        dataKey="label"
                        stroke="#333333"
                        tick={{ fontSize: 14, fontFamily: "Arial, sans-serif" }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        stroke="#333333"
                        tick={{ fontSize: 14, fontFamily: "Arial, sans-serif" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #e0e0e0",
                        }}
                      />
                      <Bar dataKey="value" fill="#4A90E2" barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-around">
                  {feedback.metrics.map((metric, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-sm font-medium text-[#333333]">
                        {metric.label}
                      </span>
                      <span className="mt-1 text-lg font-bold text-[#4A90E2]">
                        {metric.value}%
                      </span>
                    </div>
                  ))}
                </div>
                {error && (
                  <p className="mt-4 text-center text-sm text-red-500">{error}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
};

export default InstantFeedbackSection;