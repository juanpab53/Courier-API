import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository';
import { customerModel } from '../../domain/models/customer.model';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';

@Injectable()
export class GetCustomerByIdUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(id: string): Promise<customerModel> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return customer;
  }
}