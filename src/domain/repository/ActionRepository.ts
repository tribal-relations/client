import ActionNotFound from '../../exception/not-found/ActionNotFound.ts'
import GameAction from '../entity/GameAction.ts'
import ActionName from '../enum/ActionName.ts'

class ActionRepository {
    private static readonly _rawData: Record<ActionName, {
        name_ru: string
        name: string
        radius: number
        description: string
        description_ru: string
        culture: number
        population: number
        production: number
        action_cost: number
        gold_cost: number
    }> = {
        [ActionName.Arm]: {
            name_ru: 'Вооружить население',
            name: 'Arm the population',
            radius: 4,
            description: 'Произвести оружие для боеспособной части населения . Киньте кубик, умножьте результат на ваше производство. Столько домиков вы можете вооружить.',
            description_ru: 'Произвести оружие для боеспособной части населения . Киньте кубик, умножьте результат на ваше производство. Столько домиков вы можете вооружить.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.Alliance]: {
            name_ru: 'Заключить союз с племенем',
            name: 'Make an alliance',
            radius: 2,
            description: 'Бонус отношений с выбранным племенем влияет на все ваши показатели.',
            description_ru: 'Бонус отношений с выбранным племенем влияет на все ваши показатели.',
            culture: 6,
            population: 0,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.AttackTile]: {
            name_ru: 'Атаковать тайл',
            name: 'Attack a tile',
            radius: 4,
            description: 'Выберете любой тайл и начните сражение за него. Побеждает игрок с большей вооруженностью.',
            description_ru: 'Выберете любой тайл и начните сражение за него. Побеждает игрок с большей вооруженностью.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 0,
            gold_cost: 0,
        },
        [ActionName.AttackTribe]: {
            name_ru: 'Атаковать племя',
            name: 'Attack a tribe',
            radius: 4,
            description: 'Выберете племя для атаки. Побеждает игрок с большей вооруженностью. Защитник несет потери, равные разнице вооруженностей.',
            description_ru: 'Выберете племя для атаки. Побеждает игрок с большей вооруженностью. Защитник несет потери, равные разнице вооруженностей.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 0,
            gold_cost: 0,
        },
        [ActionName.Caravan]: {
            name_ru: 'Отправить торговый караван',
            name: 'Send a caravan',
            radius: 4,
            description: 'Налаживает торговые связи. Киньте кубик. результат умножьте на ваш торговый бонус. прибавьте бонус реципиента из карточки отношений. Столько монет возьмите из банка. можно сделать 1 раз за раунд с одним племенем. В следующий ваш ход караван сразу будет работать.',
            description_ru: 'Налаживает торговые связи. Киньте кубик. результат умножьте на ваш торговый бонус. прибавьте бонус реципиента из карточки отношений. Столько монет возьмите из банка. можно сделать 1 раз за раунд с одним племенем. В следующий ваш ход караван сразу будет работать.',
            culture: 2,
            population: 0,
            production: 0,
            action_cost: 3,
            gold_cost: 2,
        },
        [ActionName.Conquer]: {
            name_ru: 'Захватить дворец',
            name: 'Conquer the palace',
            radius: 1,
            description: 'Если племя имеет вооруженность больше, чем дворец, то оно выигрывает.',
            description_ru: 'Если племя имеет вооруженность больше, чем дворец, то оно выигрывает.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.Cult]: {
            name_ru: 'Распространить культ',
            name: 'Expand the cult',
            radius: 4,
            description: 'Отправить священников, миссионеров и целителей в соседние земли.\nКиньте кубик.\n1 - умерло 5 населения \n2 - ничего не произошло\n3 - +2 культуры\n4 - +3 культуры \n5 - +4 культуры\n6 - +6 культуры',
            description_ru: 'Отправить священников, миссионеров и целителей в соседние земли.\nКиньте кубик.\n1 - умерло 5 населения \n2 - ничего не произошло\n3 - +2 культуры\n4 - +3 культуры \n5 - +4 культуры\n6 - +6 культуры',
            culture: 4,
            population: 10,
            production: 0,
            action_cost: 3,
            gold_cost: 0,
        },
        [ActionName.Expedition]: {
            name_ru: 'Сделать экспедицию',
            name: 'Make an expedition',
            radius: 4,
            description: 'Открывает прилежащую территорию. Киньте кубик. Если выпало 1 - вы ничего не открыли.',
            description_ru: 'Открывает прилежащую территорию. Киньте кубик. Если выпало 1 - вы ничего не открыли.',
            culture: 0,
            population: 1,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.GoTo3rdRadius]: {
            name_ru: 'Внедриться в пограничные территории',
            name: 'Settle near the borders',
            radius: 4,
            description: 'В результате племя переходит на следующий радиус.',
            description_ru: 'В результате племя переходит на следующий радиус.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 2,
            gold_cost: 0,
        },
        [ActionName.GoTo2ndRadius]: {
            name_ru: 'Поселить семью',
            name: 'Settle inside the state',
            radius: 3,
            description: 'Семья вашего племени теперь живет в границах государства, и может оказывать минимальную ассимиляцию. Ваше племя теперь присутствует на следующем радиусе.',
            description_ru: 'Семья вашего племени теперь живет в границах государства, и может оказывать минимальную ассимиляцию. Ваше племя теперь присутствует на следующем радиусе.',
            culture: 4,
            population: 0,
            production: 0,
            action_cost: 3,
            gold_cost: 0,
        },
        [ActionName.GoTo1stRadius]: {
            name_ru: 'Поселиться в город',
            name: 'Settle inside the city',
            radius: 2,
            description: 'Cемья переезжает в 1 радиус.',
            description_ru: 'Cемья переезжает в 1 радиус.',
            culture: 8,
            population: 0,
            production: 0,
            action_cost: 4,
            gold_cost: 0,
        },
        [ActionName.Hire]: {
            name_ru: 'Нанять воинов',
            name: 'Hire warriors',
            radius: 4,
            description: 'Заплатить золотом за вооруженность навсегда. Вооруженность берется у другого племени. Игроки должны договориться о количестве воинов и цене.',
            description_ru: 'Заплатить золотом за вооруженность навсегда. Вооруженность берется у другого племени. Игроки должны договориться о количестве воинов и цене.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.HireOneRound]: {
            name_ru: 'Нанять воинов на 1 раунд',
            name: 'Hire warriors for 1 round',
            radius: 4,
            description: 'Заплатить золотом за вооруженность на этот раунд. Вооруженность берется у другого племени. Игроки должны договориться о количестве воинов и цене.',
            description_ru: 'Заплатить золотом за вооруженность на этот раунд. Вооруженность берется у другого племени. Игроки должны договориться о количестве воинов и цене.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.Pillage]: {
            name_ru: 'Разграбить караван',
            name: 'Pillage a caravan',
            radius: 4,
            description: 'Дает деньги 1 раз. Сумма равна богатству каравана.',
            description_ru: 'Дает деньги 1 раз. Сумма равна богатству каравана.',
            culture: 0,
            population: 10,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.Pray]: {
            name_ru: 'Обратиться к Богу хранителю племени',
            name: 'Pray the guardian God',
            radius: 4,
            description: 'Бог может наградить вас или наказать. Киньте кубик.\n1 - умерло 10 населения\n2 - умерло 5 населения\n3 - умерло 1 население\n4 - вооружилось 1 население \n5 - получаешь 1 тайл + 1 действие\n6 - получаешь технологию +1 действие',
            description_ru: 'Бог может наградить вас или наказать. Киньте кубик.\n1 - умерло 10 населения\n2 - умерло 5 населения\n3 - умерло 1 население\n4 - вооружилось 1 население \n5 - получаешь 1 тайл + 1 действие\n6 - получаешь технологию +1 действие',
            culture: 10,
            population: 10,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.RemoveCaravan]: {
            name_ru: 'Убрать караван',
            name: 'Remove a caravan',
            radius: 4,
            description: 'Мирно перестать отправлять караван в выбранное место.',
            description_ru: 'Мирно перестать отправлять караван в выбранное место.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 0,
            gold_cost: 0,
        },
        [ActionName.Research]: {
            name_ru: 'Изучить технологию',
            name: 'Research',
            radius: 4,
            description: 'Выберете любую доступную технологию.',
            description_ru: 'Выберете любую доступную технологию.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 1,
            gold_cost: 0,
        },
        [ActionName.Quit]: {
            name_ru: 'Закончить игру',
            name: 'Quit',
            radius: 4,
            description: 'Выигрывает игрок с максимальным количеством очков.',
            description_ru: 'Выигрывает игрок с максимальным количеством очков.',
            culture: 0,
            population: 0,
            production: 0,
            action_cost: 0,
            gold_cost: 0,
        },
    }

