/**
 * Attack definitions based on the attack system specification document.
 */

import { Attack, BaseAttack, SpecialAttack } from './AttackSystem';

// Common attack definitions that can be used by all characters
export const commonAttackDefinitions = [
  {
    id: 'melee',
    name: '近接攻撃',
    description: '前方に素早く攻撃を繰り出す',
    baseDamage: 10,
    baseInterval: 1.0,
    baseHitboxWidth: 30,
    baseHitboxHeight: 30,
    baseDuration: 0.5,
    level: 1,
    maxLevel: 5,
    availableFor: ['all']
  },
  {
    id: 'throw',
    name: '投擲攻撃',
    description: '遠くの敵にも届く投げ攻撃',
    baseDamage: 8,
    baseInterval: 1.5,
    baseHitboxWidth: 20,
    baseHitboxHeight: 20,
    baseDuration: 1.0,
    level: 1,
    maxLevel: 5,
    specialEffect: {
      type: 'pierce',
      value: 100, // 100% chance to pierce
      duration: 0
    },
    availableFor: ['all']
  },
  {
    id: 'area',
    name: '範囲攻撃',
    description: '周囲の敵に広範囲ダメージを与える',
    baseDamage: 6,
    baseInterval: 3.0,
    baseHitboxWidth: 100,
    baseHitboxHeight: 100,
    baseDuration: 0.8,
    level: 1,
    maxLevel: 5,
    specialEffect: {
      type: 'area',
      value: 100, // 100% area effect
      duration: 0
    },
    availableFor: ['all']
  },
  {
    id: 'poison',
    name: '毒攻撃',
    description: '敵に毒効果を付与し、継続ダメージを与える',
    baseDamage: 3,
    baseInterval: 2.0,
    baseHitboxWidth: 40,
    baseHitboxHeight: 40,
    baseDuration: 1.0,
    level: 1,
    maxLevel: 5,
    specialEffect: {
      type: 'poison',
      value: 50, // 50% of base damage as poison tick
      duration: 3.0 // 3 seconds
    },
    availableFor: ['all']
  },
  {
    id: 'slow',
    name: '鈍化攻撃',
    description: '敵の移動速度を低下させる',
    baseDamage: 5,
    baseInterval: 2.0,
    baseHitboxWidth: 40,
    baseHitboxHeight: 40,
    baseDuration: 1.0,
    level: 1,
    maxLevel: 5,
    specialEffect: {
      type: 'slow',
      value: 30, // Slow enemy by 30%
      duration: 2.0 // 2 seconds
    },
    availableFor: ['all']
  }
];

// Character-specific attack definitions
export const characterSpecificAttackDefinitions: Record<string, any[]> = {
  'character_a': [
    {
      id: 'lightning',
      name: '雷撃',
      description: '敵を一瞬で麻痺させる電撃',
      baseDamage: 15,
      baseInterval: 4.0,
      baseHitboxWidth: 50,
      baseHitboxHeight: 50,
      baseDuration: 0.5,
      level: 1,
      maxLevel: 5,
      specialEffect: {
        type: 'stun',
        value: 100, // 100% chance to stun
        duration: 1.0 // 1 second
      },
      availableFor: ['character_a']
    },
    {
      id: 'fire_wall',
      name: '炎の壁',
      description: '炎の壁を作成し、触れる敵に継続ダメージを与える',
      baseDamage: 8,
      baseInterval: 5.0,
      baseHitboxWidth: 120,
      baseHitboxHeight: 30,
      baseDuration: 3.0,
      level: 1,
      maxLevel: 5,
      specialEffect: {
        type: 'burn',
        value: 40, // 40% of base damage as burn tick
        duration: 2.0 // 2 seconds
      },
      availableFor: ['character_a']
    }
  ],
  'character_b': [
    {
      id: 'ice_arrow',
      name: '氷の矢',
      description: '敵を凍結させ一時的に行動不能にする',
      baseDamage: 12,
      baseInterval: 2.5,
      baseHitboxWidth: 25,
      baseHitboxHeight: 25,
      baseDuration: 0.5,
      level: 1,
      maxLevel: 5,
      specialEffect: {
        type: 'freeze',
        value: 80, // 80% chance to freeze
        duration: 1.5 // 1.5 seconds
      },
      availableFor: ['character_b']
    },
    {
      id: 'multi_shot',
      name: '多重弾',
      description: '一度に複数の攻撃を広範囲に放つ',
      baseDamage: 4, // Lower damage but hits multiple times
      baseInterval: 2.0,
      baseHitboxWidth: 80,
      baseHitboxHeight: 80,
      baseDuration: 1.0,
      level: 1,
      maxLevel: 5,
      specialEffect: {
        type: 'area',
        value: 100, // 100% area effect
        duration: 0
      },
      availableFor: ['character_b']
    }
  ]
};

// Factory function to create attack instances
export function createAttack(attackDefinition: any): Attack {
  if (attackDefinition.specialEffect) {
    return new SpecialAttack(attackDefinition);
  } else {
    throw new Error('BaseAttack is abstract and cannot be instantiated directly. Please provide a concrete implementation.');
  }
}

// Function to get all available attacks for a character
export function getAvailableAttacksForCharacter(characterId: string): Attack[] {
  const availableAttacks: Attack[] = [];

  // Add common attacks
  commonAttackDefinitions.forEach(attackDef => {
    availableAttacks.push(createAttack(attackDef));
  });

  // Add character specific attacks if they exist
  if (characterSpecificAttackDefinitions[characterId]) {
    characterSpecificAttackDefinitions[characterId].forEach(attackDef => {
      availableAttacks.push(createAttack(attackDef));
    });
  }

  return availableAttacks;
}
