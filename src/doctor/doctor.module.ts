import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';
import { Clinic } from '../clinic/clinic.entity';
import { Service } from '../service/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor, Clinic, Service])],
  providers: [DoctorService, DoctorResolver],
})
export class DoctorModule {}