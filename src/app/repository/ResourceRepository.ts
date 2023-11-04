import Resource from '../../domain/entity/Resource'
import ResourceName from '../../domain/enum/ResourceName'
import Rand from '../../domain/helper/Rand'

const resources: Record<string, {
    quantity: number
    food: number
    trading_ability: number
    production: number
    culture: number
}> = {
    Metal: {
        quantity: 10,
        food: 0,
        trading_ability: 1,
        production: 2,
        culture: 0,
    },
    Fruit: {
        quantity: 8,
        food: 2,
        trading_ability: 1,
        production: 0,
        culture: 0,
    },
    Lake: {
        quantity: 4,
        food: 2,
        trading_ability: 0,
        production: 0,
        culture: 1,
    },
    Forest: {
        quantity: 20,
        food: 1,
        trading_ability: 0,
        production: 2,
        culture: 0,
    },
    River: {
        quantity: 6,
        food: 1,
        trading_ability: 2,
        production: 0,
        culture: 1,
    },
    Pasture: {
        quantity: 10,
        food: 3,
        trading_ability: 0,
        production: 0,
        culture: 0,
    },
    Stone: {
        quantity: 10,
        food: 0,
        trading_ability: 0,
        production: 2,
        culture: 1,
    },
    Gold: {
        quantity: 2,
        food: 0,
        trading_ability: 4,
        production: 0,
        culture: 0,
    },
    Silver: {
        quantity: 4,
        food: 0,
        trading_ability: 2,
        production: 0,
        culture: 1,
    },
    Desert: {
        quantity: 6,
        food: 0,
        trading_ability: 1,
        production: 0,
        culture: 1,
    },
}

class ResourceRepository {
    static resourcesCount = 10

    public static createFromName(name: ResourceName): Resource {
        return new Resource(
            String(name),
            resources[name].quantity,
            resources[name].food,
            resources[name].trading_ability,
            resources[name].production,
            resources[name].culture,
        )
    }

    static getRandomResource(): Resource {
        const randomName = Rand.enumChoice(ResourceName)

        return ResourceRepository.createFromName(randomName)
    }
}

export default ResourceRepository
