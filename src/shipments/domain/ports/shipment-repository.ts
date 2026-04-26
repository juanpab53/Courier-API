import { ShipmentModel } from '../models/shipment.model';

export abstract class ShipmentRepositoryPort {
  abstract save(shipment: ShipmentModel): Promise<ShipmentModel>;
  abstract findById(id: string): Promise<ShipmentModel | null>;
  abstract findBySenderId(senderId: string): Promise<ShipmentModel[]>;
  abstract findByRecipientId(recipientId: string): Promise<ShipmentModel[]>;
  abstract update(shipment: ShipmentModel): Promise<ShipmentModel>;
}