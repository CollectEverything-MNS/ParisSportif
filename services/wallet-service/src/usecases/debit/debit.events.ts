import {Controller} from "@nestjs/common";
import { EventPattern, Payload } from '@nestjs/microservices';
import { DebitDto } from "./debit.dto";
import { DebitUseCase } from "./debit.usecase";

@Controller()
export class DebitEventsListener {
  constructor(
        private readonly debitUseCase: DebitUseCase,
  ) {}

  @EventPattern('bet.placed')
  async onUserDeleted(@Payload() data: DebitDto) {
    await this.debitUseCase.execute(data);
  }
}
