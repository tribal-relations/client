import { singleton } from 'tsyringe'
import TurnDecisionManager from '../app/TurnDecisionManager'
import TurnManager from '../app/TurnManager'
import type TurnResult from '../app/TurnResult'
import type Action from '../domain/entity/Action'
import type Game from '../domain/entity/Game'

@singleton()
class WebUi {
    _game: Game | undefined

    constructor(
        private readonly _turnManager: TurnManager,
        private readonly _turnDecisionManager: TurnDecisionManager,
    ) {
    }

    get game(): Game {
        if (this._game === undefined) {
            throw new Error('game is not yet created')
        }
        return this._game
    }

    set game(game: Game) {
        this._game = game
    }

    startTurns(): void {
        // TODO get player names from ui

        this._turnManager.addPlayers(this.game.players.length)

        let turnResult: TurnResult
        let decision: Action
        let parameters: string

        // TODO issue-16 add front https://github.com/tribal-relations/corejs/issues/16
    }
}

export default WebUi
