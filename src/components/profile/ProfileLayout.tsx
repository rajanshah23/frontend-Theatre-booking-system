import { Link, Outlet, useLocation } from "react-router-dom";

const ProfileLayout = () => {
  const { pathname } = useLocation();

  const linkClass = (path: string) =>
    `block px-4 py-2 rounded hover:bg-yellow-300 ${
      pathname === path ? "bg-yellow-300 font-semibold" : "text-black-700"
    }`;

  return (
    <div className="max-w-6xl mx-auto px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-7">
      <aside className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-bold mb-8">My Account</h2>
        <nav className="space-y-2">
          <Link to="/profile" className={linkClass("/profile")}>
            {" "}
            Profile Info
          </Link>
          <Link
            to="/profile/booking-history"
            className={linkClass("/profile/booking-history")}
          >
            Booking History
          </Link>
          <Link
            to="/profile/change-password"
            className={linkClass("/profile/change-password")}
          >
            Change Password
          </Link>

          <Link to="/profile/update" className={linkClass("/profile/update")}>
            Update Profile
          </Link>
        </nav>
      </aside>

      <section className="md:col-span-3 bg-white p-4 rounded-lg shadow-md">
        <Outlet />
      </section>
    </div>
  );
};

export default ProfileLayout;
