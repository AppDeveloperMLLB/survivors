/**
 * Attack Manager to handle the player's attacks including selection, level up, and execution.
 */

import { Attack } from './AttackSystem';
import { getAvailableAttacksForCharacter, commonAttackDefinitions, characterSpecificAttackDefinitions, createAttack } from './AttackDefinitions';

export class AttackManager {
  private characterId: string;
  private activeAttacks: Attack[] = [];
  private maxActiveAttacks: number = 6; // Maximum number of attacks a player can have at once
  
  constructor(characterId: string) {
    this.characterId = characterId;
    
    // Initialize with the first common attack (typically melee)
    const initialAttack = createAttack(commonAttackDefinitions[0]);
    this.activeAttacks.push(initialAttack);
  }
  
  /**
   * Get all attacks that the player currently has
   */
  getActiveAttacks(): Attack[] {
    return this.activeAttacks;
  }
  
  /**
   * Add a new attack to the player's active attacks
   */
  addAttack(attack: Attack): boolean {
    if (this.activeAttacks.length >= this.maxActiveAttacks) {
      console.warn('Cannot add more attacks, maximum reached');
      return false;
    }
    
    // Check if the attack is already active
    if (this.activeAttacks.some(a => a.id === attack.id)) {
      console.warn('Attack already active');
      return false;
    }
    
    this.activeAttacks.push(attack);
    return true;
  }
  
  /**
   * Level up an existing attack
   */
  levelUpAttack(attackId: string): boolean {
    const attack = this.activeAttacks.find(a => a.id === attackId);
    if (!attack) {
      console.warn(`Attack with ID ${attackId} not found`);
      return false;
    }
    
    return attack.levelUp();
  }
  
  /**
   * Generate level up options (3 options as per spec)
   */
  generateLevelUpOptions(): Attack[] {
    const options: Attack[] = [];
    const allAvailableAttacks = getAvailableAttacksForCharacter(this.characterId);
    
    // Filter out attacks that are at max level or already active
    const activeAttackIds = this.activeAttacks.map(a => a.id);
    
    // Option 1: Try to add a new common attack
    const availableCommonAttacks = allAvailableAttacks.filter(
      a => a.availableFor.includes('all') && 
           !activeAttackIds.includes(a.id)
    );
    
    if (availableCommonAttacks.length > 0) {
      // Randomly select one common attack
      const randomIndex = Math.floor(Math.random() * availableCommonAttacks.length);
      options.push(availableCommonAttacks[randomIndex]);
    }
    
    // Option 2: Try to add a new character-specific attack
    const availableCharacterAttacks = allAvailableAttacks.filter(
      a => a.availableFor.includes(this.characterId) && 
           !a.availableFor.includes('all') &&
           !activeAttackIds.includes(a.id)
    );
    
    if (availableCharacterAttacks.length > 0) {
      // Randomly select one character-specific attack
      const randomIndex = Math.floor(Math.random() * availableCharacterAttacks.length);
      options.push(availableCharacterAttacks[randomIndex]);
    }
    
    // Option 3: Try to level up an existing attack that's not at max level
    const upgradableAttacks = this.activeAttacks.filter(a => a.level < a.maxLevel);
    
    if (upgradableAttacks.length > 0) {
      // Randomly select one upgradable attack
      const randomIndex = Math.floor(Math.random() * upgradableAttacks.length);
      options.push(upgradableAttacks[randomIndex]);
    }
    
    // If we don't have 3 options yet, fill with random available attacks or upgrades
    const remainingAvailableAttacks = allAvailableAttacks.filter(
      a => !activeAttackIds.includes(a.id)
    );
    
    const allPossibleOptions = [...remainingAvailableAttacks, ...upgradableAttacks];
    
    // Shuffle the array to get random selections
    const shuffled = this.shuffleArray(allPossibleOptions);
    
    // Add options until we have 3 or run out of possibilities
    for (const attack of shuffled) {
      if (options.length >= 3) break;
      
      // Make sure we don't add duplicates
      if (!options.some(o => o.id === attack.id)) {
        options.push(attack);
      }
    }
    
    return options;
  }
  
  /**
   * Select an attack option from level up choices
   */
  selectLevelUpOption(selectedAttack: Attack): void {
    const existingAttack = this.activeAttacks.find(a => a.id === selectedAttack.id);
    
    if (existingAttack) {
      // Level up existing attack
      existingAttack.levelUp();
    } else {
      // Add new attack
      this.addAttack(selectedAttack);
    }
  }
  
