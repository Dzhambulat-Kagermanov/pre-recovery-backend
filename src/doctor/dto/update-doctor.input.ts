import { InputType, Field, Int } from '@nestjs/graphql';
import { WorkDayInput } from '../../common/work-day.input';
import { EnWorkDays } from '../../common/enums/en-work-days.enum';
import { EnConsultationType } from '../../common/enums/en-consultation-type.enum';

@InputType()
export class UpdateDoctorInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  speciality?: string;

  @Field(() => EnConsultationType, { nullable: true })
  consultationType?: EnConsultationType;

  @Field({ nullable: true })
  experience?: string;
    
  @Field(() => [EnWorkDays], { nullable: true })
  workDays?: EnWorkDays[];

  @Field(() => WorkDayInput, { nullable: true })
  workTime?: WorkDayInput;

  @Field(() => Int, { nullable: true })
  clinicId?: number;

  @Field(() => [Int], { nullable: true })
  serviceIds?: number[];
}