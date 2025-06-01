import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function AccountDeletion() {
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/account/delete", {
        method: "POST",  
        headers: {
          "Content-Type": "application/json",
        
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete account.");
      }

      toast.success("Account deleted successfully.");
 
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-4 bg-gray-100 p-6 rounded-lg shadow max-w-md  ">
        <p className="text-red-600 font-semibold">
          Warning: Deleting your account is irreversible. All your data will be lost.
        </p>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <input
          type="text"
          placeholder='Type "DELETE" to confirm'
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={handleDelete}
          className={`w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </>
  );
}

export default AccountDeletion;
