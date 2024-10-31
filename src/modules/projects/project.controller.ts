import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { LocaleKeys } from 'src/types';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../users/user.schema';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  async getAllProjects(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('featured') featured: string,
    @Query('locale') locale: LocaleKeys,
    @Query('category') category: string,
    @Query('status') status: string,
    @Query('domain') domain: string,
    @Req() req: Request,
  ) {
    const multiLocale = req.query.multiLocale === 'true';
    return this.projectService.getAllProjects(
      { page, limit, featured, locale, category, status, domain },
      multiLocale,
      req,
    );
  }

  @Get('/:id')
  async getProjectById(
    @Param('id') id: string,
    @Query('locale') locale: LocaleKeys = 'en',
    @Query('multiLocale') multiLocale: boolean = false,
  ) {
    return this.projectService.getProjectById(id, locale, multiLocale);
  }

  @UseGuards(AuthGuard('jwt')) // Yetkilendirme koruması
  @Post('/')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: Request,
  ) {
    const user: User = req.user as unknown as User;
    return this.projectService.createProject(createProjectDto, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/:id')
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/')
  async deleteAllProjects() {
    return this.projectService.deleteAllProjects();
  }
}
