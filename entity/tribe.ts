import Population from './population'
import Territory from './territory'
import Tile from './tile'
import Resource from './resource'

class Tribe {

    static tribesCount = 8

    static tribeNameNorth = "North"
    static tribeNameNortheast = "Northeast"
    static tribeNameEast = "East"
    static tribeNameSoutheast = "Southeast"
    static tribeNameSouth = "South"
    static tribeNameSouthwest = "Southwest"
    static tribeNameWest = "West"
    static tribeNameNorthwest = "Northwest"

    static tribeNames = [
        "North",
        "Northeast",
        "East",
        "Southeast",
        "South",
        "Southwest",
        "West",
        "Northwest",
    ]
    static tribeNameToAliasMap =
        {
            "North": "Saami",
            "Northeast": "Chukchi",
            "East": "Chinese",
            "Southeast": "Javanese",
            "South": "Zulu",
            "Southwest": "Lusitanians",
            "West": "Lakota",
            "Northwest": "Aleut",
        }

    constructor(
        private name: string,
        private wealth: number,
        private points: number,
        private population: Population,
        private territory: Territory,
    ) {
    }

    getNewPopulationCount(fertility: number): number {
        let food = this.territory.getTotalFood()
        let cropsYield = food * fertility
        let upperBound = this.population.total * 10

        if (cropsYield < upperBound) {
            return cropsYield
        }

        return upperBound
    }

    makeTerritorialDiscovery() {
        const newTile = Tribe.discoverNewTile()
        this.territory.addTile(newTile)
        this.territory.updateResources()
    }

    static discoverNewTile(): Tile {
        return new Tile(Resource.getRandomResource())
    }
}

export default Tribe
