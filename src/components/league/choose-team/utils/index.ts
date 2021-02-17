import { getCurrentGameweekFixtures } from 'src/firebase-helpers'

export const isTeamPlayingInADoubleGameweek = async (selectedTeam) => {
    const fixtures = await getCurrentGameweekFixtures()
    const selectedTeamFixture: any = fixtures.filter(
        (team) => team.home.code === selectedTeam.code || team.away.code === selectedTeam.code,
    )

    if (selectedTeamFixture.length > 1) {
        return true
    }
    return false
}

export const findOpponent = async (selectedTeam) => {
    const fixtures = await getCurrentGameweekFixtures()
    const selectedTeamFixture: any = fixtures.filter(
        (team) => team.home.code === selectedTeam.code || team.away.code === selectedTeam.code,
    )
    const homeTeam = selectedTeamFixture[0].home
    const awayTeam = selectedTeamFixture[0].away
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
