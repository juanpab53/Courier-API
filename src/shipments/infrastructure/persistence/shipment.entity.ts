import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ShipmentType, ShipmentStatus } from '../../domain/models/shipment.model';

@Entity('shipments')
export class ShipmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'sender_id' })
  senderId!: string;

  @Column({ name: 'recipient_id' })
  recipientId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  declaredValue!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  shippingCost!: number;

  @Column({ type: 'enum', enum: ShipmentType })
  type!: ShipmentType;

  @Column({ type: 'enum', enum: ShipmentStatus, default: ShipmentStatus.PENDING })
  status!: ShipmentStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}