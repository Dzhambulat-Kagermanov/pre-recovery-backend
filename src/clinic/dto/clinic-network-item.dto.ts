import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class ClinicNetworkItem {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field({ nullable: true })
  city?: string;
}
