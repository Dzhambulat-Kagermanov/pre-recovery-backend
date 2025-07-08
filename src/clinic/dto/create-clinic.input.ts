import { InputType, Field, Int } from '@nestjs/graphql';
import { WorkDayInput } from '../../common/work-day.input';

@InputType()
export class CreateClinicInput {
  @Field()
  name: string;

  @Field()
  type: string;

  @Field()
  clinicWorkBegin: string;

  @Field(() => Int)
  square: number;

  @Field()
  phone: string;

  @Field({ nullable: true })
  reportPhone?: string;

  @Field()
  country: string;

  @Field()
  city: string;

  @Field()
  address: string;

  @Field(() => Int)
  floorCount: number;

  @Field({ defaultValue: false })
  hasComputer: boolean;

  @Field({ defaultValue: false })
  hasInternet: boolean;

  @Field(() => WorkDayInput)
  workTime: WorkDayInput;

  @Field(() => [String])
  languages: string[];

  @Field(() => [String], { nullable: true })
  mediaFiles?: string[];

  @Field({ defaultValue: false })
  hasElevator: boolean;

  @Field(() => [Int], { nullable: true })
  networkClinicIds?: number[]; // ID клиник, с которыми нужно объединить в сеть
}