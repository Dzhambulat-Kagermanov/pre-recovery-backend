import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Clinic } from '../clinic.entity';

@ObjectType()
export class PaginatedClinicResponse {
  @Field(() => [Clinic])
  items: Clinic[];

  @Field(() => Int)
  total: number;

  @Field(() => Int, { nullable: true })
  nextPage?: number;

  @Field(() => Int, { nullable: true })
  prevPage?: number;
}