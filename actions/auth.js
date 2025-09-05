"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const signUp = async (params) => {
  const { fullName, email, username, password } = params;

  if (!email || !username || !password) {
    return { success: false, error: "Incomplete data" };
  }
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashesdPass = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        passwordHash: hashesdPass,
        email: email,
        fullName,
      },
    });

    await signInWithCredentials({ email, password });

    return { success: true, data: newUser };
  } catch (error) {
    console.log(error);
  }
};

export const signInWithCredentials = async (params) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.log(error, "Sign in error");
    return { success: false, error: "Signin Error" };
  }
};
