import 'reflect-metadata'
import { container } from 'tsyringe'
import ActionRepository from '../../../src/app/repository/ActionRepository'
import TurnDecisionManager from '../../../src/app/TurnDecisionManager'
import type Action from '../../../src/domain/entity/Action'
import Player from '../../../src/domain/entity/Player'
import Population from '../../../src/domain/entity/Population'
import Territory from '../../../src/domain/entity/Territory'
import Tribe from '../../../src/domain/entity/Tribe'
import Turn from '../../../src/domain/entity/Turn'
import ActionName from '../../../src/domain/enum/ActionName'
import TestBootstrapper from '../../test-bootstrapper'

test('arm for amount of production', () => {
    const turnDecisionManager = container.resolve(TurnDecisionManager)

    const tribe = new Tribe(
        '',
        0,
        0,
        new Population(100, 0, 0),
        new Territory(0, 0, 10),
    )
    expect(tribe.population.total).toBe(100)
    expect(tribe.population.civilizedness).toBe(0)
    expect(tribe.population.combatReadiness).toBe(0)

    const player = new Player(tribe)
    const turn = new Turn(player)
    const action = ActionRepository.createFromName(ActionName.Arm)

    turnDecisionManager.processTurn(action, turn)

    expect(tribe.population.total).toBe(100)
    expect(tribe.population.civilizedness).toBe(0)
    expect(tribe.population.combatReadiness).toBe(10)
})

test('arm for amount of production, but not bigger than non-armed population', () => {
    const turnDecisionManager = container.resolve(TurnDecisionManager)

    const tribe = new Tribe(
        '',
        0,
        0,
        new Population(100, 0, 0),
        new Territory(0, 0, 1000),
    )
    expect(tribe.population.total).toBe(100)
    expect(tribe.population.civilizedness).toBe(0)
    expect(tribe.population.combatReadiness).toBe(0)

    const player = new Player(tribe)
    const turn = new Turn(player)
    const action = ActionRepository.createFromName(ActionName.Arm)

    turnDecisionManager.processTurn(action, turn)

    expect(tribe.population.total).toBe(100)
    expect(tribe.population.civilizedness).toBe(0)
    expect(tribe.population.combatReadiness).toBe(100)
})

test('cannot arm more than population', () => {
    const turnDecisionManager = container.resolve(TurnDecisionManager)

    const tribe = new Tribe(
        '',
        0,
        0,
        new Population(100, 0, 0),
        new Territory(0, 0, 90),
    )
    const player = new Player(tribe)
    const turn = new Turn(player)
    let action: Action
    expect(tribe.population.total).toBe(100)
    expect(tribe.population.combatReadiness).toBe(0)
    expect(tribe.territory.production).toBe(90)

    action = ActionRepository.createFromName(ActionName.Arm)
    turnDecisionManager.processTurn(action, turn)

    expect(tribe.population.total).toBe(100)
    expect(tribe.population.combatReadiness).toBe(90)

    action = ActionRepository.createFromName(ActionName.Arm)
    turnDecisionManager.processTurn(action, turn)

    expect(tribe.population.total).toBe(100)
    expect(tribe.population.combatReadiness).toBe(100)

    const throwingFunction = (): void => {
        const action = ActionRepository.createFromName(ActionName.Arm)
        turnDecisionManager.processTurn(action, turn)
    }
    expect(tribe.population.combatReadiness).toBe(100)

    expect(throwingFunction).toThrow('Cannot arm further. Maximal combat readiness for such population.')
})

test('arm reduces civilizedness if no extra population', () => {
    return
    // civilizedness is deprecated
    const { turnDecisionManager, tribe, turn } = TestBootstrapper.getStarterData()

    expect(tribe.population.total).toBe(2)
    expect(tribe.population.civilizedness).toBe(1)
    expect(tribe.population.combatReadiness).toBe(1)

    const action = ActionRepository.createFromName(ActionName.Arm)
    const turnResult = turnDecisionManager.processTurn(action, turn)

    expect(turnResult.isLast).toBe(false)
    expect(tribe.population.total).toBe(2)
    expect(tribe.population.civilizedness).toBe(0)
    expect(tribe.population.combatReadiness).toBe(2)
})

test('arm does not reduce civilizedness if extra population', () => {
    return
    // civilizedness is deprecated
    const turnDecisionManager = container.resolve(TurnDecisionManager)

    const tribe = new Tribe(
        '',
        0,
        0,
        new Population(10, 1, 1),
    )
    expect(tribe.population.total).toBe(10)
    expect(tribe.population.civilizedness).toBe(1)
    expect(tribe.population.combatReadiness).toBe(1)

    const player = new Player(tribe)
    const turn = new Turn(player)
    const action = ActionRepository.createFromName(ActionName.Arm)

    const turnResult = turnDecisionManager.processTurn(action, turn)

    expect(turnResult.isLast).toBe(false)
    expect(tribe.population.total).toBe(10)
    expect(tribe.population.civilizedness).toBe(1)
    expect(tribe.population.combatReadiness).toBe(2)
})
