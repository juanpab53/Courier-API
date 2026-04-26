export class CustomerNotFoundException extends Error {
  constructor(id: string) {
    super(`Customer with id ${id} not found`);
    this.name = 'CustomerNotFoundException';
  }
}

export class EmailAlreadyExistsException extends Error {
  constructor(email: string) {
    super(`Email ${email} already exists`);
    this.name = 'EmailAlreadyExistsException';
  }
}