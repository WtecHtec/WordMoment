export type Language = 'zh' | 'ja';

export const translations = {
    zh: {
        title: 'WordMoment',
        subtitle: '主动回忆 + 累积强化',
        animationStyle: '动画风格',
        animationSmash: '💥 撞击 & 收缩 (默认)',
        animationStandard: '✨ 标准 (即将推出)',
        words: '单词',
        basicVocabulary: '基础词汇',
        moreComingSoon: '更多单元即将推出...',
        languageZh: '中文',
        languageJa: '日本語',
    },
    ja: {
        title: 'WordMoment',
        subtitle: 'アクティブリコール + 累積強化',
        animationStyle: 'アニメーションスタイル',
        animationSmash: '💥 衝突 & 収縮 (デフォルト)',
        animationStandard: '✨ 標準 (近日公開)',
        words: '単語',
        basicVocabulary: '基本語彙',
        moreComingSoon: 'その他のユニットは近日公開予定...',
        languageZh: '中文',
        languageJa: '日本語',
    },
};

export const useTranslation = (lang: Language) => {
    return translations[lang];
};
