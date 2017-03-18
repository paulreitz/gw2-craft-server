export interface IInfixUpgradeAttribute {
    attribute: string;
    modifier: number;
}

export interface IBuff {
    skill_id: number;
    description: string;
}

export interface IInfixUpgrade {
    id: number;
    attributes?: Array<IInfixUpgradeAttribute>;
    buffs?: Array<IBuff>;
}

export interface IInfusionSlot {
    flags: Array<string>;
}

export interface IDetails {
    type: string;
}

export interface IConsumableDetails extends IDetails {
    duration_ms: number;
    apply_count: number;
    name: string;
    icon: string;
    description: string;
}

export interface ITrinketDetails extends IDetails {
    infusion_slots: Array<string>;
    infix_upgrade: IInfixUpgrade;
    suffix_item_id: number;
    secondary_suffix_item_id: string;
}

export interface IUpgradeComponentDetails extends IDetails {
    flags: Array<string>;
    infusion_upgrade_flags: Array<string>;
    infix_upgrade: IInfixUpgrade;
    suffix: string;
}

export interface IArmorDetails extends IDetails {
    weight_class: string;
    defense: number,
    infusion_slots: Array<string>;
    infix_upgrade: IInfixUpgrade;
    suffix_item_id: number;
    secondary_suffix_item_id: string;
}

export interface IBagDetails extends IDetails {
    no_sell_or_sort: boolean;
    size: number;
}

export interface IWeaponDetails extends IDetails {
    damage_type: string;
    min_power: number;
    max_power: number;
    defense: number;
    infusions_slots: Array<string>;
    infix_upgrade: IInfixUpgrade;
    secondary_suffix_item_id: string;
}

export interface IBackDetails extends IDetails {
    infusion_slots: Array<IInfusionSlot>;
    secondary_suffix_item_id: string;
    stat_choices: Array<number>;
}

export interface IItem {
    id: number;
    name: string;
    type: string;
    level: number;
    rarity: string;
    vendor_value: number;
    default_skin: number;
    game_types: Array<string>;
    flags: Array<string>;
    restrictions: Array<string>;
    chat_link: string;
    icon: string;
    details?:IDetails;
}