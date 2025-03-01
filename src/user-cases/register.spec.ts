import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { UserAlreadyExistsError } from "./erros/user-already-exists-error";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repositry";

let usersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(usersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "ayranoliveira1@gmail.com",
      password: "12345678",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "ayranoliveira1@gmail.com",
      password: "12345678",
    });

    const isPasswordCorrect = await compare("12345678", user.password_hash);

    expect(isPasswordCorrect).toBe(true);
  });

  it("should not be able to register witch same email twice", async () => {
    const email = "ayranoliveira1@gmail.com";

    await registerUseCase.execute({
      name: "John Doe",
      email,
      password: "12345678",
    });

    await expect(async () => {
      await registerUseCase.execute({
        name: "John Doe",
        email,
        password: "12345678",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