    private static readonly _instances = {
        [ActionName.Arm]: ActionRepository.create(ActionName.Arm),
        [ActionName.Alliance]: ActionRepository.create(ActionName.Alliance),
        [ActionName.AttackTile]: ActionRepository.create(ActionName.AttackTile),
        [ActionName.AttackTribe]: ActionRepository.create(ActionName.AttackTribe),
        [ActionName.Caravan]: ActionRepository.create(ActionName.Caravan),
        [ActionName.Conquer]: ActionRepository.create(ActionName.Conquer),
        [ActionName.Cult]: ActionRepository.create(ActionName.Cult),
        [ActionName.Expedition]: ActionRepository.create(ActionName.Expedition),

        [ActionName.GoTo3rdRadius]: ActionRepository.create(ActionName.GoTo3rdRadius),
        [ActionName.GoTo2ndRadius]: ActionRepository.create(ActionName.GoTo2ndRadius),
        [ActionName.GoTo1stRadius]: ActionRepository.create(ActionName.GoTo1stRadius),
        [ActionName.Hire]: ActionRepository.create(ActionName.Hire),
        [ActionName.HireOneRound]: ActionRepository.create(ActionName.HireOneRound),
        [ActionName.Pray]: ActionRepository.create(ActionName.Pray),
        [ActionName.Pillage]: ActionRepository.create(ActionName.Pillage),
        [ActionName.RemoveCaravan]: ActionRepository.create(ActionName.RemoveCaravan),
        [ActionName.Research]: ActionRepository.create(ActionName.Research),
        [ActionName.Quit]: ActionRepository.create(ActionName.Quit),
    }

    public static get(name: ActionName): GameAction {
        if (name in ActionRepository._instances) {
            return ActionRepository._instances[name]
        }
        throw new ActionNotFound(name)
    }

    private static create(name: ActionName): GameAction {
        return new GameAction(
            name,
            ActionRepository._rawData[name].description,
            ActionRepository._rawData[name].radius,
            {
                radius: ActionRepository._rawData[name].radius,
                culture: ActionRepository._rawData[name].culture,
                population: ActionRepository._rawData[name].population,
                production: ActionRepository._rawData[name].production,
                action_cost: ActionRepository._rawData[name].action_cost,
                gold_cost: ActionRepository._rawData[name].gold_cost,
            },
        )
    }

    public static getAll(): Record<ActionName, GameAction> {
        return ActionRepository._instances
    }
}

export default ActionRepository
