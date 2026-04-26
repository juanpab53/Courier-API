import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerRepositoryPort } from '../../../domain/ports/customer-repository';
import { customerModel } from '../../../domain/models/customer.model';
import { CustomerEntity } from './customer.entity';
import { CustomerMapper } from './customer.mapper';

@Injectable()
export class CustomerRepository implements CustomerRepositoryPort {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly repository: Repository<CustomerEntity>,
  ) {}

  async save(model: customerModel): Promise<customerModel> {
    const entity = CustomerMapper.toEntity(model);
    const saved = await this.repository.save(entity);
    return CustomerMapper.toDomain(saved);
  }

  async findById(id: string): Promise<customerModel | null> {
    const entity = await this.repository.findOne({ where: { id } as any });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<customerModel | null> {
    const entity = await this.repository.findOne({ where: { email } as any });
    return entity ? CustomerMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<customerModel[]> {
    const entities = await this.repository.find();
    return entities.map(CustomerMapper.toDomain);
  }

  async update(model: customerModel): Promise<customerModel> {
    const entity = CustomerMapper.toEntity(model);
    const updated = await this.repository.save(entity);
    return CustomerMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}