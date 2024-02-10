import { Module } from '@nestjs/common';
import { SecretsService } from './secrets.service';
import { SecretsController } from './secrets.controller';

@Module({
  controllers: [SecretsController],
  providers: [SecretsService],
})
export class SecretsModule {}
