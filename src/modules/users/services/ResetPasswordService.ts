import { sign } from 'jsonwebtoken';
import AppError from '@shared/errors/AppError';
import { isAfter, addHours } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

// interface IResponse {
//   user: User;
//   token: string;
// }

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

  ) { }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token is not valid')
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User is not valid')
    }

    const tokenCreatedAt = userToken.created_at;
    const comparedDate = addHours(tokenCreatedAt, 2)

    if (isAfter(Date.now(), comparedDate)) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);

  }
}

export default ResetPasswordService;