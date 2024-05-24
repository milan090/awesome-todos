import { User } from "@prisma/client";
import prisma from "../utils/db";

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (
  email: string,
  hashedPassword: string
): Promise<User> => {
  return await prisma.user.create({
    data: {
      email,
      hashedPassword,
    },
  });
};
