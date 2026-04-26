import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto } from '../../application/dtos/customer.dto';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { GetAllCustomersUseCase } from '../../application/use-cases/get-all-customers.use-case';
import { GetCustomerByIdUseCase } from '../../application/use-cases/get-customer-by-id.use-case';
import { UpdateCustomerUseCase } from '../../application/use-cases/update-customer.use-case';
import { DeleteCustomerUseCase } from '../../application/use-cases/delete-customer.use-case';

@Controller('api/customers')
export class CustomersController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getAllCustomersUseCase: GetAllCustomersUseCase,
    private readonly getCustomerByIdUseCase: GetCustomerByIdUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.createCustomerUseCase.execute(dto);
    return new CustomerResponseDto(customer);
  }

  @Get()
  async findAll(): Promise<CustomerResponseDto[]> {
    const customers = await this.getAllCustomersUseCase.execute();
    return customers.map(c => new CustomerResponseDto(c));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
    const customer = await this.getCustomerByIdUseCase.execute(id);
    return new CustomerResponseDto(customer);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCustomerDto): Promise<CustomerResponseDto> {
    const customer = await this.updateCustomerUseCase.execute(id, dto);
    return new CustomerResponseDto(customer);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }
}