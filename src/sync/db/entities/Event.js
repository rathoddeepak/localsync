// models/Event.js
import { Model } from '@nozbe/watermelondb';
import {
  field,
  date,
  readonly,
  children,
} from '@nozbe/watermelondb/decorators';

export default class Event extends Model {
  static table = 'events';
  static associations = {
    event_attendees: { type: 'has_many', foreignKey: 'event_id' },
    event_photos: { type: 'has_many', foreignKey: 'event_id' },
  };

  @field('group_id') groupId;
  @field('event_name') eventName;
  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  @children('event_attendees') attendees;
  @children('event_photos') photos;
}
