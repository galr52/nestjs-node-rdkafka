export interface UserEvent {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface OrderEvent {
  orderId: string;
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'created' | 'paid' | 'shipped' | 'delivered';
  timestamp: string;
}

export interface NotificationEvent {
  id: string;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  content: {
    subject?: string;
    body: string;
    metadata?: Record<string, any>;
  };
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
}
