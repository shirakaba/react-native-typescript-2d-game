import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Box} from "./src/Battlefield";

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/*<Text>Open up App.js to start working on your app!</Text>*/}
        {/*<Text>Changes you make will automatically reload.</Text>*/}
        {/*<Text>Shake your phone to open the developer menu.</Text>*/}
        <Box size={200} colour={"red"} initialLeft={90} initialTop={75}/>
        <Box size={50} colour={"blue"} initialLeft={50} initialTop={100}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        // top: 100,
        // left: 75,
        height: "100%",
        width: "100%",
        flex: 1,
        backgroundColor: 'orange',
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
