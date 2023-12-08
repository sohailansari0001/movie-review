import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";
import Container from "../Container";

const NotVerified = () => {
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;
  const isVerified = authInfo?.profile?.isVerified;

  const navigate = useNavigate();

  const navigateToVerification = () => {
    navigate("/auth/verification", { state: { user: authInfo?.profile } });
  };
  return (
    <div>
      {isLoggedIn && !isVerified ? (
        <p className=" text-lg text-center bg-blue-50 p-2 ">
          It looks like you haven&apos;t verified your account,{" "}
          <button
            onClick={navigateToVerification}
            className=" text-blue-500 font-semibold hover:underline duration-200 transition-all"
          >
            Click here to verify your account.
          </button>
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NotVerified;
