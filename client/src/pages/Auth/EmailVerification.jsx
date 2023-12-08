import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Container, FormContainer, Submit, Title } from "../../components";
import { commonModalClasses } from "../../utils/theme";
import { resendEmailVerificationToken, verifyUserEmail } from "../../api/auth";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks";

const OTP_LENGTH = 6;
let currentOTPIndex;

const isValidElementOTP = (otp) => {
  let valid = false;

  for (let val of otp) {
    valid = !isNaN(parseInt(val));

    if (!valid) {
      break;
    }
  }

  return valid;
};

const EmailVerification = () => {
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

  const { isAuth, authInfo } = useAuth();
  const { isLoggedIn, profile } = authInfo;
  const isVerified = profile?.isVerified;

  const navigate = useNavigate();

  const inputRef = useRef();

  const { state } = useLocation();
  const user = state.user;

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const focusNextInputField = (index) => {
    setActiveOtpIndex(index + 1);
  };

  const focusPrevInputField = (index) => {
    let nextIndex;
    const diff = index - 1;
    nextIndex = diff !== 0 ? diff : 0;

    setActiveOtpIndex(nextIndex);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;

    const newOtp = [...otp];
    newOtp[currentOTPIndex] = value.substring(value.length - 1, value.length);

    if (!value) {
      focusPrevInputField(currentOTPIndex);
    } else {
      focusNextInputField(currentOTPIndex);
    }
    setOtp([...newOtp]);
  };

  const handleKeyDown = ({ key }, index) => {
    currentOTPIndex = index;
    if (key === "Backspace") {
      focusPrevInputField(currentOTPIndex);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidElementOTP(otp)) {
      return toast.error("Invalid OTP");
    }

    const {
      success,
      message,
      user: userResponse,
    } = await verifyUserEmail({
      OTP: otp.join(""),
      userId: user.id,
    });

    if (!success) {
      return toast.error(message);
    }

    toast.success(message);

    localStorage.setItem("auth-token", userResponse.token);
    isAuth();
  };

  const handleOTPResend = async () => {
    const { success, message } = await resendEmailVerificationToken(user.id);

    if (!success) {
      return toast.error(message);
    }

    toast.success(message);
  };

  useEffect(() => {
    if (!user) {
      navigate("/not-found");
    }
    if (isLoggedIn && isVerified) {
      navigate("/");
    }
  }, [user, isLoggedIn, isVerified]);

  return (
    <FormContainer>
      <Container>
        <form
          onSubmit={handleSubmit}
          className={`${commonModalClasses} py-8 space-y-7 text-center w-max `}
        >
          <div className="flex flex-col gap-2">
            <Title small={true}>
              Please Enter the OTP to verify your account
            </Title>
            <p className=" text-center dark:text-dark-subtle text-light-subtle">
              OTP has been sent to your email
            </p>
          </div>

          <div className=" space-x-4">
            {otp.map((_, index) => {
              return (
                <input
                  key={index}
                  type="number"
                  value={otp[index] || ""}
                  ref={activeOtpIndex === index ? inputRef : null}
                  onChange={handleOtpChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 rounded-md border-2 dark:border-dark-subtle border-light-subtle font-semibold dark:focus:border-white focus:border-primary  bg-transparent outline-none text-center dark:text-white text-primary text-xl spin-button-none"
                />
              );
            })}
          </div>

          <div className="">
            <Submit value={"Verify Account"} />
            <button
              type="button"
              onClick={handleOTPResend}
              className=" dark:text-white text-blue-500 hover:underline mt-4"
            >
              I don&apos;t have OTP
            </button>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default EmailVerification;
