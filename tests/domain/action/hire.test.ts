import TurnDecisionManager from '../../../src/app/TurnDecisionManager.ts'
import HirePlayerAction from '../../../src/domain/entity/action/HirePlayerAction.ts'
import Player from '../../../src/domain/entity/Player.ts'
import Turn from '../../../src/domain/entity/Turn.ts'
import { container } from '../../../src/NaiveDiContainer.ts'
import TribeFactory from '../../../src/outer/factory/TribeFactory.ts'

const defaultMilitaryPower = 10
const defaultGold = 10

function createSeller(militaryPower = null) {
    return TribeFactory.createStarterTribeWithOptions({
        militaryPower: militaryPower ?? defaultMilitaryPower,
        gold: defaultGold,
    })
}

function createBuyer(gold = null) {
    return TribeFactory.createStarterTribeWithOptions({
        militaryPower: defaultMilitaryPower,
        gold: gold ?? defaultGold,
    })
}

test('can hire', () => {
    const turnDecisionManager = container.resolveSafely(TurnDecisionManager)
    const seller = createSeller()
    const buyer = createBuyer()

    const player = new Player(buyer)
    const turn = new Turn(player)

    const playerAction = new HirePlayerAction(
        buyer,
        seller,
        5,
        6,
    )
    turnDecisionManager.processTurn(playerAction, turn)

    expect(buyer.militaryPower).toStrictEqual(10 + 5)
    expect(seller.militaryPower).toStrictEqual(10 - 5)
    expect(buyer.gold).toStrictEqual(10 - 6)
    expect(seller.gold).toStrictEqual(10 + 6)
})

test('cannot hire if buyer does not have not enough gold', () => {
    const turnDecisionManager = container.resolveSafely(TurnDecisionManager)
    const seller = createSeller()
    const buyer = createBuyer(1)

    const player = new Player(buyer)
    const turn = new Turn(player)

    const playerAction = new HirePlayerAction(
        buyer,
        seller,
        5,
        6,
    )

    const throwingFunction = () => {
        turnDecisionManager.processTurn(playerAction, turn)
    }
    expect(throwingFunction).toThrow(`Buyer ${buyer.name} does not have enough gold.`)

    expect(buyer.militaryPower).toStrictEqual(defaultMilitaryPower)
    expect(seller.militaryPower).toStrictEqual(defaultMilitaryPower)
    expect(buyer.gold).toStrictEqual(1)
    expect(seller.gold).toStrictEqual(defaultGold)
})

test('cannot hire if seller does not have enough troops', () => {
    const turnDecisionManager = container.resolveSafely(TurnDecisionManager)
    const seller = createSeller(1)
    const buyer = createBuyer()

    const player = new Player(buyer)
    const turn = new Turn(player)

    const playerAction = new HirePlayerAction(
        buyer,
        seller,
        5,
        6,
    )

    const throwingFunction = () => {
        turnDecisionManager.processTurn(playerAction, turn)
    }
    expect(throwingFunction).toThrow(`Seller ${seller.name} does not have enough troops.`)

    expect(buyer.militaryPower).toStrictEqual(defaultMilitaryPower)
    expect(seller.militaryPower).toStrictEqual(1)
    expect(buyer.gold).toStrictEqual(defaultGold)
    expect(seller.gold).toStrictEqual(defaultGold)
})
