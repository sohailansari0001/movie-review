import { Navbar } from "./components";
import { Routes, Route } from "react-router-dom";
import {
  ConfirmPassword,
  EmailVerification,
  ForgetPassword,
  Home,
  MovieReviews,
  NotFound,
  SearchMovieUser,
  SignIn,
  SignUp,
  SingleMovie,
} from "./pages";
import { useAuth } from "./hooks";
import AdminNavigator from "./navigator/AdminNavigator";

const App = () => {
  const { authInfo } = useAuth();

  const isAdmin = authInfo?.profile?.role === "admin";

  if (isAdmin) return <AdminNavigator />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/sign-in" element={<SignIn />} />
        <Route path="/auth/sign-up" element={<SignUp />} />
        <Route path="/auth/verification" element={<EmailVerification />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/reset-password" element={<ConfirmPassword />} />
        <Route path="/movie/:movieId" element={<SingleMovie />} />
        <Route path="/movie/reviews/:movieId" element={<MovieReviews />} />
        <Route path="/movie/search" element={<SearchMovieUser />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
