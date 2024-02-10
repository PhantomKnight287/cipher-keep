import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { Auth } from 'src/decorators/user/user.decorator';
import { User } from 'src/db/types';
import { CreateSecretDTO } from './dto/create-secret.dto';
import { DecodeAllSecretsDTO } from './dto/decode-secret.dto';
import { Environment } from 'src/db/enums';

@Controller('secrets/:projectId')
export class SecretsController {
  constructor(private readonly secretsService: SecretsService) {}

  @Post('')
  async createProjectSecret(
    @Auth() auth: User,
    @Param('projectId') projectId: string,
    @Body() body: CreateSecretDTO,
  ) {
    return this.secretsService.addNewSecret(auth.id, projectId, body);
  }

  @Post(':env/decode')
  async getProjectSecrets(
    @Param('projectId') projectId: string,
    @Param('env') env: Environment,

    @Body() body: DecodeAllSecretsDTO,
  ) {
    if (Object.keys(Environment).includes(env) === false)
      throw new HttpException('Invalid Envrionment', HttpStatus.BAD_REQUEST);
    return await this.secretsService.decodeAllSecrets(projectId, env, body);
  }
}
