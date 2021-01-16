import React, { useEffect, useState } from 'react'
import { Image, Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import FastImage from 'react-native-fast-image'

import * as Images from '../../images'

const HomeTeam = styled.View<any>`
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    width: 120px;
`

const AwayTeam = styled(HomeTeam)`
    align-items: flex-start;
`

const LeagueNameAndLeagueTypeImage = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

const ExpandImage = styled.Image<any>`
    align-self: center;
    height: 15px;
    transform: ${({ expand }: any) => (expand ? 'rotate(180deg)' : 'rotate(0deg)')};
    width: 15px;
`

export const Fixtures = React.memo(
    ({ fixtures }) => {
        console.log('rendering again')
        return (
            <View>
                <Text style={{ fontSize: 17, alignSelf: 'center', fontWeight: '700', marginBottom: 10 }}>
                    Gameweek Fixtures
                </Text>
                <View style={styles.container}>
                    <View>
                        {fixtures.map((match: any) => (
                            <View key={match.home} style={styles.match}>
                                <HomeTeam homeTeam={true}>{<Text style={styles.teamName}>{match.home}</Text>}</HomeTeam>
                                <View style={styles.center}>
                                    <FastImage
                                        style={{ width: 30, height: 30 }}
                                        source={Images[match.home.replace(/\s/g, '').toLowerCase()]}
                                        // resizeMode={FastImage.resizeMode.contain}
                                    />
                                    <Text style={styles.vs}> VS </Text>
                                    <FastImage
                                        style={{ width: 30, height: 30 }}
                                        source={Images[match.away.replace(/\s/g, '').toLowerCase()]}
                                        // resizeMode={FastImage.resizeMode.contain}
                                    />
                                </View>
                                <AwayTeam homeTeam={false}>
                                    {<Text style={styles.teamName}>{match.away}</Text>}
                                </AwayTeam>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        )
    },
    (prevProps, nextProps) => {
        console.log(prevProps, nextProps, 'please show the props')
        return true // props are not equal -> update the component)
    },
)

const styles = StyleSheet.create({
    center: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 5,
        width: 100,
    },
    container: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    match: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    teamName: {
        fontSize: 11,
        fontWeight: '600',
        margin: 5,
    },
    vs: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 11,
    },
})
