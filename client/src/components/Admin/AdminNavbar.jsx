import { Link, NavLink } from "react-router-dom";

// icons
import { AiOutlineHome } from "react-icons/ai";
import { BiMoviePlay } from "react-icons/bi";
import { FaUserNinja } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

// hook
import { useAuth } from "../../hooks";

const AdminNavbar = () => {
  // using auth hook for handling logout
  const { handleLogout } = useAuth();

  return (
    <nav className=" w-48 min-h-screen bg-secondary border-r border-green-300 ">
      <div className="flex flex-col justify-between items-center  sticky top-0 h-screen">
        <ul className="">
          <li className=" mb-8">
            <Link to={"/"}>
              <img src={"/logo.png"} alt="logo" className="h-14 p-2" />
            </Link>
          </li>

          <li className="">
            <NavItem to={"/"}>
              <AiOutlineHome />
              <span>Home</span>
            </NavItem>
          </li>
          <li>
            <NavItem to={"/movies"}>
              <BiMoviePlay />
              <span>Movies</span>
            </NavItem>
          </li>
          <li>
            <NavItem to={"/actors"}>
              <FaUserNinja />
              <span>Actors</span>
            </NavItem>
          </li>
        </ul>

        <div className=" flex flex-col items-center pb-5 gap-2 justify-center ">
          <span className=" font-semibold text-white text-xl">Admin</span>
          <button
            onClick={handleLogout}
            className=" flex items-center gap-2 text-dark-subtle text-md font-semibold hover:text-white transition-all duration-200"
          >
            <FiLogOut />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ to, children }) => {
  const commonClasses =
    " flex items-center text-lg font-semibold space-x-2 p-2 hover:opacity-80 duration-200 transition-all";

  return (
    <NavLink
      className={({ isActive }) =>
        (isActive ? "text-white" : "text-gray-400") + commonClasses
      }
      to={to}
    >
      {children}
    </NavLink>
  );
};

export default AdminNavbar;
