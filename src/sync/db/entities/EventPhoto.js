// models/EventPhoto.js
import { Model } from '@nozbe/watermelondb';
import {
  field,
  date,
  readonly,
  relation,
} from '@nozbe/watermelondb/decorators';

export default class EventPhoto extends Model {
  static table = 'event_photos';
  static associations = {
    events: { type: 'belongs_to', key: 'event_id' },
  };

  @field('group_id') groupId;
  @field('event_id') eventId;
  @field('photo_url') photoUrl;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @relation('events', 'event_id') event;
}
