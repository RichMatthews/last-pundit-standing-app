import React from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo'

import { ScreenComponent } from 'src/ui-components/containers/screenComponent'

interface LeagueState {
    name?: string
    id?: string
}

export const MyLeagues = ({ navigation, theme }: any) => {
    const userLeagues = useSelector((store: { userLeagues: any }) => store.userLeagues)

    const {
        container,
        leagueButton,
        leagueTitle,
        leagueImage,
        imageWrapper,
        text,
        helperText,
        joinLeagueWrapper,
    } = styles(theme)

    return (
        <ScreenComponent theme={theme}>
            <View style={container}>
                <View>
                    {userLeagues.loading ? (
                        <ActivityIndicator size="large" color={theme.spinner.primary} />
                    ) : userLeagues.leagues.length ? (
                        userLeagues.leagues.map((league: LeagueState) => (
                            <TouchableOpacity onPress={() => navigation.push('League', { leagueId: league.id })}>
                                <View key={league.id} style={leagueButton}>
                                    <View>
                                        <Text style={leagueTitle}>{league.name}</Text>
                                        <View style={imageWrapper}>
                                            <Image
                                                source={require('../../images/other/premier-league.png')}
                                                style={leagueImage}
                                            />
                                        </View>
                                    </View>
                                    <Entypo name="chevron-small-right" size={30} color={theme.icons.primary} />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View>
                            <Text style={helperText}>You have not entered any public leagues yet</Text>
                        </View>
                    )}
                </View>

                <View style={joinLeagueWrapper}>
                    <TouchableOpacity onPress={() => navigation.navigate('Join')}>
                        <Text style={text}>Tap here to join a league</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenComponent>
    )
}

const styles = (theme: any) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.background.primary,
            flex: 1,
            alignItems: 'center',
        },
        leagueButton: {
            alignItems: 'center',
            backgroundColor: theme.button.backgroundColor,
            justifyContent: 'space-between',
            flexDirection: 'row',
            margin: 10,
            width: 350,
            padding: 5,
            borderRadius: 10,
        },
        leagueTitle: {
            color: theme.text.primary,
            fontSize: theme.text.large,
            fontFamily: 'Nunito',
            fontWeight: '700',
        },
        leagueImage: {
            resizeMode: 'contain',
            flex: 1,
            height: undefined,
            width: undefined,
        },
        imageWrapper: {
            width: 45,
            height: 30,
        },
        text: {
            color: theme.text.primary,
            fontFamily: 'Nunito',
            alignSelf: 'center',
            fontSize: 15,
        },
        helperText: {
            fontFamily: 'Nunito',
        },
        joinLeagueWrapper: {
            marginTop: 50,
        },
    })
