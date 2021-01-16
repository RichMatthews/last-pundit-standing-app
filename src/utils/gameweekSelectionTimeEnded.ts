export const gameweekSelectionTimeEnded = (gameweekSelectionEndTime: number) => {
    const timeNowInMs = Date.now()

    if (timeNowInMs > gameweekSelectionEndTime) {
        return true
    }
    return false
}
