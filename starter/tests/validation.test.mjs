import test from 'node:test';
import assert from 'node:assert/strict';
import { assignTickets, seedTickets } from '../src/tickets.mjs';

test('invalid ticket IDs and owners are rejected', () => {
  const tickets = seedTickets();
  assert.throws(() => assignTickets(tickets, ['missing'], 'Maya'));
  assert.throws(() => assignTickets(tickets, ['NS-1042'], 'Unknown'));
  assert.throws(() => assignTickets(tickets, [], 'Maya'));
});
