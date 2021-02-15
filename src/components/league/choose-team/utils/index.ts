import { getCurrentGameweekFixtures } from 'src/firebase-helpers'

export const findOpponent = async (selectedTeam) => {
    const fixtures = await getCurrentGameweekFixtures()
    const selectedTeamFixture: any = fixtures.find(
        (team) => team.home.code === selectedTeam.code || team.away.code === selectedTeam.code,
    )
    const homeTeam = selectedTeamFixture['home']
    const awayTeam = selectedTeamFixture['away']
    const selectedTeamPlayingAtHome = homeTeam === selectedTeam

    if (selectedTeamPlayingAtHome) {
        return {
            teamPlayingAtHome: true,
            opponent: {
                name: awayTeam.name,
                code: awayTeam.code,
            },
        }
    } else {
        return {
            teamPlayingAtHome: false,
            opponent: {
                name: homeTeam.name,
                code: homeTeam.code,
            },
        }
    }
}
