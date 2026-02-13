import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectCurrentAdmin } from "../features/auth/authSlice";
import { 
  LogOut, 
  User, 
  Bell, 
  Search,
  Menu,
  X,
  ChevronDown,
  Settings
} from "lucide-react";
import { useGetAdminProfileQuery } from "../features/auth/authApi";

const Navbar = () => {
  const dispatch = useDispatch();
  const admin = useSelector(selectCurrentAdmin);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
   const { data, isLoading, isError } = useGetAdminProfileQuery();

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100' 
        : 'bg-white border-b border-gray-100'
    }`}>
      <div className="px-6 py-3">
        <div className="flex justify-between items-center">
          
          {/* Left Section - Search and Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button (Hidden on desktop) */}
            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
            
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          {/* Right Section - User Info and Actions */}
          <div className="flex items-center gap-4">
            
           
            
         
            
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500  to-purple-500 rounded-full  border-gray-100 border-2 flex items-center justify-center text-white font-semibold shadow-md">
                  {/* {admin?.name?.charAt(0) || "A"} */}
                 <img src={admin?.profileImage} alt="profile image"   className="rounded-full"/>
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-medium text-gray-800">{admin?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500">{admin?.role || "Administrator"}</p>
                </div>
                <ChevronDown size={18} className={`text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{admin?.name || "Admin"}</p>
                    <p className="text-sm text-gray-500 truncate">{admin?.email || "admin@example.com"}</p>
                  </div>
                  
                  <div className="py-2">
                    <a 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </a>
                   
                  </div>
                  
                  <div className="border-t border-gray-100 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Search (Hidden on desktop) */}
        <div className={`md:hidden mt-3 ${showMobileMenu ? 'block' : 'hidden'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Mobile Menu Items */}
          <div className="mt-3 space-y-2">
            <a href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <User size={18} />
              <span>Profile</span>
            </a>
            <a href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <Settings size={18} />
              <span>Settings</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Navbar;