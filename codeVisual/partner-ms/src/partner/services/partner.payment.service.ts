import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

// Definir enums localmente ya que no están siendo exportados por Prisma
export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum PlanType {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export interface CreatePaymentTransactionDto {
  partnerId: string;
  amount: number;
  currency?: string;
  transactionId: string;
  paymentMethod: string;
  status?: PaymentStatus;
  planType: PlanType;
  expirationDate: string;
  metadata?: any;
}

export interface ValidatePaymentDto {
  partnerId: string;
  transactionId: string;
}

export interface UpdatePartnerPaymentStatusDto {
  partnerId: string;
  paymentStatus: PaymentStatus;
  planType: PlanType;
  paymentDate: string;
  expirationDate: string;
}

@Injectable()
export class PartnerPaymentService extends PrismaClient implements OnModuleInit {
  
  async onModuleInit() {
    await this.$connect();
  }

  // Crear transacción de pago
  async createPaymentTransaction(createPaymentDto: CreatePaymentTransactionDto) {
    try {
      const transaction = await this.paymentTransaction.create({
        data: {
          partnerId: createPaymentDto.partnerId,
          amount: createPaymentDto.amount,
          currency: createPaymentDto.currency || 'COP',
          transactionId: createPaymentDto.transactionId,
          paymentMethod: createPaymentDto.paymentMethod,
          status: createPaymentDto.status || PaymentStatus.PENDING,
          planType: createPaymentDto.planType,
          expirationDate: new Date(createPaymentDto.expirationDate),
          metadata: createPaymentDto.metadata || {}
        }
      });

      return {
        status: 200,
        data: transaction
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Validar pago y actualizar estado del partner
  async validatePayment(validatePaymentDto: ValidatePaymentDto) {
    try {
      const { partnerId, transactionId } = validatePaymentDto;

      // Buscar la transacción
      const transaction = await this.paymentTransaction.findUnique({
        where: { transactionId }
      });

      if (!transaction) {
        throw new RpcException({
          status: 404,
          message: 'Transacción no encontrada'
        });
      }

      if (transaction.partnerId !== partnerId) {
        throw new RpcException({
          status: 403,
          message: 'No autorizado para validar esta transacción'
        });
      }

      // Actualizar estado de la transacción
      const updatedTransaction = await this.paymentTransaction.update({
        where: { transactionId },
        data: {
          status: PaymentStatus.PAID,
          updatedAt: new Date()
        }
      });

      // Actualizar estado del partner
      await this.updatePartnerPaymentStatus({
        partnerId,
        paymentStatus: PaymentStatus.PAID,
        planType: transaction.planType as PlanType,
        paymentDate: new Date().toISOString(),
        expirationDate: transaction.expirationDate.toISOString()
      });

      return {
        status: 200,
        data: updatedTransaction
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Actualizar estado de pago del partner
  async updatePartnerPaymentStatus(updateDto: UpdatePartnerPaymentStatusDto) {
    try {
      const updatedPartner = await this.userDataPartner.update({
        where: { id: updateDto.partnerId },
        data: {
          payment_status: updateDto.paymentStatus,
          plan_type: updateDto.planType,
          payment_date: new Date(updateDto.paymentDate),
          expiration_date: new Date(updateDto.expirationDate)
        }
      });

      return {
        status: 200,
        data: updatedPartner
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Verificar si un partner tiene un plan activo
  async checkPartnerSubscription(partnerId: string) {
    try {
      const partner = await this.userDataPartner.findUnique({
        where: { id: partnerId },
        select: {
          id: true,
          payment_status: true,
          plan_type: true,
          payment_date: true,
          expiration_date: true
        }
      });

      if (!partner) {
        throw new RpcException({
          status: 404,
          message: 'Partner no encontrado'
        });
      }

      const now = new Date();
      const isActive = partner.expiration_date ? new Date(partner.expiration_date) > now : false;
      const hasPaid = partner.payment_status === PaymentStatus.PAID;

      return {
        status: 200,
        data: {
          partnerId: partner.id,
          hasActiveSubscription: hasPaid && isActive,
          hasPaid: partner.payment_status === PaymentStatus.PAID,
          planType: partner.plan_type,
          paymentDate: partner.payment_date,
          expirationDate: partner.expiration_date,
          isActive
        }
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Obtener historial de transacciones de un partner
  async getPartnerPaymentHistory(partnerId: string) {
    try {
      const transactions = await this.paymentTransaction.findMany({
        where: { partnerId },
        orderBy: { createdAt: 'desc' }
      });

      return {
        status: 200,
        data: transactions
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Procesar pago de especialista
  async processPartnerPayment(partnerId: string, transactionId: string, amount: number, planType: PlanType, paymentMethod: string) {
    try {
      // Verificar que el partner existe
      const partner = await this.userDataPartner.findUnique({
        where: { id: partnerId }
      });

      if (!partner) {
        throw new RpcException({
          status: 404,
          message: 'Partner no encontrado'
        });
      }

      // Calcular fecha de expiración (30 días desde ahora)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      // Crear transacción de pago
      await this.createPaymentTransaction({
        partnerId,
        amount,
        transactionId,
        paymentMethod,
        planType,
        expirationDate: expirationDate.toISOString()
      });

      // Actualizar estado del partner a PAID
      await this.userDataPartner.update({
        where: { id: partnerId },
        data: {
          payment_status: PaymentStatus.PAID,
          plan_type: planType,
          payment_date: new Date(),
          expiration_date: expirationDate
        }
      });

      return {
        status: 200,
        message: 'Pago procesado exitosamente',
        data: {
          partnerId,
          planType,
          expirationDate
        }
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }

  // Expirar planes vencidos (tarea programada)
  async expireSubscriptions() {
    try {
      const now = new Date();
      
      const expiredPartners = await this.userDataPartner.updateMany({
        where: {
          expiration_date: {
            lt: now
          },
          payment_status: PaymentStatus.PAID
        },
        data: {
          payment_status: PaymentStatus.EXPIRED
        }
      });

      return {
        status: 200,
        data: {
          expiredPartnersCount: expiredPartners.count
        }
      };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      });
    }
  }
}