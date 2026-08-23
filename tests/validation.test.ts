import { describe, expect, it } from 'vitest';
import { GenerationValidationError, parseGenerationRequest } from '../src/lib/generation/validation';

describe('parseGenerationRequest', () => {
  it('接受合法请求', () => {
    const req = parseGenerationRequest({
      entityType: 'character',
      entityId: 'character-change',
      styleId: 'canonical',
      scene: '云海',
      composition: '手机锁屏',
      ratio: '9:16',
    });
    expect(req.entityType).toBe('character');
    expect(req.description).toBe('');
  });

  it('非法实体类型抛错', () => {
    expect(() =>
      parseGenerationRequest({
        entityType: 'foo',
        entityId: 'x',
        styleId: 'y',
        scene: 'z',
        composition: 'c',
        ratio: '9:16',
      }),
    ).toThrow(GenerationValidationError);
  });

  it('超长描述抛错', () => {
    expect(() =>
      parseGenerationRequest({
        entityType: 'character',
        entityId: 'x',
        styleId: 'y',
        scene: 's',
        composition: 'c',
        ratio: '9:16',
        description: 'a'.repeat(200),
      }),
    ).toThrow(/180/);
  });

  it('非法比例抛错', () => {
    expect(() =>
      parseGenerationRequest({
        entityType: 'realm',
        entityId: 'x',
        styleId: 'y',
        scene: 's',
        composition: 'c',
        ratio: '21:9',
      }),
    ).toThrow(GenerationValidationError);
  });

  it('空 body 抛错', () => {
    expect(() => parseGenerationRequest(null)).toThrow(GenerationValidationError);
  });
});