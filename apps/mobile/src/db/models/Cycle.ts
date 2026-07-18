import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, children } from '@nozbe/watermelondb/decorators';

export default class Cycle extends Model {
  static table = 'cycles';
  static associations = {
    symptom_logs: { type: 'has_many' as const, foreignKey: 'cycle_id' },
  };

  @date('date_debut') dateDebut: Date;
  @date('date_fin') dateFin?: Date;
  @field('duree') duree?: number;
  @field('synced') synced: boolean;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;

  @children('symptom_logs') symptomLogs: any;
}