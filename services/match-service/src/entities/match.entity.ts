import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  FINISHED = 'FINISHED',
}

@Entity('match')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  equipeA: string;

  @Column()
  equipeB: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  location: string;

  @Column({ type: 'int', nullable: true })
  scoreA: number | null;

  @Column({ type: 'int', nullable: true })
  scoreB: number | null;

  @Column({
    type: 'enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED,
  })
  status: MatchStatus;
}
