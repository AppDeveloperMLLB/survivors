export interface Skill {
    id: string;
    name: string;
    description: string;
    apply: (playerStats: any) => void;
}

export class SkillSystem {
    private availableSkills: Skill[] = [
        {
            id: 'health_up',
            name: 'Health Up',
            description: 'Increase max health by 20%',
            apply: (playerStats) => playerStats.modifyStat('health', 1.2)
        },
        {
            id: 'speed_up',
            name: 'Speed Up',
            description: 'Increase movement speed by 15%',
            apply: (playerStats) => playerStats.modifyStat('speed', 1.15)
        },
        {
            id: 'damage_up',
            name: 'Damage Up',
            description: 'Increase damage by 25%',
            apply: (playerStats) => playerStats.modifyStat('damage', 1.25)
        }
    ];

    getRandomSkills(count: number): Skill[] {
        const shuffled = [...this.availableSkills].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}
