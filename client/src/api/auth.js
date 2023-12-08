import { catchError } from "../utils/helper";
import client from "./client";

export const createUser = async (userInfo) => {
  try {
    const { data } = await client.post("/user/create", userInfo);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const verifyUserEmail = async (userInfo) => {
  try {
    const { data } = await client.post("/user/verify-email", userInfo);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const signInUser = async (userInfo) => {
  try {
    const { data } = await client.post("/user/sign-in", userInfo);

    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const getIsAuth = async (token) => {
  try {
    const { data } = await client.get("/user/is-auth", {
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
      },
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

// Forget password api
export const forgetPassword = async (email) => {
  try {
    const { data } = await client.post("/user/forget-password", { email });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const verifyPasswordResetToken = async (token, userId) => {
  try {
    const { data } = await client.post("/user/verify-pass-reset-token", {
      token,
      userId,
    });
    return data;
  } catch (error) {
    return catchError(error);
  }
};

// reset password
export const resetPassword = async (passwordInfo) => {
  try {
    const { data } = await client.post("/user/reset-password", passwordInfo);
    return data;
  } catch (error) {
    return catchError(error);
  }
};

export const resendEmailVerificationToken = async (userId) => {
  try {
    const { data } = await client.post(
      "/user/resend-email-verification-token",
      { userId }
    );
    return data;
  } catch (error) {
    return catchError(error);
  }
};
