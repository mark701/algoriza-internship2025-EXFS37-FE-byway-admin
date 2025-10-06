// src/components/Sidebar.js
import React, { useState, useEffect } from 'react';

import { useSetAtom } from 'jotai';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAtom } from '../utils/authAtom';

const Sidebar = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // local state instead of atom
  // const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const setToken = useSetAtom(authAtom);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const path =  'dashboard';
  //   setActiveTab(path);
  // }, [location, setActiveTab]);

  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'dashboard';
    setActiveTab(path);
  }, [location]);

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(`/${path}`);
  };

  
  const handleLogout = () => {
    setToken(null); 
    navigate('/');
  };

  return (
<div className="w-80  bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center  space-x-3">
            <div className="w-8 h-8 flex-center mx-2 ">
            <img src={`${process.env.PUBLIC_URL}/Assets/Icons/logo.png`} alt='logo.png'/>
            </div>
            <span className="text-xl font-bold text-gray-800">Byway</span>
          </div>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button
              onClick={() => handleNavigation('dashboard')}
              className={`SideBarBorder ${
                activeTab === 'dashboard' 
                  ? 'SideBarActive' 
                  : 'SideBarHover'
              }`}
            >
              {/* <Home size={20} /> */}
              <span>Dashboard</span>
            </button>
            
            <button
              onClick={() => handleNavigation('Instructor')}
              className={`SideBarBorder ${
                activeTab === 'Instructor' 
                  ? 'SideBarActive' 
                  : 'SideBarHover'
              }`}
            >
              {/* <Users size={20} /> */}
              <span>Instructors</span>
            </button>
            
            <button
              onClick={() => handleNavigation('course')}
              className={`SideBarBorder ${
                activeTab === 'course' 
                  ? 'SideBarActive' 
                  : 'SideBarHover'
              }`}
            >
              {/* <BookOpen size={20} /> */}
              <span>Courses</span>
            </button>
          </div>
  <div className="border-t border-gray-200 mx-7 my-3"></div>

          
          <div className="mt-auto px-4 py-4">
            <button 
             onClick={() => handleLogout()}
            className="w-full flex items-center space-x-3 px-4 py-3 SideBarHover rounded-lg">
              {/* <LogOut size={20} /> */}
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>



  );
};

export default Sidebar;