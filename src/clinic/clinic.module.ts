// clinic.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Clinic } from './clinic.entity';
import { ClinicService } from './clinic.service';
import { ClinicResolver } from './clinic.resolver';
import { Doctor } from '../doctor/doctor.entity';
import { Service } from '../service/service.entity';
import { ClinicNetwork } from './clinic-network.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Clinic, Doctor, Service, ClinicNetwork])],
  providers: [ClinicService, ClinicResolver],
})
export class ClinicModule {}