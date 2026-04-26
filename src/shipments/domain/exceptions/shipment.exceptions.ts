export class ShipmentNotFoundException extends Error {
  constructor(id: string) {
    super(`Shipment with id ${id} not found`);
    this.name = 'ShipmentNotFoundException';
  }
}

export class InvalidShipmentException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidShipmentException';
  }
}

export class CustomerNotActiveException extends Error {
  constructor(id: string) {
    super(`Customer with id ${id} is not active`);
    this.name = 'CustomerNotActiveException';
  }
}

export class SameSenderRecipientException extends Error {
  constructor() {
    super('Sender and recipient must be different');
    this.name = 'SameSenderRecipientException';
  }
}