import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SubscriptionService } from './subscription.service';

@Controller()
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @MessagePattern('auth.subscription.get')
  getUserSubscription(data: { userId: string }) {
    return this.subscriptionService.getUserSubscription(data.userId);
  }

  @MessagePattern('auth.subscription.create')
  createSubscription(data: any) {
    return this.subscriptionService.createSubscription(data);
  }

  @MessagePattern('auth.subscription.renew')
  renewSubscription(data: any) {
    return this.subscriptionService.renewSubscription(
      data.userId,
      data.months,
      data.amount,
      data.paymentId,
    );
  }
}
