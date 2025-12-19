import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SubscriptionService {
  private readonly baseUrl = '';
  private readonly apiKey = '';

  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {}

  async getSubscriptionByUserId(userId: number) {
    return this.prisma.subscription.findFirst({
      where: { userId, isActive: true },
    });
  }

  async createSubscriptionForUser(userId: number, planId: number) {
    try {
      const plan = await this.prisma.subscriptionPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        throw new Error('Subscription plan not found');
      }

      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new Error('User not found');
      }

      var asaasClient = await this.findAsaasClientByCpf(user.cpf);

      if (!asaasClient) {
        const newAsaasClient = await this.createAsaasClient({
          name: user.username,
          email: user.email,
          cpf: user.cpf,
        });
        asaasClient = newAsaasClient;
      }

      const newSubscription = await this.createAsaasSubscription({
        asaasCustomerId: asaasClient.id,
        planId: plan.id.toString(),
        value: plan.priceCents,
        planName: plan.name,
      });

      const subscriptionRecord = await this.prisma.subscription.create({
        data: {
          userId: user.id,
          planId: plan.id,
          isActive: true,
          asaasSubscriptionId: newSubscription.id,
          asaasCustomerId: asaasClient.id,
        },
      });

      return subscriptionRecord;
    } catch (error) {
      throw new Error('Failed to create subscription for user');
    }
  }

  private async createAsaasSubscription(subscriptionData: {
    asaasCustomerId: string;
    planId: string;
    value: number;
    planName: string;
  }) {
    try {
      const url = `${this.baseUrl}/subscriptions`;

      const body = {
        customer: subscriptionData.asaasCustomerId,
        billingType: 'CREDIT_CARD',
        value: subscriptionData.value / 100,
        cycle: 'MONTHLY',
        description: `Assinatura do plano ${subscriptionData.planName} - Registro:  ${'0000' + subscriptionData.planId}`,
      };
      const headers = {
        'Content-Type': 'application/json',
        access_token: this.apiKey,
      };
      const response = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to create Asaas subscription');
    }
  }

  private async createAsaasClient(user: {
    name: string;
    email: string;
    cpf: string;
  }) {
    try {
      const url = `${this.baseUrl}/customers`;

      const requestBody = {
        name: user.name,
        email: user.email,
        cpfCnpj: user.cpf,
      };

      const headers = {
        'Content-Type': 'application/json',
        access_token: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.post(url, requestBody, {
          headers,
        }),
      );

      return response.data;
    } catch (error) {
      throw new Error('Failed to create Asaas client');
    }
  }

  private async findAsaasClientByCpf(cpf: string) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        access_token: this.apiKey,
      };
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/customers?cpfCnpj=${cpf}`, {
          headers,
        }),
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch Asaas client by CPF');
    }
  }
}
