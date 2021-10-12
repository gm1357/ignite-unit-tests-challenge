import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticaUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    authenticaUserUseCase = new AuthenticateUserUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should throw IncorrectEmailOrPasswordError when email is not found", async () => {
    await expect(async () => {
      await authenticaUserUseCase.execute({
        email: "test@ignite.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should throw IncorrectEmailOrPasswordError when password doesn't match", async () => {
    const password = "12345";
    const newUser = await createUserUseCase.execute({
      email: 'test@ignite.com',
      name: 'test',
      password: password,
    });

    await expect(async () => {
      await authenticaUserUseCase.execute({
        email: newUser.email,
        password: password + "e",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should authenticate valid user", async () => {
    const password = "12345";
    const newUser = await createUserUseCase.execute({
      email: 'test@ignite.com',
      name: 'test',
      password: password,
    });

    const authResponse = await authenticaUserUseCase.execute({
      email: newUser.email,
      password: password,
    });

    expect(authResponse).toHaveProperty("token");
    expect(authResponse.user.id).toEqual(newUser.id);
  });
});
