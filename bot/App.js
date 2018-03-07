/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    ScrollView,
    View,
    Dimensions,
    FlatList,
    Alert,
} from 'react-native';

let width = Dimensions.get('window').width; //full width
let height = Dimensions.get('window').height; //full height

class App extends Component {

    constructor() {
        super();
        this.state = {
            response: "",
            nbMsg: 0,
            conversation: []
        }
    }


    _appendHumanAnswer = () => {
        this.setState({nbMsg: this.state.nbMsg++});
        var conversationPush = this.state.conversation.slice();
        conversationPush.push({key: this.state.nbMsg, msg: this.state.response, from: "Human"});
        this.setState({
            conversation: conversationPush,
            response: ""
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                </View>
                <ScrollView>
                    <View style={styles.viewTextBotAnswer}>
                        <Text style={styles.textAnswer}>hello</Text>
                    </View>
                    <View>
                        <FlatList
                            data={this.state.conversation}
                            renderItem={({item}) =>
                                <View style={styles.viewTextHumanAnswer}>
                                    <Text style={styles.textAnswer}>{item.msg}</Text>
                                </View>
                            }
                        />
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <TextInput style={styles.inputAnswer} underlineColorAndroid='transparent' placeholder='Envoyer un message'
                               onChangeText={(response) => this.setState({response})} value={this.state.response}/>
                    <TouchableOpacity onPress={() => this._appendHumanAnswer()}>
                        <View style={styles.buttonAnswer}>
                            <Text style={styles.textButtonAnswer}>Envoyer</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        height: height/12,
        backgroundColor: '#F2F2F2',
    },
    footer: {
        height: height/12,
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
    },
    inputAnswer: {
        flex: 1,
        width: width-(width/5),
        fontSize: 20,
        marginLeft: 10,
    },
    buttonAnswer: {
        flex: 1,
        backgroundColor: '#F5D0A9',
        width: width/5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textButtonAnswer: {
        fontSize: 20,
        color: '#FFFFFF'
    },
    textAnswer: {
        fontSize: 18,
        color: '#FFFFFF'
    },
    viewTextBotAnswer: {
        backgroundColor: "#F7BE81",
        borderRadius: 5,
        margin: width/20,
        marginRight: width/5,
        padding: width/20,
    },
    viewTextHumanAnswer: {
        backgroundColor: "#BDBDBD",
        borderRadius: 5,
        margin: width/20,
        marginLeft: width/5,
        padding: width/20,
    },
});

export default App