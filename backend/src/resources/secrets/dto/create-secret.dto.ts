import { IsEnum, IsString } from 'class-validator';
import { Environment } from 'src/db/enums';

export class CreateSecretDTO {
  @IsString()
  name: string;

  @IsString()
  value: string;

  @IsEnum(Environment)
  environment: Environment;
}
