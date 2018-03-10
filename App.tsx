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
            <TouchableWithoutFeedback
                onPress={
                    (evt: GestureResponderEvent) => {

                        console.log("onPress()");
                        console.log(evt.nativeEvent);
                    }
                }
            >
                <View
                    style={styles.container}
                >
                    <Box size={200} colour={"red"} initialLeft={90} initialTop={75}/>
                    <Box size={50} colour={"blue"} initialLeft={50} initialTop={100}/>
                </View>
            </TouchableWithoutFeedback>
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
