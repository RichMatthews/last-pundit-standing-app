import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

export const LeagueMenu = () => {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 50 }}>Menu</Text>
            <View style={styles.inner}>
                <View style={styles.section}>
                    <LinearGradient
                        colors={['#246abf', '#d098e3']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}
                    >
                        <Text style={styles.sectionText}>Current game</Text>
                    </LinearGradient>
                </View>
                <View style={styles.section}>
                    <LinearGradient
                        colors={['#246abf', '#d098e3']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}
                    >
                        <Text style={styles.sectionText}>Team selection</Text>
                    </LinearGradient>
                </View>

                <View style={styles.section}>
                    <LinearGradient
                        colors={['#246abf', '#d098e3']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}
                    >
                        <Text style={styles.sectionText}>Weekly fixtures</Text>
                    </LinearGradient>
                </View>

                <View style={styles.section}>
                    <LinearGradient
                        colors={['#246abf', '#d098e3']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}
                    >
                        <Text style={styles.sectionText}>Previous games</Text>
                    </LinearGradient>
                </View>

                <View style={styles.section}>
                    <LinearGradient
                        colors={['#246abf', '#d098e3']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}
                    >
                        <Text style={styles.sectionText}>League rules</Text>
                    </LinearGradient>
                </View>

                <View style={styles.section}>
                    <LinearGradient
                        colors={['#246abf', '#d098e3']}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1, borderRadius: 10, justifyContent: 'center' }}
                    >
                        <Text style={styles.sectionText}>Current game</Text>
                    </LinearGradient>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 50,
    },
    inner: {
        flexDirection: 'row',
        alignSelf: 'center',
        flexWrap: 'wrap',
        justifyContent: 'center',
        margin: 20,
    },
    section: {
        shadowOffset: { width: 1, height: 5 },
        shadowColor: '#aaa',
        shadowOpacity: 0.5,
        backgroundColor: '#fff',
        width: 140,
        height: 140,
        borderRadius: 10,
        margin: 15,
        justifyContent: 'center',
        // padding: 10,
        // backgroundColor: 'rgba(0,0,0,.6)',
        // opacity: 0.5,
    },
    sectionText: {
        alignSelf: 'center',
        color: '#fff',
        fontFamily: 'Nunito',
        textAlign: 'center',
        fontSize: 15,
    },
})
