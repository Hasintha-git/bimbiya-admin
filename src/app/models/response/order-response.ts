import { OrderDetailResponse } from "./order-detail-response";

export class OrderResponse {
    orderId: number;
    userId: number;
    orderDate: Date;
    totalAmount: string;
    status: string;
    createdUser: string;
    lastUpdatedUser: string;
    lastUpdatedTime: Date;
    createdTime: Date;
    scheduleTime: string;

    username: string;
    fullName: string;
    email: string;
    mobileNo: string;
    address: string;
    city: string;

    orderDetails: Array<OrderDetailResponse>;
}
  