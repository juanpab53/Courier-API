export enum ShipmentType {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  INTERNATIONAL = 'INTERNATIONAL',
  THIRD_PARTY_CARRIER = 'THIRD_PARTY_CARRIER',
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  IN_CUSTOMS = 'IN_CUSTOMS',
  FAILED = 'FAILED',
}

export interface ShipmentMetadata {
  weightKg?: number;
  destinationCountry?: string;
  customsDeclaration?: string;
  carrierName?: string;
  externalTrackingId?: string;
}

export class ShipmentModel {
  id!: string;
  senderId!: string;
  recipientId!: string;
  declaredValue!: number;
  shippingCost!: number;
  type!: ShipmentType;
  status!: ShipmentStatus;
  metadata!: ShipmentMetadata;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    id: string,
    senderId: string,
    recipientId: string,
    declaredValue: number,
    shippingCost: number,
    type: ShipmentType,
    status: ShipmentStatus = ShipmentStatus.PENDING,
    metadata: ShipmentMetadata = {},
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.declaredValue = declaredValue;
    this.shippingCost = shippingCost;
    this.type = type;
    this.status = status;
    this.metadata = metadata;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  markDelivered(): void {
    this.status = ShipmentStatus.DELIVERED;
    this.updatedAt = new Date();
  }

  markInCustoms(): void {
    this.status = ShipmentStatus.IN_CUSTOMS;
    this.updatedAt = new Date();
  }

  markFailed(): void {
    this.status = ShipmentStatus.FAILED;
    this.updatedAt = new Date();
  }
}