const db = require('./db')

exports.up = next => db.multi([
  'ALTER TABLE public.blacklist DROP CONSTRAINT IF EXISTS blacklist_pkey;',
  'ALTER TABLE public.blacklist ADD PRIMARY KEY (address);',
  'DROP INDEX IF EXISTS blacklist_temp_address_key;',
  'CREATE UNIQUE INDEX blacklist_address_idx ON public.blacklist USING btree (address);',

], next)

exports.down = next => next()
