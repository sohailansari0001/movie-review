import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import toast from "react-hot-toast";

import {
  Container,
  CustomLink,
  FormContainer,
  FormInput,
  Submit,
  Title,
} from "../../components";

import { commonModalClasses } from "../../utils/theme";
import { useAuth } from "../../hooks";
import { isValidEmail } from "../../utils/helper";

const validateUserInfo = ({ email, password }) => {
  if (!email.trim()) {
    return { ok: false, error: "Email is missing" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Invalid email!" };
  }

  if (!password.trim()) {
    return { ok: false, error: "Password is missing" };
  }

  if (password.length < 6) {
    return { ok: false, error: "Password must be atleast 6 characters long" };
  }

  return { ok: true, error: "" };
};

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const { email, password } = userInfo;

  const { handleLogin, authInfo } = useAuth();

  const { isPending, isLoggedIn } = authInfo;

  const handleChange = (e) => {
    const { value, name } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) {
      return toast.error(error);
    }

    handleLogin(email, password);
  };

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     navigate("/");
  //   }
  // }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <Title>Sign In</Title>
          <FormInput
            label={"Email"}
            placeholder={"xyz@example.com"}
            name={"email"}
            type="email"
            value={email}
            onChange={handleChange}
          />
          <div className="flex flex-col gap-1 relative">
            <FormInput
              label={"Password"}
              placeholder={"*******"}
              name={"password"}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handleChange}
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
            <CustomLink
              to={"/auth/forget-password"}
              className=" flex justify-end items-center text-sm"
            >
              Forgot Password?
            </CustomLink>
          </div>
          <Submit value={"Sign In"} busy={isPending} />

          <div className=" flex items-center justify-center dark:text-dark-subtle">
            <p className="flex gap-2">
              Don&apos;t have an account?
              <CustomLink to={"/auth/sign-up"} className=" hover:underline">
                Sign Up
              </CustomLink>
            </p>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default SignIn;
