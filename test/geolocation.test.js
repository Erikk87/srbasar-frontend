import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseDistanceKm, formatDistanceKm, roundCoordinate } from '../src/services/geolocation.service.js'

test('does not display missing or malformed distances as zero kilometres', () => {
  for (const value of [null, undefined, '', ' ', false, [], ['2'], {}, Infinity, -1, 'NaN']) {
    assert.equal(parseDistanceKm(value), null)
  }
})

test('preserves actual zero and decimal distances from the API', () => {
  assert.equal(parseDistanceKm(0), 0)
  assert.equal(parseDistanceKm('1.25'), 1.25)
  assert.equal(formatDistanceKm(parseDistanceKm('1.25')), '1,3 km')
  assert.equal(formatDistanceKm(null), 'Entfernung unbekannt')
})

test('rounds coordinates to about one kilometre before they leave the browser', () => {
  assert.equal(roundCoordinate(51.534567), 51.53)
  assert.equal(roundCoordinate(9.935678), 9.94)
})
