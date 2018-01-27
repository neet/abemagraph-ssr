interface SharedLink {
    facebook: string;
    line: string;
    copy: string;
    twitter: string;
    google: string;
    screen: string;
}

interface Credit {
    copyrights?: string[];
    casts?: string[];
    crews?: string[];
}

interface ThemeColor {
    detail?: string;
    primary?: string;
    secondary?: string;
    background?: string;
}

interface Series {
    updatedAt: number;
    id: string;
    themeColor?: ThemeColor;
}

interface Episode {
    content?: string;
    sequence: number;
    title?: string;
    overview?: string;
    name?: string;
}

interface ProvidedInfo {
    thumbImg: string;
    updatedAt: number;
}

export interface Program {
    credit: Credit;
    series: Series;
    id: string;
    episode: Episode;
    providedInfo: ProvidedInfo;
}

interface Mark {
    first?: true;
    last?: true;
    live?: true;
    bingeWatching?: true;
    drm?: true;
    recommendation?: true;
}

interface Flags {
    timeshift?: true;
    timeshiftFree?: true;
}

interface SlotGroup {
    id: string;
    lastSlotId: string;
    name: string;
    fixed?: boolean;
}

export interface Channel {
    id: string;
    name: string;
    order: number;
}

export interface Slot {
    channelId: string;
    hashtag?: string;
    endAt: number;
    highlight: string;
    title: string;
    startAt: number;
    sharedLink: SharedLink;
    id: string;
    links?: {};
    content: string;
    timeshiftEndAt: number;
    timeshiftFreeEndAt: number;
    programs: Program[];
    slotGroup?: SlotGroup;
    displayProgramId: string;
    mark: Mark;
    tableHighlight: string;
    tableStartAt: number;
    tableEndAt: number;
    flags: Flags;
}

export interface Timetable {
    channelSchedules: Array<{
        channelId: string;
        slots: Slot[];
        date: string
    }>;
    channels: Channel[];
}

export interface SlotAudienceItem {
    slotId: string;
    channelId: string;
    viewCount: number;
    commentCount: number;
}

export interface SlotAudience {
    slotAudiences: SlotAudienceItem[];
}