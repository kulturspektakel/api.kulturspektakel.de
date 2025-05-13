import {expect, test, describe} from 'bun:test';
import {kultEpochToDate, dateToKultEpoch} from './kultCash';

describe('kultEpochToUTCDate', () => {
  test('kultEpochToUTCDate', () => {
    expect(kultEpochToDate(0)).toEqual(new Date('2025-01-02T04:00:00.000Z'));
    expect(kultEpochToDate(1)).toEqual(new Date('2025-01-03T04:00:00.000Z'));
    expect(kultEpochToDate(-1)).toEqual(new Date('2025-01-01T04:00:00.000Z'));
    expect(kultEpochToDate(-2)).toEqual(new Date('2024-12-31T04:00:00.000Z'));
  });
});

describe('dateToKultEpoch', () => {
  test('dateToKultEpoch', () => {
    expect(dateToKultEpoch(new Date('2025-01-01T03:59:59Z'))).toBe(-1);
    expect(dateToKultEpoch(new Date('2025-01-02T03:59:59Z'))).toBe(0);
    expect(dateToKultEpoch(new Date('2025-01-02T04:00:00Z'))).toBe(1);
    expect(dateToKultEpoch(new Date('2025-01-03T03:59:59Z'))).toBe(1);
    expect(dateToKultEpoch(new Date('2025-01-03T04:00:00Z'))).toBe(2);
  });
});
