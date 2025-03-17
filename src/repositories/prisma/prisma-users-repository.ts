import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";
import { UsersRepository } from "../user-repository";

export class PrismaUsersReposity implements UsersRepository {
  findById(id: string) {
    const user = prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    });

    return user;
  }
}
