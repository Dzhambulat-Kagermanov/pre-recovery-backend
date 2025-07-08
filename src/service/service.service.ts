import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Service } from './service.entity';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { Clinic } from '../clinic/clinic.entity';
import { Doctor } from 'src/doctor/doctor.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
    @InjectRepository(Doctor) // Добавлено
    private doctorRepository: Repository<Doctor>, // Добавлено
  ) {}

  async findAll(
    take?: number,
    skip?: number,
  ): Promise<{ items: Service[]; total: number }> {
    const [items, total] = await this.serviceRepository.findAndCount({
      relations: ['clinic', 'doctors'],
      take,
      skip,
      order: { name: 'ASC' },
    });

    return { items, total };
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['clinic'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async create(createServiceInput: CreateServiceInput): Promise<Service> {
    const clinic = await this.clinicRepository.findOneBy({
      id: createServiceInput.clinicId,
    });

    if (!clinic) {
      throw new NotFoundException('Clinic not found');
    }

    const doctors = createServiceInput.doctorIds
      ? await this.doctorRepository.findByIds(createServiceInput.doctorIds)
      : [];

    const service = this.serviceRepository.create({
      ...createServiceInput,
      clinic: clinic as DeepPartial<Clinic>, // Явное приведение типа
      doctors,
    });

    return this.serviceRepository.save(service);
  }

  async update(updateServiceInput: UpdateServiceInput): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id: updateServiceInput.id },
      relations: ['clinic', 'doctors'], // Добавляем загрузку doctors
    });

    if (!service) {
      throw new Error('Service not found');
    }

    // Обновляем клинику если изменился clinicId
    if (
      updateServiceInput.clinicId &&
      updateServiceInput.clinicId !== service.clinic?.id
    ) {
      const clinic = await this.clinicRepository.findOneBy({
        id: updateServiceInput.clinicId,
      });
      if (!clinic) throw new Error('Clinic not found');
      service.clinic = clinic;
    }

    // Обновляем doctors если пришли doctorIds
    if (updateServiceInput.doctorIds) {
      service.doctors = await this.doctorRepository.findByIds(
        updateServiceInput.doctorIds,
      );
    }

    // Обновляем остальные поля
    Object.assign(service, updateServiceInput);

    return this.serviceRepository.save(service);
  }

  async delete(id: number): Promise<boolean> {
    await this.serviceRepository.delete(id);
    return true;
  }
  async search(
    query: string,
    clinicId?: number,
    take?: number,
    skip?: number,
  ): Promise<{ items: Service[]; total: number }> {
    const queryBuilder = this.serviceRepository
      .createQueryBuilder('service')
      .leftJoinAndSelect('service.clinic', 'clinic')
      .leftJoinAndSelect('service.doctors', 'doctors')
      .where(
        `(LOWER(service.name) LIKE LOWER(:query) OR 
      LOWER(service.category) LIKE LOWER(:query) OR 
      LOWER(service.description) LIKE LOWER(:query) OR 
      LOWER(clinic.name) LIKE LOWER(:query) OR 
      LOWER(doctors.name) LIKE LOWER(:query))`,
        { query: `%${query}%` },
      );

    // Добавляем фильтрацию по clinicId если он указан
    if (clinicId) {
      queryBuilder.andWhere('service.clinicId = :clinicId', { clinicId });
    }

    queryBuilder.orderBy('service.name', 'ASC');

    if (take) {
      queryBuilder.take(take);
    }
    if (skip) {
      queryBuilder.skip(skip);
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }
  async findByClinicIdPaginated(
    clinicId: number,
    take?: number,
    skip?: number,
  ): Promise<{ items: Service[]; total: number }> {
    const [items, total] = await this.serviceRepository.findAndCount({
      where: { clinic: { id: clinicId } },
      relations: ['clinic', 'doctors'],
      take,
      skip,
      order: { name: 'ASC' },
    });

    return { items, total };
  }
}
