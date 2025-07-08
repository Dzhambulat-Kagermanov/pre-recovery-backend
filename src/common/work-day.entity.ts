import { ObjectType, Field, Int } from '@nestjs/graphql';
@ObjectType()
export class WorkDay {
  @Field(() => [Int, Int], { nullable: true })
  Monday?: [number, number];

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