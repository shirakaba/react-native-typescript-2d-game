import React from 'react';
import {Alert, GestureResponderEvent, StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
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
                onStartShouldSetResponder={(ev: GestureResponderEvent) => true}
                onMoveShouldSetResponder={(ev: GestureResponderEvent) => true}
                onResponderGrant={(ev: GestureResponderEvent) => { console.log(`onResponderGrant():`, ev.nativeEvent); }}
                onResponderReject={(ev: GestureResponderEvent) => { console.log(`onResponderReject():`, ev.nativeEvent); }}
                onResponderMove={(ev: GestureResponderEvent) => { console.log(`onResponderMove():`, ev.nativeEvent); }}
                onResponderRelease={(ev: GestureResponderEvent) => { console.log(`onResponderRelease():`, ev.nativeEvent); }}
                onResponderTerminationRequest={(ev: GestureResponderEvent) => true}
                onResponderTerminate={(ev: GestureResponderEvent) => { console.log(`onResponderTerminate():`, ev.nativeEvent); }}
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
