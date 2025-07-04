import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { BellIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const [notifications, setNotifications] = useState<
    { id: string; message: string; isRead: boolean; createdAt: string }[]
  >([]);
  const [isNotifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const notifDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchedNotifications = [
      {
        id: "1",
        message: "Your booking for Show A is confirmed!",
        isRead: false,
        createdAt: "2025-05-30T12:00:00Z",
      },
      {
        id: "2",
        message: "New review on Show B.",
        isRead: true,
        createdAt: "2025-05-29T09:30:00Z",
      },
    ];
    setNotifications(fetchedNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
      if (
        notifDropdownRef.current &&
        !notifDropdownRef.current.contains(event.target as Node)
      ) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isRead: true,
            }
          : n
      )
    );
  };

  
  const navLinks = [
    { path: "/", label: "Home" },
    ...(isAuthenticated ? [{ path: "/shows", label: "Browse Shows" }] : []),
    { path: "/bookings", label: "My Bookings" },
    ...(isAuthenticated && user?.role === "admin"
      ? [{ path: "/admin", label: "Admin Dashboard" }]
      : []),
    ...(!isAuthenticated ? [{ path: "/login", label: "Login" }] : []),
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-white"
          >
            <img
              src="/s-logo.png"
              alt="logo"
              className="h-10 w-10 mr-2 rounded-full"
              loading="lazy"
            />
            <span>Theatre Booking System</span>
          </Link>

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

            <div className="relative" ref={notifDropdownRef}>
              <button
                aria-label="Notifications"
                className="relative p-1 rounded-full text-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onClick={() => setNotifDropdownOpen((prev) => !prev)}
              >
                <BellIcon className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-gray-800 rounded-md shadow-lg py-2 z-30">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(({ id, message, isRead, createdAt }) => (
                      <div
                        key={id}
                        onClick={() => markAsRead(id)}
                        className={`px-4 py-2 cursor-pointer hover:bg-yellow-500 hover:text-gray-900 transition-colors duration-150 ${
                          isRead ? "text-gray-400" : "font-semibold text-white"
                        }`}
                        title={new Date(createdAt).toLocaleString()}
                      >
                        {message}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

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
              className="block px-3 py-2 rounded-md text-base font-medium bg-yellow-500 text-gray-900 hover:bg-yellow-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-500 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-yellow-500 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;