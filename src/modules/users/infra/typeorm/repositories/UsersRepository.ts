import { EntityRepository, getRepository, Repository } from 'typeorm';

import IUsersRepository from "@modules/users/repositories/IUsersRepositories";
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '@modules/users/infra/typeorm/entities/User';

// @EntityRepository(Appointment)
class UsersRepository implements IUsersRepository {
  // TYPEORM possui um metodo proprio de pegar todos
  // public all(): Appointment[] {
  //   return this.appointments;
  // }

  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;

  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ where: { email } });

    return user;
  }


  public async create({ name, email, password }: ICreateUserDTO): Promise<User> {

    const user = this.ormRepository.create({ name, email, password });

    await this.ormRepository.save(user);

    return user;

  }

  public async save(user: User): Promise<User> {
    return await this.ormRepository.save(user);
  }

}

export default UsersRepository;