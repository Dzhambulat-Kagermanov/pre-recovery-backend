import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Clinic } from './clinic.entity';
import { ClinicService } from './clinic.service';
import { CreateClinicInput } from './dto/create-clinic.input';
import { UpdateClinicInput } from './dto/update-clinic.input';
import { PaginatedClinicResponse } from './dto/paginated-clinic.response';
import { Auth } from '../common/decorators/auth.decorator';
import { ClinicNetworkItem } from './dto/clinic-network-item.dto';

@Resolver(() => Clinic)
export class ClinicResolver {
  constructor(private clinicService: ClinicService) {}

  @Query(() => PaginatedClinicResponse)
  async clinics(
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<PaginatedClinicResponse> {
    const { items, total } = await this.clinicService.findAll(take, skip);

    const response = new PaginatedClinicResponse();
    response.items = items;
    response.total = total;
    
    // Добавляем проверку на undefined для take
    if (take !== undefined && skip !== undefined) {
      response.nextPage = skip + take < total ? skip + take : undefined;
      response.prevPage = skip > 0 ? Math.max(0, skip - take) : undefined;
    } else {
      response.nextPage = undefined;
      response.prevPage = undefined;
    }

    return response;
  }

  @Query(() => Clinic)
  async clinic(@Args('id', { type: () => Int }) id: number): Promise<Clinic> {
    return this.clinicService.findOne(id);
  }

  @Mutation(() => Clinic)
  @Auth()
  async createClinic(
    @Args('createClinicInput') createClinicInput: CreateClinicInput,
  ): Promise<Clinic> {
    return this.clinicService.create(createClinicInput);
  }

  @Mutation(() => Clinic)
  @Auth()
  async updateClinic(
    @Args('updateClinicInput') updateClinicInput: UpdateClinicInput,
  ): Promise<Clinic> {
    return this.clinicService.update(updateClinicInput);
  }

  @Mutation(() => Boolean)
  @Auth()
  async deleteClinic(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.clinicService.delete(id);
  }

  @Query(() => PaginatedClinicResponse)
  async searchClinics(
    @Args('query') query: string,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<PaginatedClinicResponse> {
    const { items, total } = await this.clinicService.search(query, take, skip);

    const response = new PaginatedClinicResponse();
    response.items = items;
    response.total = total;
    
    // Та же логика пагинации, что и в clinics()
    if (take !== undefined && skip !== undefined) {
      response.nextPage = skip + take < total ? skip + take : undefined;
      response.prevPage = skip > 0 ? Math.max(0, skip - take) : undefined;
    } else {
      response.nextPage = undefined;
      response.prevPage = undefined;
    }

    return response;
  }

  @Query(() => [ClinicNetworkItem])
  async getClinicNetwork(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<ClinicNetworkItem[]> {
    const network = await this.clinicService.getClinicNetwork(id);
    return network.map(clinic => ({
      id: clinic.id,
      name: clinic.name,
      address: clinic.address,
      city: clinic.city,
    }));
  }

}