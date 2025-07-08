// dto/paginated-service.response.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Service } from '../service.entity';

@ObjectType()
export class PaginatedServiceResponse {
  @Field(() => [Service])
  items: Service[];

  @Field(() => Int)
  total: number;

  @Field(() => Int, { nullable: true })
  nextPage?: number;

  @Field(() => Int, { nullable: true })
  prevPage?: number;
}