import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

// Define the shape of the feedback data
interface Feedback {
  score: number;
  executionTime: number; // in milliseconds
  errors: string[];
  warnings: string[];
  strengths: string[];
  weaknesses: string[];
}

// Simulate an API call to fetch feedback data with a delay
const fetchFeedback = (): Promise<Feedback> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: 85,
        executionTime: 150,
        errors: [],
        warnings: ["Minor styling issues detected."],
        strengths: ["Efficient use of semantic HTML", "Clean coding standards"],
        weaknesses: ["Improve error handling", "Optimize performance for large datasets"],
      });
    }, 2000);
  });
};

const RealTimeEvaluationFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load feedback using the simulated API call
  const loadFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFeedback();
      setFeedback(data);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // On component mount, scroll to top and load feedback
  useEffect(() => {
    window.scrollTo(0, 0);
    loadFeedback();
  }, []);

  return (
    <motion.div
      className="flex justify-center items-center px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl shadow-md rounded-lg border border-gray-200">
        <CardHeader className="border-b border-gray-200">
          <CardTitle className="text-2xl font-bold text-[#333333]">Real-Time Evaluation Feedback</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-10">
              <span className="text-lg font-medium text-gray-600">Loading feedback...</span>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col justify-center items-center py-10">
              <p className="text-lg text-red-500 mb-4">Error: {error}</p>
              <Button onClick={loadFeedback} className="flex items-center space-x-2" variant="default">
                <RefreshCw className="w-5 h-5" />
                <span>Retry</span>
              </Button>
            </div>
          )}

          {!loading && !error && feedback && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Score Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#333333] mb-2">Score</h3>
                  <p className="text-3xl font-bold text-[#4A90E2]">{feedback.score}</p>
                </div>
                {/* Execution Time Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#333333] mb-2">Execution Time</h3>
                  <p className="text-3xl font-bold text-[#50E3C2]">{feedback.executionTime} ms</p>
                </div>
              </div>

              {/* Errors and Warnings */}
              {(feedback.errors.length > 0 || feedback.warnings.length > 0) && (
                <div className="space-y-4">
                  {feedback.errors.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-red-600">Errors</h4>
                      <ul className="list-disc list-inside text-red-500">
                        {feedback.errors.map((err, index) => (
                          <li key={`error-${index}`}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {feedback.warnings.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-yellow-600">Warnings</h4>
                      <ul className="list-disc list-inside text-yellow-500">
                        {feedback.warnings.map((warning, index) => (
                          <li key={`warning-${index}`}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#333333] mb-2">Strengths</h3>
                  {feedback.strengths.length > 0 ? (
                    <ul className="list-disc list-inside text-[#333333]">
                      {feedback.strengths.map((strength, index) => (
                        <li key={`strength-${index}`}>{strength}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No strengths identified.</p>
                  )}
                </div>
                {/* Areas for Improvement */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#333333] mb-2">Areas for Improvement</h3>
                  {feedback.weaknesses.length > 0 ? (
                    <ul className="list-disc list-inside text-[#333333]">
                      {feedback.weaknesses.map((weakness, index) => (
                        <li key={`weakness-${index}`}>{weakness}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No areas for improvement.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        {!loading && !error && (
          <CardFooter className="border-t border-gray-200">
            <div className="flex justify-end">
              <Button onClick={loadFeedback} variant="outline" className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Refresh Feedback</span>
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default RealTimeEvaluationFeedback;