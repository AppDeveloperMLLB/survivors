export default class ScoreDisplay {
    private text: Phaser.GameObjects.Text;
    private score: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.text = scene.add.text(x, y, 'Score: 0', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
    }

    setScore(score: number): void {
        this.score = score;
        this.text.setText(`Score: ${this.score}`);
    }

    addScore(amount: number): void {
        this.score += amount;
        this.text.setText(`Score: ${this.score}`);
    }

    getScore(): number {
        return this.score;
    }
}