import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report-dto';
import { ReportsService } from './reports.service';
import { AuthGuard } from '../guard/auth.guard';


@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createReport(@Body() body: CreateReportDto) {
    return this.reportService.create(body);
  }
}
