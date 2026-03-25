import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthService.check();
  }

  @Get('liveness')
  @ApiOperation({ summary: 'Kubernetes liveness probe' })
  async liveness(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  @Get('readiness')
  @ApiOperation({ summary: 'Kubernetes readiness probe' })
  async readiness(): Promise<{ status: string }> {
    return this.healthService.isReady();
  }
}
