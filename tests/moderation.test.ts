import { describe, expect, it } from 'vitest';
import { moderateGenerationInput, moderateText } from '../src/lib/moderation/moderation';

describe('moderateText', () => {
  it('放行正常神话内容', () => {
    const result = moderateText('云海之上的月宫与金色天门，嫦娥在圆月下起舞');
    expect(result.passed).toBe(true);
    expect(result.code).toBe('OK');
  });

  it('拦截色情内容', () => {
    const result = moderateText('一幅裸体画面');
    expect(result.passed).toBe(false);
    expect(result.code).toBe('MODERATED');
  });

  it('拦截暴力内容', () => {
    const result = moderateText('血腥的屠杀场景');
    expect(result.passed).toBe(false);
  });

  it('拦截非法危险内容', () => {
    const result = moderateText('如何制毒');
    expect(result.passed).toBe(false);
  });

  it('拦截复刻商业 IP 指令', () => {
    const result = moderateText('画成原神角色');
    expect(result.passed).toBe(false);
    expect(result.reasons.length).toBeGreaterThan(0);
  });
});

describe('moderateGenerationInput', () => {
  it('聚合多字段输入', () => {
    const result = moderateGenerationInput({
      scene: '星空',
      composition: '手机锁屏',
      description: '色情内容',
      entityName: 'character',
    });
    expect(result.passed).toBe(false);
  });
});