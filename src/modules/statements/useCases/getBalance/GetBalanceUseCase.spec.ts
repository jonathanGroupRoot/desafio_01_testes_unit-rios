import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { OperationType } from "../createStatement/CreateStatementController";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get balance", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able get the balance from an user account", async () => {
    const user: ICreateUserDTO = {
      name: "Test User",
      email: "test@mail.com",
      password: "1234",
    };

    const user_id = <string>(await createUserUseCase.execute(user)).id;

    await createStatementUseCase.execute({
      user_id,
      type: "deposit" as OperationType,
      amount: 100,
      description: "Deposit test",
    });

    const balance = await getBalanceUseCase.execute({ user_id });

    expect(balance).toHaveProperty("balance", 100);
    expect(balance).toHaveProperty("statement");
    expect(balance.statement[0].amount).toBe(100);
    expect(balance.statement[0].description).toBe("Deposit test");
  });

  it("Should not be able get the balance from an unexistent user account", async () => {
    expect(async () => {
      const user_id = "fake_user_id";

      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(AppError);
  });
});
