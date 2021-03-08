import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

export const ButtonText = ({ children }) => (
  <View style={buttonTextStyles.wrapper}>
    <Text style={buttonTextStyles.text}>{children}</Text>
  </View>
)

const buttonTextStyles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    display: 'flex',
    alignSelf: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
})

export const InvertedButtonText = ({ children }) => <Text style={invertedButtonTextStyles}>{children}</Text>

const invertedButtonTextStyles = {
  color: '#2c3e50',
}

export const Button = ({ children, disabled }) => (
  <View style={buttonStyles.linearGradient}>
    <View style={buttonStyles.buttonWrapper}>{children}</View>
  </View>
)

const buttonStyles = StyleSheet.create({
  linearGradient: {
    borderRadius: 25,
  },
  buttonWrapper: {
    alignSelf: 'center',
    padding: 10,
    width: 400,
  },
})

export const InvertedButton = ({ background, children, disabled }) => (
  <View style={invertedButtonStyles(background).wrapper}>{children}</View>
)

const invertedButtonStyles = (background) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: background,
      borderColor: '#2C3E50',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      padding: 10,
      width: 300,
      zIndex: 100,
    },
  })
