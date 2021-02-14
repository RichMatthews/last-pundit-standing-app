import React from 'react'
import { Text, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from '../../images'
export const Fixtures = React.memo(
    ({ fixtures }) => {
        return (
            <View>
                <Text style={styles.title}>Gameweek Fixtures</Text>
                <View style={styles.container}>
                    {fixtures.map((match: any) => (
                        <View key={match.home}>
                            <View style={styles.center}>
                                <FastImage
                                    style={styles.clubBadge}
                                    source={Images[match.home.replace(/\s/g, '').toLowerCase()]}
                                    // resizeMode={FastImage.resizeMode.contain}
                                />
                                <Text style={styles.vs}> VS </Text>
                                <FastImage
                                    style={styles.clubBadge}
                                    source={Images[match.away.replace(/\s/g, '').toLowerCase()]}
                                    // resizeMode={FastImage.resizeMode.contain}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        )
    },
    (prevProps, nextProps) => {
        return true // props are not equal -> update the component)
    },
)

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        flexDirection: 'row',
        margin: 5,
    },
    container: {
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        width: 300,
    },
    vs: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 11,
        fontWeight: '700',
    },
    title: { fontSize: 17, alignSelf: 'center', fontWeight: '700', marginBottom: 10 },
    clubBadge: { width: 30, height: 30 },
})
