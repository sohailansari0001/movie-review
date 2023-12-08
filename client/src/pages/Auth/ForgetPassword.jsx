import { useState } from "react";
import {
  Container,
  CustomLink,
  FormContainer,
  FormInput,
  Submit,
  Title,
} from "../../components";
import { commonModalClasses } from "../../utils/theme";
import toast from "react-hot-toast";
import { forgetPassword } from "../../api/auth";
import { isValidEmail } from "../../utils/helper";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    const { value } = e.target;

    setEmail(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      return toast.error("Invalid Email");
    }

    const { success, message } = await forgetPassword(email);

    if (!success) {
      return toast.error(message);
    }

    toast.success(message);
  };

  return (
    <FormContainer>
      <Container>
        <form
          onSubmit={handleSubmit}
          className={`${commonModalClasses}  w-[460px] space-y-6`}
        >
          <Title small={true}>Please Enter Your Email</Title>
          <FormInput
            label={"Email"}
            placeholder={"xyz@example.com"}
            name={"email"}
            type="email"
            value={email}
            onChange={handleChange}
          />

          <Submit value={"Send Link"} />

          <div className=" flex items-center justify-between text-dark-subtle">
            <p className="flex gap-2">
              <CustomLink to={"/auth/sign-up"} className=" hover:underline">
                Sign Up
              </CustomLink>
            </p>
            <p className="flex gap-2">
              <CustomLink to={"/auth/sign-in"} className=" hover:underline">
                Sign in
              </CustomLink>
            </p>
          </div>
        </form>
      </Container>
    </FormContainer>
  );
};

export default ForgetPassword;
