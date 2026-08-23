/**
 * 生成内容审核规则引擎（V1 轻量实现）。
 *
 * 覆盖三类输入风险：
 * 1. NSFW / 成人内容
 * 2. 暴力、血腥、自伤、非法危险内容
 * 3. 现代影视 / 动漫 / 游戏 / 商业 IP 复刻指令
 *
 * 真实线上建议接入专业 Moderation API；本引擎作为 V1 兜底。
 */

export type ModerationResult = {
  passed: boolean;
  reasons: string[];
  code: 'OK' | 'MODERATED';
};

type Rule = {
  id: string;
  label: string;
  patterns: RegExp[];
};

const NSFW_RULES: Rule[] = [
  {
    id: 'nsfw',
    label: '包含不适宜公开的成人内容',
    patterns: [
      /裸体|裸露|色情|性爱|性交|淫|露骨|情色|成人内容|hentai|porn|nude|naked|sex/i,
    ],
  },
];

const VIOLENCE_RULES: Rule[] = [
  {
    id: 'violence',
    label: '包含暴力或危险内容',
    patterns: [
      /流血|血腥|屠杀|肢解|断头|自残|自杀|恐怖袭击|炸弹|枪支|虐杀|gore|violence|blood|murder|suicide/i,
    ],
  },
];

const ILLEGAL_RULES: Rule[] = [
  {
    id: 'illegal',
    label: '包含非法或危险内容',
    patterns: [
      /毒品|制毒|吸毒|枪支弹药|爆炸物|违禁|暗网|非法交易|儿童色情/i,
    ],
  },
];

const IP_RULES: Rule[] = [
  {
    id: 'ip-clone',
    label: '禁止复刻现代影视、动漫、游戏的商业 IP 具体设计',
    patterns: [
      /复刻|模仿.{0,8}(游戏|动漫|电影|动画|影视|漫画|ip).{0,16}(角色|形象|服装|造型|设计)/i,
      /画成.{0,12}(原神|王者荣耀|阴阳师|fgo|崩坏|宝可梦|精灵宝可梦|海贼王|火影|龙珠|美少女战士|哈利波特|漫威|dc|迪斯尼|迪士尼)/i,
    ],
  },
];

const ALL_RULES: Rule[] = [...NSFW_RULES, ...VIOLENCE_RULES, ...ILLEGAL_RULES, ...IP_RULES];

export function moderateText(text: string): ModerationResult {
  const reasons: string[] = [];
  for (const rule of ALL_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      reasons.push(rule.label);
    }
  }
  return {
    passed: reasons.length === 0,
    reasons,
    code: reasons.length === 0 ? 'OK' : 'MODERATED',
  };
}

export function moderateGenerationInput(input: {
  scene: string;
  composition: string;
  description: string;
  entityName: string;
}): ModerationResult {
  const combined = [input.scene, input.composition, input.description, input.entityName].join(' ');
  return moderateText(combined);
}
