import { ObjectID } from 'mongodb';

import IAppointmentsRepository from "@modules/notifications/repositories/INotificationsRepository";
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

class FakeNotificationsRepository implements IAppointmentsRepository {
  private notifications: Notification[] = [];

  public async create({ recipient_id, content }: ICreateNotificationDTO): Promise<Notification> {

    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), recipient_id, content });

    await this.notifications.push(notification);

    return notification;

  }

}

export default FakeNotificationsRepository;
