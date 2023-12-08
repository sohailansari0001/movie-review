import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { commonModalClasses } from "../../utils/theme";
import { createUser } from "../../api/auth";

import {
  Container,
  CustomLink,
  FormContainer,
  FormInput,
  Submit,
  Title,
} from "../../components";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks";
import { isValidEmail } from "../../utils/helper";

const validateUserInfo = ({ name, email, password }) => {
  const isValidName = /^[a-z A-Z]+$/;

  if (!name.trim()) {
    return { ok: false, error: "Name is missing" };
  }

  if (!isValidName.test(name)) {
    return { ok: false, error: "Invalid name!" };
  }

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

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { name, email, password } = userInfo;

  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

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

    const response = await createUser(userInfo);

    if (response.message) {
      return toast.error(response.message);
    }

    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });

    toast.success("For verificaion, Email is sent to your email.");
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses}>
          <Title>Sign Up</Title>
          <FormInput
            label={"Name"}
            placeholder={"John Doe"}
            name={"name"}
            type="text"
            value={name}
            onChange={handleChange}
          />
          <FormInput
            label={"Email"}
            placeholder={"xyz@example.com"}
            name={"email"}
            type="email"
            value={email}
            onChange={handleChange}
          />
          <div className=" relative">
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
          </div>
          <Submit value={"Sign Up"} />

          <div className=" flex items-center justify-center dark:text-dark-subtle">
            <p className="flex gap-2">
              Already a user?
              <CustomLink to={"/auth/sign-in"} className="hover:underline">
                Sign In
              </CustomLink>
            </p>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default SignUp;
