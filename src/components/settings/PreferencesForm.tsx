import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function PreferencesForm() {
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    toast.success("Preferences saved successfully!");
  };

  return (
    <>
      
      <Toaster position="top-right" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gray-100 p-6 rounded-lg   shadow-md max-w-md  "
      >
        <label className="flex items-center gap-3 text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          Enable Email Notifications
        </label>

        <label className="block text-gray-700 font-medium">
          Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="mt-1 block  rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
          </select>
        </label>

        <button
          type="submit"
          className="w-60 bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors"
        >
          Save Preferences
        </button>
      </form>
    </>
  );
}

export default PreferencesForm;