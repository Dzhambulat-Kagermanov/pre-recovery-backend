import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service.entity';
import { ServiceService } from './service.service';
import { ServiceResolver } from './service.resolver';
import { Clinic } from '../clinic/clinic.entity';
import { Doctor } from '../doctor/doctor.entity'; // Добавляем импорт

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Clinic, Doctor]), // Добавляем Doctor
  ],
  providers: [ServiceService, ServiceResolver],
})
export class ServiceModule {}