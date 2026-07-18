import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class LuluMessage extends Model {
  static table = 'lulu_messages';

  @field('session_id') sessionId: string;
  @field('role') role: string;
  @field('contenu') contenu: string;
  @date('date') date: Date;
  @field('synced') synced: boolean;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
}