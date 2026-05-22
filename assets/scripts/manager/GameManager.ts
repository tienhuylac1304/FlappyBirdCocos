import { _decorator, Component, Node } from 'cc';
import { EventManager } from './EventManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    is_playing: boolean = false;
    is_pause: boolean = false;
    is_end_game: boolean = false;

    score: number = 0;

    onLoad() {
        EventManager.instance.on("start-game", this.onStartGame, this);

        EventManager.instance.on("pause-game", this.onPauseGame, this);

        EventManager.instance.on("end-game", this.onEndGame, this);

        EventManager.instance.on("add-point", this.onAddPoint, this);
    }

    onStartGame() {
        this.is_playing = true;
        this.is_pause = false;
        this.is_end_game = false;
        this.onGameStateChange()
    }

    onPauseGame() {
        this.is_playing = false;
        this.is_pause = true;
        this.is_end_game = false;
        this.onGameStateChange()
    }

    onEndGame() {
        this.is_playing = false;
        this.is_pause = false;
        this.is_end_game = true;
        this.onGameStateChange()
    }

    onAddPoint() {

        this.score++;
        EventManager.instance.emit("point-change", this.score);

    }
    onGameStateChange() {
        EventManager.instance.emit("game-state-change", this.is_playing, this.is_pause, this.is_end_game);
    }
}

