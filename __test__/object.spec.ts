import { test, expect, describe } from 'bun:test';
import { merge } from '../src';

describe('object', () => {
  test('merge', () => {
    const target = {
      a: 1,
      b: 2,
      c: {
        d: 3,
      },
    };

    expect(
      merge(target, {
        a: 3,
        c: {
          e: 4,
        },
      })
    ).toEqual({
      a: 3,
      b: 2,
      c: {
        d: 3,
        e: 4,
      },
    });
  });
});
