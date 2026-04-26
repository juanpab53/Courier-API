import { customerModel } from '../models/customer.model';

export abstract class CustomerRepositoryPort {
  abstract save(user: customerModel): Promise<customerModel>;
  abstract findById(id: string): Promise<customerModel | null>;
  abstract findByEmail(email: string): Promise<customerModel | null>;
  abstract findAll(): Promise<customerModel[]>;
  abstract update(user: customerModel): Promise<customerModel>;
  abstract delete(id: string): Promise<void>;
}