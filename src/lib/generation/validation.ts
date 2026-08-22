import type { GenerationRequest } from './types';

const entityTypes = new Set(['character', 'realm']);
const ratios = new Set(['9:16', '16:9', '1:1', '3:4', '4:3']);

export class GenerationValidationError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = 'GenerationValidationError';
    this.code = code;
    this.status = status;
  }
}

export function parseGenerationRequest(input: unknown): GenerationRequest {
  if (!input || typeof input !== 'object') {
    throw new GenerationValidationError('INVALID_BODY', '生成参数格式不正确。');
  }

  const body = input as Record<string, unknown>;
  const entityType = stringValue(body.entityType);
  const entityId = stringValue(body.entityId);
  const styleId = stringValue(body.styleId);
  const scene = stringValue(body.scene);
  const composition = stringValue(body.composition);
  const ratio = stringValue(body.ratio);
  const description = stringValue(body.description, true);

  if (!entityTypes.has(entityType)) {
    throw new GenerationValidationError('INVALID_ENTITY_TYPE', '请选择角色或神域。');
  }
  if (!entityId) throw new GenerationValidationError('MISSING_ENTITY', '请选择要绘制的角色或神域。');
  if (!styleId) throw new GenerationValidationError('MISSING_STYLE', '请选择画风。');
  if (!scene || scene.length > 40) throw new GenerationValidationError('INVALID_SCENE', '场景信息无效。');
  if (!composition || composition.length > 40) throw new GenerationValidationError('INVALID_COMPOSITION', '构图信息无效。');
  if (!ratios.has(ratio)) throw new GenerationValidationError('INVALID_RATIO', '当前画面比例暂不支持。');
  if (description.length > 180) throw new GenerationValidationError('DESCRIPTION_TOO_LONG', '补充描述请控制在 180 字以内。');

  return {
    entityType: entityType as GenerationRequest['entityType'],
    entityId,
    styleId,
    scene,
    composition,
    ratio,
    description,
  };
}

function stringValue(value: unknown, optional = false): string {
  if (value == null && optional) return '';
  return typeof value === 'string' ? value.trim() : '';
}
