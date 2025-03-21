import React, { useEffect } from "react";
import AdminControlPanel from "../components/AdminControlPanel";

const AdminPanel: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#FFFFFF] min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <AdminControlPanel />
      </div>
    </div>
  );
};

export default AdminPanel;