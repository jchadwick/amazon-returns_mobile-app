export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
  token: string;
}

export interface OrderProduct {
  id: number;
  account_id: string;
  order_id: string;
  product_id: string;
  status: OrderStatus;
  service: string;
  product_name: string | undefined;
  product_url: string | undefined;
  product_image_url: string | undefined;
  return_url: string | undefined;
  return_location: ReturnLocation | undefined;
  return_method: string | undefined;
  return_image_url: string | undefined;
  return_status_url: string | undefined;
  estimated_refund_amount: number | undefined;
}

export type OrderStatus = (typeof OrderStatuses)[number];

export const OrderStatuses = [
  "cancelled",
  "created",
  "shipped",
  "delivered",
  "return_created",
  "returned",
  "refunded",
] as const;

export const ReturnLocations = [
  "kohls",
  "staples",
  "whole_foods",
  "ups_store",
  "ups_dropoff",
  "ups_pickup",
  "unknown",
] as const;

export type ReturnLocation = (typeof ReturnLocations)[number];

export const ReturnLocationNames: Record<ReturnLocation, string> = {
  kohls: "Kohl's",
  staples: "Staples",
  whole_foods: "Whole Foods",
  ups_store: "UPS Store",
  ups_dropoff: "UPS Dropoff",
  ups_pickup: "UPS Pickup",
  unknown: "Unknown",
};
