import { sql } from 'drizzle-orm';
import { serial, text, timestamp, boolean, integer, index, pgTable, } from 'drizzle-orm/pg-core';

// Users table
const users = pgTable(
    'users',
    {
      id: serial('id').primaryKey(),
      auth_uid: text('auth_uid').unique().notNull(),
      auth_provider: text('auth_provider').notNull(), // email, google, facebook
      name: text('name').notNull(),
      email: text('email').unique().notNull(),
      created_at: timestamp('created_at').defaultNow().notNull(),
      updated_at: timestamp('updated_at'),
      verified: boolean('verified').notNull(),
      last_login: timestamp('last_login'),
      no_of_logins: integer('no_of_logins').default(0),
      avatar: text('avatar'),
      background_photo: text('background_photo'),
      bio: text('bio'),
      total_followers: integer('total_followers').default(0),
      total_likes: integer('total_likes').default(0),
      total_subscribers: integer('total_subscribers').default(0),
    },
    (table) => ({
      // Indexes
      auth_uid_idx: index('auth_uid_idx').on(table.auth_uid),
      email_idx: index('email_idx').on(table.email),
      user_search_index: index('user_search_index').using(
        'gin',
        sql`to_tsvector('english', ${table.name}`
      ),
    })
  );

  export { users }