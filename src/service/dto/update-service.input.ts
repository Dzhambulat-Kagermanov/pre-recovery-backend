import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { EnPayType } from '../../common/enums/en-pay-type.enum';

@InputType()
export class UpdateServiceInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => String, { nullable: true })
  consultationType?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  price?: string;

  @Field(() => [EnPayType], { nullable: true })
  payTypes?: EnPayType[];

  @Field({ nullable: true })
  duration?: string;

  @Field(() => Int, { nullable: true })
  clinicId?: number;

  @Field(() => [Int], { nullable: true })
  doctorIds?: number[];
}
