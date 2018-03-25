<div align="center">
    <img src="screenshots/safe.png" width="400" />
    <img src="screenshots/colliding.png" width="400" />
</div>

# React Native Typescript 2D Game

## About

### Background

Around 2006, my brother made a simple Flash game called [The Box](https://birchlabs.co.uk/legacy/TheBox.html). In this game, you'd control a small blue box that has to run away from an ever-growing red box that is hunting it. The game would end upon the blue box being caught. You could attempt to live longer by picking up power-ups that would hinder the red box, but loss was ultimately inevitable.

### This project

This repository aims to reproduce The Box using modern mobile technologies. Aspects that are implemented so far:

- [x] INTERACTIVE: Tap (or drag) to command the blue box where to go
- [x] AI: Blue box follows the red box  
- [x] GAMEPLAY: Basic rectangle-based collision detection  
- [x] GRAPHICAL: Boxes rotate in the direction of movement 
- [x] OPTIMISATION: Game's state update is synced with the screen refresh (reduces jank/thrashing)

To-do:

- [ ] UX: Integrate a router to show different screens (e.g. start, options, etc.)
- [ ] ARCHITECTURE: integrate Redux to manage state
- [ ] GAMEPLAY: Make the game end, and display a score (for time lived) upon collision
- [ ] GAMEPLAY: Separating Axis Theorem-based collision detection
- [ ] GAMEPLAY: Add items (without slowdown – likely depends upon next to-do)
- [ ] OPTIMISATION: Convert graphics from being React Views to being canvas layers (or similar)

## Technologies

I'm using:

* **Expo:** for rapid development of the app (allows you to develop without touching Xcode/Android Studio; is pre-configured with hot-reloading; has its own app store for instant publishing; provides debug tools, etc.).

* **React Native:** as a library for developing an cross-platform phone app using React's reactive architecture.

* **React Game Kit:** simply for providing a game loop by which to synchronise state/graphics updates.

* **TypeScript:** to write type-safe, refactorable, auto-completing code yet still output JavaScript (the language of React Native).

For instructions on how exactly to make a project like this for yourself from scratch, read the repository wiki's [How I created this project](https://github.com/shirakaba/react-native-typescript-2d-game/wiki/How-I-created-this-project) page.
 

## Usage

### Global dependencies

If you haven't made a `create-react-native-app` project before, you may need to install the Xcode command-line tools (if you're a Mac user), `yarn`, `create-react-native-app` itself, and `watchman`. Here are the instructions to get set up (for Mac):

```bash
brew update # For good luck
xcode-select --install
brew install yarn # This also implicitly installs a copy of node under brew (without npm)
yarn global add create-react-native-app
brew install watchman # Maybe not required, but I did it just in case.
```

### Installation

```bash
git clone git@github.com:shirakaba/react-native-typescript-2d-game.git
cd react-native-typescript-2d-game
yarn install
```

### Running in the simulator

Either of these commands will load your app into the Expo app in your phone simulator. I believe the Expo app itself gets installed onto the simulator as a result of `yarn global add create-react-native-app` (or simply during the first time that either of these commands is run).

```bash
yarn run ios
```

or:

```bash
yarn run android
```

Once the app is running, simply click anywhere on the screen to command the blue box! 

### Troubleshooting

Refer to [How I created this project: Troubleshooting](https://github.com/shirakaba/react-native-typescript-2d-game/wiki/How-I-created-this-project#Troubleshooting)
