import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PartnerPaymentService, CreatePaymentTransactionDto, ValidatePaymentDto, UpdatePartnerPaymentStatusDto, PlanType } from '../services/partner.payment.service';

@Controller()
export class PartnerPaymentController {
  constructor(
    private readonly partnerPaymentService: PartnerPaymentService
  ) {}

  @MessagePattern('partner.payment.create.transaction')
  createPaymentTransaction(@Payload() createPaymentDto: CreatePaymentTransactionDto) {
    return this.partnerPaymentService.createPaymentTransaction(createPaymentDto);
  }

  @MessagePattern('partner.payment.validate')
  validatePayment(@Payload() validatePaymentDto: ValidatePaymentDto) {
    return this.partnerPaymentService.validatePayment(validatePaymentDto);
  }

  @MessagePattern('partner.payment.update.status')
  updatePartnerPaymentStatus(@Payload() updateDto: UpdatePartnerPaymentStatusDto) {
    return this.partnerPaymentService.updatePartnerPaymentStatus(updateDto);
  }

  @MessagePattern('partner.payment.check.subscription')
  checkPartnerSubscription(@Payload() { partnerId }: { partnerId: string }) {
    return this.partnerPaymentService.checkPartnerSubscription(partnerId);
  }

  @MessagePattern('partner.payment.history')
  getPartnerPaymentHistory(@Payload() { partnerId }: { partnerId: string }) {
    return this.partnerPaymentService.getPartnerPaymentHistory(partnerId);
  }

  @MessagePattern('partner.payment.process')
  processPartnerPayment(@Payload() { partnerId, transactionId, amount, planType, paymentMethod }: { 
    partnerId: string, 
    transactionId: string, 
    amount: number, 
    planType: PlanType, 
    paymentMethod: string 
  }) {
    return this.partnerPaymentService.processPartnerPayment(partnerId, transactionId, amount, planType, paymentMethod);
  }

  @MessagePattern('partner.payment.expire.subscriptions')
  expireSubscriptions() {
    return this.partnerPaymentService.expireSubscriptions();
  }
}