# Initialising the project

React Native TypeScript Starter reference: https://github.com/cbrevik/react-native-typescript-starter/issues/8#issuecomment-371937307

What is Expo: https://stackoverflow.com/questions/39170622/what-is-the-difference-between-expo-and-react-native

* **To create a new project *without* Expo:** `react-native init TheBox`, first following the React Native [quickstart docs](http://facebook.github.io/react-native/docs/getting-started.html) ('Building Projects with Native Code' tab) to install the prerequisites (`react-native-cli`, `node`, and `watchman`).

* **To create a new project *with* Expo:** `create-react-native-app TheBox`, first following the previous link's 'Getting Started' tab alongside the corresponding React Community [GitHub page](https://github.com/react-community/create-react-native-app) to install the prerequisites (`create-react-native-app`, `node`, and likely also `watchman`).

I created a project *with* Expo. This produced the success response:

> Success! Created TheBox at: `/Users/jamie/Documents/git/TheBox`.
> Inside that directory, you can run several commands:
> 
>  `yarn start`
>
>  Starts the development server so you can open your app in the Expo app on your phone.
> 
>  `yarn run ios`
>
>  *(Mac only, requires Xcode)*
>  Starts the development server and loads your app in an iOS simulator.
> 
>  `yarn run android`
>
>  *(Requires Android build tools)*
>  Starts the development server and loads your app on a connected Android device or emulator.
> 
>   `yarn test`
>
>  Starts the test runner.
> 
>  `yarn run eject`
>
>  Removes this tool and copies build dependencies, configuration files and scripts into the app directory. If you do this, you can’t go back!
> 
> We suggest that you begin by typing:
> 
> ```cd TheBox
yarn start```

# Integrating TypeScript

Before doing any of these steps, I decided to integrate TypeScript by following cbrevik's [blog post](http://blog.novanet.no/easy-typescript-with-react-native/):

1: `yarn add --dev react-native-typescript-transformer typescript`

2: `touch rn-cli.config.js` and write the following into it:

```TypeScript
module.exports = {  
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer')
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  }
}
```

3: `touch tsconfig.json` and write your desired settings, eg.:

```JSON
{
  "compilerOptions": {
    "target": "es2015",
    "module": "es2015",
    "jsx": "react-native",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true
  }
}
```

4: Now refer to cbrevik's [react-native-typescript-starter](https://github.com/cbrevik/react-native-typescript-starter) project for an example working project.