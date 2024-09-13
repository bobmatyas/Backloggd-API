//Copyright 2023 Qewertyy, MIT License

export type userInfo = {
    profile: string;
    username: string;
    bio: string;
    recentlyPlayed?: recentlyPlayed[];
} & userStats;


export type recentlyPlayed = {
    name: string;
    image: string;
};

export type userStats = {
    [key: string]: number;
};