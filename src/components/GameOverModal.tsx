import React, {Component, PureComponent} from 'react';
import {StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {StyleObject} from "../utils/utils";

interface Props {
    // deviceHeight: number,
    modalVisible: boolean,
    timeSurvived: number
}

interface State {
    modalVisible: boolean,
    modalCommitted: boolean,
    timeSurvived: number
}

export class GameOverModal extends Component<Props, State> {
    constructor(props: Props){
        super(props);

        this.state = {
            modalVisible: this.props.modalVisible,
            modalCommitted: false,
            timeSurvived: 0
        };
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if(this.state.modalCommitted && this.state.modalVisible){
            // if(nextProps.)
            // console.log("MODAL COMMITTED");
            return
        } else {
            if(
                nextProps.modalVisible !== this.state.modalVisible ||
                // nextProps.timeSurvived !== this.state.timeSurvived ||
                this.state.modalCommitted === false
               ){
                console.log("MODAL NOT COMMITTED");
                this.setState({
                    modalVisible: nextProps.modalVisible,
                    timeSurvived: nextProps.timeSurvived,
                    modalCommitted: true
                });
            }
        }
    }

    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        // if(this.state.modalCommitted && this.props.timeSurvived > this.state.timeSurvived) return false;
        // if(this.props.timeSurvived > this.state.timeSurvived) return false;
        // return true;
        if(nextProps.modalVisible !== this.state.modalVisible){
            // console.log("SHOULD UPDATE");
            return true;
        }
        // if(this.state.modalVisible) return true;
        if(this.state.modalCommitted) return false;
        return false;
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    render() {
        // console.log(`this.state.modalVisible:`, this.state.modalVisible);
        console.log(`this.props.timeSurvived:`, this.props.timeSurvived);

        return (
            <Modal
                animationIn="slideInUp"
                isVisible={this.props.modalVisible}
                onModalHide={() => {}}
                onModalShow={() => {}}
                // supportedOrientations={['portrait', 'landscape']}
                >
                <View style={styles.modalContent}>
                    <View>
                        <Text style={{
                            fontSize: 32
                        }}>Game over!</Text>
                        <Text style={{
                            // fontSize: 32
                        }}>{`You lasted ${(this.state.timeSurvived / 1000).toFixed(0)} seconds`}</Text>

                        <TouchableOpacity
                            onPress={() => {
                            this.setModalVisible(false);
                        }}>
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
