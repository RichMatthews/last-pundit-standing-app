const BRAND_PURPLE = '#390d40'
const COLOURS = {
    WHITE: '#fff',
    BLACK: '#000',
    PRIMARY_WHITE: '#f7f7f7',
    SECONDARY_WHITE: '#f2f2f2',
    PRIMARY_BLACK: '#1c191c',
    SECONDARY_BLACK: '#302d30',
    TERTIARY_BLACK: '#454145',
    BRAND_COLOR_DARK: '#BB86FC',
    BRAND_COLOR_LIGHT: '#390d40',
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
    purple: COLOURS.BRAND_COLOR_DARK,
    background: {
        primary: COLOURS.PRIMARY_BLACK,
        secondary: COLOURS.SECONDARY_BLACK,
    },
    borders: {
        ...DEFAULT_THEME.borders,
        primary: '#454545',
    },
    button: {
        backgroundColor: COLOURS.PRIMARY_BLACK,
        color: COLOURS.PRIMARY_WHITE,
    },
    colors: {
        primary: COLOURS.PRIMARY_BLACK,
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
    purple: COLOURS.BRAND_COLOR_LIGHT,
    background: {
        primary: COLOURS.PRIMARY_WHITE,
        secondary: COLOURS.SECONDARY_WHITE,
    },
    borders: {
        ...DEFAULT_THEME.borders,
        primary: COLOURS.PRIMARY_BLACK,
    },
    button: {
        backgroundColor: COLOURS.PRIMARY_WHITE,
        color: COLOURS.PRIMARY_BLACK,
    },
    colors: {
        primary: COLOURS.PRIMARY_BLACK,
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
