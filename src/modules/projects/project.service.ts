import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { IProject } from './project.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { LocaleKeys } from 'src/types';
import { User } from '../users/user.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<IProject>,
  ) {}

  async getAllProjects(queryParams, multiLocale: boolean, req: Request) {
    const { page, limit, featured, locale, category, status } = queryParams;

    const query: any = {};
    const user = await this.getUserByDomain(req.query.domain as string);

    if (!user) throw new NotFoundException('user_not_found');

    if (!queryParams.domain) throw new NotFoundException('domain_not_found');
    query.user = user._id;
    if (featured) query.featured = featured === 'true';
    if (category) query.category = category;
    query.status = status || 'active';

    const projects = await this.projectModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category')
      .populate('user');

    const totalProjects = await this.projectModel.countDocuments(query);

    return {
      status: 'success',
      projects: projects.map((project) =>
        multiLocale
          ? this.projectFields(project)
          : this.projectFields(project, locale),
      ),
      total: totalProjects,
      page,
      pages: Math.ceil(totalProjects / limit),
    };
  }

  async getProjectById(id: string, locale: LocaleKeys, multiLocale: boolean) {
    const project = await this.projectModel
      .findById(id)
      .populate('category')
      .populate('user');
    if (!project) throw new NotFoundException('project_not_found');

    return {
      status: 'success',
      project: this.projectFields(project, multiLocale ? null : locale),
      message: 'project_fetched_successfully',
    };
  }

  async createProject(createProjectDto: CreateProjectDto, user: User) {
    const project = new this.projectModel({
      ...createProjectDto,
      user: user.id,
    });
    await project.save();
    return { status: 'success', project };
  }

  async updateProject(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .populate('category')
      .populate('user');
    if (!project) throw new NotFoundException('project_not_found');

    return { status: 'success', project };
  }

  async deleteProject(id: string) {
    const project = await this.projectModel.findByIdAndDelete(id);
    if (!project) throw new NotFoundException('Project not found');
    return { status: 'success', message: 'Project deleted successfully' };
  }

  async deleteAllProjects() {
    await this.projectModel.deleteMany({});
    return { status: 'success', message: 'All projects deleted successfully' };
  }

  private projectFields(project: IProject, locale?: LocaleKeys) {
    return {
      id: project._id,
      title: locale ? project.title[locale] : project.title,
      description: locale ? project.description[locale] : project.description,
      background: project.background,
      images: project.images,
      featured: project.featured,
      status: project.status,
      category: project.category,
      user: project.user,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  private async getUserByDomain(domain: string) {
    return await this.projectModel.findOne({ domain });
  }
}
