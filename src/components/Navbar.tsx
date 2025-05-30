import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BellIcon } from "@heroicons/react/24/outline"; // Ensure this package is installed

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    ...(isAuthenticated ? [{ path: "/shows", label: "Browse Shows" }] : []),
    { path: "/bookings", label: "My Bookings" },
    ...(!isAuthenticated ? [{ path: "/login", label: "Login" }] : []),
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-white"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 w-10 mr-2 rounded-full"
              loading="lazy"
            />
            <span>Theatre Booking System</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-yellow-500 text-gray-900"
                      : "hover:bg-gray-800 hover:text-yellow-400"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {/* Notification Icon */}
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative p-1 rounded-full text-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
            </Link>

            {/* Profile or Sign Up */}
            {!isAuthenticated ? (
              <Link
                to="/signup"
                className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Sign Up
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="ml-4 flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  aria-haspopup="true"
                  aria-expanded={isProfileDropdownOpen}
                >
                  <span>Profile</span>
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-500 hover:text-gray-900"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-white hover:bg-yellow-500 hover:text-gray-900"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-md text-gray-400 hover:text-yellow-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                aria-current={isActive ? "page" : undefined}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-yellow-500 text-gray-900"
                    : "hover:bg-gray-700 hover:text-yellow-400"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            );
          })}
          {!isAuthenticated ? (
            <Link
              to="/signup"
              className="block mt-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          ) : (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                logout();
              }}
              className="block mt-2 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              aria-label="Logout"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
