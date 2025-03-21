import React, { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

const CodingEnvironment: React.FC = () => {
  // Ensure page starts at the top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // State for selected language tab and code content
  const [activeTab, setActiveTab] = useState<"html" | "css" | "js">("html");
  const [htmlCode, setHtmlCode] = useState<string>(
    `<div>
  <h1>Hello, World!</h1>
  <p>This is your HTML code.</p>
</div>`
  );
  const [cssCode, setCssCode] = useState<string>(
    `body {
  font-family: Arial, sans-serif;
  background-color: #fff;
  color: #333;
}
h1 {
  color: #4A90E2;
}`
  );
  const [jsCode, setJsCode] = useState<string>(
    `console.log("Hello, World!");`
  );
  // State to hold the combined document content for the output iframe
  const [srcDoc, setSrcDoc] = useState<string>("");
  // State to capture console logs and errors from the iframe execution
  const [logs, setLogs] = useState<
    { type: "log" | "error"; message: string }[]
  >([]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for messages (logs and errors) posted from the iframe document
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === "object") {
        const { type, message } = event.data;
        if (type === "log" || type === "error") {
          setLogs((prevLogs) => [...prevLogs, { type, message }]);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Combines the code from different editors and sets the iframe document
  const runCode = () => {
    // Clear any previous logs
    setLogs([]);
    const documentContent = `
      <html>
        <head>
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            (function(){
              function sendMessage(type, message) {
                window.parent.postMessage({ type, message }, '*');
              }
              // Override console.log and console.error to capture messages
              console.log = function() {
                var args = Array.from(arguments);
                sendMessage('log', args.join(' '));
              };
              console.error = function() {
                var args = Array.from(arguments);
                sendMessage('error', args.join(' '));
              };
              window.onerror = function(message, source, lineno, colno, error) {
                sendMessage('error', message);
              };
            })();
          <\/script>
          <script>
            try {
              ${jsCode}
            } catch(e) {
              console.error(e);
            }
          <\/script>
        </body>
      </html>
    `;
    setSrcDoc(documentContent);
  };

  return (
    <div className="p-4 md:p-8 bg-[#FFFFFF] text-[#333333] font-sans">
      <div className="mb-6">
        <h1 className="text-[28px] font-bold">Coding Environment</h1>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left Panel: Code Editor */}
        <div className="md:w-3/5 flex flex-col">
          {/* Language Selection Tabs */}
          <div className="mb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab("html")}
                className={`px-4 py-2 rounded transition transform hover:scale-105 ${
                  activeTab === "html"
                    ? "bg-[#4A90E2] text-white"
                    : "bg-gray-200 text-[#333333]"
                }`}
              >
                HTML
              </button>
              <button
                onClick={() => setActiveTab("css")}
                className={`px-4 py-2 rounded transition transform hover:scale-105 ${
                  activeTab === "css"
                    ? "bg-[#4A90E2] text-white"
                    : "bg-gray-200 text-[#333333]"
                }`}
              >
                CSS
              </button>
              <button
                onClick={() => setActiveTab("js")}
                className={`px-4 py-2 rounded transition transform hover:scale-105 ${
                  activeTab === "js"
                    ? "bg-[#4A90E2] text-white"
                    : "bg-gray-200 text-[#333333]"
                }`}
              >
                JavaScript
              </button>
            </div>
          </div>
          {/* Code Editor Area */}
          <div className="mb-4 flex-1">
            {activeTab === "html" && (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            )}
            {activeTab === "css" && (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            )}
            {activeTab === "js" && (
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded font-mono resize-none focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              />
            )}
          </div>
          {/* Run Code Button */}
          <button
            onClick={runCode}
            className="flex items-center justify-center bg-[#4A90E2] text-white rounded-md min-h-[50px] px-4 py-2 hover:opacity-90 transition"
          >
            <Play className="mr-2" size={20} />
            Run Code
          </button>
        </div>
        {/* Right Panel: Output and Console */}
        <div className="md:w-2/5 flex flex-col">
          <div className="flex-1 mb-4 border border-gray-300 rounded shadow-md">
            <iframe
              title="output"
              srcDoc={srcDoc}
              sandbox="allow-scripts"
              frameBorder="0"
              className="w-full h-64"
              ref={iframeRef}
            />
          </div>
          <div className="border border-gray-300 rounded p-2 h-32 overflow-y-auto font-mono bg-gray-50">
            <div className="text-sm font-bold mb-1">Console Output:</div>
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet...</div>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={log.type === "error" ? "text-red-600" : "text-green-600"}
                >
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingEnvironment;