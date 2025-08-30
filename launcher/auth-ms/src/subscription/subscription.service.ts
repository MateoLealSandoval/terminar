import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlanType, SubscriptionStatus } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SubscriptionService {
  constructor(private prisma: PrismaService) {}

  async createSubscription(data: {
    userId: string;
    planType: PlanType;
    months: number;
    amount: number;
    paymentId?: string;
  }) {
    try {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + data.months);

      const subscription = await this.prisma.subscription.create({
        data: {
          userId: data.userId,
          planType: data.planType,
          endDate,
          amount: data.amount,
          paymentId: data.paymentId,
          status: SubscriptionStatus.ACTIVE,
        },
      });

      return subscription;
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }

  async getUserSubscription(userId: string) {
    try {
      const subscription = await this.prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription) {
        return null;
      }

      // Verificar si la suscripción está vencida
      if (
        subscription.endDate < new Date() &&
        subscription.status === SubscriptionStatus.ACTIVE
      ) {
        await this.prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: SubscriptionStatus.EXPIRED },
        });
        subscription.status = SubscriptionStatus.EXPIRED;
      }

      return subscription;
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }

  async renewSubscription(
    userId: string,
    months: number,
    amount: number,
    paymentId?: string,
  ) {
    try {
      const existingSubscription = await this.prisma.subscription.findUnique({
        where: { userId },
      });

      if (existingSubscription) {
        const newEndDate = new Date();
        if (
          existingSubscription.status === SubscriptionStatus.ACTIVE &&
          existingSubscription.endDate > new Date()
        ) {
          // Si la suscripción está activa, extender desde la fecha actual de vencimiento
          newEndDate.setTime(existingSubscription.endDate.getTime());
        }
        newEndDate.setMonth(newEndDate.getMonth() + months);

        return await this.prisma.subscription.update({
          where: { userId },
          data: {
            endDate: newEndDate,
            status: SubscriptionStatus.ACTIVE,
            amount,
            paymentId,
            updatedAt: new Date(),
          },
        });
      } else {
        // Crear nueva suscripción
        return await this.createSubscription({
          userId,
          planType: PlanType.BASIC,
          months,
          amount,
          paymentId,
        });
      }
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message,
      });
    }
  }
}
