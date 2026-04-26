import { ShipmentModel } from '../models/shipment.model';

export interface ShipmentStrategyResult {
  cost: number;
  finalStatus: 'DELIVERED' | 'IN_CUSTOMS' | 'FAILED';
}

export abstract class ShipmentStrategyPort {
  abstract validate(metadata: Record<string, any>, declaredValue: number): void;
  abstract calculateCost(metadata: Record<string, any>, declaredValue: number): number;
  abstract execute(model: ShipmentModel): ShipmentStrategyResult;
}