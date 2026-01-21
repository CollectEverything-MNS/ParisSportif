import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { routesConfig } from '../../../../config/routes.config';
import { UpdateUserService } from './update-user.service';
import { UpdateUserDto } from './update-user.dto';

@ApiTags('User')
@Controller()
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch(routesConfig.user.updateUser.path)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.updateUserService.execute(id, dto);
  }
}
