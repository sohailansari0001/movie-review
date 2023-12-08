import { createContext, useEffect, useState } from "react";
import { getIsAuth, signInUser } from "../api/auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: "",
};

const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });

    const { message, success, user } = await signInUser({ email, password });

    if (!success) {
      toast.error(message);
      return setAuthInfo({ ...authInfo, isPending: false, error: message });
    }

    navigate("/", { replace: true });

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      error: "",
      isLoggedIn: true,
    });
    toast.success("Logged in");

    localStorage.setItem("auth-token", user.token);
  };

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");

    if (!token) return;
    setAuthInfo({ ...authInfo, isPending: true });

    const { message, success, user } = await getIsAuth(token);

    if (!success) {
      toast.error(message);
      return setAuthInfo({ ...authInfo, isPending: false, error: message });
    }

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      error: "",
      isLoggedIn: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
    navigate("/auth/sign-in");
    toast.success("Logged Out");
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authInfo,
        handleLogin,
        handleLogout,
        isAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
