import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Plus, Edit2, Trash, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Test {
  id: string;
  name: string;
  description: string;
  challenge: string;
  testCase: string;
}

const testSchema = z.object({
  name: z.string().min(1, { message: "Test name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  challenge: z.string().min(1, { message: "Challenge is required" }),
  testCase: z.string().min(1, { message: "Test Case is required" })
});
type TestFormInputs = z.infer<typeof testSchema>;

const AdminControlPanel: React.FC = () => {
  // View mode: "dashboard" shows overall stats and test grid, "editor" shows multi-step test form.
  const [viewMode, setViewMode] = useState<"dashboard" | "editor">("dashboard");
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // React Hook Form for test editor form with zod validation.
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
    getValues
  } = useForm<TestFormInputs>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      name: "",
      description: "",
      challenge: "",
      testCase: ""
    }
  });
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Scroll to top when view changes.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

  // Simulate API call to fetch tests when in dashboard view.
  useEffect(() => {
    if (viewMode === "dashboard") {
      setLoading(true);
      setError(null);
      setTimeout(() => {
        try {
          // Use mock data if API returns empty.
          const mockTests: Test[] = [
            {
              id: "1",
              name: "HTML Basics",
              description: "Test on basic HTML skills",
              challenge: "Implement a simple webpage structure",
              testCase: "Verify DOCTYPE, header, and body"
            },
            {
              id: "2",
              name: "CSS Styling",
              description: "Test on CSS styling skills",
              challenge: "Create a responsive button",
              testCase: "Check hover state and responsiveness"
            },
            {
              id: "3",
              name: "JavaScript Challenge",
              description: "Test on JavaScript skills",
              challenge: "Implement a function to reverse a string",
              testCase: "Edge cases for empty string and long text"
            }
          ];
          setTests(mockTests);
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch tests.");
          setLoading(false);
        }
      }, 1000);
    }
  }, [viewMode]);

  // Filter tests by search term.
  const filteredTests = tests.filter(
    (test) =>
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete test handler.
  const handleDeleteTest = (id: string) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      setTests((prev) => prev.filter((test) => test.id !== id));
    }
  };

  // Edit test handler: load the selected test into the form and switch to editor view.
  const handleEditTest = (id: string) => {
    const testToEdit = tests.find((test) => test.id === id);
    if (testToEdit) {
      reset(testToEdit);
      setCurrentStep(0);
      setViewMode("editor");
    }
  };

  // Handle test editor form submission.
  const onSubmit: SubmitHandler<TestFormInputs> = (data) => {
    try {
      // For simulation, create a new test entry.
      const newTest: Test = {
        id: String(Date.now()),
        name: data.name,
        description: data.description,
        challenge: data.challenge,
        testCase: data.testCase
      };
      setTests((prev) => [...prev, newTest]);
      reset();
      setCurrentStep(0);
      setViewMode("dashboard");
      alert("Test published successfully!");
    } catch (err) {
      alert("An error occurred while publishing the test.");
    }
  };

  // Navigation between multi-step form sections.
  const handleNextStep = async () => {
    let valid = false;
    if (currentStep === 0) {
      valid = await trigger(["name", "description"]);
    } else if (currentStep === 1) {
      valid = await trigger("challenge");
    } else if (currentStep === 2) {
      valid = await trigger("testCase");
    }
    if (valid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Render the current step in the test editor multi-step form.
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333333]">
                Test Name
              </label>
              <input
                {...register("name")}
                type="text"
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Enter test name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333]">
                Description
              </label>
              <textarea
                {...register("description")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Enter test description"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333333]">
                Challenge Definition
              </label>
              <textarea
                {...register("challenge")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Define the coding challenge"
                rows={4}
              />
              {errors.challenge && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.challenge.message}
                </p>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#333333]">
                Test Cases
              </label>
              <textarea
                {...register("testCase")}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Describe a test case"
                rows={4}
              />
              {errors.testCase && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.testCase.message}
                </p>
              )}
            </div>
          </div>
        );
      case 3:
        const values = getValues();
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#333333]">Preview</h3>
            <div className="border p-4 rounded-md">
              <p>
                <strong>Name:</strong> {values.name}
              </p>
              <p>
                <strong>Description:</strong> {values.description}
              </p>
              <p>
                <strong>Challenge:</strong> {values.challenge}
              </p>
              <p>
                <strong>Test Cases:</strong> {values.testCase}
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-4 md:p-8">
      <AnimatePresence mode="wait">
        {viewMode === "dashboard" && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
                Admin Control Panel
              </h1>
            </div>
            {/* Overview Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="shadow hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#333333]">
                    Total Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">{tests.length}</p>
                </CardContent>
              </Card>
              <Card className="shadow hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#333333]">
                    Active Candidates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">5</p>
                </CardContent>
              </Card>
              <Card className="shadow hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-[#333333]">
                    Completed Tests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold">
                    {Math.floor(tests.length / 2)}
                  </p>
                </CardContent>
              </Card>
            </div>
            {/* Test Management Grid */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <div className="flex items-center space-x-2 w-full sm:w-auto mb-2 sm:mb-0">
                  <Search className="w-5 h-5 text-[#333333]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search tests..."
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] w-full"
                  />
                </div>
                <Button
                  onClick={() => {
                    reset();
                    setCurrentStep(0);
                    setViewMode("editor");
                  }}
                  className="bg-[#4A90E2] text-white rounded-full h-12 hover:opacity-90 transition"
                >
                  <Plus className="w-5 h-5 mr-2" /> Create New Test
                </Button>
              </div>
              {loading ? (
                <p>Loading tests...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredTests.map((test) => (
                    <Card
                      key={test.id}
                      className="shadow hover:shadow-lg transition relative"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-[#333333]">
                          {test.name}
                        </CardTitle>
                        <CardDescription className="text-sm text-[#333333]">
                          {test.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEditTest(test.id)}
                          className="text-[#4A90E2] border-[#4A90E2]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleDeleteTest(test.id)}
                          className="text-[#F5A623] border-[#F5A623]"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
        {viewMode === "editor" && (
          <motion.div
            key="editor"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-bold text-[#333333]">
                Test Editor
              </h1>
              <Button
                variant="outline"
                onClick={() => {
                  setViewMode("dashboard");
                  reset();
                }}
                className="text-[#4A90E2] border-[#4A90E2]"
              >
                Back to Dashboard
              </Button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}
              <div className="flex justify-between">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    variant="outline"
                    className="text-[#4A90E2] border-[#4A90E2]"
                  >
                    Back
                  </Button>
                )}
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-[#4A90E2] text-white hover:opacity-90"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-[#4A90E2] text-white hover:opacity-90"
                    >
                      Publish Test
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminControlPanel;