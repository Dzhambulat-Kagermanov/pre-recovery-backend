import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Doctor } from './doctor.entity';
import { DoctorService } from './doctor.service';
import { CreateDoctorInput } from './dto/create-doctor.input';
import { UpdateDoctorInput } from './dto/update-doctor.input';
import { Auth } from '../common/decorators/auth.decorator';
import { PaginatedDoctorResponse } from './dto/paginated-doctor.response';

@Resolver(() => Doctor)
export class DoctorResolver {
  constructor(private doctorService: DoctorService) {}

  @Query(() => PaginatedDoctorResponse)
  async doctors(
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<PaginatedDoctorResponse> {
    const { items, total } = await this.doctorService.findAll(take, skip);

    const response = new PaginatedDoctorResponse();
    response.items = items;
    response.total = total;

    if (take !== undefined && skip !== undefined) {
      response.nextPage = skip + take < total ? skip + take : undefined;
      response.prevPage = skip > 0 ? Math.max(0, skip - take) : undefined;
    } else {
      response.nextPage = undefined;
      response.prevPage = undefined;
    }

    return response;
  }

  @Query(() => Doctor)
  async doctor(@Args('id', { type: () => Int }) id: number): Promise<Doctor> {
    return this.doctorService.findOne(id);
  }

  @Mutation(() => Doctor)
  @Auth()
  createDoctor(
    @Args('createDoctorInput') createDoctorInput: CreateDoctorInput,
  ): Promise<Doctor> {
    return this.doctorService.create(createDoctorInput);
  }

  @Mutation(() => Doctor)
  @Auth()
  updateDoctor(
    @Args('updateDoctorInput') updateDoctorInput: UpdateDoctorInput,
  ): Promise<Doctor> {
    return this.doctorService.update(updateDoctorInput);
  }

  @Mutation(() => Boolean)
  @Auth()
  deleteDoctor(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.doctorService.delete(id);
  }

  @Query(() => PaginatedDoctorResponse)
  async searchDoctors(
    @Args('query') query: string,
    @Args('clinicId', { type: () => Int, nullable: true }) clinicId?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<PaginatedDoctorResponse> {
    const { items, total } = await this.doctorService.search(query, clinicId, take, skip);

    const response = new PaginatedDoctorResponse();
    response.items = items;
    response.total = total;

    if (take !== undefined && skip !== undefined) {
      response.nextPage = skip + take < total ? skip + take : undefined;
      response.prevPage = skip > 0 ? Math.max(0, skip - take) : undefined;
    } else {
      response.nextPage = undefined;
      response.prevPage = undefined;
    }

    return response;
  }

  @Query(() => PaginatedDoctorResponse)
  async doctorsByClinic(
    @Args('clinicId', { type: () => Int }) clinicId: number,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 10 })
    take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 })
    skip: number,
  ): Promise<PaginatedDoctorResponse> {
    return this.doctorService.findByClinicIdWithPagination(
      clinicId,
      take,
      skip,
    );
  }
}
