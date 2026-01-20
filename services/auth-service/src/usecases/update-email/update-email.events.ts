import {Controller} from "@nestjs/common";
import { EventPattern, Payload } from '@nestjs/microservices';
import { UpdateEmailDto } from "./update-email.dto";
import { UpdateEmailUseCase } from "./update-email.usecase";

@Controller()
export class UpdateEmailEventsListener {
  constructor(
        private readonly updateEmailUseCase: UpdateEmailUseCase,
  ) {}

  @EventPattern('user.updated')
  async onUserUpdated(@Payload() data: UpdateEmailDto) {
    await this.updateEmailUseCase.execute(data);
  }
}
