const BRAND_PURPLE = '#9f85d4'
const COLOURS = {
    WHITE: '#fff',
    BLACK: '#000',
    PRIMARY_WHITE: '#f7f7f7',
    PRIMARY_BLACK: '#1d1d1d',
    // TODO: change to #
    ACCENT: BRAND_PURPLE,
}

const DEFAULT_THEME = {
    borders: {
        radius: 5,
    },
    text: {
        heading: 25,
        xlarge: 21,
        large: 18,
        medium: 15,
        small: 12,
    },
}

export const DARK_THEME = {
    ...DEFAULT_THEME,
    dark: true,
    background: {
        primary: '#111111',
    },
    borders: {
        ...DEFAULT_THEME.borders,
        primaryColor: COLOURS.PRIMARY_BLACK,
    },
    button: {
        backgroundColor: COLOURS.PRIMARY_BLACK,
        color: COLOURS.PRIMARY_WHITE,
    },
    colors: {
        primaryColor: COLOURS.PRIMARY_BLACK,
    },
    headings: {
        primary: COLOURS.PRIMARY_WHITE,
        inverse: COLOURS.PRIMARY_BLACK,
        accent: BRAND_PURPLE,
    },
    icons: {
        primary: COLOURS.PRIMARY_WHITE,
        inverse: '#212020',
    },
    input: {
        backgroundColor: COLOURS.PRIMARY_BLACK,
        color: COLOURS.PRIMARY_WHITE,
    },
    spinner: {
        primary: COLOURS.PRIMARY_WHITE,
    },
    text: {
        ...DEFAULT_THEME.text,
        primary: COLOURS.PRIMARY_WHITE,
        inverse: COLOURS.PRIMARY_BLACK,
    },
    tint: {
        active: BRAND_PURPLE,
        inactive: COLOURS.PRIMARY_WHITE,
    },
}

export const LIGHT_THEME = {
    ...DEFAULT_THEME,
    dark: false,
    background: {
        primary: '#fff',
    },
    borders: {
        ...DEFAULT_THEME.borders,
        primaryColor: COLOURS.PRIMARY_WHITE,
    },
    button: {
        backgroundColor: COLOURS.PRIMARY_WHITE,
        color: COLOURS.PRIMARY_BLACK,
    },
    colors: {
        primaryColor: COLOURS.PRIMARY_WHITE,
    },
    headings: {
        primary: COLOURS.PRIMARY_BLACK,
        inverse: COLOURS.PRIMARY_WHITE,
        accent: COLOURS.ACCENT,
    },
    icons: {
        primary: COLOURS.PRIMARY_BLACK,
        inverse: '#212020',
    },
    input: {
        backgroundColor: COLOURS.PRIMARY_WHITE,
        color: COLOURS.PRIMARY_WHITE,
    },
    spinner: {
        primary: COLOURS.PRIMARY_BLACK,
    },
    text: {
        ...DEFAULT_THEME.text,
        primary: COLOURS.PRIMARY_BLACK,
        inverse: COLOURS.PRIMARY_WHITE,
    },
    tint: {
        active: BRAND_PURPLE,
        inactive: '#4a4a4a',
    },
}
