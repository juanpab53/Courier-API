import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository';
import { CustomerNotFoundException } from '../../domain/exceptions/customer.exceptions';

@Injectable()
export class DeleteCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(id: string): Promise<void> {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    customer.deactivate();
    await this.customerRepository.update(customer);
  }
}