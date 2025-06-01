import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import PreferencesForm from "./PreferencesForm";
import AccountDeletion from "./AccountDeletion";

type Tab = "theme" | "preferences" | "accountDeletion";

function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>("theme");

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

   
      <div className="flex space-x-4 border-b mb-6">
        {[
          { id: "theme", label: "Theme" },
          { id: "preferences", label: "Preferences" },
          { id: "accountDeletion", label: "Account Deletion" },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as Tab)}
            className={`pb-2 text-sm font-medium ${
              activeTab === id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
 
      <div>
        {activeTab === "theme" && (
          <section className="space-y-5">
            <h2 className="text-lg font-bold mb-2">Theme</h2>
            <ThemeToggle />
          </section>
        )}

        {activeTab === "preferences" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold mb-2">Preferences</h2>
            <PreferencesForm />
          </section>
        )}

        {activeTab === "accountDeletion" && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold mb-2 text-red-600">Account Deletion</h2>
            <AccountDeletion />
          </section>
        )}
      </div>
    </div>
  );
}

export default Settings;
