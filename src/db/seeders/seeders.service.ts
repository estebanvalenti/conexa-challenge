import { Injectable } from '@nestjs/common';
import { AdminSeedsService } from './add-admin.seed';

@Injectable()
export class SeedersService {
  constructor(private readonly adminSeedsService: AdminSeedsService) {}
  async seed() {
    await this.adminSeedsService.seed();
  }
}
