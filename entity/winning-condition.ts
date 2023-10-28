import Tile from "./tile";

class WinningCondition {

    static winningConditionMilitaryName = "military"
    static winningConditionMilitaryText = "Your tribe has successfully conquered a state. You have succeeded in building a powerful army that is afraid of no one."

    static winningConditionCulturalName = "cultural"
    static winningConditionCulturalText = "Your tribe has successfully been idolized by a state. It will be remembered not as barbaric, but as heroic."

    static winningConditionPoliticalName = "political"
    static winningConditionPoliticalText = "Your tribe has successfully infiltrated and subjugated a state. It now prospers, not knowing it is You, who controls it behind the curtains."
    static winningConditionAliasToWinningConditionMap = {
        military: WinningCondition.winningConditionMilitaryText,
        cultural: WinningCondition.winningConditionCulturalText,
        political: WinningCondition.winningConditionPoliticalText,
    }

    public static createFromName(name: string): WinningCondition {
        const text = WinningCondition.winningConditionAliasToWinningConditionMap[name];
        return new WinningCondition(name, text)
    }

    constructor(
        private name: string,
        private winningText: string,
    ) {
    }
}

export default WinningCondition
