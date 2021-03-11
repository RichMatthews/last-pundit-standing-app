export const findOpponent = (selectedTeam: any, fixtures) => {
  const fixture = fixtures[selectedTeam.block].matches.find(
    (match) => match.home.code === selectedTeam.code || match.away.code === selectedTeam.code,
  )

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
