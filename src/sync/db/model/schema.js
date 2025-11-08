import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'events',
      columns: [
        { name: 'group_id', type: 'number' },
        { name: 'event_name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'event_attendees',
      columns: [
        { name: 'group_id', type: 'number' },
        { name: 'event_id', type: 'string', isIndexed: true },
        { name: 'user_id', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'event_photos',
      columns: [
        { name: 'group_id', type: 'number' },
        { name: 'event_id', type: 'string', isIndexed: true },
        { name: 'photo_url', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
