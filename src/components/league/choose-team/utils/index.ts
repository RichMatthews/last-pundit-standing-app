import { getCurrentGameweekFixtures } from 'src/firebase-helpers'

export const findOpponent = async (selectedTeam: any) => {
    const fixtures = await getCurrentGameweekFixtures()
    const fixture = fixtures[selectedTeam.block].matches.find(
        (match) => match.home.code === selectedTeam.code || match.away.code === selectedTeam.code,
    )
    console.log(fixture, 'fix')
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
