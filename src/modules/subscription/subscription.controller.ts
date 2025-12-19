import { Body, Controller, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  async createSubscription(@Body() data: { userId: number; planId: number }) {
    if (!data.userId || !data.planId) {
      throw new Error('Missing userId or planId');
    }
    return this.subscriptionService.createSubscriptionForUser(
      data.userId,
      data.planId,
    );
  }
}
