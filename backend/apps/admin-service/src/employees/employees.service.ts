import { removeAvatar, Role, UPLOADS_PREFIX, User } from '@app/common';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import {
  CreateEmployeeDto,
  ListEmployeesQueryDto,
  UpdateEmployeeDto,
} from './employee.dto.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async findAll({ page, limit, search }: ListEmployeesQueryDto) {
    const where = search
      ? ['name', 'email', 'position'].map((field) => ({
          role: Role.EMPLOYEE,
          [field]: Like(`%${search}%`),
        }))
      : { role: Role.EMPLOYEE };
    const [data, total] = await this.users.findAndCount({
      where,
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, page, limit, total };
  }

  async findOne(id: number) {
    const user = await this.users.findOneBy({ id, role: Role.EMPLOYEE });
    if (!user) throw new NotFoundException('Employee not found');
    return user;
  }

  async create(dto: CreateEmployeeDto) {
    const email = dto.email.toLowerCase();
    await this.assertEmailAvailable(email);
    const { id } = await this.users.save({
      ...dto,
      email,
      password: await bcrypt.hash(dto.password, 10),
      role: Role.EMPLOYEE,
    });
    return this.findOne(id);
  }

  async update(id: number, dto: UpdateEmployeeDto) {
    const user = await this.findOne(id);
    const patch: Partial<User> = { ...dto };
    if (dto.email) {
      patch.email = dto.email.toLowerCase();
      if (patch.email !== user.email) await this.assertEmailAvailable(patch.email);
    }
    if (dto.password) patch.password = await bcrypt.hash(dto.password, 10);
    if (Object.keys(patch).length) await this.users.update(id, patch);
    return this.findOne(id);
  }

  async updateAvatar(id: number, file: Express.Multer.File | undefined) {
    if (!file) throw new BadRequestException('avatar file is required');
    const user = await this.findOne(id);
    await this.users.update(id, { avatar: `${UPLOADS_PREFIX}${file.filename}` });
    await removeAvatar(this.config, user.avatar);
    return this.findOne(id);
  }

  private async assertEmailAvailable(email: string) {
    if (await this.users.existsBy({ email })) {
      throw new ConflictException('Email is already registered');
    }
  }
}
