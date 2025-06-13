import { useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleClick = () => {
    
    setIsDarkMode((prev) => !prev);
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
    >
      {isDarkMode ? (
        <>
          <FiSun size={20} />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <FiMoon size={20} />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;