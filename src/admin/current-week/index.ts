export const GAMEWEEK_INFORMATION = [
    {
        gameweek: 0,
        matches: [
            { home: 'Fulham', away: 'Arsenal', result: 'Arsenal' },
            { home: 'Crystal Palace', away: 'Southampton', result: 'Crystal Palace' },
            { home: 'Liverpool', away: 'Leeds', result: 'Liverpool' },
            { home: 'West Ham', away: 'Newcastle', result: 'Newcastle' },
            { home: 'West Brom', away: 'Leicester', result: 'Leicester' },
            { home: 'Spurs', away: 'Everton', result: 'Everton' },
            { home: 'Sheffield United', away: 'Wolves', result: 'pending' },
            { home: 'Brighton', away: 'Chelsea', result: 'pending' },
        ],
    },
    {
        gameweek: 1,
        matches: [
            { home: 'Everton', away: 'West Brom', result: 'Everton' },
            { home: 'Leeds', away: 'Fulham', result: 'Leeds' },
            { home: 'Man United', away: 'Crystal Palace', result: 'Crystal Palace' },
            { home: 'Arsenal', away: 'West Ham', result: 'Arsenal' },
            { home: 'Southampton', away: 'Spurs', result: 'Spurs' },
            { home: 'Newcastle', away: 'Brighton', result: 'Brighton' },
            { home: 'Chelsea', away: 'Liverpool', result: 'Liverpool' },
            { home: 'Leicester', away: 'Burnley', result: 'Leicester' },
            { home: 'Aston Villa', away: 'Sheffield United', result: 'pending' },
            { home: 'Wolves', away: 'Man City', result: 'pending' },
        ],
    },
    {
        gameweek: 2,
        matches: [
            { home: 'Brighton', away: 'Man United', result: 'pending' },
            { home: 'Crystal Palace', away: 'Everton', result: 'pending' },
            { home: 'West Brom', away: 'Chelsea', result: 'pending' },
            { home: 'Burnley', away: 'Southampton', result: 'pending' },
            { home: 'Sheffield United', away: 'Leeds', result: 'pending' },
            { home: 'Spurs', away: 'Newcastle', result: 'pending' },
            { home: 'Man City', away: 'Leicester', result: 'pending' },
            { home: 'West Ham', away: 'Wolves', result: 'pending' },
            { home: 'Fulham', away: 'Aston Villa', result: 'pending' },
            { home: 'Liverpool', away: 'Arsenal', result: 'pending' },
        ],
    },
]

export const CURRENT_GAMEWEEK = {
    ends: 1600516800000,
    endTime: 'Saturday 19th September @ 12:00',
    fixtures: GAMEWEEK_INFORMATION[1].matches,
}

export const ALL_GAMEWEEKS = [{ gameweek: 0, fixtures: GAMEWEEK_INFORMATION[0].matches, ended: 1599912000000 }]
