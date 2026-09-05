import type { UiMessages } from './types';

const messages = {
  brand: {
    name: 'MythCanvas',
    tagline: 'AIで神話世界を再構築。神々、神域、伝説のビジュアルを探索します。',
  },
  nav: {
    home: 'ホーム',
    explore: '探索',
    characters: '神々',
    worlds: '神域',
    mythology: '神話',
    create: 'AI創作',
    my: 'マイ宇宙',
  },
  action: {
    search: '検索',
    language: '言語を変更',
  },
  account: {
    entry: 'ログインまたはマイ宇宙を表示',
    signedInPrefix: 'ログイン中',
    myUniverse: 'マイ宇宙を表示',
  },
  footer: {
    description: 'AIで神話世界を再構築。神々、神域、伝説のビジュアルを探索します。',
    legalAria: '法務とポリシー',
    navAria: 'フッターナビゲーション',
    privacy: 'プライバシー',
    terms: '利用規約',
    copyright: '著作権ポリシー',
    meta: '神話の原型 · オリジナルビジュアル · AI再解釈',
  },
} satisfies UiMessages;

export default messages;
