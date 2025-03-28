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

    private shuffle<T>(array: T[]): T[] {
        // Create a copy of the array to avoid modifying the original
        const shuffled = [...array];
        
        // Fisher-Yates shuffle algorithm
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
    }

    getRandomSkills(count: number): Skill[] {
        const shuffled = this.shuffle(this.availableSkills);
        return shuffled.slice(0, count);
    }
}
