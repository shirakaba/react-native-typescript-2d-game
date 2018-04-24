<div align="center">
    <img src="screenshots/safe.png" width="400" />
    <img src="screenshots/colliding.png" width="400" />
</div>

# React Native Typescript 2D Game (The Box)

## About

### TL;DR

* Available on [expo.io](https://expo.io/@bottledlogic/the-box) for Android (untested) but maybe not iOS anymore (due to a recent change in [Apple policy](https://blog.expo.io/expo-sdk-v26-0-0-is-now-available-2be6d9805b31)).

* Or on the [App Store](https://itunes.apple.com/us/app/plucky-box/id1375337845?ls=1&mt=8), with the title "Plucky Box" ("The Box" was sadly taken!).

### Background

Around 2006, my brother made a simple Flash game called [The Box](https://birchlabs.co.uk/legacy/TheBox.html). In this game, you'd control a small blue box that has to run away from an ever-growing red box that is hunting it. The game would end upon the blue box being caught. You could attempt to live longer by picking up power-ups that would hinder the red box, but loss was ultimately inevitable.

### This project

This repository aims to reproduce The Box using modern mobile technologies. It's available on the Expo app store [here](https://expo.io/@bottledlogic/the-box).

#### Implemented so far:

- [x] INTERACTIVE: Tap (or drag) to command the blue box where to go
- [x] AI: Blue box follows the red box  
- [x] GAMEPLAY: Basic rectangle-based collision detection  
- [x] GRAPHICAL: Boxes rotate in the direction of movement 
- [x] GRAPHICAL: Runs at 60fps (both JS and UI thread) on both iOS Simulator and iPhone 5S
- [x] OPTIMISATION: Game's state update is synced with the screen refresh via a bespoke-made StateBatcher
- [x] OPTIMISATION: Eliminate slowdown upon addition of extra components into tree (via `shouldComponentUpdate()`)
- [x] GAMEPLAY: Add items
- [x] UX: Integrate a router to show different screens (e.g. start, options, etc.)
- [x] GAMEPLAY: Make the game end, and display a score (for time lived) upon collision

#### To-do:

- [ ] ARCHITECTURE: integrate Redux to manage state
- [ ] OPTIMISATION: Investigate using [object pools](https://www.html5rocks.com/en/tutorials/speed/static-mem-pools/) to reduce heap load (as iOS simulator's garbage collection is noticeable)

#### Investigated (but ditched):
- ~~GAMEPLAY: Separating Axis Theorem-based collision detection.~~ Current cheap box-based collision detection works fine because rotation is only an illusion!
- ~~OPTIMISATION: Convert graphics from being React Native Views to being canvas layers (or similar).~~ Did an experimental canvas implementation but it was much slower than native `View` components and the rotation maths somehow changed.
- ~~OPTIMISATION: Use React Native's [Animated](https://facebook.github.io/react-native/docs/animated.html) library, as by [Wix](https://github.com/wix-incubator/rn-perf-experiments2/blob/master/src/AnimatedScrollView.js), to reduce '[crossing the bridge](https://www.youtube.com/watch?v=OmiXlJ4ZzAo)'~~ Tested out, but it ran much slower! It seems `Animated` doesn't make sense for repetitive single-frame manual position adjustments. 


## Technologies

See the dependencies section below for links to these projects. I'm using:

* **Expo:** for rapid development of the app (allows you to develop without touching Xcode/Android Studio; is pre-configured with hot-reloading; has its own app store for instant publishing; provides debug tools, etc.).

* **React Native:** as a library for developing an cross-platform phone app using React's reactive architecture.

* **React Game Kit:** simply for providing a game loop by which to synchronise state/graphics updates.

* **React Navigation:** to provide cross-platform navigation. Chosen over [React Native Navigation](https://github.com/wix/react-native-navigation) because: **1)** Expo recommends it; and **2)** React Native Navigation is flooded with hundreds of open issues because the core team have switched attention to producing a new major release.      

* **TypeScript:** to write type-safe, refactorable, auto-completing code yet still output JavaScript (the language of React Native).

For instructions on how exactly to make a project like this for yourself from scratch, read the repository wiki's [How I created this project](https://github.com/shirakaba/react-native-typescript-2d-game/wiki/How-I-created-this-project) page.

For instructions on how to deploy an Expo app to the App Store, follow the repository wiki's [How I deployed this project to the App Store](https://github.com/shirakaba/react-native-typescript-2d-game/wiki/How-I-deployed-this-project-to-the-App-Store) page.
 

## Usage

### Installing as an app in the Expo Client

If you just want to try out the game without interacting with the repository, you can download it in the Expo Client via the URL:

https://exp.host/@bottledlogic/the-box

... Otherwise, follow the instructions in the next section to build it yourself.

### Building from this repository

#### Global dependencies

If you haven't made a `create-react-native-app` project before, you may need to install the Xcode command-line tools (if you're a Mac user), `yarn`, `create-react-native-app` itself, and `watchman`. Here are the instructions to get set up (for Mac):

```bash
brew update # For good luck
xcode-select --install
brew install yarn # This also implicitly installs a copy of node under brew (without npm)
yarn global add create-react-native-app
brew install watchman # Maybe not required, but I did it just in case.
```

#### Installation

```bash
git clone git@github.com:shirakaba/react-native-typescript-2d-game.git
cd react-native-typescript-2d-game
yarn install
```

#### Running in the simulator

Either of these commands will load your app into the Expo app in your phone simulator. I believe the Expo app itself gets installed onto the simulator as a result of `yarn global add create-react-native-app` (or simply during the first time that either of these commands is run).

```bash
yarn run ios
```

or:

```bash
yarn run android
```

Once the app is running, simply click anywhere on the screen to command the blue box! 

#### Troubleshooting

Refer to [How I created this project: Troubleshooting](https://github.com/shirakaba/react-native-typescript-2d-game/wiki/How-I-created-this-project#Troubleshooting)

## Licences

This project itself is GPL-licensed (see [LICENSE.txt](LICENSE.txt)).

### Dependencies

It is unlikely I'll be able to keep this table up-to-date, but assume either MIT or BSD licence if unsure.

| Dependency  | Licence |
| ------------- | ------------- |
| [react-game-kit](https://github.com/FormidableLabs/react-game-kit)  | [MIT](https://github.com/FormidableLabs/react-game-kit/blob/master/LICENSE.md)  |
| [react-native](https://github.com/facebook/react-native)  | [MIT](https://github.com/facebook/react-native/blob/master/LICENSE)  |
| [react](https://github.com/facebook/react)  | [MIT](https://github.com/facebook/react/blob/master/LICENSE)  |
| [prop-types](https://github.com/facebook/prop-types)  | [MIT](https://github.com/facebook/prop-types/blob/master/LICENSE)  |
| [expo](https://github.com/expo/expo)  | [BSD](https://github.com/expo/expo/blob/master/LICENSE)  |
| [react-navigation](https://github.com/react-navigation/react-navigation)  | [BSD](https://github.com/react-navigation/react-navigation/blob/master/LICENSE)  |

### Images

Images drawn by my brother for the original The Box game over a decade ago. Used with permission 🤡

### Sounds

All sounds gratefully sourced from [Taira Komori](http://taira-komori.jpn.org/freesounden.html).

Terms of use [here](http://taira-komori.jpn.org/freesounden.html). In brief: 

> free of charge and royalty free in your projects... be it for commercial or non-commercial purposes.

| Direct download  | Webpage |
| ------------- | ------------- |
| [attack1.mp3](http://taira-komori.jpn.org/sound_os/attack01/attack1.mp3)  | [Martial Arts > SF](http://taira-komori.jpn.org/attack01en.html)  |
| [attack2.mp3](http://taira-komori.jpn.org/sound_os/attack01/attack2.mp3)  | [Martial Arts > SF](http://taira-komori.jpn.org/attack01en.html)  |
| [bomb.mp3](http://taira-komori.jpn.org/sound_os/arms01/bomb.mp3)  | [Arms Explosion > Explosion,Launcher](http://taira-komori.jpn.org/arms01en.html)  |
| [explosion1.mp3](http://taira-komori.jpn.org/sound_os/arms01/explosion1.mp3)  | [Arms Explosion > Explosion,Launcher](http://taira-komori.jpn.org/arms01en.html)  |
| [kick1.mp3](http://taira-komori.jpn.org/sound_os/arms01/explosion1.mp3)  | [Martial Arts > Punching,Kicking](http://taira-komori.jpn.org/attack01en.html)  |
| [swing1.mp3](http://taira-komori.jpn.org/sound_os/attack01/swing1.mp3)  | [Martial Arts > Swinging](http://taira-komori.jpn.org/attack01en.html)  |
| [swing3.mp3](http://taira-komori.jpn.org/sound_os/attack01/swing1.mp3)  | [Martial Arts > Swinging](http://taira-komori.jpn.org/attack01en.html)  |

He also makes these available on [freesound](https://freesound.org/people/Taira%20Komori/) under a [Attribution 3.0 Unported (CC BY 3.0)](https://creativecommons.org/licenses/by/3.0/) licence.

## Special thanks

* To [Noitidart Saab](https://github.com/Noitidart) for his published and open-source [FlyThru](https://github.com/Noitidart/FlyThru) React Native app, which gave me hope that React Native could be used for 2D games without a dedicated graphics library; and for his demonstration of how to rig up React Navigation.

* To [Alex Duckmanton](https://github.com/alexduckmanton) who makes another React Native app, Burst, albeit closed-source (for now?) apart from an [animation tutorial](https://github.com/alexduckmanton/burst-animation-guide-complete). A productive [chance conversation](https://www.reddit.com/r/reactnative/comments/889ery/how_i_created_bursts_mind_bending_animations_with/dwj33od/) with him led me to getting items integrated without losing frame rate.
