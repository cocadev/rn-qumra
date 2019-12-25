import React from 'react'
import { Dimensions } from 'react-native'
import { Scene, Router, Drawer, Stack } from 'react-native-router-flux'
import SignIn from '../screens/Auth/signIn'
import SignUp from '../screens/Auth/signUp'
import Profile from '../screens/Profile/UserProfile'
import PgSignIn from '../screens/Auth/pgSignIn';
import PgSignUp from '../screens/Auth/pgSignUp';
import SideMenu from '../components/sideMenu';
import ForgetPassword from '../screens/Auth/forgetPassword';
import RequestPhotographer from '../screens/Other/requestPhotographer';
import Orders from '../screens/Other/orders';
import Test from '../screens/test';
import PrivacyPolicy from '../screens/Auth/privacyPolicy';
import PgPrivacyPolicy from '../screens/Auth/pgPrivacyPolicy';
import PhotographerProfile from '../screens/Profile/PhotographerProfile';
import PhotographerResume from '../screens/Profile/PhotographerResume';
import Chat from '../screens/Other/chat';
import Phonenumber from '../screens/Auth/phonenumber';
import UnAuthMap from '../screens/Map/UnAuthMap';
import UserMap from '../screens/Map/UserMap';
import PhotographerMap from '../screens/Map/PhotographerMap';
import Messages from '../screens/Other/Messages';
import orderPhotographer from '../screens/Photographer/orderPhotographer'
import orderUser from '../screens/User/orderUser'
import Photo from '../screens/photo'
import MyMap from '../screens/Map/MyMap';
import ShoppingCart from '../screens/Other/ShoppingCart'
import Fav from '../screens/Other/Fav'

const width = Dimensions.get('window').width
const MAIN = [
  { key: 'test', component: Test },
  { key: 'photographerresume', component: PhotographerResume },
  { key: 'requestPhotographer', component: RequestPhotographer },
  { key: 'orders', component: Orders },
  { key: 'chat', component: Chat },
  { key: 'phone', component: Phonenumber },
  { key: 'test', component: Test },
  { key: 'photo', component: Photo },
  { key: 'mymap', component: MyMap },

]

export const AuthPage = props => {
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
          <Scene key="maps" component={UnAuthMap} initial={false} hideNavBar />
        </Drawer>

        <Scene key="signup" component={SignUp} initial={false} hideNavBar />
        <Scene key="signin" component={SignIn} initial={false} hideNavBar />
        <Scene key="forgotPassword" component={ForgetPassword} initial={false} hideNavBar />
        <Scene key="pgsignin" component={PgSignIn} initial={false} hideNavBar />
        <Scene key="pgsignup" component={PgSignUp} initial={false} hideNavBar />
        <Scene key="privacypolicy" component={PrivacyPolicy} initial={false} hideNavBar />
        <Scene key="pgprivacypolicy" component={PgPrivacyPolicy} initial={false} hideNavBar />
        <Scene key="pgselect" component={PgPrivacyPolicy} initial={false} />
      </Stack>
    </Router>)
}

export const UserPage = props => {
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
          <Scene key="maps" component={UserMap} initial={false} hideNavBar />
          <Scene key="profile" component={Profile} initial={false} hideNavBar />
          <Scene key="messages" component={Messages} initial={false} hideNavBar />
          <Scene key="orders" component={Orders} initial={false} hideNavBar />
          <Scene key="cart" component={ShoppingCart} initial={false} hideNavBar />
          <Scene key="fav" component={Fav} initial={false} hideNavBar />

        </Drawer>

        <Scene key="chat" component={Chat} initial={false} hideNavBar />
        <Scene key="orderDetail" component={orderUser} initial={false} hideNavBar />

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

export const PhotographerPage = props => {
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
          <Scene key="maps" component={PhotographerMap} initial={false} hideNavBar />
          <Scene key="photographerprofile" component={PhotographerProfile} initial={false} hideNavBar />
          <Scene key="messages" component={Messages} initial={false} hideNavBar />
          <Scene key="orders" component={Orders} initial={false} hideNavBar />

        </Drawer>
        {MAIN.map(a => (
          <Scene
            key={a.key}
            component={a.component}
            initial={a.key == 'orders' ? false : false}
            hideNavBar
          />))}
        <Scene key="chat" component={Chat} initial={false} hideNavBar />
        <Scene key="orderDetail" component={orderPhotographer} initial={false} hideNavBar />

      </Stack>
    </Router>)
}