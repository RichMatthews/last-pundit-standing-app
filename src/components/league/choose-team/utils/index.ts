import { getCurrentGameweekFixtures } from 'src/firebase-helpers'

export const findOpponent = async (selectedTeam: string) => {
    const fixtures = await getCurrentGameweekFixtures()
    const selectedTeamFixture: any = fixtures.find(
        (team: { home: string; away: string; result: string }) =>
            team.home === selectedTeam || team.away === selectedTeam,
    )
    const homeTeam = selectedTeamFixture['home']
    const awayTeam = selectedTeamFixture['away']
    const selectedTeamPlayingAtHome = homeTeam === selectedTeam

    if (selectedTeamPlayingAtHome) {
        return {
            teamPlayingAtHome: true,
            opponent: {
                name: awayTeam,
            },
        }
    } else {
        return {
            teamPlayingAtHome: false,
            opponent: {
                name: homeTeam,
            },
        }
    }
}
