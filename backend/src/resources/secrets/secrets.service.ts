import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSecretDTO } from './dto/create-secret.dto';
import { db } from 'src/db';
import { createId } from '@paralleldrive/cuid2';
import { constants, privateDecrypt, publicEncrypt } from 'crypto';
import { DecodeAllSecretsDTO } from './dto/decode-secret.dto';
import { Environment } from 'src/db/enums';

@Injectable()
export class SecretsService {
  async addNewSecret(userId: string, projectId: string, body: CreateSecretDTO) {
    const { environment, name, value } = body;

    const project = await db
      .selectFrom('projects')
      .where('id', '=', projectId)
      .where('ownerId', '=', userId)
      .select(['id', 'publicKey'])
      .executeTakeFirst();
    if (!project)
      throw new HttpException('No project found.', HttpStatus.NOT_FOUND);

    const encryptedData = publicEncrypt(
      {
        key: project.publicKey,
        padding: constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(value, 'utf-8'),
    );

    const secret = await db
      .insertInto('secrets')
      .values({
        environment,
        name,
        id: `secret_${createId()}`,
        value: encryptedData.toString('hex'),
        projectId,
      })
      .returningAll()
      .executeTakeFirst();
    return secret;
  }

  async decodeAllSecrets(
    projectId: string,
    environment: Environment,
    body: DecodeAllSecretsDTO,
  ) {
    const project = await db
      .selectFrom('projects')
      .where('id', '=', projectId)
      .select(['id', 'publicKey'])
      .executeTakeFirst();
    if (!project)
      throw new HttpException('No project found.', HttpStatus.NOT_FOUND);

    const decrypted = [];
    const secrets = await db
      .selectFrom('secrets')
      .where('projectId', '=', projectId)
      .where('environment', '=', environment)
      .selectAll()
      .execute();

    for (const secret of secrets) {
      const decryptedData = privateDecrypt(
        {
          key: Buffer.from(body.key, 'base64').toString('utf-8'),
          padding: constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(secret.value, 'hex'),
      );
      decrypted.push({
        name: secret.name,
        value: decryptedData.toString('utf-8'),
      });
    }
    return decrypted;
  }
}
