import authConfig from '../../../../config/auth';
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError';

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserCase: CreateUserUseCase;
let userAuthenticateUseCase: AuthenticateUserUseCase;

describe('Authenticate users', () => {
  beforeEach(() => {
    authConfig.jwt.secret = "335cd5e290807fd304c6b635e7cb0c5c";
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserCase = new CreateUserUseCase(inMemoryUsersRepository);
    userAuthenticateUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able authenticate', async () => {
    const user: ICreateUserDTO = {
      name: "Test User",
      email: "test@mail.com",
      password: "1234",
    }
    await createUserCase.execute(user);

    const auth = await userAuthenticateUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(auth.user).toHaveProperty('email');
    expect(auth).toHaveProperty('token')
  });

  it('not should be able authenticate user', async () => {
    expect(async () => {
      await userAuthenticateUseCase.execute({
        email: 'jonathantoot@gmail.com',
        password: '2121',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
