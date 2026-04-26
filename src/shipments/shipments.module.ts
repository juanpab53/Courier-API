import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShipmentsController } from './infrastructure/controllers/shipments.controller';
import { ShipmentRepository } from './infrastructure/persistence/shipment.repository';
import { ShipmentEntity } from './infrastructure/persistence/shipment.entity';
import { CreateShipmentUseCase } from './application/use-cases/create-shipment.use-case';
import { GetShipmentByIdUseCase } from './application/use-cases/get-shipment-by-id.use-case';
import { StandardShippingStrategy } from './application/strategies/standard-shipping.strategy';
import { ExpressShippingStrategy } from './application/strategies/express-shipping.strategy';
import { InternationalShippingStrategy } from './application/strategies/international-shipping.strategy';
import { ThirdPartyCarrierStrategy } from './application/strategies/third-party-carrier.strategy';
import { ShipmentStrategyFactory } from './application/strategies/shipment-strategy.factory';
import { ConsoleEventPublisher } from '../shared/events/console-event-publisher';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShipmentEntity]),
    CustomersModule,
  ],
  controllers: [ShipmentsController],
  providers: [
    ShipmentRepository,
    CreateShipmentUseCase,
    GetShipmentByIdUseCase,
    StandardShippingStrategy,
    ExpressShippingStrategy,
    InternationalShippingStrategy,
    ThirdPartyCarrierStrategy,
    ShipmentStrategyFactory,
    ConsoleEventPublisher,
  ],
  exports: [ShipmentRepository],
})
export class ShipmentsModule {}