import { Dimensions, Platform, StyleSheet } from 'react-native'
const width = Dimensions.get('window').width

export const styles = (theme) =>
    StyleSheet.create({
        heading: {
            color: theme.text.primaryTextColor,
            marginBottom: 50,
            marginTop: 50,
            textAlign: 'center',
        },
        icon: {},
        section: {
            alignItems: 'center',
            backgroundColor: theme.colors.buttonBackgroundColor,
            borderRadius: theme.borders.radius,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            maxHeight: 40,
            padding: 10,
            width: width * 0.9,
        },
        signOut: {
            alignSelf: 'center',
            bottom: Platform.OS === 'ios' ? 450 : 350,
            position: 'absolute',
            zIndex: 1,
        },
        text: {
            color: theme.text.primaryTextColor,
            fontSize: Platform.OS === 'ios' ? 18 : 15,
        },
        topSection: {
            height: Platform.OS === 'ios' ? 300 : 200,
            paddingTop: Platform.OS === 'ios' ? 150 : 100,
        },
        username: {
            alignSelf: 'center',
            borderColor: theme.colors.inverseTextColor,
            borderWidth: 4,
            borderRadius: 85 / 2,
            lineHeight: 80,
            height: 85,
            fontSize: 40,
            textAlign: 'center',
            width: 85,
        },
    })
