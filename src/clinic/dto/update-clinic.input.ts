import { InputType, Field, Int } from '@nestjs/graphql';
import { WorkDayInput } from '../../common/work-day.input';

@InputType()
export class UpdateClinicInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  clinicWorkBegin?: string;

  @Field(() => Int, { nullable: true })
  square?: number;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  reportPhone?: string;

  @Field({ nullable: true })
  country?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  address?: string;

  @Field(() => Int, { nullable: true })
  floorCount?: number;

  @Field({ nullable: true })
  hasComputer?: boolean;

  @Field({ nullable: true })
  hasInternet?: boolean;

  @Field(() => WorkDayInput, { nullable: true})
  workTime?: WorkDayInput;

  @Field(() => [String], { nullable: true })
  languages?: string[];

  @Field(() => [String], { nullable: true })
  mediaFiles?: string[];

  @Field({ nullable: true })
  hasElevator?: boolean;

  @Field(() => [Int], { nullable: true })
  networkClinicIds?: number[]; // ID клиник, с которыми нужно объединить в сеть
}