import { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Upload, 
  Images, 
  Settings, 
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Image
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();

  const navItems = [
    { path: "/upload", label: "Upload Image", icon: <Upload size={20} /> },
    { path: "/images", label: "Images Management", icon: <Images size={20} /> },
   
  ];

 

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-100 shadow-sm transition-all duration-300 ease-in-out h-screen sticky top-0`}>
      <div className="p-4">
        {/* Logo and Toggle Button */}
        <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center mb-8`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <Image className="text-white" size={22} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Admin Panel</h2>
                <p className="text-xs text-gray-500">Image Gallery</p>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Image className="text-white" size={22} />
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight size={20} className="text-gray-600" />
            ) : (
              <ChevronLeft size={20} className="text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-4'} py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-500 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
              title={isCollapsed ? item.label : ""}
            >
              {({ isActive }) => (
                <>
                  <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        
        
        
        {/* Collapsed Info */}
        {isCollapsed && (
          <div className="mt-8 text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;