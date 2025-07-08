import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';
import { Service } from '../service/service.entity';
import { WorkDay } from '../common/work-day.entity';
import { ClinicNetwork } from './clinic-network.entity';

@ObjectType()
@Entity()
export class Clinic {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  clinicWorkBegin: string;

  @Field()
  @Column()
  square: number;

  @Field()
  @Column()
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  reportPhone?: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  address: string;

  @Field()
  @Column()
  floorCount: number;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasComputer: boolean;

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasInternet: boolean;

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

  @Field(() => [String])
  @Column('text', { array: true })
  languages: string[];

  @Field(() => [String])
  @Column('jsonb', { nullable: true })
  mediaFiles: string[];

  @Field({ defaultValue: false })
  @Column({ default: false })
  hasElevator: boolean;

  // Связь с клиники с сетью клиник
  @Field(() => [ClinicNetwork], { nullable: true })
  @ManyToMany(() => ClinicNetwork, (network) => network.clinics)
  networks: ClinicNetwork[];

  // Вычисляемое поле для получения клиник из сети (исключая текущую)
  @Field(() => [Clinic], { nullable: true })
  get clinicsNet(): Clinic[] {
    if (!this.networks || this.networks.length === 0) return [];

    // Собираем все клиники из всех сетей текущей клиники
    const allClinics = this.networks.flatMap((network) => network.clinics);

    // Удаляем дубликаты и текущую клинику
    const uniqueClinics = allClinics.filter(
      (clinic, index, self) =>
        clinic.id !== this.id &&
        self.findIndex((c) => c.id === clinic.id) === index,
    );

    return uniqueClinics;
  }

  @Field(() => [Doctor], { nullable: true }) // Добавлено
  @OneToMany(() => Doctor, (doctor) => doctor.clinic, { cascade: true })
  doctors: Doctor[];

  @Field(() => [Service], { nullable: true }) // Добавлено
  @OneToMany(() => Service, (service) => service.clinic, { cascade: true })
  services: Service[];

  // Вычисляемое поле - количество уникальных категорий услуг
  @Field(() => Int)
  get categoriesQnt(): number {
    if (!this.services) return 0;
    const uniqueCategories = new Set(this.services.map((s) => s.category));
    return uniqueCategories.size;
  }

  // Вычисляемое поле - количество услуг
  @Field(() => Int)
  get servicesQnt(): number {
    return this.services?.length || 0;
  }

  // Вычисляемое поле - количество докторов
  @Field(() => Int)
  get doctorsQnt(): number {
    return this.doctors?.length || 0;
  }
}
