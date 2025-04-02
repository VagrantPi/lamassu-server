const db = require('./db')

exports.up = next => db.multi([
  'DROP TABLE aggregated_machine_pings;',
  'DROP TABLE cash_in_refills;',
  'DROP TABLE cash_out_refills;',
  'DROP TABLE customer_compliance_persistence;',
  'DROP TABLE compliance_overrides_persistence;',
  'DROP TABLE server_events;',
], next)

exports.down = next => next()
