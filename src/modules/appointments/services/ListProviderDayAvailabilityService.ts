// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import 'reflect-metadata';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
};

type IResponse = Array<{
  hour: number;
  available: boolean;
}>

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) { };

  public async execute({ provider_id, month, year, day }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayByProvider({
      provider_id,
      month,
      year,
      day
    })

    const hourStart = 8;
    const currentDate = new Date(Date.now());

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(appointment =>
        getHours(appointment.date) === hour
      );

      const compareDate = new Date(year, month - 1, day, hour)

      return { hour: hour, available: !hasAppointmentInHour && isAfter(compareDate, currentDate) }
    })


    return availability;
  }
}

export default ListProviderDayAvailabilityService;
