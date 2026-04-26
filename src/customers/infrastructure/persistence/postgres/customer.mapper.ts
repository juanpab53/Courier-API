import { customerModel } from '../../../domain/models/customer.model';
import { CustomerEntity } from './customer.entity';

export class CustomerMapper {
  static toDomain(entity: CustomerEntity): customerModel {
    return new customerModel(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.role,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toEntity(model: customerModel): CustomerEntity {
    const entity = new CustomerEntity();
    entity.id = model.id;
    entity.name = model.name;
    entity.email = model.email;
    entity.password = model.password;
    entity.role = model.role;
    entity.isActive = model.isActive;
    entity.createdAt = model.createdAt;
    entity.updatedAt = model.updatedAt;
    return entity;
  }
}