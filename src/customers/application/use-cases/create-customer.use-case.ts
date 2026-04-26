import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository';
import { customerModel, CustomerRole } from '../../domain/models/customer.model';
import { CreateCustomerDto } from '../dtos/customer.dto';
import { EmailAlreadyExistsException } from '../../domain/exceptions/customer.exceptions';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(dto: CreateCustomerDto): Promise<customerModel> {
    const existing = await this.customerRepository.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyExistsException(dto.email);
    }

    const customer = new customerModel(
      uuidv4(),
      dto.name,
      dto.email,
      dto.password,
      dto.role || CustomerRole.SENDER,
      true,
      new Date(),
      new Date(),
    );

    return this.customerRepository.save(customer);
  }
}