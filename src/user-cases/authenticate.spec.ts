import { expect, describe, it } from "vitest";
import { InMemoryUsersRepository } from "../repositories/in-memory/in-memory-users-repositry";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./erros/invalid-credentials-error";

describe("Authenticate use case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const autheticateUseCase = new AuthenticateUseCase(usersRepository);

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
    const usersRepository = new InMemoryUsersRepository();
    const autheticateUseCase = new AuthenticateUseCase(usersRepository);

    expect(async () => {
      await autheticateUseCase.execute({
        email: "ayranoliveira1@gmail.com",
        password: "12345678",
      });
    }).rejects.instanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrpong password", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const autheticateUseCase = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "John Doe",
      email: "ayranoliveira22@gmail.com",
      password_hash: await hash("12345678", 6),
    });

    expect(async () => {
      await autheticateUseCase.execute({
        email: "ayranoliveira1@gmail.com",
        password: "123456789",
      });
    }).rejects.instanceOf(InvalidCredentialsError);
  });
});
