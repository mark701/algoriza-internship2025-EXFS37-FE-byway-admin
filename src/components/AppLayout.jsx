// src/layouts/AppLayout.jsx
import Sidebar from "../Shared/Sidebar"; 
import { Outlet } from "react-router-dom";
const AppLayout = () => {



  return (
    <div className="flex min-h-screen bg-gray-50 ">
      <Sidebar />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
