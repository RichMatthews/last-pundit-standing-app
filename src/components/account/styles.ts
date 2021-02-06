import { Dimensions, Platform, StyleSheet } from 'react-native'
const width = Dimensions.get('window').width

export const styles = (theme) =>
    StyleSheet.create({
        heading: {
            color: theme.text.primary,
            marginBottom: 50,
            marginTop: 50,
            textAlign: 'center',
        },
        icon: {},
        section: {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
            padding: 10,
            width: width * 0.9,
        },
        signOut: {
            alignSelf: 'center',
            zIndex: 1,
        },
        text: {
            color: theme.text.primary,
            fontSize: Platform.OS === 'ios' ? 18 : 15,
        },
        topSection: {
            height: Platform.OS === 'ios' ? 300 : 200,
            paddingTop: Platform.OS === 'ios' ? 150 : 100,
        },
        username: {
            alignSelf: 'center',
            color: 'purple',
            fontFamily: 'Nunito',
            fontSize: 20,
            textAlign: 'center',
        },
    })
