class Resource {
    constructor(
        private readonly _name: string,
        private readonly _quantity: number,
        private readonly _food: number,
        private readonly _tradingAbility: number,
        private readonly _production: number,
        private readonly _culture: number,
    ) {
    }

    get name(): string {
        return this._name
    }

    get quantity(): number {
        return this._quantity
    }

    get food(): number {
        return this._food
    }

    get tradingAbility(): number {
        return this._tradingAbility
    }

    get production(): number {
        return this._production
    }

    get culture(): number {
        return this._culture
    }
}

export default Resource
