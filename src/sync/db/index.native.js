import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './model/schema';
import migrations from './model/migrations';
import Event from './entities/Event';
import EventAttendee from './entities/EventAttendee';
import EventPhoto from './entities/EventPhoto';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  jsi: true,
  onSetUpError: error => {
    console.log('error: ', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [Event, EventAttendee, EventPhoto],
});
