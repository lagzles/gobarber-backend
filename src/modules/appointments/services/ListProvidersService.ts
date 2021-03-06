import 'reflect-metadata';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import { injectable, inject } from 'tsyringe';

interface IRequest {
  user_id: string;
};

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

  ) { };

  public async execute({ user_id }: IRequest): Promise<User[] | undefined> {
    const users = await this.usersRepository.findAllProviders({
      except_id: user_id
    });

    return users;
  }
}

export default ListProvidersService;
