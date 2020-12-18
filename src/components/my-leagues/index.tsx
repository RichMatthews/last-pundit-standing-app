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

const LeagueName = styled.Text`
    color: #827ee6;
    font-size: 22px;
    font-weight: 700;
`
const NoLeagueText = styled(LeagueName)`
    color: #000;
`

export const MyLeagues = ({ navigation }: any) => {
    const userLeagues = useSelector((store: { userLeagues: any }) => store.userLeagues)

    return (
        <Fragment>
            <Container style={{ backgroundColor: '#fff', marginTop: 100, width: '100%' }}>
                <Text style={{ alignSelf: 'center', fontSize: 25, marginBottom: 20 }}>My Leagues</Text>
                <LeagueContainer>
                    {userLeagues.loading ? (
                        <ActivityIndicator size="large" color="#827ee6" />
                    ) : userLeagues.leagues.length ? (
                        userLeagues.leagues.map((league: LeagueState) => (
                            <TouchableOpacity onPress={() => navigation.navigate('League', { leagueId: league.id })}>
                                <LeagueItem
                                    key={league.id}
                                    style={{
                                        backgroundColor: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row',
                                        shadowOpacity: 1,
                                        shadowRadius: 4,
                                        shadowColor: '#ccc',
                                        shadowOffset: { height: 1, width: 0 },
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
                                        <LeagueName>{league.name}</LeagueName>
                                        <View style={{ width: 50, height: 30 }}>
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
                                    <Entypo name="chevron-small-right" size={30} />
                                </LeagueItem>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View>
                            <LeagueItem>
                                <NoLeagueText>You have not entered any public leagues yet</NoLeagueText>
                            </LeagueItem>
                        </View>
                    )}
                </LeagueContainer>

                <View style={{ position: 'absolute', bottom: 100 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Join')}>
                        <ButtonText style={{ color: '#827ee6' }}>Click here to join a league</ButtonText>
                    </TouchableOpacity>
                </View>
            </Container>
        </Fragment>
    )
}
