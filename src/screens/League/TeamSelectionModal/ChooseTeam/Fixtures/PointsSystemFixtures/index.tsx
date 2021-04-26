import React, { useCallback, useEffect, useState } from 'react'
import { Text, TouchableOpacity, Platform, StyleSheet, View } from 'react-native'
import FastImage from 'react-native-fast-image'
import { useSelector } from 'react-redux'

import * as Images from 'app/src/images'

const ShowSelectionForEachTeam = ({ selections, justifyContent }) => {
  if (selections === undefined || selections.length === 0) {
    return <View style={{ padding: 10, height: 20 }}></View>
  }
  return (
    <View style={{ flexDirection: 'row', width: '100%', justifyContent }}>
      {selections.map((selection) => (
        <View
          style={{
            borderColor: 'red',
            borderWidth: 1,
            borderRadius: 100,
            margin: 2,
            width: 25,
            height: 25,
            justifyContent: 'center',
          }}
        >
          <Text style={{ textAlign: 'center', fontSize: 8 }}>{selection}</Text>
        </View>
      ))}
    </View>
  )
}

export const PointsBasedFixtures = ({ fixtures, selectedTeams, setSelectedTeams, theme }) => {
  const currentGame = useSelector((store: { currentGame: any }) => store.currentGame)
  const [fixturesWithPredictions, setFixturesWithPredictions] = useState([])
  useEffect(() => {
    setFixturesWithPredictions(calculateFixturesWithPredictions())
  }, [calculateFixturesWithPredictions, currentGame])

  const splitName = (name) => {
    return name.split(' ')[0][0] + name.split(' ')[1][0]
  }

  const calculateFixturesWithPredictions = useCallback(() => {
    return fixtures.map((block) => {
      return {
        ...block,
        matches: block.matches.map((match) => {
          currentGame.players.map((player) => {
            const b = player.rounds.find((p) => p.round === player.rounds.length - 1).selection.predictions
            const c = b.find((mch) => mch.id === match.id)
            console.log('b:', b)
            console.log('c:', c)
            if (c.choice === 'draw') {
              console.log('is a draw?')
              match = {
                ...match,
                draw: {
                  predictors: match.draw
                    ? match.draw.predictors
                      ? match.draw.predictors.concat(splitName(player.information.name))
                      : [splitName(player.information.name)]
                    : [splitName(player.information.name)],
                },
              }
            } else {
              match = {
                ...match,
                [c.choice]: {
                  ...match[c.choice],
                  predictors: match[c.choice].predictors
                    ? match[c.choice].predictors.concat(splitName(player.information.name))
                    : [splitName(player.information.name)],
                },
              }
            }
          })
          return match
        }),
      }
    })
  }, [currentGame.players, fixtures])

  const selectedTeamsHelper = (code, id) => {
    const newArr = selectedTeams.filter((mch) => mch.id !== id)
    newArr.push({ selected: code, id })
    setSelectedTeams(newArr)
  }

  return (
    <View>
      <Text style={styles(theme).heading}>Gameweek Fixtures</Text>
      <Text style={styles(theme).subHeading}>
        From each fixture, select a home win, away win or draw. You will get a point for each correct result
      </Text>
      <View style={styles(theme).container}>
        {fixturesWithPredictions.map((block: any) => (
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
              {block.matches &&
                block.matches.map((match, index: number) => {
                  const { code: homeTeamCode, name: homeTeamName } = match.home
                  const { code: awayTeamCode, name: awayTeamName } = match.away
                  return (
                    <View key={homeTeamCode} style={{ flexDirection: 'column' }}>
                      <View style={styles(theme).center}>
                        <TouchableOpacity
                          onPress={() => selectedTeamsHelper(match.home.code, match.id)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles(theme).matchContainerHome,
                              {
                                backgroundColor:
                                  selectedTeams.filter((team) => team.selected === homeTeamCode).length > 0
                                    ? '#00FF87'
                                    : 'transparent',
                              },
                            ]}
                          >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                              <Text style={[styles(theme).teamName]}>{homeTeamName}</Text>
                              <View style={styles(theme).teamBadgeContainer}>
                                <FastImage style={styles(theme).teamBadge} source={Images[homeTeamCode]} />
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => selectedTeamsHelper('draw', match.id)}>
                          <>
                            <View
                              style={[
                                styles(theme).vsContainer,
                                {
                                  backgroundColor:
                                    selectedTeams.filter((mch) => mch.id === match.id && mch.selected === 'draw')
                                      .length > 0
                                      ? '#00FF87'
                                      : 'transparent',
                                },
                              ]}
                            >
                              <Text style={styles(theme).vs}>Draw</Text>
                            </View>
                          </>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => selectedTeamsHelper(match.away.code, match.id)}
                          activeOpacity={0.7}
                        >
                          <View
                            style={[
                              styles(theme).matchContainerAway,
                              {
                                backgroundColor:
                                  selectedTeams.filter((team) => team.selected === awayTeamCode).length > 0
                                    ? '#00FF87'
                                    : 'transparent',
                              },
                            ]}
                          >
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                              <View style={styles(theme).teamBadgeContainer}>
                                <FastImage style={styles(theme).teamBadge} source={Images[awayTeamCode]} />
                              </View>
                              <Text style={[styles(theme).teamName]}>{awayTeamName}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={[styles(theme).matchContainerHome, { borderWidth: 0 }]}>
                          <ShowSelectionForEachTeam justifyContent="flex-start" selections={match.home.predictors} />
                        </View>
                        <View style={[styles(theme).vsContainer, { borderWidth: 0, justifyContent: 'flex-start' }]}>
                          <ShowSelectionForEachTeam justifyContent="center" selections={match?.draw?.predictors} />
                        </View>
                        <View style={[styles(theme).matchContainerAway, { borderWidth: 0 }]}>
                          <ShowSelectionForEachTeam justifyContent="flex-end" selections={match.away.predictors} />
                        </View>
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
      justifyContent: 'space-between',
      margin: 5,
      width: '100%',
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
      height: 40,
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: 130,
      borderColor: theme.borders.primary,
      borderWidth: 1,
      borderRadius: 5,
    },
    matchContainerHome: {
      height: 40,
      flexDirection: 'column',
      alignItems: 'flex-end',
      width: 130,
      borderColor: theme.borders.primary,
      borderWidth: 1,
      borderRadius: 5,
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
      width: 30,
      height: 30,
    },
    teamBadgeContainer: {
      borderRadius: 5,
      padding: 5,
    },
    vsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: theme.borders.primary,
      borderWidth: 1,
      borderRadius: 5,
      height: 40,
      width: 100,
    },
    vs: {
      color: theme.text.primary,
      fontWeight: '600',
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      marginLeft: 10,
      marginRight: 10,
    },
  })
