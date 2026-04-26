import { Injectable } from '@nestjs/common';
import { ShipmentStrategyPort, ShipmentStrategyResult } from '../../domain/ports/shipment-strategy.port';
import { ShipmentModel } from '../../domain/models/shipment.model';
import { InvalidShipmentException } from '../../domain/exceptions/shipment.exceptions';

@Injectable()
export class InternationalShippingStrategy extends ShipmentStrategyPort {
  validate(metadata: Record<string, any>, declaredValue: number): void {
    if (declaredValue <= 0) {
      throw new InvalidShipmentException('declaredValue must be greater than 0');
    }
    if (!metadata.destinationCountry) {
      throw new InvalidShipmentException('International: destinationCountry is required');
    }
    if (!metadata.customsDeclaration) {
      throw new InvalidShipmentException('International: customsDeclaration is required');
    }
    if (declaredValue > 50000000) {
      throw new InvalidShipmentException('International: declaredValue must be <= 50,000,000');
    }
  }

  calculateCost(_metadata: Record<string, any>, declaredValue: number): number {
    return 50000 + declaredValue * 0.02;
  }

  execute(model: ShipmentModel): ShipmentStrategyResult {
    model.markInCustoms();
    return {
      cost: model.shippingCost,
      finalStatus: 'IN_CUSTOMS',
    };
  }
}