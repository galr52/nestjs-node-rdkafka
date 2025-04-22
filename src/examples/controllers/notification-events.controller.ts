import { Controller, Logger } from '@nestjs/common';
import { KafkaHandler } from '../../registry';
import { NotificationEvent } from '../interfaces/events.interface';

@Controller()
export class NotificationEventsController {
  private readonly logger = new Logger(NotificationEventsController.name);

  @KafkaHandler('notifications.email')
  async handleEmailNotification(message: string) {
    try {
      const notification: NotificationEvent = JSON.parse(message);
      this.logger.log(
        `Processing email notification: ${notification.content.subject} to ${notification.recipient}`
      );
      await this.sendEmail(notification);
    } catch (error) {
      this.logger.error('Failed to process email notification', error);
    }
  }

  @KafkaHandler('notifications.sms')
  async handleSMSNotification(message: string) {
    try {
      const notification: NotificationEvent = JSON.parse(message);
      this.logger.log(
        `Processing SMS notification to ${notification.recipient}`
      );
      await this.sendSMS(notification);
    } catch (error) {
      this.logger.error('Failed to process SMS notification', error);
    }
  }

  @KafkaHandler('notifications.push')
  async handlePushNotification(message: string) {
    try {
      const notification: NotificationEvent = JSON.parse(message);
      this.logger.log(
        `Processing push notification to ${notification.recipient}`
      );
      await this.sendPushNotification(notification);
    } catch (error) {
      this.logger.error('Failed to process push notification', error);
    }
  }

  private async sendEmail(notification: NotificationEvent): Promise<void> {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 100));
    this.logger.log(`Email sent to ${notification.recipient}`);
  }

  private async sendSMS(notification: NotificationEvent): Promise<void> {
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 50));
    this.logger.log(`SMS sent to ${notification.recipient}`);
  }

  private async sendPushNotification(notification: NotificationEvent): Promise<void> {
    // Simulate push notification sending
    await new Promise(resolve => setTimeout(resolve, 30));
    this.logger.log(`Push notification sent to ${notification.recipient}`);
  }
} 