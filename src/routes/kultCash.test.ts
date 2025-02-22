import {expect, test, describe} from 'bun:test';
import {kultEpochToDate, dateToKultEpoch} from './kultCash';

describe('kultEpochToUTCDate', () => {
  test('kultEpochToUTCDate', () => {
    expect(kultEpochToDate(0)).toEqual(
      new Date('2025-01-01T00:00:00.000-04:00'),
    );

    expect(kultEpochToDate(1)).toEqual(
      new Date('2025-01-02T00:00:00.000-04:00'),
    );

    expect(kultEpochToDate(-1)).toEqual(
      new Date('2024-12-31T00:00:00.000-04:00'),
    );
  });
});

describe('dateToKultEpoch', () => {
  test('dateToKultEpoch', () => {
    expect(dateToKultEpoch(new Date('2025-01-01T00:00:00+00:00'))).toBe(-1);
    expect(dateToKultEpoch(new Date('2024-12-31T00:00:00Z'))).toBe(-2);
    expect(dateToKultEpoch(new Date('2025-01-01T03:00:00Z'))).toBe(-1);
    expect(dateToKultEpoch(new Date('2024-12-31T20:00:00Z'))).toBe(-1);
    expect(dateToKultEpoch(new Date('2025-01-01T05:59:00+02:00'))).toBe(-1);
    expect(dateToKultEpoch(new Date('2025-01-01T06:00:00+02:00'))).toBe(0);
    expect(dateToKultEpoch(new Date('2025-01-01T04:00:00Z'))).toBe(0);
    expect(dateToKultEpoch(new Date('2025-01-01T12:00:00Z'))).toBe(0);
    expect(dateToKultEpoch(new Date('2025-01-02T04:00:00Z'))).toBe(1);
    expect(dateToKultEpoch(new Date('2025-01-02T06:00:00+04:00'))).toBe(1);
    expect(dateToKultEpoch(new Date('2025-01-02T03:59:00+04:00'))).toBe(0);
    expect(dateToKultEpoch(new Date('2025-01-02T04:00:00+04:00'))).toBe(1);
  });
});
