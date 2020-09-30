import React, { Component } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Keyboard, Image, ActivityIndicator } from 'react-native';
import CustomStyle from '../../common/c_style';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import firebaseAPI from '../../common/firebaseAPI';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { LinearGradient } from 'expo-linear-gradient';
import * as ATOM from '../../components/atoms';
import * as actions from "../../store/auth/actions";
import * as auth_actions from "../../store/common/actions";
import _ from 'underscore'

class Login extends Component {

    constructor() {
        super();
        this.state = {
            email: 'max@x.io',
            password: '123123',
            isWaiting: false
        }
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    _loadInitialState = async () => {
        var value = await AsyncStorage.getItem('user');
        if (value !== null) {
            this.props.navigation.navigate('Map');
        }
    }

    render() {
        const { isWaiting } = this.state
        return (
            <LinearGradient colors={['#020407', '#2d3e50']} style={{ flex: 1 }}>

               { isWaiting && <ATOM.Loading />} 

                <View style={CustomStyle.wrapper}>
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, padding: p(12) }}>

                        <TouchableOpacity onPress={() => Actions.pop()}>
                            <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
                        </TouchableOpacity>

                        <View style={{ padding: p(1), alignItems: 'center', marginBottom: p(10) }}>
                            <Image source={images.logo_white} style={{ width: p(200), height: p(50), marginTop: p(20), marginBottom: p(40) }} />
                            <Text style={{ color: '#fff', fontSize: p(14), marginBottom: p(6), textAlign: 'center', fontFamily: 'CarinoSans-Bold' }}>Welcome to Photographer Portal</Text>
                        </View>

                        <TextInput
                            style={CustomStyle.textInput}
                            placeholder='Email'
                            placeholderTextColor={COLORS.white}
                            onChangeText={(email) => this.setState({ email })}
                            underlineColorAndroid='transparent'
                            value={this.state.email}
                        />

                        <TextInput
                            style={CustomStyle.textInput}
                            placeholder='Password'
                            placeholderTextColor={COLORS.white}
                            secureTextEntry={true}
                            onChangeText={(password) => this.setState({ password })}
                            underlineColorAndroid='transparent'
                            value={this.state.password}
                        />

                        <TouchableOpacity onPress={this.login}>
                            <View style={CustomStyle.btn}>
                                <Text style={{ color: '#2d3e50', fontSize: p(17), fontFamily: 'CarinoSans-Bold' }}>Log In</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                            <TouchableOpacity onPress={() => Actions.pgsignup()}>
                                <Text style={{ alignSelf: 'center', color: 'white', fontSize: p(13), fontFamily: 'CarinoSans-SemiBold' }}>Create an account  </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => Actions.forgotPassword()}>
                                <Text style={{ alignSelf: 'center', color: 'white', fontSize: p(13), fontFamily: 'CarinoSans-SemiBold' }}>Forgot password?</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </LinearGradient>

        );
    }

    login = () => {
        Keyboard.dismiss();

        this.setState({ isWaiting: true })
        const { email, password } = this.state
        firebaseAPI.pgCheck(email)
        .then((res)=>{ 
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => { this.setState({ isWaiting: false }) })
            .catch(() => { 
                this.setState({ isWaiting: false })
                showMessage({
                    message: "Fail",
                    description: "Password is wrong",
                    type: "danger",
                    icon: "danger"
                  });
             })
        })
        .catch(e => { this.setState({ isWaiting: false }) })      
    }
}

export default connect(
    state => ({
        reduxUser: state.auth.reduxUser,
        photographers: state.common.photographers,
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        auth_actions: bindActionCreators(auth_actions, dispatch)
    })
)(Login);
