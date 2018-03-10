import React from 'react';
import {Alert, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import {Box} from "./src/Box";

export default class App extends React.Component {
    onPress(ev): void {
        console.log(ev);
        // Alert.alert('You tapped the screen!');
    }

    render() {
        return (
            <View
                style={styles.container}
                onStartShouldSetResponder={(ev) => true}
                onMoveShouldSetResponder={(ev) => true}
                onResponderGrant={(evt) => { console.log(`onResponderGrant():`); }}
                onResponderReject={(evt) => { console.log(`onResponderReject():`); }}
                onResponderMove={(evt) => { console.log(`onResponderMove():`); }}
                onResponderRelease={(evt) => { console.log(`onResponderRelease():`); }}
                onResponderTerminationRequest={(evt) => true}
                onResponderTerminate={(evt) => { console.log(`onResponderTerminate():`); }}
            >
                <Box size={200} colour={"red"} initialLeft={90} initialTop={75}/>
                <Box size={50} colour={"blue"} initialLeft={50} initialTop={100}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        height: "100%",
        width: "100%",
        backgroundColor: 'orange',
        // flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
    fullscreen: {
    }
});
