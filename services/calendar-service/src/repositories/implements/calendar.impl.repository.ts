import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar } from '../../entities/calendar.entity';
import { ICalendarRepository } from '../calendar.repository';

@Injectable()
export class TypeOrmCalendarRepository implements ICalendarRepository {
  constructor(
    @InjectRepository(Calendar)
    private readonly repository: Repository<Calendar>,
  ) {}
}
