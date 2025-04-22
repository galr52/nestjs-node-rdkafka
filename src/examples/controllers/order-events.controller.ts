import { Controller, Logger } from '@nestjs/common';
import { KafkaHandler } from '../../registry';
import { OrderEvent } from '../interfaces/events.interface';

@Controller()
export class OrderEventsController {
  private readonly logger = new Logger(OrderEventsController.name);

  @KafkaHandler('orders.created')
  async handleOrderCreated(message: string) {
    try {
      const orderData: OrderEvent = JSON.parse(message);
      this.logger.log(`New order created: ${orderData.orderId}`);
      await this.processOrder(orderData);
    } catch (error) {
      this.logger.error('Failed to process order creation', error);
    }
  }

  @KafkaHandler('orders.status-updated')
  handleOrderStatusUpdate(message: string) {
    try {
      const orderData: OrderEvent = JSON.parse(message);
      this.logger.log(`Order ${orderData.orderId} status changed to ${orderData.status}`);
      // Add your business logic here
    } catch (error) {
      this.logger.error('Failed to process order status update', error);
    }
  }

  private async processOrder(orderData: OrderEvent): Promise<void> {
    // Simulate some async processing
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.log(`Processed order ${orderData.orderId} for user ${orderData.userId}`);

    // Calculate order summary
    const itemCount = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
    this.logger.log(`Order summary: ${itemCount} items, total: $${orderData.totalAmount}`);
  }
}
