import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository';
import { customerModel, CustomerRole } from '../../domain/models/customer.model';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';

export class UpdateCustomerDto {
  name?: string;
  role?: CustomerRole;
}

@Injectable()
export class UpdateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(id: string, dto: UpdateCustomerDto): Promise<customerModel> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    if (dto.name) {
      customer.updateName(dto.name);
    }
    if (dto.role) {
      customer.updateRole(dto.role);
    }

    return this.customerRepository.update(customer);
  }
}