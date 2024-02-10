import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { db } from 'src/db';
import { CreateProjectDTO } from './dto/create-project.dto';
import { generateKeyPairSync } from 'node:crypto';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class ProjectsService {
  async getProjects(userId: string) {
    const projects = await db
      .selectFrom('projects')
      .selectAll()
      .where('ownerId', '=', userId)
      .orderBy('createdAt', 'desc')
      .execute();
    return projects;
  }

  async createProject(userId: string, body: CreateProjectDTO) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    const privateKeyString = privateKey.export({
      type: 'pkcs1',
      format: 'pem',
    });
    const publicKeyString = publicKey.export({
      type: 'pkcs1',
      format: 'pem',
    });
    const project = await db
      .insertInto('projects')
      .values({
        id: `project_${createId()}`,
        name: body.name,
        ownerId: userId,
        publicKey: publicKeyString.toString(),
      })
      .returning(['name', 'id'])
      .execute();

    return {
      keys: { privateKey: privateKeyString.toString() },
      project,
    };
  }

  async projectInfo(userId: string, projectId: string) {
    const project = await db
      .selectFrom('projects')
      .where('id', '=', projectId)
      .where('ownerId', '=', userId)
      .selectAll()
      .executeTakeFirst();
    if (!project)
      throw new HttpException('No project found.', HttpStatus.NOT_FOUND);

    const secrets = await db
      .selectFrom('secrets')
      .where('projectId', '=', projectId)
      .select(['id', 'name', 'environment', 'value', 'createdAt', 'updatedAt'])
      .orderBy('updatedAt desc')
      .execute();

    return {
      project: { name: project.name },
      secrets,
    };
  }
}
