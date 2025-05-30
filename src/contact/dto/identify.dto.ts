import { IsOptional, IsString } from 'class-validator';

export class IdentifyDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
