import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Clinic } from '../clinic/clinic.entity';
import { Service } from '../service/service.entity';
import { JoinTable } from 'typeorm';
import { EnConsultationType } from '../common/enums/en-consultation-type.enum';
import { EnWorkDays } from '../common/enums/en-work-days.enum';
import { WorkDay } from '../common/work-day.entity';

@ObjectType()
@Entity()
export class Doctor {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  speciality: string;

  @Field(() => EnConsultationType)
  @Column({type: 'enum', enum: EnConsultationType})
  consultationType: EnConsultationType;

  @Field()
  @Column()
  experience: string;

  @Field(() => [EnWorkDays])
  @Column('text', { array: true })
  workDays: EnWorkDays[];

  @Field(() => WorkDay)
  @Column('jsonb')
  workTime: {
    Monday?: [number, number] | null;
    Tuesday?: [number, number] | null;
    Wednesday?: [number, number] | null;
    Thursday?: [number, number] | null;
    Friday?: [number, number] | null;
    Saturday?: [number, number] | null;
    Sunday?: [number, number] | null;
  };

  @Field(() => Clinic)
  @ManyToOne(() => Clinic, clinic => clinic.doctors)
  clinic: Clinic;

  @Field(() => [Service], { nullable: true })
  @ManyToMany(() => Service, service => service.doctors)
  @JoinTable()
  services: Service[];
}