import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class JournalEntry extends Model {
  static table = 'journal_entries';

  @field('texte') texte: string;
  @field('humeur') humeur?: string;
  @field('tags') tags?: string;
  @date('date') date: Date;
  @field('synced') synced: boolean;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
}