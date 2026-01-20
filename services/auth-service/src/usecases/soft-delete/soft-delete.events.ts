import {Controller} from "@nestjs/common";
import { EventPattern, Payload } from '@nestjs/microservices';
import { SoftDeleteDto } from "./soft-delete.dto";
import { SoftDeleteUseCase } from "./soft-delete.usecase";

@Controller()
export class SoftDeleteEventsListener {
  constructor(
        private readonly softDeleteUseCase: SoftDeleteUseCase,
  ) {}

  @EventPattern('user.deleted')
  async onUserDeleted(@Payload() data: SoftDeleteDto) {
    await this.softDeleteUseCase.execute(data);
  }
}
