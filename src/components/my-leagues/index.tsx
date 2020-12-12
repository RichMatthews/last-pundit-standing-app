import React, { Fragment } from 'react'
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
    background-color: #fff;
    border-radius: 10px;
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
    font-size: 22px;
    margin-right: 10px;
`
const NoLeagueText = styled(LeagueName)`
    color: #000;
`

export const MyLeagues = ({ navigation, userLeaguesFetchComplete }: any) => {
    const userLeagues = useSelector((store: { userLeagues: any }) => store.userLeagues)

    return (
        <Fragment>
            <SafeAreaView style={{ flex: 0, height: 100, backgroundColor: '#827ee6' }} />
            <SafeAreaView>
                <H1 style={{ backgroundColor: '#827ee6', color: '#fff', padding: 20, width: '100%' }}>My Leagues</H1>
                <Container>
                    <LeagueContainer>
                        {userLeaguesFetchComplete ? (
                            userLeagues.length ? (
                                userLeagues.map((league: LeagueState) => (
                                    <LeagueItem
                                        key={league.id}
                                        style={{
                                            shadowOpacity: 1,
                                            shadowRadius: 3.5,
                                            shadowColor: '#ccc',
                                            shadowOffset: { height: 2, width: 0 },
                                        }}
                                    >
                                        <View>
                                            <LeagueName>{league.name}</LeagueName>
                                        </View>
                                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                                            <TouchableOpacity
                                                onPress={() => navigation.navigate('League', { leagueId: league.id })}
                                            >
                                                <SimpleLineIcon name="arrow-right-circle" size={20} color={'#827ee6'} />
                                            </TouchableOpacity>
                                        </View>
                                    </LeagueItem>
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

                    <View style={{ position: 'absolute', bottom: 300 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Join')}>
                            <ButtonText style={{ color: '#827ee6' }}>Click here to join a league</ButtonText>
                        </TouchableOpacity>
                    </View>
                </Container>
            </SafeAreaView>
        </Fragment>
    )
}
