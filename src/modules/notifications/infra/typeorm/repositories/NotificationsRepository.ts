import { getMongoRepository, MongoRepository, Raw } from 'typeorm';

import IAppointmentsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class NotificationsRepository implements IAppointmentsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({ recipient_id, content }: ICreateNotificationDTO): Promise<Notification> {

    const notification = this.ormRepository.create({ recipient_id, content });

    await this.ormRepository.save(notification);

    return notification;

  }

}

export default NotificationsRepository;
