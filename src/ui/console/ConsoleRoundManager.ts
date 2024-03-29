import type ConsoleCommandPerformer from './ConsoleCommandPerformer.ts'
import type ConsoleRelationRoundManager from './ConsoleRelationRoundManager.ts'
import ConsoleCommand from './entity/ConsoleCommand.ts'
import type ConsolePlayerActionIo from './io/ConsolePlayerActionIo.ts'
import type Std from './io/Std.ts'
import type CurrentGame from '../../app/CurrentGame.ts'
import type TurnDecisionManager from '../../app/TurnDecisionManager.ts'
import type TurnManager from '../../app/TurnManager.ts'
import type TurnResult from '../../app/TurnResult.ts'
import type PlayerActionInterface from '../../domain/entity/action/PlayerActionInterface.ts'
import type Player from '../../domain/entity/Player.ts'
import type Turn from '../../domain/entity/Turn.ts'
import type DiceThrower from '../../domain/helper/DiceThrower.ts'
import type RelationsStore from '../../domain/store/RelationsStore.ts'
import BubblingError from '../../exception/BubblingError.ts'
import type CommonRoundManager from '../common/CommonRoundManager.ts'

class ConsoleRoundManager {
    constructor(
        private readonly _diceThrower: DiceThrower,
        private readonly _std: Std,
        private readonly _turnManager: TurnManager,
        private readonly _turnDecisionManager: TurnDecisionManager,
        private readonly _consoleCommandPerformer: ConsoleCommandPerformer,
        private readonly _playerActionGetter: ConsolePlayerActionIo,
        private readonly _relationRoundManager: ConsoleRelationRoundManager,
        private readonly _relationsManager: RelationsStore,
        private readonly _currentGame: CurrentGame,
        private readonly _commonRoundManager: CommonRoundManager,
    ) {
    }

    public startRounds(): TurnResult {
        let turnResult: TurnResult
        let globalTurnNumber = 1
        for (let round = 1; true; ++round) {
            this._std.outHeading(`[ROUND ${round}]`)
            this._std.outHeading('[ACTIONS PHASE]')

            this._commonRoundManager.beforeRound()

            for (let i = 0; i < this._currentGame.playersLength; ++i, ++globalTurnNumber) {
                this._std.outSpacer(`Turn ${globalTurnNumber}`)

                const nextTurn = this._turnManager.nextTurn(this._currentGame)

                this._turnManager.tribeProfitBeforeActions(nextTurn.player.tribe)
                turnResult = this.doAllPlayerActions(nextTurn)

                if (turnResult.isLast) {
                    return turnResult
                }
                this._std.outEmptyLine()
            }
            this._std.outSpacer('Round finished.')

            this._currentGame.nextHalfRound()
            this.finalizeRound()
        }
    }

    private doAllPlayerActions(nextTurn: Turn): TurnResult {
        const totalActions = this._commonRoundManager.howManyActionsCanTribePerformThisTurn(nextTurn.player.tribe)

        let turnResult: TurnResult
        for (let i = 0; i < totalActions; ++i) {
            this._std.out(`action ${i + 1}/${totalActions} `)
            turnResult = this.doWhatPlayerSaysSafely(nextTurn.player, nextTurn)
        }

        return turnResult
    }

    public finalizeRound(): void {
        // this._commonRoundManager.discardTemporaryBonuses()
        this.outputPopulationGrowthRules()
        this._commonRoundManager.populationGrowth()
        this._relationRoundManager.determineRelations()
        this._currentGame.nextHalfRound()
    }

    private doWhatPlayerSaysSafely(player: Player, nextTurn: Turn): TurnResult {
        let decision: PlayerActionInterface | ConsoleCommand
        let parameters: string
        for (; ;) {
            try {
                const decisionWithParameters = this._playerActionGetter.getDecisionSafe(player)
                decision = decisionWithParameters.decision
                parameters = decisionWithParameters.parameters

                if (decision instanceof ConsoleCommand) {
                    this._consoleCommandPerformer.performCommand(decision, parameters, nextTurn)
                    continue
                }

                nextTurn.parameters = parameters
                return this._turnDecisionManager.processTurn(decision, nextTurn)
            } catch (error) {
                if (error instanceof BubblingError) {
                    throw error
                } else {
                    this._std.out(error.message)
                }
            }
        }
    }

    private outputPopulationGrowthRules(): void {
        this._std.outHeading('[POPULATION GROWTH PHASE]')
        this._std.out('One player casts a dice, its result is called fertility.')
        this._std.out('Each player can have its own bonuses to fertility from technologies.')
        this._std.out('Population surplus is then calculated based on fertility.')
        this._std.out('Population surplus is total tribe food multiplied by fertility or ten times current population, whichever is smaller.')
    }
}

export default ConsoleRoundManager
