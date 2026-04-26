import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { ShipmentEntity } from './shipment.entity';
import { ShipmentMapper } from './shipment.mapper';

@Injectable()
export class ShipmentRepository implements ShipmentRepositoryPort {
  constructor(
    @InjectRepository(ShipmentEntity)
    private readonly repository: Repository<ShipmentEntity>,
  ) {}

  async save(model: ShipmentModel): Promise<ShipmentModel> {
    const entity = ShipmentMapper.toEntity(model);
    const saved = await this.repository.save(entity);
    return ShipmentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<ShipmentModel | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    return entity ? ShipmentMapper.toDomain(entity) : null;
  }

  async findBySenderId(senderId: string): Promise<ShipmentModel[]> {
    const entities = await this.repository.find({ where: { senderId } as any });
    return entities.map(ShipmentMapper.toDomain);
  }

  async findByRecipientId(recipientId: string): Promise<ShipmentModel[]> {
    const entities = await this.repository.find({ where: { recipientId } as any });
    return entities.map(ShipmentMapper.toDomain);
  }

  async update(model: ShipmentModel): Promise<ShipmentModel> {
    const entity = ShipmentMapper.toEntity(model);
    const updated = await this.repository.save(entity);
    return ShipmentMapper.toDomain(updated);
  }
}