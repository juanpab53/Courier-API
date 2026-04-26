import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateShipmentDto, ShipmentResponseDto } from '../../application/dtos/shipment.dto';
import { CreateShipmentUseCase } from '../../application/use-cases/create-shipment.use-case';
import { GetShipmentByIdUseCase } from '../../application/use-cases/get-shipment-by-id.use-case';
import { ShipmentRepositoryPort } from '../../domain/ports/shipment-repository';

@Controller('api/shipments')
export class ShipmentsController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly getShipmentByIdUseCase: GetShipmentByIdUseCase,
    private readonly shipmentRepository: ShipmentRepositoryPort,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateShipmentDto): Promise<ShipmentResponseDto> {
    const shipment = await this.createShipmentUseCase.execute(dto);
    return new ShipmentResponseDto(shipment);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ShipmentResponseDto> {
    const shipment = await this.getShipmentByIdUseCase.execute(id);
    return new ShipmentResponseDto(shipment);
  }

  @Get('customer/:customerId')
  async findByCustomer(@Param('customerId') customerId: string): Promise<ShipmentResponseDto[]> {
    const sent = await this.shipmentRepository.findBySenderId(customerId);
    const received = await this.shipmentRepository.findByRecipientId(customerId);
    const all = [...sent, ...received];
    return all.map(s => new ShipmentResponseDto(s));
  }
}