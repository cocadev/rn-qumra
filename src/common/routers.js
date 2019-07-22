import React from 'react'
import { Dimensions } from 'react-native'
import { Scene, Router, Drawer, Stack } from 'react-native-router-flux'
import Intro from '../screens/Intro'
import SignIn from '../screens/Auth/signIn'
import SignUp from '../screens/Auth/signUp'
import Profile from '../screens/Profile/UserProfile'

import SideMenu from '../components/sideMenu';
import ForgetPassword from '../screens/Auth/forgetPassword';
import RequestPhotographer from '../screens/Other/requestPhotographer';
import Orders from '../screens/Other/orders';
import Maps from '../screens/Map/Maps';

const width = Dimensions.get('window').width
const MAIN = [
  // { key: 'test', component: Test },

  { key: 'maps', component: Maps },

  { key: 'intro', component: Intro },
  { key: 'signup', component: SignUp },
  { key: 'signin', component: SignIn },
  { key: 'forgotPassword', component: ForgetPassword },
  { key: 'profile', component: Profile },
  { key: 'requestPhotographer', component: RequestPhotographer },
  { key: 'orders', component: Orders },

]
  
export const MainPage = props => {
  return (
    <Router>
      <Stack key='root'>
        <Drawer
          hideNavBar
          key="drawerMenu"
          contentComponent={SideMenu}
          drawerWidth={width / 1.4}
          drawerPosition="left"
        >
          <Scene 
            key="maps" 
            component={Maps} 
            initial={true} 
            hideNavBar 
          />
        </Drawer>
        {MAIN.map(a => (
          <Scene
            key={a.key}
            component={a.component}
            initial={a.key == 'orders' ? false : false}
            hideNavBar
          />))}
      </Stack>
    </Router>)
}