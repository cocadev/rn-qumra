import React, { Component } from 'react';
import { Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, AsyncStorage, Image, ScrollView, Keyboard } from 'react-native';
import CustomStyle from '../../common/c_style';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { p } from '../../common/normalize';
import { images } from '../../common/images';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import * as ATOM from '../../components/atoms';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../../store/auth/actions";
import * as auth_actions from "../../store/common/actions";
import _ from 'underscore'
import firebaseAPI from '../../common/firebaseAPI';
import firebase from 'firebase';
import { showMessage } from "react-native-flash-message";

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'bruce@a.io', //invoker@x.io
            password: '123123',
            isWaiting: false
        }
    }

    componentDidMount() {
        this._loadInitialState().done();
        this.props.auth_actions.loadUsers()

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

                {isWaiting && <ATOM.Loading />}

                <View style={CustomStyle.wrapper}>

                    <TouchableOpacity style={{ margin: p(12) }} onPress={() => Actions.pop()}>
                        <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
                    </TouchableOpacity>

                    <ScrollView>
                        <KeyboardAvoidingView behavior='padding' style={{ flex: 1, padding: p(12) }}>

                            <View style={{ padding: p(1), alignItems: 'center', marginBottom: p(10) }}>
                                <Image source={images.logo_full} style={{ width: p(200), height: p(60), marginTop: p(2), marginBottom: p(40) }} />
                                <Text style={{ color: '#fff', fontSize: p(14), marginBottom: p(6), textAlign: 'center', fontFamily: 'CarinoSans-Bold' }}>Sign in to continue</Text>
                            </View>
                          
                            <View style={{ height: 15 }}></View>
                            <TextInput
                                style={CustomStyle.textInput}
                                placeholder='Email'
                                placeholderTextColor={COLORS.light_color}
                                onChangeText={(email) => this.setState({ email })}
                                underlineColorAndroid='transparent'
                                value={this.state.email}

                            />

                            <TextInput
                                style={CustomStyle.textInput}
                                placeholder='Password'
                                placeholderTextColor={COLORS.light_color}
                                secureTextEntry={true}
                                onChangeText={(password) => this.setState({ password })}
                                underlineColorAndroid='transparent'
                                value={this.state.password}

                            />

                            <TouchableOpacity onPress={this.login}>
                                <View style={CustomStyle.btn}>
                                    <Text style={{ color: '#2d3e50', fontSize: p(17), fontFamily: 'CarinoSans-Bold' }}> Log in</Text>
                                </View>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, }}>
                                <TouchableOpacity onPress={() => Actions.signup()}>
                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: p(13), fontFamily: 'CarinoSans-SemiBold' }}>Create an account  </Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => Actions.forgotPassword()}>
                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: p(13), fontFamily: 'CarinoSans-SemiBold' }}>Forgot password?</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                onPress={() => Actions.pgsignin()}
                                style={{ marginTop: p(20) }}>
                                <View style={CustomStyle.SignUp}>
                                    <Text style={{ color: 'white', fontSize: p(17), fontFamily: 'CarinoSans-Bold' }}> Sign In as a Photographer </Text>
                                </View>
                            </TouchableOpacity>
                        </KeyboardAvoidingView>
                    </ScrollView>

                </View>

            </LinearGradient>
        );
    }

    login = () => {
        Keyboard.dismiss();

        this.setState({ isWaiting: true })
        const { email, password } = this.state
        firebaseAPI.usersCheck(email)
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
        users: state.common.users,
    }),
    dispatch => ({
        actions: bindActionCreators(actions, dispatch),
        auth_actions: bindActionCreators(auth_actions, dispatch)
    })
)(Login);