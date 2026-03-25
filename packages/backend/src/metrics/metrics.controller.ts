import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { register, Registry } from 'prom-client';

@ApiTags('metrics')
@Controller('metrics')
export class MetricsController {
  @Get()
  @ApiOperation({ summary: 'Get Prometheus metrics', description: 'Returns metrics in Prometheus format for monitoring' })
  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
