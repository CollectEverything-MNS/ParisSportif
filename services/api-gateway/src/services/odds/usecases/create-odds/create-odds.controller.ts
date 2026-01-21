import { Body, Controller, Post } from '@nestjs/common';
import { routesConfig } from '../../../../config/routes.config';
import { CreateOddsService } from './create-odds.service';
import { CreateOddsDto } from './create-odds.dto';

@Controller()
export class CreateOddsController {
  constructor(private readonly service: CreateOddsService) {}

  @Post(routesConfig.odds.create.path)
  async execute(@Body() dto: CreateOddsDto) {
    return this.service.execute(dto);
  }
}
