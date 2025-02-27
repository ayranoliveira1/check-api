import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repositry";

describe("check if the works", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "ayranoliveira1@gmail.com",
      password: "12345678",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "ayranoliveira1@gmail.com",
      password: "12345678",
    });

    const isPasswordCorrect = await compare("12345678", user.password_hash);

    expect(isPasswordCorrect).toBe(true);
  });

  it("should not be able to register witch same email twice", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "ayranoliveira1@gmail.com";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "12345678",
    });

    expect(async () => {
      await registerUseCase.execute({
        name: "John Doe",
        email,
        password: "12345678",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
