import { Skill } from '../skills/SkillSystem';
import { Attack } from '../skills/AttackSystem';

export default class LevelUpMenu extends Phaser.GameObjects.Container {
    private background!: Phaser.GameObjects.Rectangle;
    private titleText!: Phaser.GameObjects.Text;
    private skillButtons: Phaser.GameObjects.Container[] = [];

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0);
        this.createMenu();
        this.setVisible(false);
        this.setDepth(1000);
        scene.add.existing(this);
    }

    private createMenu(): void {
        const { width, height } = this.scene.game.canvas;

        // Add semi-transparent background
        this.background = this.scene.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        this.add(this.background);

        // Add title
        this.titleText = this.scene.add.text(width / 2, height / 4, 'LEVEL UP!\nChoose your upgrade:', {
            fontSize: '32px',
            color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        this.add(this.titleText);
    }

    showSkillChoices(skills: Skill[], onSelect: (skill: Skill) => void): void {
        const { width, height } = this.scene.game.canvas;
        
        // Clear existing skill buttons
        this.skillButtons.forEach(button => button.destroy());
        this.skillButtons = [];

        // Create new skill buttons
        skills.forEach((skill, index) => {
            const yOffset = height / 2 + index * 80;
            const button = this.scene.add.container(width / 2, yOffset);

            const buttonBg = this.scene.add.rectangle(0, 0, 300, 60, 0x444444)
                .setInteractive()
                .on('pointerover', () => buttonBg.setFillStyle(0x666666))
                .on('pointerout', () => buttonBg.setFillStyle(0x444444))
                .on('pointerdown', () => {
                    onSelect(skill);
                    this.hide();
                });

            const text = this.scene.add.text(0, 0, `${skill.name}\n${skill.description}`, {
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            button.add([buttonBg, text]);
            this.skillButtons.push(button);
            this.add(button);
        });

        this.setVisible(true);
    }    showAttackChoices(attacks: Attack[], onSelect: (attack: Attack) => void): void {
        const { width, height } = this.scene.game.canvas;
        
        // Clear existing buttons
        this.skillButtons.forEach(button => button.destroy());
        this.skillButtons = [];

        // Create new attack buttons
        attacks.forEach((attack, index) => {
            const yOffset = height / 2 + index * 80;
            const button = this.scene.add.container(width / 2, yOffset);

            const buttonBg = this.scene.add.rectangle(0, 0, 300, 60, 0x444444)
                .setInteractive()
                .on('pointerover', () => buttonBg.setFillStyle(0x666666))
                .on('pointerout', () => buttonBg.setFillStyle(0x444444))
                .on('pointerdown', () => {
                    onSelect(attack);
                    this.hide();
                });

            // Show attack level if it's already owned
            const levelText = attack.level > 1 ? `(Lv. ${attack.level})` : '';
            const description = attack.specialEffect 
                ? `${attack.description} - 特殊効果: ${this.getSpecialEffectDescription(attack.specialEffect)}` 
                : attack.description;
            
            const text = this.scene.add.text(0, 0, `${attack.name} ${levelText}\n${description}`, {
                fontSize: '16px',
                color: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);

            button.add([buttonBg, text]);
            this.skillButtons.push(button);
            this.add(button);
        });

        this.setVisible(true);
    }

    private getSpecialEffectDescription(effect: any): string {
        const effectTypes = {
            'stun': 'スタン',
            'slow': '鈍化',
            'poison': '毒',
            'burn': '炎上',
            'freeze': '凍結',
            'knockback': '吹き飛ばし',
            'pierce': '貫通',
            'area': '範囲'
        };
        
        const type = effectTypes[effect.type] || effect.type;
        return `${type}（効果値: ${effect.value}%${effect.duration ? `, 持続: ${effect.duration}秒` : ''}）`;
    }

    hide(): void {
        this.setVisible(false);
    }
}
