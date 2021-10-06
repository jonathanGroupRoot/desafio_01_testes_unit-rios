import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUserRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
  });

  it('should be able list all user', async () => {
    const user: ICreateUserDTO = {
      name: 'Jonathan vinicius',
      email: 'jonathangrouproot@gmail.com',
      password: '221212'
    }

    const userCreate = await createUserUseCase.execute(user);


    const userReturn = await showUserProfileUseCase.execute(userCreate.id);

    expect(userReturn).toHaveProperty('id');
    expect(userReturn).toHaveProperty('email');
  });

  it("Should not be able to return a non existent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("fake_id");
    }).rejects.toBeInstanceOf(AppError);
  });
});
