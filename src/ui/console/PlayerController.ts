import type Std from './Std.ts'
import type TurnManager from '../../app/TurnManager.ts'
import Game from '../../domain/entity/Game.ts'
import Player from '../../domain/entity/Player.ts'
import Tribe from '../../domain/entity/Tribe.ts'
import TribeName from '../../domain/enum/TribeName.ts'
import GameNotYetCreated from '../../exception/GameNotYetCreated'

class PlayerController {
    _game: Game | undefined

    constructor(
        private readonly _turnManager: TurnManager,
        private readonly _std: Std,
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

    get std(): Std {
        return this._std
    }

    public updatePlayers(): void {
        this.std.out('Adding players')
        this.std.out('Players must have unique names.')

        const playerNames: string[] = []
        let playerName: string
        for (; true;) {
            for (let i = 1; i <= Game.maxPlayers; i++) {
                this.std.out(`Adding player ${i}/${Game.maxPlayers}`)

                playerName = this.std.in(`Enter player ${i} name (or return to end adding players)>`) ?? `player ${i}`
                if (!playerName || playerName === '\n') {
                    break
                }
                playerNames.push(playerName)
            }
            if (playerNames.length !== 0) {
                break
            }
        }
        this.game.players = this.createPlayers(playerNames)
        this.game.playersLength = Object.keys(this.game.players).length
    }

    public outputPlayersWithTribes(): void {
        let line: string

        for (const playerName in this.game.players) {
            line = `\t${playerName}\t-\tTribe '${this.game.players[playerName].tribe.name}'`
            this._std.out(line)
        }
    }

    private createPlayers(playerNames: string[]): Record<string, Player> {
        const players = {}
        const tribeNames = (Object as any).values(TribeName).slice(0, playerNames.length)

        for (let i = 0; i < playerNames.length; i++) {
            players[playerNames[i]] = new Player(
                new Tribe(tribeNames[i]),
                playerNames[i],
            )
        }
        return players
    }
}

export default PlayerController
