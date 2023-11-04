import 'reflect-metadata'
import { container } from 'tsyringe'
import ActionRepository from '../../../src/app/repository/ActionRepository'
import TurnDecisionManager from '../../../src/app/TurnDecisionManager'
import Player from '../../../src/domain/entity/Player'
import Population from '../../../src/domain/entity/Population'
import Tribe from '../../../src/domain/entity/Tribe'
import Turn from '../../../src/domain/entity/Turn'
import ActionName from '../../../src/domain/enum/ActionName'
import TestBootstrapper from '../../test-bootstrapper'

test('arm reduces civilizedness if no extra population', () => {
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

    const player = new Player(tribe, 'test_player')

    const turn = new Turn(player)
    const action = ActionRepository.createFromName(ActionName.Arm)

    const turnResult = turnDecisionManager.processTurn(action, turn)

    expect(turnResult.isLast).toBe(false)
    expect(tribe.population.total).toBe(10)
    expect(tribe.population.civilizedness).toBe(1)
    expect(tribe.population.combatReadiness).toBe(2)
})