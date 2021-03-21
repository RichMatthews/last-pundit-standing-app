import React, { forwardRef, Ref } from 'react'
import { ActivityIndicator, Platform, View, StyleSheet, Text } from 'react-native'
import { Modalize } from 'react-native-modalize'

import { ChooseTeam } from './ChooseTeam'

type Props = {
  closeTeamSelectionModal: () => void
  loadingModalOpen: boolean
  gameweekFixtures: []
  setLoadingModalOpen: (arg: boolean) => void
  pullLatestLeagueData: () => void
  theme: any
  showConfirmationScreen: boolean
  setShowConfirmationScreen: boolean
}

export const TeamSelectionModal = forwardRef((props: Props, ref: Ref<Modalize>) => {
  const {
    closeTeamSelectionModal,
    loadingModalOpen,
    gameweekFixtures,
    setLoadingModalOpen,
    pullLatestLeagueData,
    theme,
    showConfirmationScreen,
    setShowConfirmationScreen,
  } = props

  return (
    <Modalize
      disableScrollIfPossible
      ref={ref}
      scrollViewProps={{
        contentContainerStyle: { backgroundColor: theme.background.primary, minHeight: '100%' },
      }}
      handlePosition={'inside'}
      modalStyle={{ backgroundColor: theme.background.primary, minHeight: showConfirmationScreen ? '100%' : 'auto' }}
      onClosed={() => setLoadingModalOpen(false)}
    >
      {loadingModalOpen ? (
        <View style={{ alignSelf: 'center', marginTop: 100 }}>
          <ActivityIndicator size={'large'} color={theme.spinner.inverse} />
          <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Hind' : 'Hind-Bold', fontSize: 20 }}>
            Submitting choice, please wait...
          </Text>
        </View>
      ) : (
        <View style={styles(theme).fixturesWrapper}>
          <ChooseTeam
            showConfirmationScreen={showConfirmationScreen}
            setShowConfirmationScreen={setShowConfirmationScreen}
            closeTeamSelectionModal={closeTeamSelectionModal}
            setLoadingModalOpen={setLoadingModalOpen}
            pullLatestLeagueData={pullLatestLeagueData}
            theme={theme}
            fixtures={gameweekFixtures}
          />
        </View>
      )}
    </Modalize>
  )
})

const styles = (theme?: any) =>
  StyleSheet.create({
    fixturesWrapper: {
      flex: 1,
      justifyContent: 'space-between',
      margin: 30,
    },
  })
