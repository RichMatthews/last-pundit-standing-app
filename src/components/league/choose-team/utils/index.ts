import { getCurrentGameweekFixtures } from 'src/firebase-helpers'

export const findOpponent = async (selectedTeam: any) => {
    const fixtures = await getCurrentGameweekFixtures()
    const fixture = fixtures[selectedTeam.index]

    if (selectedTeam.home) {
        return {
            teamPlayingAtHome: true,
            opponent: {
                name: fixture.away.name,
                code: fixture.away.code,
            },
        }
    } else {
        return {
            teamPlayingAtHome: false,
            opponent: {
                name: fixture.home.name,
                code: fixture.home.code,
            },
        }
    }
}
