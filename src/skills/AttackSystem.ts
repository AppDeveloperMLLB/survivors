/**
 * Attack system implementation based on the attack system specification document.
 */

export interface SpecialEffect {
  type: 'stun' | 'slow' | 'poison' | 'burn' | 'freeze' | 'knockback' | 'pierce' | 'area';
  value: number; // Effect strength (%)
  duration?: number; // Effect duration (seconds)
}

export interface Attack {
  id: string;
  name: string;
  description: string;
  baseDamage: number;
  baseInterval: number; // In seconds
  baseHitboxWidth: number;
  baseHitboxHeight: number;
  baseDuration: number; // In seconds
  level: number;
  maxLevel: number;
  specialEffect?: SpecialEffect;
  availableFor: string[]; // "all" or specific character IDs
  
  // Methods for calculating level-based stats
  getCurrentDamage(): number;
  getCurrentInterval(): number;
  getCurrentHitboxWidth(): number;
  getCurrentHitboxHeight(): number;
  getCurrentDuration(): number;
  
  // Method to level up the attack
  levelUp(): boolean;
}

export abstract class BaseAttack implements Attack {
  id: string;
  name: string;
  description: string;
  baseDamage: number;
  baseInterval: number;
  baseHitboxWidth: number;
  baseHitboxHeight: number;
  baseDuration: number;
  level: number = 1;
  maxLevel: number = 5;
  specialEffect?: SpecialEffect;
  availableFor: string[];

  constructor(config: Omit<Attack, 'getCurrentDamage' | 'getCurrentInterval' | 'getCurrentHitboxWidth' | 'getCurrentHitboxHeight' | 'getCurrentDuration' | 'levelUp'>) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.baseDamage = config.baseDamage;
    this.baseInterval = config.baseInterval;
    this.baseHitboxWidth = config.baseHitboxWidth;
    this.baseHitboxHeight = config.baseHitboxHeight;
    this.baseDuration = config.baseDuration;
    this.level = config.level || 1;
    this.maxLevel = config.maxLevel || 5;
    this.specialEffect = config.specialEffect;
    this.availableFor = config.availableFor;
  }

  // Calculate bonuses based on level
  protected calculateLevelBonus(baseValue: number, level: number, increasePerLevel: number): number {
    return baseValue * Math.pow(1 + increasePerLevel, level - 1);
  }

  // Get damage value considering level
  getCurrentDamage(): number {
    // Damage increases by 30% per level
    return this.calculateLevelBonus(this.baseDamage, this.level, 0.3);
  }

  // Get interval value considering level
  getCurrentInterval(): number {
    // Interval decreases by 10% per level (becomes faster)
    return this.baseInterval / this.calculateLevelBonus(1, this.level, 0.1);
  }

  // Get hitbox width value considering level
  getCurrentHitboxWidth(): number {
    // Hitbox size increases by 20% per level
    return this.calculateLevelBonus(this.baseHitboxWidth, this.level, 0.2);
  }

  // Get hitbox height value considering level
  getCurrentHitboxHeight(): number {
    // Hitbox size increases by 20% per level
    return this.calculateLevelBonus(this.baseHitboxHeight, this.level, 0.2);
  }

  // Get duration value considering level
  getCurrentDuration(): number {
    // Duration increases by 15% per level
    return this.calculateLevelBonus(this.baseDuration, this.level, 0.15);
  }

  // Level up the attack if not at max level
  levelUp(): boolean {
    if (this.level < this.maxLevel) {
      this.level++;
      return true;
    }
    return false;
  }

  // Calculate DPS (Damage Per Second)
  getDPS(): number {
    return this.getCurrentDamage() / this.getCurrentInterval();
  }
}

// Class for implementing attacks with special effects
export class SpecialAttack extends BaseAttack {
  getCurrentSpecialEffectValue(): number {
    if (!this.specialEffect) return 0;
    
    // Special effects also improve with level
    return this.calculateLevelBonus(this.specialEffect.value, this.level, 0.2);
  }

  getCurrentSpecialEffectDuration(): number {
    if (!this.specialEffect || !this.specialEffect.duration) return 0;
    
    // Special effect durations also improve with level
    return this.calculateLevelBonus(this.specialEffect.duration, this.level, 0.15);
  }
}
