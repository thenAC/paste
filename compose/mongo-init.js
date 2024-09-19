db.createUser({
  user: 'root',
  pwd: 'your_auth_pass',
  roles: [
    {
      role: 'readWrite',
      db: 'thenac_paste',
    },
  ],
});

db.createCollection('statistics');
db.createCollection('pieces');

db.statistics.update(
  { key: 'main' },
  { $setOnInsert: { totalCount: NumberLong('0'), totalBytes: NumberLong('0') } },
  { upsert: true },
);
