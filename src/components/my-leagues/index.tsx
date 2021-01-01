import React, { Fragment } from 'react'
import styled from 'styled-components'
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import Entypo from 'react-native-vector-icons/Entypo'

import { ButtonText } from '../../ui-components/button'
import { Container } from '../../ui-components/containers'

interface LeagueState {
    name?: string
    id?: string
}

const LeagueContainer = styled.View`
    display: flex;
    align-items: center;
`

const LeagueItem = styled.View`
    background-color: #fff;
    align-self: center;
`

export const MyLeagues = ({ navigation, theme }: any) => {
    const userLeagues = useSelector((store: { userLeagues: any }) => store.userLeagues)

    return (
        <View style={{ backgroundColor: theme.background.primary }}>
            <Container style={{ marginTop: 100 }}>
                <Text
                    style={{
                        alignSelf: 'center',
                        color: theme.text.primary,
                        fontSize: theme.text.heading,
                        fontWeight: '700',
                        marginBottom: 20,
                    }}
                >
                    My Leagues
                </Text>
                <LeagueContainer>
                    {userLeagues.loading ? (
                        <ActivityIndicator size="large" color={theme.spinner.primary} />
                    ) : userLeagues.leagues.length ? (
                        userLeagues.leagues.map((league: LeagueState) => (
                            <TouchableOpacity onPress={() => navigation.navigate('League', { leagueId: league.id })}>
                                <LeagueItem
                                    key={league.id}
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: theme.button.backgroundColor,
                                        display: 'flex',
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
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: theme.text.primary,
                                                fontSize: theme.text.large,
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
                                </LeagueItem>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View>
                            <LeagueItem>
                                <Text>You have not entered any public leagues yet</Text>
                            </LeagueItem>
                        </View>
                    )}
                </LeagueContainer>

                <View style={{ position: 'absolute', bottom: 250 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Join')}>
                        <ButtonText style={{ color: theme.text.primary }}>Click here to join a league</ButtonText>
                    </TouchableOpacity>
                </View>
            </Container>
        </View>
    )
}
