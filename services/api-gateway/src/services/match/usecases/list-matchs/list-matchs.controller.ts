import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListMatchsService } from './list-matchs.service';
import { routesConfig } from '../../../../config/routes.config';

@ApiTags('Match')
@Controller()
export class ListMatchsController {
  constructor(private readonly listMatchsService: ListMatchsService) {}

  @Get(routesConfig.match.root.path)
  @ApiOperation({ summary: "Liste de tous les matchs GET par l'API" })
  async listMatchs() {
    return this.listMatchsService.execute();
  }
}
