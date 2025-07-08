import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { Clinic } from '../clinic/clinic.entity';
import { Service } from '../service/service.entity';
import { PaginatedDoctorResponse } from './dto/paginated-doctor.response';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async findAll(
    take?: number,
    skip?: number,
  ): Promise<{ items: Doctor[]; total: number }> {
    const [items, total] = await this.doctorRepository.findAndCount({
      relations: ['clinic', 'services'],
      take,
      skip,
      order: { name: 'ASC' },
    });

    return { items, total };
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: ['clinic', 'services'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async create(createDoctorInput: CreateDoctorInput): Promise<Doctor> {
    const clinic = await this.clinicRepository.findOneBy({
      id: createDoctorInput.clinicId,
    });
    if (!clinic) {
      throw new Error('Clinic not found');
    }

    const services = createDoctorInput.serviceIds
      ? await this.serviceRepository.findByIds(createDoctorInput.serviceIds)
      : [];

    const doctor = this.doctorRepository.create({
      ...createDoctorInput,
      clinic,
      services, // Привязка услуг
    });

    return this.doctorRepository.save(doctor);
  }

  async update(updateDoctorInput: UpdateDoctorInput): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id: updateDoctorInput.id },
      relations: ['clinic', 'services'], // загрузить текущие связи
    });
    if (!doctor) {
      throw new Error('Doctor not found');
    }

    if (updateDoctorInput.clinicId) {
      const clinic = await this.clinicRepository.findOneBy({
        id: updateDoctorInput.clinicId,
      });
      if (!clinic) {
        throw new Error('Clinic not found');
      }
      doctor.clinic = clinic;
    }

    if (updateDoctorInput.serviceIds) {
      doctor.services = await this.serviceRepository.findByIds(
        updateDoctorInput.serviceIds,
      );
    }

    Object.assign(doctor, updateDoctorInput);
    return this.doctorRepository.save(doctor);
  }

  async delete(id: number): Promise<boolean> {
    await this.doctorRepository.delete(id);
    return true;
  }

  async search(
    query: string,
    clinicId?: number,
    take?: number,
    skip?: number,
  ): Promise<{ items: Doctor[]; total: number }> {
    const queryBuilder = this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.clinic', 'clinic')
      .leftJoinAndSelect('doctor.services', 'services')
      .where(
        `(LOWER(doctor.name) LIKE LOWER(:query) OR 
      LOWER(doctor.speciality) LIKE LOWER(:query) OR 
      LOWER(clinic.name) LIKE LOWER(:query) OR 
      LOWER(services.name) LIKE LOWER(:query))`,
        { query: `%${query}%` },
      );

    // Добавляем условие фильтрации по clinicId если он передан
    if (clinicId) {
      queryBuilder.andWhere('doctor.clinicId = :clinicId', { clinicId });
    }

    queryBuilder.orderBy('doctor.name', 'ASC');

    if (take) {
      queryBuilder.take(take);
    }
    if (skip) {
      queryBuilder.skip(skip);
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }

  async findByClinicIdWithPagination(
    clinicId: number,
    take: number,
    skip: number,
  ): Promise<PaginatedDoctorResponse> {
    const [items, total] = await this.doctorRepository.findAndCount({
      where: { clinic: { id: clinicId } },
      relations: ['clinic', 'services'],
      take,
      skip,
      order: { name: 'ASC' },
    });

    const response = new PaginatedDoctorResponse();
    response.items = items;
    response.total = total;
    response.nextPage = skip + take < total ? skip + take : undefined;
    response.prevPage = skip > 0 ? Math.max(0, skip - take) : undefined;

    return response;
  }
}
