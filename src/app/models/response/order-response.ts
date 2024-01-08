import { OrderDetailResponse } from "./order-detail-response";

export class OrderResponse {
    orderId: number;
    userId: number;
    orderDate: Date;
    totalAmount: string;
    status: string;
    createdUser: string;
    lastUpdatedUser: string;
    createdTime: Date;
    lastUpdatedTime: Date;

    username: string;
    fullName: string;
    email: string;
    mobileNo: string;
    address: string;
    city: string;

    orderDetails: Array<OrderDetailResponse>;
}
  