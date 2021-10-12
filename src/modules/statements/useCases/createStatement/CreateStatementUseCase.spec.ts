import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUserRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    inMemoryUserRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository,
    );
  });

  it("should throw CreateStatementError.UserNotFound when user not found", async () => {
    const request: ICreateStatementDTO = {
      amount: 1,
      description: "test",
      type: "deposit" as any,
      user_id: "1",
    };

    await expect(
      async () => await createStatementUseCase.execute(request)
    ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should throw CreateStatementError.InsufficientFunds when trying to withdraw more than what's in balance", async () => {
    const newUser = await inMemoryUserRepository.create({
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    });
    const request: ICreateStatementDTO = {
      amount: 100,
      description: "test",
      type: "withdraw" as any,
      user_id: newUser.id!,
    };

    await expect(
      async () => await createStatementUseCase.execute(request)
    ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should create new statement when using valid data", async () => {
    const amount = 100;
    const newUser = await inMemoryUserRepository.create({
      email: 'test@ignite.com',
      name: 'test',
      password: '12345',
    });
    const request: ICreateStatementDTO = {
      amount: amount,
      description: "test",
      type: "deposit" as any,
      user_id: newUser.id!,
    };

    const statement = await createStatementUseCase.execute(request);

    expect(statement).toHaveProperty("id");
    expect(statement.user_id).toEqual(newUser.id);
    expect(statement.amount).toEqual(amount);
  });
});
