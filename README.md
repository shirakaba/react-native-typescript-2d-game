# Initialising the project

React Native TypeScript Starter reference: https://github.com/cbrevik/react-native-typescript-starter/issues/8#issuecomment-371937307

What is Expo: https://stackoverflow.com/questions/39170622/what-is-the-difference-between-expo-and-react-native

* **To create a new project *without* Expo:** `react-native init TheBox`, first following the React Native [quickstart docs](http://facebook.github.io/react-native/docs/getting-started.html) ('Building Projects with Native Code' tab) to install the prerequisites (`react-native-cli`, `node`, and `watchman`).

* **To create a new project *with* Expo:** `create-react-native-app TheBox`, first following the previous link's 'Getting Started' tab alongside the corresponding React Community [GitHub page](https://github.com/react-community/create-react-native-app) to install the prerequisites (`create-react-native-app`, `node`, and likely also `watchman`).

I created a project *with* Expo. If you want to create a project without it, then follow Saket Sinha's blog post instead: [ReactNative-Starter-with-TypeScript](https://medium.com/@saketsinha23/reactnative-starter-with-typescript-4af9527e9142).

Creating the project produced the following success response:

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
> `cd TheBox`
>
> `yarn start`

# Integrating TypeScript

Before doing any of these steps, I decided to integrate TypeScript by following cbrevik's [blog post](http://blog.novanet.no/easy-typescript-with-react-native/):

1: `yarn add --dev react-native-typescript-transformer typescript`

2: `touch rn-cli.config.js` and write the following into it:

```JavaScript
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

If there are any problems specifically with TypeScript (eg. due to circular dependencies), refer to [ds300's react-native-typescript-transformer](https://github.com/ds300/react-native-typescript-transformer) GitHub project.
 
# First build

If you've cloned the git repo at this step (and therefore didn't get them installed as part of the setup), get all the dependencies with:

```yarn install```

Now, ensure that you don't have anything running on port 8081, as it will be used by the Metro Bundler (the packager) in the next step:

```
sudo lsof -i :8081      # Returns either an empty string (good) or a list of process' pids.
kill -9 <relevant pid>  # Kill each process by its pid number until port 8081 is free.
```

Next, as in the `create-react-native-app` init instructions, run:

```yarn run ios```

This should automatically start the simulator, open Expo, and start building the JavaScript bundle for the first time. It'll also give you a QR code to access your app.

Successful building of the app is indicated by a message like "17:40:52: Finished building JavaScript bundle in 45268ms", with the app appearing in your simulator.

# Troubleshooting

Before running `yarn run ios` again (possibly additionally with the `--reset-cache` flag; see below), do the following health check:

* `sudo lsof -i :8081` and `kill -9 <relevant pid>`, as described before.

* Delete the `ios/build` folder.

* Optionally delete the `node_modules` folder, perhaps also `yarn.lock` and perform a new `yarn install`.

* Optionally open a new terminal (in case you deleted build files whilst the packager was using them, and their symlinks have become cached)

* Remember to empty your Trash, as you'll have just deleted some big folders.

* Try passing the `--reset-cache` flag to React Native's packager somehow. Create React Native App's [User Guide](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/README.md#npm-start) mentions in the `npm start` section that `yarn start -- --reset-cache` is how to "run the app in development mode". Thus, you could perhaps try rewriting this command for iOS as something like `yarn run ios -- --reset-cache`?