import AppException from './AppException.ts'

class MaximalMilitaryPower extends AppException {
    constructor(militaryPower: number, population: number) {
        super(`Cannot arm further. Attained maximal military power ${militaryPower} for population ${population}.`)
    }
}

export default MaximalMilitaryPower
