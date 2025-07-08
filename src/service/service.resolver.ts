import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Service } from './service.entity';
import { ServiceService } from './service.service';
import { CreateServiceInput } from './dto/create-service.input';
import { UpdateServiceInput } from './dto/update-service.input';
import { Auth } from '../common/decorators/auth.decorator';
import { PaginatedServiceResponse } from './dto/paginated-service.response';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(private serviceService: ServiceService) {}

  @Query(() => PaginatedServiceResponse)
  async services(
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<PaginatedServiceResponse> {
    const { items, total } = await this.serviceService.findAll(take, skip);

    const response = new PaginatedServiceResponse();
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

  // Добавляем новый метод для поиска
  @Query(() => PaginatedServiceResponse)
  async searchServices(
    @Args('query') query: string,
    @Args('clinicId', { type: () => Int, nullable: true }) clinicId?: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<PaginatedServiceResponse> {
    const { items, total } = await this.serviceService.search(
      query,
      clinicId,
      take,
      skip,
    );

    const response = new PaginatedServiceResponse();
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

  @Query(() => Service)
  async service(@Args('id', { type: () => Int }) id: number): Promise<Service> {
    return this.serviceService.findOne(id);
  }

  @Mutation(() => Service)
  @Auth()
  createService(
    @Args('createServiceInput') createServiceInput: CreateServiceInput,
  ): Promise<Service> {
    return this.serviceService.create(createServiceInput);
  }

  @Mutation(() => Service)
  @Auth()
  updateService(
    @Args('updateServiceInput') updateServiceInput: UpdateServiceInput,
  ): Promise<Service> {
    return this.serviceService.update(updateServiceInput);
  }

  @Mutation(() => Boolean)
  @Auth()
  deleteService(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    return this.serviceService.delete(id);
  }
  @Query(() => PaginatedServiceResponse)
  async servicesByClinicPaginated(
    @Args('clinicId', { type: () => Int }) clinicId: number,
    @Args('take', { type: () => Int, nullable: true }) take?: number,
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
  ): Promise<PaginatedServiceResponse> {
    const { items, total } = await this.serviceService.findByClinicIdPaginated(
      clinicId,
      take,
      skip,
    );

    const response = new PaginatedServiceResponse();
    response.items = items;
    response.total = total;
    response.nextPage =
      skip !== undefined && take !== undefined
        ? skip + take < total
          ? skip + take
          : undefined
        : undefined;
    response.prevPage =
      skip !== undefined && take !== undefined
        ? skip > 0
          ? Math.max(0, skip - take)
          : undefined
        : undefined;

    return response;
  }
}
