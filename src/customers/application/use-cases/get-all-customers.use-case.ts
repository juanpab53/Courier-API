import { Injectable } from '@nestjs/common';
import { CustomerRepositoryPort } from '../../domain/ports/customer-repository';
import { customerModel } from '../../domain/models/customer.model';

@Injectable()
export class GetAllCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepositoryPort) {}

  async execute(): Promise<customerModel[]> {
    return this.customerRepository.findAll();
  }
}