import React from 'react'
import styled from 'styled-components'
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import { useSelector } from 'react-redux'

import { ButtonText } from '../../ui-components/button'
import { H1 } from '../../ui-components/headings'
import { Container } from '../../ui-components/containers'

interface LeagueState {
    name?: string
    id?: string
}

const LeagueContainer = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    margin-top: 20px;
`

const LeagueItem = styled.View`
    border-bottom-width: 1px;
    border-bottom-color: #ccc;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin: 10px;
    width: 350px;
`

const LeagueName = styled.Text`
    color: #827ee6;
    font-size: 25px;
    margin-right: 10px;
`
const NoLeagueText = styled(LeagueName)`
    color: #000;
`

export const MyLeagues = ({ navigation, userLeaguesFetchComplete }: any) => {
    const userLeagues = useSelector((store: { leagues: any }) => store.leagues)

    return (
        <SafeAreaView>
            <Container style={{ marginTop: 50 }}>
                <H1>My Leagues</H1>
                <LeagueContainer>
                    {userLeaguesFetchComplete ? (
                        userLeagues.length ? (
                            userLeagues.map((league: LeagueState) => (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('League', { leagueId: league.id })}
                                >
                                    <LeagueItem key={league.id}>
                                        <View>
                                            <LeagueName>{league.name}</LeagueName>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <Text
                                                style={{
                                                    borderWidth: 1,
                                                    padding: 3,
                                                    borderColor: '#474444',
                                                    borderRadius: 5,
                                                    color: '#474444',
                                                    marginRight: 10,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {league.isPrivate ? 'Private' : 'Public'}{' '}
                                            </Text>
                                            <SimpleLineIcon name="arrow-right-circle" size={20} color={'#827ee6'} />
                                        </View>
                                    </LeagueItem>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <View>
                                <LeagueItem>
                                    <NoLeagueText>You have not entered any public leagues yet</NoLeagueText>
                                </LeagueItem>
                            </View>
                        )
                    ) : (
                        <ActivityIndicator size="large" color="#827ee6" />
                    )}
                </LeagueContainer>

                <View style={{ position: 'absolute', bottom: 200 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Join')}>
                        <ButtonText style={{ color: '#827ee6' }}>Click here to join a league</ButtonText>
                    </TouchableOpacity>
                </View>
            </Container>
        </SafeAreaView>
    )
}
