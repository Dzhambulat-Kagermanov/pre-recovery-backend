import { registerEnumType } from '@nestjs/graphql';

export enum EnPayType {
  online = 'online',         // Онлайн
  cashier = 'cashier',       // В Кассу
  doctor = 'doctor',         // Доктору
  installments = 'installments', // В Рассрочку
  credit = 'credit',         // Кредит
}

registerEnumType(EnPayType, {
  name: 'EnPayType',
  description: 'Тип оплаты',
});