import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import HomePage from "./pages/HomePage";
import AdminPanel from "./pages/AdminPanel";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPanel />} />
      {/* Fallback to HomePage for any unmatched routes */}
      <Route path="*" element={<HomePage />} />
    </Routes>
  );
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Failed to find the root element. Ensure an element with id 'root' exists in your HTML."
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);