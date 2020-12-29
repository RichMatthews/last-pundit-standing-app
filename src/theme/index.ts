const DEFAULT_THEME = {
    borders: {
        radius: 5,
    },
    text: {
        heading: 25,
        largeTextSize: 18,
        mediumTextSize: 15,
        smallTextSize: 12,
    },
}

export const DARK_THEME = {
    ...DEFAULT_THEME,
    dark: true,
    colors: {
        activitySpinner: '#fff',
        buttonBackgroundColor: '#454343',
        activeTintBottomColor: 'purple',
        inactiveTintBottomColor: '#f7f7f7',
        background: '#212020',
        backgroundColor: '#212020',
        borderColor: 'red',
        iconColor: '#fff',
        iconColorInverse: '#212020',
        primaryColor: '#fff',
    },
    text: {
        ...DEFAULT_THEME.text,
        primaryTextColor: '#fff',
        inverseTextColor: '#000',
    },
}

export const LIGHT_THEME = {
    ...DEFAULT_THEME,
    dark: false,
    colors: {
        activitySpinner: '#000',
        buttonBackgroundColor: '#eee',
        activeTintBottomColor: '#2C3E50',
        inactiveTintBottomColor: '#000',
        background: '#fff',
        backgroundColor: '#fff',
        borderColor: 'red',
        iconColor: '#000',
        iconColorInverse: '#212020',
        primaryColor: '#000',
    },
    text: {
        ...DEFAULT_THEME.text,
        primaryTextColor: '#000',
        inverseTextColor: '#fff',
    },
}
