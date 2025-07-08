import { InputType, Field, Int } from '@nestjs/graphql';

@InputType('WorkDayInput')
export class WorkDayInput {
  @Field(() => [Int, Int], { nullable: true })
  Monday?: [number, number] | null;

  @Field(() => [Int, Int], { nullable: true })
  Tuesday?: [number, number] | null;

  @Field(() => [Int, Int], { nullable: true })
  Wednesday?: [number, number] | null;

  @Field(() => [Int, Int], { nullable: true })
  Thursday?: [number, number] | null;

  @Field(() => [Int, Int], { nullable: true })
  Friday?: [number, number] | null;

  @Field(() => [Int, Int], { nullable: true })
  Saturday?: [number, number] | null;

  @Field(() => [Int, Int], { nullable: true })
  Sunday?: [number, number] | null;
}