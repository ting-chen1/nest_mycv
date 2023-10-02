import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './reports.entity';
import { CreateReportDto } from './dto/create-report-dto';


@Injectable()
export class ReportsService {
  // InjectRepository 則是告知 DI 系統，這裡會用到 Report repository
  // 這個修飾器只是因為 DI 系統與 通用型別相容不夠好，所以才需要使用
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  create(reportDto: CreateReportDto) {
    const report = this.repo.create(reportDto)
    return this.repo.save(report)
  }
}
