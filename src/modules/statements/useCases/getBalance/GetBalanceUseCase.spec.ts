import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementRepository,
      inMemoryUserRepository
    );
  });

  it("should throw GetBalanceError when user not found", async () => {
    await expect(
      () => getBalanceUseCase.execute({ user_id: "1"})
    ).rejects.toBeInstanceOf(GetBalanceError);
  });

  it("should get balance when providing valid user", async () => {
    const newUser = await inMemoryUserRepository.create({
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    });

    const response = await getBalanceUseCase.execute({ user_id: newUser.id! });

    expect(response).not.toBeUndefined();
    expect(response.balance).toEqual(0);
  });
});
