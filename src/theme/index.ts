const DEFAULT_THEME = {
    borders: {
        radius: 5,
    },
    text: {
        largeTextSize: 18,
        mediumTextSize: 15,
        smallTextSize: 12,
    },
}

export const DARK_THEME = {
    ...DEFAULT_THEME,
    dark: true,
    colors: {
        accountButtonBackgroundColor: '#454343',
        background: '#212020',
        backgroundColor: '#212020',
        borderColor: 'red',
        iconColor: '#fff',
        iconColorInverse: '#212020',
        primaryColor: '#fff',
    },
    text: {
        primaryTextColor: '#fff',
        inverseTextColor: '#000',
    },
}

export const LIGHT_THEME = {
    ...DEFAULT_THEME,
    dark: false,
    colors: {
        accountButtonBackgroundColor: '#eee',
        background: '#fff',
        backgroundColor: '#fff',
        borderColor: 'red',
        iconColor: '#000',
        iconColorInverse: '#212020',
        primaryColor: '#000',
    },
    text: {
        primaryTextColor: '#000',
        inverseTextColor: '#fff',
    },
}
