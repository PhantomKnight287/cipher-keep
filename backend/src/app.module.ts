import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './resources/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { ProjectsModule } from './resources/projects/projects.module';
import { SecretsModule } from './resources/secrets/secrets.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ cache: true }),
    ProjectsModule,
    SecretsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/v(.*)/auth/(.*)', '/v(.*)/secrets/(.*)/decode')
      .forRoutes('*');
  }
}
