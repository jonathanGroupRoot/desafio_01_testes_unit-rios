import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository
let createUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able sessions', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'Jonathan vinicius',
      email: 'jonathangrouproot@gmail.com',
      password: '123',
    });

    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('password');
  });

  it('should not be able to create more than one user with the same email', async () => {
    expect(async () => {
      const user = {
        name: 'Jonathan vinicius braz silva',
        email: 'jonathangrouproot1@gmail.com',
        password: '123',
      }
      await createUseCase.execute(user);

      await createUseCase.execute(user);
  
    }).rejects.toEqual(new CreateUserError())
  });
});
