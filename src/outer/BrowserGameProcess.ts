import type EndGameManager from '../app/EndGameManager.ts'
import type StartGameManager from '../app/StartGameManager.ts'
import type Game from '../domain/entity/Game.ts'
import GameNotYetCreated from '../exception/GameNotYetCreated'
import type WebUi from '../ui/web/WebUi.ts'

class BrowserGameProcess {
    _game: Game | undefined

    constructor(
        private readonly _startGameManager: StartGameManager,
        private readonly _playerInterface: WebUi,
        private readonly _endGameManager: EndGameManager,
    ) {
    }

    get game(): Game {
        if (this._game === undefined) {
            throw new GameNotYetCreated()
        }
        return this._game
    }

    set game(game: Game) {
        this._game = game
    }

    get startGameManager(): StartGameManager {
        return this._startGameManager
    }

    get playerInterface(): WebUi {
        return this._playerInterface
    }

    get endGameManager(): EndGameManager {
        return this._endGameManager
    }

    start(): void {
        this.game = this.startGameManager.start()

        this.playerInterface.game = this.game
        this.playerInterface.startTurns()

        this.endGameManager.game = this.game
        this.endGameManager.initiateFinish()
    }
}

export default BrowserGameProcess
