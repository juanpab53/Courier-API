import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerRole } from '../../domain/models/customer.model';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  password!: string;

  @ApiPropertyOptional({ enum: CustomerRole })
  @IsEnum(CustomerRole)
  @IsOptional()
  role?: CustomerRole;
}

export class UpdateCustomerDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: CustomerRole })
  @IsEnum(CustomerRole)
  @IsOptional()
  role?: CustomerRole;
}

export class CustomerResponseDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  email!: string;
  @ApiProperty({ enum: CustomerRole })
  role!: CustomerRole;
  @ApiProperty()
  isActive!: boolean;
  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;

  constructor(partial?: Partial<CustomerResponseDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}