// services/userService.js
import { prisma } from '../database/database.js';

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      avatarUrl: true,
      status: true
    }
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      bio: true,
      avatarUrl: true,
      status: true
    }
  });
};

export const createUser = async (userData) => {
  // This is mostly handled by authController now, but kept for admin/internal usage if needed
  return await prisma.user.create({
    data: userData
  });
};
