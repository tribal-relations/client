import type PlayerActionInterface from '../entity/action/PlayerActionInterface'
import type Turn from '../entity/Turn.ts'
import type ActionName from '../enum/ActionName'

interface ActionInterface {
    actionName: ActionName
    perform: (playerAction: PlayerActionInterface, turn: Turn) => void
}

export default ActionInterface
