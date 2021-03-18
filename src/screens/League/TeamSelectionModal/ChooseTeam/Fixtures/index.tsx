import React from 'react'
import { Text, TouchableOpacity, Platform, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'

import * as Images from 'app/src/images'

export const Fixtures = ({ chosenTeams, fixtures, playerHasMadeChoice, selectedTeam, setSelectedTeam, theme }) => {
  return (
    <View>
      <Text style={styles(theme).heading}>Gameweek Fixtures</Text>
      {!playerHasMadeChoice && (
        <Text style={styles(theme).subHeading}>Select your team then confirm at the bottom</Text>
      )}
      <View style={styles(theme).container}>
        {fixtures.map((block: any) => (
          <>
            <Text
              style={{
                backgroundColor: theme.background.secondary,
                fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
                color: theme.text.primary,
                fontWeight: '600',
                padding: 5,
                textAlign: 'center',
              }}
            >
              {block.date}
            </Text>
            <View key={block.block}>
              {block.matches.map((match, index: number) => {
                const { code: homeTeamCode, name: homeTeamName } = match.home
                const { code: awayTeamCode, name: awayTeamName } = match.away
                const homeTeamPreviouslyChosen = chosenTeams.includes(homeTeamCode)
                const awayTeamPreviouslyChosen = chosenTeams.includes(awayTeamCode)
                const disableHomeSelecting = homeTeamPreviouslyChosen || playerHasMadeChoice
                const disableAwaySelecting = awayTeamPreviouslyChosen || playerHasMadeChoice

                return (
                  <View key={homeTeamCode}>
                    <View style={styles(theme).center}>
                      <TouchableOpacity
                        onPress={
                          disableHomeSelecting
                            ? null
                            : () =>
                                setSelectedTeam({
                                  ...match.home,
                                  block: block.block,
                                  index,
                                  home: true,
                                })
                        }
                        activeOpacity={disableHomeSelecting ? 1 : 0.7}
                      >
                        <View
                          style={[
                            styles(theme).matchContainerHome,
                            {
                              backgroundColor:
                                selectedTeam?.code === homeTeamCode && selectedTeam?.index === index
                                  ? '#fcebff'
                                  : 'transparent',
                              opacity: homeTeamPreviouslyChosen ? 0.1 : 1,
                            },
                          ]}
                        >
                          <Text style={[styles(theme).teamName]}>{homeTeamName}</Text>
                          <View style={styles(theme).teamBadgeContainer}>
                            <FastImage style={styles(theme).teamBadge} source={Images[homeTeamCode]} />
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={styles(theme).vsContainer}>
                        <Text style={styles(theme).vs}>{match.time || 'TBC'}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={
                          disableAwaySelecting
                            ? null
                            : () =>
                                setSelectedTeam({
                                  ...match.away,
                                  block: block.block,
                                  index,
                                  home: false,
                                })
                        }
                        activeOpacity={disableAwaySelecting ? 1 : 0.7}
                      >
                        <View
                          style={[
                            styles(theme).matchContainerAway,
                            {
                              backgroundColor:
                                selectedTeam?.code === awayTeamCode && selectedTeam?.index === index
                                  ? '#fcebff'
                                  : 'transparent',
                              opacity: awayTeamPreviouslyChosen ? 0.1 : 1,
                            },
                          ]}
                        >
                          <View style={styles(theme).teamBadgeContainer}>
                            <FastImage style={styles(theme).teamBadge} source={Images[awayTeamCode]} />
                          </View>
                          <Text style={[styles(theme).teamName]}>{awayTeamName}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              })}
            </View>
          </>
        ))}
      </View>
    </View>
  )
}
const styles = (theme) =>
  StyleSheet.create({
    center: {
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    container: {
      alignSelf: 'center',
    },
    heading: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontSize: 20,
      alignSelf: 'center',
      fontWeight: '600',
      marginBottom: 10,
    },
    matchContainerAway: {
      flexDirection: 'row',
      alignItems: 'center',
      width: 150,
    },
    matchContainerHome: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: 150,
    },
    subHeading: {
      alignSelf: 'center',
      color: '#aaa',
      marginBottom: 10,
    },
    teamName: {
      fontSize: theme.text.small,
      marginRight: 5,
      fontWeight: '600',
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
    },
    teamBadge: {
      width: 40,
      height: 40,
    },
    teamBadgeContainer: {
      borderRadius: 5,
      padding: 5,
    },
    vsContainer: {
      alignSelf: 'center',
      borderColor: theme.borders.primary,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      padding: 10,
      margin: 10,
    },
    vs: {
      color: theme.text.primary,
      marginLeft: 10,
      marginRight: 10,
    },
  })
