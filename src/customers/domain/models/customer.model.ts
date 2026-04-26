export enum CustomerRole {
  ADMIN = 'ADMIN',
  SENDER = 'SENDER',
}

export class customerModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role: CustomerRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    role: CustomerRole,
    isActive: boolean = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isAdmin(): boolean {
    return this.role === CustomerRole.ADMIN;
  }

  updateName(newName: string): void {
    this.name = newName;
    this.updatedAt = new Date();
  }

  updateRole(newRole: CustomerRole): void {
    this.role = newRole;
    this.updatedAt = new Date();
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
