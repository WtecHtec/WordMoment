export interface Word {
    en: string;
    zh: string;
    phonetic?: string;
    block?: string[];
}

export interface UnitData {
    level: string;
    unit: string;
    words: Word[];
}

export interface UserProgress {
    [level: string]: {
        [unit: string]: {
            currentIndex: number;
            finished: boolean;
        };
    };
}

export interface UserSettings {
    wordsPerGroup: number;
}

export interface AppState {
    settings: UserSettings;
    progress: UserProgress;
}
