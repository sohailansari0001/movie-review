import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

// icons
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ImSpinner3 } from "react-icons/im";

//components
import {
  Container,
  FormContainer,
  FormInput,
  Submit,
  Title,
} from "../../components";

import { commonModalClasses } from "../../utils/theme";
import { resetPassword, verifyPasswordResetToken } from "../../api/auth";

const ConfirmPassword = () => {
  // states
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [password, setPassword] = useState({
    one: "",
    two: "",
  });

  // params
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const id = searchParams.get("id");

  // navigate hook
  const navigate = useNavigate();

  // checking token is valid or not
  const isValidToken = async () => {
    const { success, message, valid } = await verifyPasswordResetToken(
      token,
      id
    );

    setIsVerifying(false);
    if (!success) {
      navigate("/auth/reset-password", { replace: true });
      return toast.error(message);
    }

    if (!valid) {
      setIsValid(false);
      return navigate("/auth/reset-password", { replace: true });
    }

    setIsValid(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.one.trim()) {
      return toast.error("Password is missing!");
    }

    if (password.one.trim().length < 6) {
      return toast.error("Password length must be atleast 6 characters long");
    }
    if (password.one !== password.two) {
      return toast.error("Passwords not matched!");
    }

    const { success, message } = await resetPassword({
      newPassword: password.one,
      token,
      userId: id,
    });

    if (!success) {
      return toast.error(message);
    }

    toast.success(message);

    navigate("/auth/sign-in", { replace: true });
  };

  // use Effect

  useEffect(() => {
    isValidToken();
  }, []);

  if (isVerifying)
    return (
      <FormContainer>
        <Container className={"flex gap-4 items-center"}>
          <h2 className="text-4xl font-semibold dark:text-white text-primary">
            Please wait we are verifying your token
          </h2>
          <ImSpinner3 className="animate-spin dark:text-white text-4xl text-primary" />
        </Container>
      </FormContainer>
    );

  if (!isValid)
    return (
      <FormContainer>
        <Container>
          <h2 className="text-4xl font-semibold dark:text-white text-primary">
            Sorry! Token is invalid.
          </h2>
        </Container>
      </FormContainer>
    );

  return (
    <FormContainer>
      <Container>
        <form
          className={` ${commonModalClasses} w-[460px] space-y-6`}
          onSubmit={handleSubmit}
        >
          <Title small={true}>Enter New Password</Title>

          <div className="flex flex-col gap-1 relative">
            <FormInput
              label={"New Password"}
              placeholder={"*******"}
              name={"one"}
              type={showPassword ? "text" : "password"}
              value={password.one}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[40px] z-[10] cursor-pointer"
            >
              {!showPassword ? (
                <AiOutlineEyeInvisible
                  fontSize={24}
                  className=" dark:text-dark-subtle"
                />
              ) : (
                <AiOutlineEye fontSize={24} className="dark:text-dark-subtle" />
              )}
            </span>
          </div>

          <div className="flex flex-col gap-1 relative">
            <FormInput
              label={"Confirm New Password"}
              placeholder={"*******"}
              name={"two"}
              type={confirmShowPassword ? "text" : "password"}
              value={password.two}
              onChange={handleChange}
              required
            />
            <span
              onClick={() => setConfirmShowPassword((prev) => !prev)}
              className="absolute right-3 top-[40px] z-[10] cursor-pointer"
            >
              {!confirmShowPassword ? (
                <AiOutlineEyeInvisible
                  fontSize={24}
                  className=" dark:text-dark-subtle"
                />
              ) : (
                <AiOutlineEye fontSize={24} className="dark:text-dark-subtle" />
              )}
            </span>
          </div>
          <Submit value={"Change Password"} />
        </form>
      </Container>
    </FormContainer>
  );
};

export default ConfirmPassword;
