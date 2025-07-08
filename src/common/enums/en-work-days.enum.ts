import { registerEnumType } from '@nestjs/graphql';

export enum EnWorkDays {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Sunday = 'Sunday',
  Saturday = 'Saturday'
}

registerEnumType(EnWorkDays, {
  name: 'EnWorkDays',
  description: 'Дни недели',
});