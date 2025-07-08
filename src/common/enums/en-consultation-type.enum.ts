import { registerEnumType } from '@nestjs/graphql';

export enum EnConsultationType {
  online = 'online',         // Онлайн
  offline = 'offline',       // В Кассу
}

registerEnumType(EnConsultationType, {
  name: 'EnConsultationType',
  description: 'Тип консультации',
});