import React from 'react'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo'

import { ButtonText } from '../../ui-components/button'

interface LeagueState {
    name?: string
    id?: string
}

export const MyLeagues = ({ navigation, theme }: any) => {
    const userLeagues = useSelector((store: { userLeagues: any }) => store.userLeagues)

    return (
        <View style={{ backgroundColor: theme.background.primary }}>
            <View style={{ paddingTop: 50 }}>
                <View style={{ alignItems: 'center' }}>
                    {userLeagues.loading ? (
                        <ActivityIndicator size="large" color={theme.spinner.primary} />
                    ) : userLeagues.leagues.length ? (
                        userLeagues.leagues.map((league: LeagueState) => (
                            <TouchableOpacity onPress={() => navigation.push('League', { leagueId: league.id })}>
                                <View
                                    key={league.id}
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: theme.button.backgroundColor,
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        margin: 10,
                                        width: 350,
                                        padding: 5,
                                        borderRadius: 10,
                                    }}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: theme.text.primary,
                                                fontSize: theme.text.large,
                                                fontFamily: 'Nunito',
                                                fontWeight: '700',
                                            }}
                                        >
                                            {league.name}
                                        </Text>
                                        <View style={{ width: 45, height: 30 }}>
                                            <Image
                                                source={require('../../images/other/premier-league.png')}
                                                style={{
                                                    resizeMode: 'contain',
                                                    flex: 1,
                                                    height: undefined,
                                                    width: undefined,
                                                }}
                                            />
                                        </View>
                                    </View>
                                    <Entypo name="chevron-small-right" size={30} color={theme.icons.primary} />
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View>
                            <Text style={{ fontFamily: 'Nunito' }}>You have not entered any public leagues yet</Text>
                        </View>
                    )}
                </View>

                <View style={{ marginTop: 50 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Join')}>
                        <Text
                            style={{
                                color: theme.text.primary,
                                fontFamily: 'Nunito',
                                alignSelf: 'center',
                                fontSize: 15,
                            }}
                        >
                            Tap here to join a league
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
