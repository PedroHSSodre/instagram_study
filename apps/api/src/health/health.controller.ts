import { Controller, Get, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('health')
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    const plan = this.prisma.db.raw
      .sql`SELECT 1 AS ok`
      .returnsRow({ ok: 'pg/int4@1' })
      .build();

    for await (const _row of this.prisma.db.runtime().query(plan)) {
      break;
    }

    return { status: 'ok', database: 'up' };
  }
}
