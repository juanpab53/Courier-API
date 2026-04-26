import { Injectable } from '@nestjs/common';
import { ShipmentStrategyPort } from '../../domain/ports/shipment-strategy.port';
import { ShipmentType } from '../../domain/models/shipment.model';
import { StandardShippingStrategy } from './standard-shipping.strategy';
import { ExpressShippingStrategy } from './express-shipping.strategy';
import { InternationalShippingStrategy } from './international-shipping.strategy';
import { ThirdPartyCarrierStrategy } from './third-party-carrier.strategy';

@Injectable()
export class ShipmentStrategyFactory {
  private readonly strategies: Map<ShipmentType, ShipmentStrategyPort>;

  constructor(
    private readonly standardStrategy: StandardShippingStrategy,
    private readonly expressStrategy: ExpressShippingStrategy,
    private readonly internationalStrategy: InternationalShippingStrategy,
    private readonly thirdPartyStrategy: ThirdPartyCarrierStrategy,
  ) {
    this.strategies = new Map([
      [ShipmentType.STANDARD, standardStrategy],
      [ShipmentType.EXPRESS, expressStrategy],
      [ShipmentType.INTERNATIONAL, internationalStrategy],
      [ShipmentType.THIRD_PARTY_CARRIER, thirdPartyStrategy],
    ]);
  }

  getStrategy(type: ShipmentType): ShipmentStrategyPort {
    const strategy = this.strategies.get(type);
    if (!strategy) {
      throw new Error(`Strategy not found for type: ${type}`);
    }
    return strategy;
  }
}