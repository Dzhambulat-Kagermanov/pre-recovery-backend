import { InputType, Field, Int } from '@nestjs/graphql';
import { WorkDayInput } from '../../common/work-day.input';
import { EnWorkDays } from '../../common/enums/en-work-days.enum';
import { EnConsultationType } from '../../common/enums/en-consultation-type.enum';
@InputType()
export class CreateDoctorInput {
  @Field()
  name: string;

  @Field()
  speciality: string;

  @Field(() => EnConsultationType)
  consultationType: EnConsultationType;

  @Field()
  experience: string;
  
  @Field(() => [EnWorkDays])
  workDays: EnWorkDays[];

  @Field(() => WorkDayInput)
  workTime: WorkDayInput;

  @Field(() => Int)
  clinicId: number;

  @Field(() => [Int], { nullable: true })
  serviceIds?: number[];
}