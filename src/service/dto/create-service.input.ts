import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { EnPayType } from '../../common/enums/en-pay-type.enum';

@InputType()
export class CreateServiceInput {
  @Field()
  name: string;

  @Field()
  category: string;
  
  @Field(() => String, { nullable: true })
  consultationType: string;

  @Field()
  description: string;

  @Field()
  price: string;

  @Field(() => [EnPayType], { nullable: true })
  payTypes?: EnPayType[];

  @Field()
  duration: string;

  @Field(() => Int)
  clinicId: number;

  @Field(() => [Int], { nullable: true })
  doctorIds?: number[];
}