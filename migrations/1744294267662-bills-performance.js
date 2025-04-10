const db = require('./db')

exports.up = next => db.multi([
  'ALTER TABLE bills ADD CONSTRAINT cash_in_txs_id FOREIGN KEY (cash_in_txs_id) REFERENCES cash_in_txs(id);',
  'CREATE INDEX bills_cash_in_txs_id_idx ON bills USING btree (cash_in_txs_id);',
  `CREATE INDEX bills_null_cashbox_batch_id_idx ON bills (cash_in_txs_id) WHERE cashbox_batch_id IS NULL AND destination_unit = 'cashbox';`,
  'CREATE INDEX cash_in_txs_device_id_idx ON cash_in_txs USING btree (device_id);'
], next)

exports.down = next => next()
