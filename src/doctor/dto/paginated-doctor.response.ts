// dto/paginated-doctor.response.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Doctor } from '../doctor.entity';

@ObjectType()
export class PaginatedDoctorResponse {
  @Field(() => [Doctor])
  items: Doctor[];

  @Field(() => Int)
  total: number;

  @Field(() => Int, { nullable: true })
  nextPage?: number;

  @Field(() => Int, { nullable: true })
  prevPage?: number;
}