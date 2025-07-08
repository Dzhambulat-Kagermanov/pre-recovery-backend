import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Clinic } from './clinic.entity';
import { ClinicNetwork } from './clinic-network.entity';
import { CreateClinicInput } from './dto/create-clinic.input';
import { UpdateClinicInput } from './dto/update-clinic.input';
import { Doctor } from 'src/doctor/doctor.entity';
import { Service } from 'src/service/service.entity';

@Injectable()
export class ClinicService {
  constructor(
    @InjectRepository(Clinic)
    private clinicRepository: Repository<Clinic>,
    @InjectRepository(ClinicNetwork)
    private networkRepository: Repository<ClinicNetwork>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
  ) {}

  async findAll(
    take?: number,
    skip?: number,
  ): Promise<{ items: Clinic[]; total: number }> {
    const [items, total] = await this.clinicRepository.findAndCount({
      relations: ['doctors', 'services', 'networks', 'networks.clinics'],
      take,
      skip,
      order: { id: 'DESC' },
    });

    return { items, total };
  }

  async findOne(id: number): Promise<Clinic> {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
      relations: ['doctors', 'services'],
    });

    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    return clinic;
  }

  async create(createClinicInput: CreateClinicInput): Promise<Clinic> {
    const clinic = this.clinicRepository.create(createClinicInput);

    if (createClinicInput.networkClinicIds?.length) {
      await this.addToNetwork(clinic, createClinicInput.networkClinicIds);
    }

    return this.clinicRepository.save(clinic);
  }

  async update(updateClinicInput: UpdateClinicInput): Promise<Clinic> {
    const clinic = await this.clinicRepository.findOne({
      where: { id: updateClinicInput.id },
      relations: ['networks', 'networks.clinics'],
    });

    if (!clinic) {
      throw new NotFoundException(
        `Clinic with ID ${updateClinicInput.id} not found`,
      );
    }

    Object.assign(clinic, updateClinicInput);

    if (updateClinicInput.networkClinicIds) {
      await this.addToNetwork(clinic, updateClinicInput.networkClinicIds);
    }

    return this.clinicRepository.save(clinic);
  }

  private async addToNetwork(
    clinic: Clinic,
    clinicIds: number[],
  ): Promise<void> {
    // Находим все сети, в которых состоят указанные клиники
    const networks = await this.networkRepository
      .createQueryBuilder('network')
      .innerJoin('network.clinics', 'clinic')
      .where('clinic.id IN (:...ids)', { ids: clinicIds })
      .leftJoinAndSelect('network.clinics', 'allClinics')
      .getMany();

    // Если есть существующие сети, объединяем их и добавляем клинику
    if (networks.length > 0) {
      // Объединяем все сети в одну (берем первую)
      const mainNetwork = networks[0];

      // Добавляем клиники из других сетей в основную
      for (const network of networks.slice(1)) {
        mainNetwork.clinics = [
          ...new Set([...mainNetwork.clinics, ...network.clinics]),
        ];
        await this.networkRepository.remove(network);
      }

      // Добавляем текущую клинику и указанные клиники
      const allClinics = await this.clinicRepository.find({
        where: { id: In(clinicIds) },
      });

      mainNetwork.clinics = [
        ...new Set([...mainNetwork.clinics, clinic, ...allClinics]),
      ];
      clinic.networks = [mainNetwork];
      await this.networkRepository.save(mainNetwork);
    } else {
      // Создаем новую сеть
      const network = this.networkRepository.create();
      const clinics = await this.clinicRepository.find({
        where: { id: In(clinicIds) },
      });

      network.clinics = [clinic, ...clinics];
      clinic.networks = [network];
      await this.networkRepository.save(network);
    }
  }

  async getClinicNetwork(id: number): Promise<Clinic[]> {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
      relations: ['networks', 'networks.clinics'],
    });

    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    return clinic.clinicsNet;
  }

  async delete(id: number): Promise<boolean> {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
      relations: ['doctors', 'services'],
    });

    if (!clinic) {
      throw new NotFoundException(`Clinic with ID ${id} not found`);
    }

    // Удаляем связанные сущности
    if (clinic.doctors?.length) {
      await this.doctorRepository.remove(clinic.doctors);
    }

    if (clinic.services?.length) {
      await this.serviceRepository.remove(clinic.services);
    }

    await this.clinicRepository.remove(clinic);
    return true;
  }

  async search(
    query: string,
    take?: number,
    skip?: number,
  ): Promise<{ items: Clinic[]; total: number }> {
    const queryBuilder = this.clinicRepository
      .createQueryBuilder('clinic')
      .leftJoinAndSelect('clinic.doctors', 'doctors')
      .leftJoinAndSelect('clinic.services', 'services')
      .where(
        `LOWER(clinic.name) LIKE LOWER(:query) OR 
        LOWER(clinic.type) LIKE LOWER(:query) OR 
        LOWER(clinic.city) LIKE LOWER(:query) OR 
        LOWER(clinic.address) LIKE LOWER(:query) OR 
        LOWER(clinic.phone) LIKE LOWER(:query) OR 
        LOWER(doctors.name) LIKE LOWER(:query) OR
        LOWER(doctors.speciality) LIKE LOWER(:query) OR 
        LOWER(services.name) LIKE LOWER(:query) OR 
        LOWER(services.category) LIKE LOWER(:query) OR 
        LOWER(services.description) LIKE LOWER(:query)`,
        { query: `%${query}%` },
      )
      .orderBy('clinic.id', 'DESC');

    if (take) {
      queryBuilder.take(take);
    }
    if (skip) {
      queryBuilder.skip(skip);
    }

    const [items, total] = await queryBuilder.getManyAndCount();
    return { items, total };
  }
}
