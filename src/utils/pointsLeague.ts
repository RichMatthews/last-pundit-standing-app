const calculatePointsForTeam = (team) => {
    const fixture = findFixture(team)

    if (fixture.home.team.name !== team.name || 'draw') {
        // team lost
        return 0
    }

    if (fixture.home.team.name === team.name) {
        if (fixture.result === team.name) {
            // team won => allocate 3 points
        } else {
            // team drew => allocate 1 point
        }
    } else {
        // team playing away
        if (fixture.result === team.name) {
            // team won => allocate 4 points
        } else {
            // team drew => allocate 2 points
        }
    }
}
