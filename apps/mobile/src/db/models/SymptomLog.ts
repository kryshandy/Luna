import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';

export default class SymptomLog extends Model {
  static table = 'symptom_logs';
  static associations = {
    cycles: { type: 'belongs_to' as const, key: 'cycle_id' },
  };

  @field('cycle_id') cycleId: string;
  @date('date') date: Date;
  @field('energie') energie?: number;
  @field('humeur') humeur?: string;
  @field('douleur') douleur?: number;
  @field('synced') synced: boolean;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  @relation('cycles', 'cycle_id') cycle: any;
}