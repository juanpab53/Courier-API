import { ShipmentModel } from '../../domain/models/shipment.model';
import { ShipmentEntity } from './shipment.entity';

export class ShipmentMapper {
  static toDomain(entity: ShipmentEntity): ShipmentModel {
    return new ShipmentModel(
      entity.id,
      entity.senderId,
      entity.recipientId,
      Number(entity.declaredValue),
      Number(entity.shippingCost),
      entity.type,
      entity.status,
      entity.metadata || {},
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(model: ShipmentModel): ShipmentEntity {
    const entity = new ShipmentEntity();
    entity.id = model.id;
    entity.senderId = model.senderId;
    entity.recipientId = model.recipientId;
    entity.declaredValue = model.declaredValue;
    entity.shippingCost = model.shippingCost;
    entity.type = model.type;
    entity.status = model.status;
    entity.metadata = model.metadata;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }
}