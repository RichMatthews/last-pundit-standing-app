import React from 'react'
import { StyleSheet } from 'react-native'
import { ChooseTeam } from 'src/components/league/choose-team'

export const TeamSelection = ({
    closeTeamSelectionModal,
    pullLatestLeagueData,
    setLoadingModalOpen,
    theme,
    fixtures,
}) => {
    return (
        <ChooseTeam
            closeTeamSelectionModal={closeTeamSelectionModal}
            fixtures={fixtures}
            pullLatestLeagueData={pullLatestLeagueData}
            setLoadingModalOpen={setLoadingModalOpen}
            theme={theme}
        />
    )
}
