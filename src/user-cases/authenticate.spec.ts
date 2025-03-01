import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repositry";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let autheticateUseCase: AuthenticateUseCase;

describe("Authenticate use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    autheticateUseCase = new AuthenticateUseCase(usersRepository);
  });

  it("should be able to authenticate", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "ayranoliveira1@gmail.com",
      password_hash: await hash("12345678", 6),
    });

    const { user } = await autheticateUseCase.execute({
      email: "ayranoliveira1@gmail.com",
      password: "12345678",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrpong email", async () => {
    await expect(async () => {
      await autheticateUseCase.execute({
        email: "ayranoliveira1@gmail.com",
        password: "12345678",
      });
    }).rejects.instanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrpong password", async () => {
    await usersRepository.create({
      name: "John Doe",
      email: "ayranoliveira22@gmail.com",
      password_hash: await hash("12345678", 6),
    });

    await expect(async () => {
      await autheticateUseCase.execute({
        email: "ayranoliveira1@gmail.com",
        password: "123456789",
      });
    }).rejects.instanceOf(InvalidCredentialsError);
  });
});
