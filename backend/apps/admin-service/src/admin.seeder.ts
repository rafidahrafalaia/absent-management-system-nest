import { Role, User } from '@app/common';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

/** Creates the first HR admin account from env vars when no admin exists yet. */
@Injectable()
export class AdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(AdminSeeder.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    if (await this.users.existsBy({ role: Role.ADMIN })) return;

    const email = this.config.get<string>('ADMIN_EMAIL', 'admin@company.com');
    const password = this.config.get<string>('ADMIN_PASSWORD', 'admin123');
    await this.users.save({
      name: this.config.get<string>('ADMIN_NAME', 'HR Admin'),
      email: email.toLowerCase(),
      password: await bcrypt.hash(password, 10),
      position: 'HRD',
      role: Role.ADMIN,
    });
    this.logger.log(`Seeded admin account ${email}`);
  }
}
