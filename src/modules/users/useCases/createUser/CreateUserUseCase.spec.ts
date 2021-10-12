import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it("should throw CreateUserError when trying to create new user with already existing email", async ()  => {
    const firstUser = {
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    };
    await inMemoryUserRepository.create(firstUser);

    await expect(
      () => createUserUseCase.execute(firstUser)
    ).rejects.toBeInstanceOf(CreateUserError);
  });

  it("should create new User", async ()  => {
    const newUser = await createUserUseCase.execute({
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    });

    expect(newUser).toHaveProperty("id");
    expect(newUser.email).toEqual("test@ignite.com");
  });
});
