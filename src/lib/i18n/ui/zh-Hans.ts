import type { UiMessages } from './types';

const messages = {
  brand: {
    name: '绘神宇宙',
    tagline: '用 AI 重现神话世界。探索诸神、神域与传说中的视觉想象。',
  },
  nav: {
    home: '首页',
    explore: '探索',
    characters: '神灵',
    worlds: '神域',
    mythology: '神话',
    create: 'AI 创作',
    my: '我的宇宙',
  },
  action: {
    search: '搜索',
    language: '切换语言',
  },
  account: {
    entry: '登录或查看我的宇宙',
    signedInPrefix: '已登录',
    myUniverse: '查看我的宇宙',
  },
  footer: {
    description: '用 AI 重现神话世界。探索诸神、神域与传说中的视觉想象。',
    legalAria: '法律与政策',
    navAria: '页脚导航',
    privacy: '隐私政策',
    terms: '服务条款',
    copyright: '版权政策',
    meta: '神话原型 · 原创视觉 · AI 重绘',
  },
} satisfies UiMessages;

export default messages;
