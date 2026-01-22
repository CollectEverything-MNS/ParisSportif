import {Controller} from "@nestjs/common";
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreditDto } from "./credit.dto";
import { CreditUseCase } from "./credit.usecase";

@Controller()
export class CreditEventsListener {
  constructor(
        private readonly creditUseCase: CreditUseCase,
  ) {}

  @EventPattern('bet.settled')
  async onUserDeleted(@Payload() data: CreditDto) {
    await this.creditUseCase.execute(data);
  }
}
