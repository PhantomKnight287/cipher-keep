import { IsString } from 'class-validator';

export class DecodeAllSecretsDTO {
  @IsString()
  key: string;
}
