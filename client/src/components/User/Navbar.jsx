import { BsFillSunFill } from "react-icons/bs";
import Container from "../Container";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import SearchForm from "../Form/SearchForm";

const Navbar = () => {
  const { toggleTheme } = useTheme();
  const { authInfo, handleLogout } = useAuth();

  const { isLoggedIn, profile } = authInfo;
  const name = profile?.name?.split(" ")[0];

  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    navigate(`/movie/search?title=${query}`);
  };

  return (
    <div className=" bg-secondary shadow-md z-10 w-full shadow-gray-500 fixed top-0">
      <Container className="p-3">
        <div className="flex justify-between  gap-5 items-center">
          <Link to={"/"}>
            <img src="/logo.png" alt="logo" className=" sm:h-10 h-8" />
          </Link>
          <ul className="flex items-center sm:space-x-6 gap-2">
            <li>
              <button
                onClick={toggleTheme}
                className=" dark:bg-white bg-dark-subtle p-1 rounded"
              >
                <BsFillSunFill size={24} className="text-secondary" />
              </button>
            </li>
            <li>
              <SearchForm
                placeholder={"Search..."}
                className={
                  "border-dark-subtle text-xl focus:border-white text-white sm:w-[250px] w-[200px] sm:block hidden"
                }
                onSubmit={handleSearchSubmit}
              />
            </li>
            <li className=" font-semibold text-xl flex gap-5 items-center">
              {isLoggedIn ? (
                <>
                  <p className={"text-white sm:block hidden"}>{name}</p>
                  <button
                    onClick={() => {
                      handleLogout();
                      navigate("/auth/sign-in");
                    }}
                    className={
                      "text-white hover:text-dark-subtle transition-all duration-200 cursor-pointer"
                    }
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={"/auth/sign-in"}
                    className={
                      "text-white hover:text-dark-subtle transition-all duration-200"
                    }
                  >
                    Login
                  </Link>
                  <Link
                    to={"/auth/sign-up"}
                    className={
                      "text-white hover:text-dark-subtle transition-all duration-200 sm:block hidden"
                    }
                  >
                    Sign up
                  </Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
