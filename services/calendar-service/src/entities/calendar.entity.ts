import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('calendar')
export class Calendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  constructor(partial: Partial<Calendar>) {
    Object.assign(this, partial);
  }
}
