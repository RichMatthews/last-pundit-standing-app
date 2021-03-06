import React, { useCallback, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { CachedResults } from './results'

import { Game, Player } from 'src/state/types'

interface Props {
  display: 'flex' | 'none' | undefined
  games: Game[]
  theme: any
}

export const PreviousGames = ({ display, games, theme }: Props) => {
  const [gameIdViewing, setGameIdViewing] = useState<string | null>(null)

  const setGameIdViewingHelper = useCallback(
    (gameId) => {
      if (gameId === gameIdViewing) {
        setGameIdViewing(null)
        return
      }
      setGameIdViewing(gameId)
    },
    [gameIdViewing],
  )

  return games.length ? (
    <View style={styles(theme, display).container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {games
          .sort((a, b) => a.leagueRound - b.leagueRound)
          .map((game: Game) => {
            const player: Player | undefined = Object.values(game.players).find((p: Player) => !p.hasBeenEliminated)

            return (
              <View key={game.id} style={styles(theme).previousGamesContainer}>
                <View style={styles(theme).topRow}>
                  <TouchableOpacity onPress={() => setGameIdViewingHelper(game.id)} activeOpacity={0.7}>
                    <View>
                      <Text style={styles(theme).playerNameText}>{player?.information.name}</Text>
                      <Text style={styles(theme).winnerText}>Winner</Text>
                    </View>
                  </TouchableOpacity>

                  <View>
                    <Text style={styles(theme).amountCorrectText}>{player?.rounds.length}</Text>
                    <Text style={styles(theme).correctText}>Correct</Text>
                  </View>
                </View>
                <View>
                  <View style={{ display: game.id === gameIdViewing ? 'flex' : 'none' }}>
                    {Object.values(game.players).map((player: Player) => {
                      return (
                        <View key={player.information.id} style={styles(theme).individualPlayerRounds}>
                          <Text
                            style={{
                              backgroundColor: theme.purple,
                              color: theme.text.inverse,
                              fontFamily: 'Hind',
                              fontWeight: '700',
                              paddingLeft: 5,
                              marginBottom: 5,
                            }}
                          >
                            {player.information.name}
                          </Text>
                          <CachedResults player={player} theme={theme} />
                        </View>
                      )
                    })}
                  </View>
                </View>
              </View>
            )
          })}
      </ScrollView>
    </View>
  ) : (
    <View style={styles(theme).container}>
      <Text style={{ textAlign: 'center' }}>Previous games will show here after they are complete</Text>
    </View>
  )
}

export const CachedPreviousGames = React.memo(PreviousGames)

const styles = (theme: any, display = 'flex') =>
  StyleSheet.create({
    container: {
      display,
      alignSelf: 'center',
      width: '100%',
      flex: 1,
    },
    amountCorrectText: {
      color: theme.text.primary,
      fontSize: theme.text.xlarge,
      textAlign: 'center',
    },
    correctText: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold',
      fontSize: theme.text.small,
      textAlign: 'center',
    },
    playerNameText: {
      color: theme.text.primary,
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Regular',
      fontWeight: '500',
      fontSize: theme.text.large,
    },
    previousGamesContainer: {
      borderBottomWidth: 0.5,
      borderBottomColor: theme.borders.primary,
      borderRadius: 5,
      padding: 10,
      margin: 10,
      display: 'flex',
      justifyContent: 'space-between',
    },
    playerResultsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    individualPlayerRounds: {
      backgroundColor: theme.background.secondary,
      flexDirection: 'column',
      marginBottom: 20,
    },
    game: {
      flexDirection: 'row',
      marginVertical: 5,
      marginRight: 10,
    },
    winnerText: {
      color: '#aaa',
      fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Regular',
    },
    userChoiceImage: {
      width: 20,
      height: 20,
      marginRight: 5,
    },
    userOpponentImage: {
      width: 20,
      height: 20,
      marginLeft: 5,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
  })
