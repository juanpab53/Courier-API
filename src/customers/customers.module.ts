import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersController } from './infrastructure/controllers/customers.controller';
import { CustomerRepository } from './infrastructure/persistence/postgres/customer.repository';
import { CustomerEntity } from './infrastructure/persistence/postgres/customer.entity';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { GetAllCustomersUseCase } from './application/use-cases/get-all-customers.use-case';
import { GetCustomerByIdUseCase } from './application/use-cases/get-customer-by-id.use-case';
import { UpdateCustomerUseCase } from './application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from './application/use-cases/delete-customer.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  controllers: [CustomersController],
  providers: [
    CustomerRepository,
    CreateCustomerUseCase,
    GetAllCustomersUseCase,
    GetCustomerByIdUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
  ],
  exports: [CustomerRepository],
})
export class CustomersModule {}