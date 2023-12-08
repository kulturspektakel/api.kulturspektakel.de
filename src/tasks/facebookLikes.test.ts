import {expect, test, describe} from 'bun:test';
import {extractFbid} from './facebookLikes';

describe('extractFbid', () => {
  test('direct ID', () => {
    expect(extractFbid('https://www.facebook.com/1234567890')).toBe(
      '1234567890',
    );
  });

  test('vanity url', () => {
    expect(extractFbid('https://www.facebook.com/kulturspektakel')).toBe(
      'kulturspektakel',
    );
  });

  test('page name with ID', () => {
    expect(
      extractFbid('https://www.facebook.com/kulturspektakel-123456789'),
    ).toBe('123456789');
  });

  test('pages/category', () => {
    expect(
      extractFbid('https://www.facebook.com/pages/category/kulturspektakel'),
    ).toBe('kulturspektakel');
  });

  test('people', () => {
    expect(
      extractFbid('https://www.facebook.com/people/kulturspektakel/123456789'),
    ).toBe('123456789');
  });

  test('profile.php?id=', () => {
    expect(
      extractFbid('https://www.facebook.com/profile.php?id=1234567890'),
    ).toBe('1234567890');
  });

  test('with periods and numbers', () => {
    expect(extractFbid('https://www.facebook.com/kult.ur.sp.ek.tak.el.3')).toBe(
      'kult.ur.sp.ek.tak.el.3',
    );
  });

  test('name with ID', () => {
    expect(
      extractFbid('https://m.facebook.com/p/Blues-Control-100063225460167'),
    ).toBe('100063225460167');
  });

  test('name with ID', () => {
    expect(
      extractFbid(
        'https://facebook.com/pages/Sleepwalkers-Station/48223376746',
      ),
    ).toBe('48223376746');
  });
});
