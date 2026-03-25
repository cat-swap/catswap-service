import { Injectable } from '@nestjs/common';
import {
  HealthCheckResult,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@Injectable()
export class HealthService {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 3000 }),
    ]);
  }

  async isReady(): Promise<{ status: string }> {
    try {
      await this.db.pingCheck('database', { timeout: 3000 });
      return { status: 'ok' };
    } catch {
      return { status: 'error' };
    }
  }
}
