import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
  });

  it("should throw ShowUserProfileError when user not found", async () => {
    await expect(
      () => showUserProfileUseCase.execute("12345")
    ).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  it("should return the user that was found", async () => {
    const createdUser = await inMemoryUserRepository.create({
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    });

    const retrievedUser = await showUserProfileUseCase.execute(createdUser.id!);

    expect(createdUser.id).toEqual(retrievedUser.id);
  });
});
