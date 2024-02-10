import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { User } from 'src/db/types';
import { Auth } from 'src/decorators/user/user.decorator';
import { CreateProjectDTO } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('')
  async getMyProjects(@Auth() user: User) {
    return await this.projectsService.getProjects(user.id);
  }

  @Post()
  async createProject(@Auth() user: User, @Body() body: CreateProjectDTO) {
    return this.projectsService.createProject(user.id, body);
  }

  @Get(':projectId')
  async getProjectInfo(
    @Param('projectId') projectId: string,
    @Auth() user: User,
  ) {
    return await this.projectsService.projectInfo(user.id, projectId);
  }
}
