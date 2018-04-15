import React, {Component, PureComponent} from 'react';
import {StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {StyleObject} from "../utils/utils";

interface Props {
    modalVisible: boolean,
    timeSurvived: number,
    resetGame: () => void
}

interface State {
    modalVisible: boolean,
    timeSurvived: number
}

export class GameOverModal extends Component<Props, State> {
    constructor(props: Props){
        super(props);

        this.state = {
            modalVisible: this.props.modalVisible,
            timeSurvived: 0
        };
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if(this.state.modalVisible){
            return
        } else {
            if(nextProps.modalVisible !== this.state.modalVisible){
                this.setState({
                    modalVisible: nextProps.modalVisible,
                    timeSurvived: nextProps.timeSurvived
                });
            }
        }
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        if(nextProps.modalVisible !== this.state.modalVisible) return true;
        if(nextState.modalVisible !== this.state.modalVisible) return true;
        return false;
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }



    render() {
        return (
            <Modal
                // animationIn="slideInUp"
                // animationIn="zoomInDown"
                // animationIn="swing"
                animationIn="shake"
                isVisible={this.state.modalVisible}
                onModalHide={() => {
                    // console.log("ON MODAL HIDE");
                    this.props.resetGame();
                }}
                onModalShow={() => {}}
                // supportedOrientations={['portrait', 'landscape']}
                >
                <View style={styles.modalContent}>
                    <View>
                        <Text
                            style={{
                                fontSize: 32
                            }}
                        >
                            Game over!
                        </Text>
                        <Text
                            style={{
                                textAlign: "center"
                            }}
                        >
                            {`You lasted ${(this.state.timeSurvived / 1000).toFixed(1)} seconds.`}
                        </Text>
                        <Text
                            style={{
                                textAlign: "center"
                            }}
                        >{`Last record: `}</Text>

                        <TouchableOpacity
                            onPress={() => {
                                this.setModalVisible(false);
                            }}
                        >
                            <View style={styles.button}>
                                <Text>Play again</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles: StyleObject = StyleSheet.create<StyleObject>({
    button: {
        backgroundColor: "lightblue",
        padding: 12,
        margin: 16,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    },
    modalContent: {
        position: "relative",
        backgroundColor: "white",
        padding: 22,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
        borderColor: "rgba(0, 0, 0, 0.1)"
    }
});
