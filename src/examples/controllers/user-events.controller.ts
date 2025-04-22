import { Controller, Logger } from '@nestjs/common';
import { KafkaHandler } from '../../registry';
import { UserEvent } from '../interfaces/events.interface';

@Controller()
export class UserEventsController {
  private readonly logger = new Logger(UserEventsController.name);

  @KafkaHandler('users.created')
  handleUserCreated(message: string) {
    try {
      const userData: UserEvent = JSON.parse(message);
      this.logger.log(`New user created: ${userData.name} (${userData.email})`);
      // Add your business logic here
    } catch (error) {
      this.logger.error('Failed to process user creation event', error);
    }
  }

  @KafkaHandler('users.updated')
  handleUserUpdated(message: string) {
    try {
      const userData: Partial<UserEvent> = JSON.parse(message);
      this.logger.log(`User updated: ${userData.id}`);
      // Add your business logic here
    } catch (error) {
      this.logger.error('Failed to process user update event', error);
    }
  }

  @KafkaHandler('users.deleted')
  handleUserDeleted(message: string) {
    try {
      const { id } = JSON.parse(message);
      this.logger.log(`User deleted: ${id}`);
      // Add your business logic here
    } catch (error) {
      this.logger.error('Failed to process user deletion event', error);
    }
  }
}