  /**
   * Helper method to shuffle an array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Class to handle the execution of attacks in the game
export class AttackExecutor {
  private attackManager: AttackManager;
  private timers: Map<string, number> = new Map();
  private scene: Phaser.Scene;
  
  constructor(scene: Phaser.Scene, characterId: string) {
    this.scene = scene;
    this.attackManager = new AttackManager(characterId);
  }
  
  /**
   * Start executing all active attacks on a timer
   */
  startAttackLoop(): void {
    // Clear any existing timers
    this.timers.forEach(timerId => window.clearInterval(timerId));
    this.timers.clear();
    
    // Set up a timer for each active attack
    this.attackManager.getActiveAttacks().forEach(attack => {
      this.setupAttackTimer(attack);
    });
  }
  
  /**
   * Set up a timer for an attack based on its interval
   */
  private setupAttackTimer(attack: Attack): void {
    const intervalMs = attack.getCurrentInterval() * 1000;
    
    const timerId = window.setInterval(() => {
      this.executeAttack(attack);
    }, intervalMs);
    
    this.timers.set(attack.id, timerId);
  }
  
  /**
   * Add a new attack or update an existing one
   */
  updateAttack(attack: Attack): void {
    const activeAttacks = this.attackManager.getActiveAttacks();
    const existingAttack = activeAttacks.find(a => a.id === attack.id);
    
    if (existingAttack) {
      // If attack already exists, clear its timer and set up a new one
      const timerId = this.timers.get(attack.id);
      if (timerId) window.clearInterval(timerId);
      this.timers.delete(attack.id);
    }
    
    // Add or update the attack
    this.attackManager.selectLevelUpOption(attack);
    
    // Set up a new timer for this attack
    this.setupAttackTimer(attack);
  }
    /**
   * Execute a single attack with collision detection against enemies
   */
  private executeAttack(attack: Attack): void {
    console.log(`Executing attack: ${attack.name} (Level ${attack.level})`);
    
    // Get attack properties
    const damage = attack.getCurrentDamage();
    const hitboxWidth = attack.getCurrentHitboxWidth();
    const hitboxHeight = attack.getCurrentHitboxHeight();
    const duration = attack.getCurrentDuration();
    
    // Create the attack visual and hitbox
    const attackObject = this.createAttackVisual(attack, hitboxWidth, hitboxHeight, duration);
    
    // Get the enemies group from the scene
    const enemiesGroup = (this.scene as any).enemies;
    
    if (enemiesGroup) {
      // Create a collision handler
      const collider = this.scene.physics.add.overlap(
        attackObject,
        enemiesGroup,
        (attackObj, enemyObj) => {
          // Apply damage to the enemy
          const enemy = enemyObj as any;
          if (enemy && enemy.takeDamage) {
            enemy.takeDamage(damage);
          }
          
          // Apply special effects if applicable
          if (attack.specialEffect) {
            this.applySpecialEffect(enemy, attack);
          }
          
          // If the attack doesn't pierce, destroy it on first hit
          if (!attack.specialEffect || attack.specialEffect.type !== 'pierce') {
            attackObj.destroy();
            collider.destroy();
          }
        },
        undefined,
        this
      );
      
      // Clean up the collider when the attack is destroyed
      attackObject.on('destroy', () => {
        if (collider) {
          collider.destroy();
        }
      });
    }
  }
    /**
   * Create visual representation of the attack with physics body for collision detection
   * @returns A physics-enabled game object representing the attack
   */
  private createAttackVisual(attack: Attack, width: number, height: number, duration: number): Phaser.GameObjects.GameObject {
    // Get player position
    const player = (this.scene as any).player as Phaser.Physics.Arcade.Sprite;
    
    // Create an attack sprite
    const attackSprite = this.scene.add.rectangle(
      player.x,
      player.y,
      width,
      height,
      this.getAttackColor(attack),
      0.5
    );
    
    // Add physics to the attack sprite
    this.scene.physics.add.existing(attackSprite);
    
    // Remove the visual after the duration
    this.scene.time.delayedCall(duration * 1000, () => {
      attackSprite.destroy();
    });
    
    console.log(`Created attack visual with size ${width}x${height} for ${duration}s`);
    
    return attackSprite;
  }
  
  /**
   * Get a color for the attack based on its type
   */
  private getAttackColor(attack: Attack): number {
    if (attack.specialEffect) {
      switch (attack.specialEffect.type) {
        case 'poison': return 0x00FF00; // Green
        case 'burn': return 0xFF4500;   // OrangeRed
        case 'freeze': return 0x00BFFF; // DeepSkyBlue
        case 'stun': return 0xFFFF00;   // Yellow
        case 'slow': return 0x800080;   // Purple
        case 'pierce': return 0xFFFFFF; // White
        case 'area': return 0xFFA500;   // Orange
        case 'knockback': return 0xA52A2A; // Brown
      }
    }
    
    return 0xFFFFFF; // Default: White
  }
  
  /**
   * Get the attack manager for level up UI integration
   */
  getAttackManager(): AttackManager {
    return this.attackManager;
  }
  
  /**
   * Clean up all timers
   */
  destroy(): void {
    this.timers.forEach(timerId => window.clearInterval(timerId));
    this.timers.clear();
  }
}
