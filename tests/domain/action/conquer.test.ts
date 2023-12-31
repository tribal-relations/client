import TurnDecisionManager from '../../../src/app/TurnDecisionManager.ts'
import AbstractPlayerAction from '../../../src/domain/entity/action/AbstractPlayerAction'
import Player from '../../../src/domain/entity/Player.ts'
import Rome from '../../../src/domain/entity/Rome.ts'
import Tribe from '../../../src/domain/entity/Tribe.ts'
import Turn from '../../../src/domain/entity/Turn.ts'
import ActionName from '../../../src/domain/enum/ActionName.ts'
import ActionRepository from '../../../src/domain/repository/ActionRepository.ts'
import { container } from '../../../src/NaiveDiContainer.ts'
import TribeFactory from '../../../src/outer/factory/TribeFactory.ts'
import TestBootstrapper from '../../test-bootstrapper.ts'

test('can conquer', () => {
    const turnDecisionManager = container.resolveSafely(TurnDecisionManager)
    const starterFood = 4

    const tribe = TribeFactory.createStarterTribeWithOptions()
    expect(tribe.population).toStrictEqual(Tribe.defaultPopulation)
    expect(tribe.food).toStrictEqual(starterFood)

    const player = new Player(tribe)
    const turn = new Turn(player)

    TestBootstrapper.addCulture(tribe, 10)
    tribe.goToNextRadius()
    tribe.goToNextRadius()
    tribe.goToNextRadius()

    TestBootstrapper.addProduction(tribe, 1000)
    tribe.growPopulation(500)
    tribe.growPopulation(500)
    tribe.growPopulation(500)
    tribe.growPopulation(500)
    tribe.arm()

    const rome = container.resolveSafely(Rome)
    expect(rome.militaryPower).toStrictEqual(Rome.defaultMilitaryPower)

    expect(tribe.militaryPower).toBeGreaterThan(rome.militaryPower)

    const gameAction = ActionRepository.createFromName(ActionName.Conquer)
    const playerAction = new AbstractPlayerAction(gameAction, player.tribe)

    const turnResult = turnDecisionManager.processTurn(playerAction, turn)

    expect(turnResult.isLast).toBe(true)
    expect(tribe.isWinner).toStrictEqual(true)
})
