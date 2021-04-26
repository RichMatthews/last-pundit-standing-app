import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import FastImage from 'react-native-fast-image'

import * as Images from 'src/images'

import { Table, TableWrapper, Row, Cell, WidthArr } from 'react-native-table-component'

export const LeagueStats = ({ display, theme }) => {
  const league = useSelector((store: { league: any }) => store.league)
  const tableHead = ['', 'Wins', 'Correct', 'Longest streak']
  const [playerTableData, setPlayerTableData] = useState([])
  const [leagueTableData, setLeagueTableData] = useState({})

  useEffect(() => {
    calculateSomeStats(league)
  }, [league])
  const calculateSomeStats = (transformedData) => {
    let playerStats = {}
    let leagueStats = {
      selected: {},
      opponent: {},
    }

    const calculateWins = (currentPlayer, player) => {
      if (player.rounds.filter((round) => round.selection.result === 'lost').length === 0) {
        return currentPlayer.wins + 1
      }
      return currentPlayer.wins
    }

    const calculateCorrectResults = (currentPlayer, player) => {
      return currentPlayer.correctResults + player.rounds.filter((round) => round.selection.result === 'won').length
    }

    const calculateConsecutiveResults = (currentPlayer, player) => {
      return currentPlayer.playerOutLastGame
        ? player.rounds.filter((round) => round.selection.result === 'won').length > currentPlayer.consecutiveResults
          ? player.rounds.filter((round) => round.selection.result === 'won').length
          : currentPlayer.consecutiveResults
        : currentPlayer.consecutiveResults + player.rounds.filter((round) => round.selection.result === 'won').length
    }

    const calculatePoints = (player) => {
      return player.wins * 10 + player.correctResults
    }

    transformedData.games.forEach((game) =>
      game.players.forEach((player) => {
        if (playerStats[player.information.id]) {
          let currentPlayer = playerStats[player.information.id]
          playerStats[player.information.id] = {
            name: player.information.name,
            id: player.information.id,
            correctResults: calculateCorrectResults(currentPlayer, player),
            consecutiveResults: calculateConsecutiveResults(currentPlayer, player),
            wins: game.complete ? calculateWins(currentPlayer, player) : currentPlayer.wins,
            playerOutLastGame: Boolean(player.rounds.filter((round) => round.selection.result === 'lost').length > 0),
          }
        } else {
          playerStats[player.information.id] = {
            name: player.information.name,
            id: player.information.id,
            correctResults: player.rounds.filter((round) => round.selection.result === 'won').length,
            consecutiveResults: player.rounds.filter((round) => round.selection.result === 'won').length,
            wins: player.rounds.filter((round) => round.selection.result === 'lost').length === 0 ? 1 : 0,
            playerOutLastGame: Boolean(player.rounds.filter((round) => round.selection.result === 'lost').length > 0),
          }
        }
        player.rounds.forEach((round) => {
          if (leagueStats.selected[round.selection.code]) {
            leagueStats.selected[round.selection.code] = {
              code: round.selection.code,
              selected: leagueStats.selected[round.selection.code].selected + 1,
            }
          } else {
            leagueStats.selected[round.selection.code] = { code: round.selection.code, selected: 1 }
          }
        })

        player.rounds.forEach((round) => {
          if (round.selection && round.selection.opponent) {
            if (leagueStats.opponent[round.selection.opponent.code]) {
              leagueStats.opponent[round.selection.opponent.code] = {
                code: round.selection.opponent.code,
                selected: leagueStats.opponent[round.selection.opponent.code].selected + 1,
              }
            } else {
              leagueStats.opponent[round.selection.opponent.code] = { code: round.selection.opponent.code, selected: 1 }
            }
          }
        })
      }),
    )
    const x = Object.values(playerStats).map((player: any) => {
      const points = calculatePoints(player)
      return { ...player, points }
    })

    const sorted = x.sort((a, b) => a.points - b.points).reverse()
    setPlayerTableData(sorted)

    setLeagueTableData({
      opponent: Object.values(Object.values(leagueStats)[1])
        .sort((max, team) => max.selected - team.selected)
        .reverse(),
      selected: Object.values(Object.values(leagueStats)[0])
        .sort((max, team) => max.selected - team.selected)
        .reverse(),
    })
  }

  const formatedStatData = (data) => (
    <View style={styles(theme).statContainer}>
      <Text style={styles(theme).statText}>{data}</Text>
    </View>
  )

  const formattedNameData = (cellData) => (
    <View style={{ minWidth: 150 }}>
      <Text>{cellData}</Text>
    </View>
  )

  return (
    <View style={styles(theme, display).container}>
      <View style={{ margin: 10 }}>
        <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginBottom: 20 }}>
          <Text>Player</Text>
          <Text>League</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ minWidth: 125 }}></Text>
          <Text style={{ minWidth: 75, textAlign: 'center' }}>Wins</Text>
          <Text style={{ minWidth: 75, textAlign: 'center' }}>Correct</Text>
          <Text style={{ minWidth: 75, textAlign: 'center' }}>Best streak</Text>
        </View>
        <View>
          {playerTableData.map((player) => {
            return (
              <View style={{ flexDirection: 'row', margin: 20, marginHorizontal: 0 }}>
                <Text style={{ minWidth: 125 }}>{player.name}</Text>
                <Text style={{ minWidth: 75, textAlign: 'center' }}>{player.wins}</Text>
                <Text style={{ minWidth: 75, textAlign: 'center' }}>{player.correctResults}</Text>
                <Text style={{ minWidth: 75, textAlign: 'center' }}>{player.consecutiveResults}</Text>
              </View>
            )
          })}
        </View>
        {/* <Table>
          <Row data={tableHead} textStyle={{ fontSize: 10, alignSelf: 'center' }} />
          {playerTableData.map((rowData, index) => (
            <View style={{ marginVertical: 10, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 15 }}>
              <TableWrapper key={index} style={{ flexDirection: 'row' }}>
                {rowData.map((cellData, cellIndex) => {
                  return (
                    <Cell
                      display={'none'}
                      key={cellIndex}
                      data={cellIndex !== 0 ? formatedStatData(cellData) : formattedNameData(cellData)}
                    />
                  )
                })}
              </TableWrapper>
            </View>
          ))}
        </Table> */}
      </View>
      {leagueTableData && leagueTableData.selected && (
        <>
          <View style={{ alignItems: 'flex-start' }}>
            <Text>Most selected teams</Text>
            <View style={{ flexDirection: 'row', width: '75%', justifyContent: 'space-around' }}>
              {leagueTableData.selected.slice(0, 3).map((data) => {
                return (
                  <View style={{ margin: 10, alignItems: 'center' }}>
                    <FastImage style={styles.clubBadge} source={Images[data.code]} style={{ width: 45, height: 45 }} />
                    <Text>({data.selected})</Text>
                  </View>
                )
              })}
            </View>
          </View>
          <View style={{ alignItems: 'flex-start' }}>
            <Text>Most selected opposition</Text>
            <View style={{ flexDirection: 'row', width: '75%', justifyContent: 'space-around' }}>
              {leagueTableData.opponent.slice(0, 3).map((data) => {
                return (
                  <View style={{ margin: 10, alignItems: 'center' }}>
                    <FastImage style={styles.clubBadge} source={Images[data.code]} style={{ width: 45, height: 45 }} />
                    <Text>({data.selected})</Text>
                  </View>
                )
              })}
            </View>
          </View>
        </>
      )}
    </View>
  )
}

const styles = (theme: any, display = 'flex') =>
  StyleSheet.create({
    container: {
      display,
      alignSelf: 'center',
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: 10,
      paddingTop: 10,
      margin: 20,
      width: '90%',
      flex: 1,
    },

    statContainer: {
      alignSelf: 'center',
      backgroundColor: theme.purple,
      borderRadius: 20,
      justifyContent: 'center',
      height: 30,
      width: 30,
    },
    statText: {
      color: '#fff',
      fontWeight: '600',
      textAlign: 'center',
    },
  })
