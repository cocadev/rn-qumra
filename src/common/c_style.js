import { StyleSheet, Platform } from 'react-native';
import { p } from './normalize';

export default CustomStyle = StyleSheet.create({
    wrapper: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: 'transparent',
    },
    container: {
        flex: 1,
        paddingLeft: p(20),
        paddingRight: p(20),
    },
    header: {
        fontSize: p(40),
        marginBottom: p(60),
        color: 'white',
        justifyContent: 'center',
        alignSelf:'center',
        // fontFamily: 'lucida grande'
    },
    textInput:{
        alignSelf: 'stretch',
        padding: p(10),
        fontSize: p(17),
        marginBottom: p(10),
        backgroundColor: 'rgba(255,255,255,0.1)', 
        height: p(40),
        borderRadius: p(10),
        textDecorationColor:'white',
        color: '#2d3e50'
    },
    btn: {
        alignSelf: 'stretch',
        backgroundColor: 'white', //'#6897bb', //'rgba(255,160,255,.1)'
        padding: p(10),
        alignItems: 'center',
        height: p(40),
        borderRadius: p(10),
       
    },
    SignUp: {
        borderColor: '#f5565b',
        borderWidth:1,
        height: p(40),
        alignSelf: 'stretch',
        backgroundColor: 'rgba(255,255,255,0.001)',
        padding: p(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        
        

    }
   
});