import { IsString, IsNumber, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ShipmentType } from '../../domain/models/shipment.model';

export class CreateShipmentDto {
  @ApiProperty()
  @IsString()
  senderId!: string;

  @ApiProperty()
  @IsString()
  recipientId!: string;

  @ApiProperty()
  @IsNumber()
  declaredValue!: number;

  @ApiProperty({ enum: ShipmentType })
  @IsEnum(ShipmentType)
  type!: ShipmentType;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class ShipmentResponseDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  senderId!: string;
  @ApiProperty()
  recipientId!: string;
  @ApiProperty()
  declaredValue!: number;
  @ApiProperty()
  shippingCost!: number;
  @ApiProperty({ enum: ShipmentType })
  type!: ShipmentType;
  @ApiProperty()
  status!: string;
  @ApiProperty()
  metadata!: Record<string, any>;
  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;

  constructor(partial?: Partial<ShipmentResponseDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}