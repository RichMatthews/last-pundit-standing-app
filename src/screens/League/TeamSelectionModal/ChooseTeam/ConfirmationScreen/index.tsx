import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const fontFamily = Platform.OS === 'ios' ? 'Hind' : 'Hind-Regular'
const boldFontFamily = Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold'

export const ConfirmationScreen = ({
  setShowConfirmationScreen,
  selectedTeam,
  selectedTeamOpponent,
  updateUserGamweekChoiceHelper,
  theme,
}) => {
  return (
    <View style={styles(theme).container}>
      <Text style={styles(theme).confirmText}>Confirm selection</Text>
      <View>
        <Text style={styles(theme).text}>You have selected</Text>
        <Text style={[styles(theme).text, styles(theme).selectedTeamName]}>{selectedTeam.name.toUpperCase()}</Text>
      </View>
      <View>
        <Text style={styles(theme).text}>vs</Text>
        <Text style={styles(theme).text}>{selectedTeamOpponent.name}</Text>
      </View>

      <View style={styles(theme).selectionTextContainer}>
        {selectedTeam.home ? (
          <Text style={styles(theme).font}>
            {selectedTeam.name} are playing at home so they must win for you to advance to the next round
          </Text>
        ) : (
          <Text style={styles(theme).font}>
            {selectedTeam.name} are playing away so they must win or draw for you to advance to the next round
          </Text>
        )}
      </View>

      <View style={styles(theme).buttonContainers}>
        <TouchableOpacity onPress={() => updateUserGamweekChoiceHelper()} activeOpacity={0.7}>
          <View style={[styles(theme).button, styles(theme).submitButton]}>
            <Text style={styles(theme).submitButtonText}>Confirm</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowConfirmationScreen(false)} activeOpacity={0.7}>
          <View style={[styles(theme).button, styles(theme).cancelButton]}>
            <Text style={styles(theme).cancelButtonText}>Cancel</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = (theme) =>
  StyleSheet.create({
    button: {
      borderWidth: 1,
      borderRadius: 5,
      margin: 5,
      padding: 5,
      paddingHorizontal: 30,
    },
    buttonContainers: {
      alignSelf: 'center',
      flexDirection: 'column',
      width: '100%',
    },
    container: {
      backgroundColor: theme.background.primary,
      // backgroundColor: 'red',
      justifyContent: 'center',
      flex: 1,
      marginBottom: 50,
    },
    cancelButton: {
      borderColor: theme.purple,
    },

    confirmText: {
      color: theme.text.primary,
      fontFamily,
      fontSize: 24,
      fontWeight: Platform.OS === 'ios' ? '600' : '700',
      marginBottom: 20,
      textAlign: 'center',
    },
    font: {
      color: theme.text.primary,
      fontFamily,
    },
    selectionTextContainer: {
      marginTop: 20,
      marginBottom: 20,
    },
    selectedTeamName: {
      fontSize: 30,
    },
    submitButton: {
      backgroundColor: theme.purple,
      borderColor: theme.purple,
    },
    cancelButtonText: {
      color: theme.purple,
      fontFamily: boldFontFamily,
      fontSize: 18,
      fontWeight: '600',
      textAlign: 'center',
    },
    submitButtonText: {
      color: theme.text.inverse,
      fontSize: 18,
      fontWeight: '600',
      fontFamily: boldFontFamily,
      textAlign: 'center',
    },
    text: {
      color: theme.text.primary,
      fontFamily,
      textAlign: 'center',
    },
  })
