import type Game from '../domain/entity/Game.ts'
import Turn from '../domain/entity/Turn.ts'

class TurnManager {
    private _playersLength = 0

    get playersLength(): number {
        return this._playersLength
    }

    addPlayer(): void {
        this._playersLength++
    }

    addPlayers(n: number): void {
        this._playersLength += n
    }

    nextTurn(game: Game): Turn {
        game.currentTurnNumber++
        const turn = new Turn(game.players[game.currentTurnNumber % this.playersLength])
        game.currentTurn = turn

        return turn
    }
}

export default TurnManager
