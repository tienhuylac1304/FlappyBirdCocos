# Flappy Bird
A web game developed with Cocos. Try to navigate the bird through the pipes without colliding to win!

## 🎮 Play Online

🔗 **Play the game here:**  
https://tienhuylac1304.github.io/FlappyBirdCocosDemo/


## 🚀 Features
* **Gameplay Mechanics:** Tap the screen or press the spacebar to jump. Navigate through moving pipe obstacles to score points. If you collide with a pipe or fall out of bounds, it's game over!
* **Decoupled Audio Manager:** Control settings to toggle BGM & SFX, adjust volume levels using sliders, and save state persistently to local storage.
* **Resume Countdown:** Smooth 3-second countdown pop-in scale animation when resuming from a paused state.
* **High Score Tracking:** Automatically tracks and saves your personal best score to local storage.
* **Decoupled Architecture:** Implements a custom EventManager to trigger audio and game state changes smoothly across classes.

## 🛠️ Customization & Tuning
* **Inspector Settings:** Customize variables such as bird jump velocity, normal gravity scale, game over gravity scale, and pipe spacing directly from the inspector.

## ⚙️ Requirements
* **Cocos Creator:** 3.8.8
* **Game Type:** 2D
* **Target Platforms:** Web

## 📥 Setup & Installation
1. Clone this repository.
2. Open Cocos Creator 3.8.8.
3. Click "Open Project" and select the project root folder.
4. Wait for the assets to import.
5. Open `assets/scenes/game_menu.scene`.

## 🏗️ Build & Run
* **Web:** Open the Build panel, choose Web, and click Build then Play.

## 📂 Project Structure
* `assets/` - Game scenes, scripts, images, prefabs, animations, and audios.
* `settings/` - Project-specific configuration settings.
* `build-templates/` - Templates used for building targets.
