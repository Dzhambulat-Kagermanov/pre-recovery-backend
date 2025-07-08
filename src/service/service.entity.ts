import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Clinic } from '../clinic/clinic.entity';
import { EnPayType } from '../common/enums/en-pay-type.enum';
import { Doctor } from '../doctor/doctor.entity';

@ObjectType()
@Entity()
export class Service {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  category: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  consultationType?: string;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  price: string;

  @Field(() => [EnPayType], { nullable: true })
  @Column({ type: 'enum', enum: EnPayType, array: true, nullable: true })
  payTypes?: EnPayType[];

  @Field()
  @Column()
  duration: string;

  @Field(() => Clinic)
  @ManyToOne(() => Clinic, clinic => clinic.services)
  clinic: Clinic;

  @Field(() => [Doctor], { nullable: true })
  @ManyToMany(() => Doctor, doctor => doctor.services)
  doctors: Doctor[];
}