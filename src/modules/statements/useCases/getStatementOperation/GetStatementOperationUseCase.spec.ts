import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository,
    );
  });

  it("should throw GetStatementOperationError.UserNotFound when user not found", async () => {
    await expect(async () =>
      await getStatementOperationUseCase.execute({
        user_id: "1",
        statement_id: "2",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should throw GetStatementOperationError.StatementNotFound when statement not found", async () => {
    const newUser = await inMemoryUserRepository.create({
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    });

    await expect(async () =>
      await getStatementOperationUseCase.execute({
        user_id: newUser.id!,
        statement_id: "2",
      })
    ).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });

  it("should get statement when valid", async () => {
    const newUser = await inMemoryUserRepository.create({
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    });

    const newStatement = await inMemoryStatementRepository.create({
      amount: 1,
      description: "test",
      type: "deposit" as any,
      user_id: newUser.id!,
    })

    const retrievedStatement = await getStatementOperationUseCase.execute({
      user_id: newUser.id!,
      statement_id: newStatement.id!,
    });

    expect(retrievedStatement.id).toEqual(newStatement.id);
  });
});
