import { StyleSheet, Dimensions } from 'react-native'
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';

var { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
  btn: {
    fontSize: p(17),
    width: p(130),
    height: p(30),
    backgroundColor: '#ff5a5f',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: p(6)
  },
  btnText: {
    fontSize: p(17),
    fontFamily: 'CarinoSans-Bold',
    color: '#fff'
  },
  raduis: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)', // rgba(255,90,95,0.1)
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // on the style sheet
  calloutView: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    width: "80%",
    marginTop: "10%",
    marginLeft: "15%"

  },
  calloutSearch: {
    borderColor: "transparent",
    marginLeft: 10,
    width: "90%",
    marginRight: 10,
    height: 40,
    borderWidth: p(1)
  },
  marker: {
    height: 20,
    width: 20,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 20 / 2,
    overflow: 'hidden',
    backgroundColor: 'black'  //'#ff5a5f'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: p(2)
  },
  mapcontainer: {
    width: width,
    height: height,
  },
  listView: {
    bottom: 0,
    paddingTop: p(7),
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width,
    height: p(100),
    backgroundColor: COLORS.white,
    elevation: 6,
    borderRadius: p(16),
  },
  round: {
    width: p(32),
    height: p(32),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: p(16),
    backgroundColor: COLORS.light_color,
    borderColor: COLORS.sky_color,
    borderWidth: p(2)
  },
  markerB: {
    width: p(28),
    height: p(28),
    borderRadius: p(13)
  },
  markerA: {
    width: p(28),
    height: p(28),
    borderRadius: p(14.5),
    borderWidth: 2,
    borderColor: 'green',
    zIndex: -10
  },
  goView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: p(-26),
    width: p(28),
    height: p(28),
    alignSelf: 'flex-end',
    backgroundColor: COLORS.white,
    // borderWidth: 2,
    // borderColor: '#fff',
    borderRadius: p(20),
    zIndex: 12,
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: p(12),
    padding: p(12),
    borderWidth: 0.5,
    borderColor: '#d2d2d2',
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2
  },
  dashboardText1: {
    fontSize: p(12),
    fontFamily: 'CarinoSans'
  },
  dashboardText2: {
    fontSize: p(10),
    textAlign: 'center',
    fontFamily: 'CarinoSans'
  },
  card: {
    marginVertical: p(3),
    paddingHorizontal: p(5),
    paddingBottom: p(1),
    borderColor: 'grey',
    borderWidth: 0.5,
    borderRadius: 3
  },
  earning: {
    backgroundColor: '#39B652',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },

  searchView: {
    position: 'absolute',
    top: 100,
    left: 0,
    flex: 1,
    width: width,
  },
  search: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    height: 50,
  },
  searchMenu: {
    backgroundColor: 'white',
    height: 40,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  searchMenuText: {
    color: 'grey'
  },
  bottomBorder: {
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 0.5,
  },
  rateText: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center'
  },
  price: {
    width: p(30),
    height: p(30),
    borderRadius: p(15.5),
    marginTop: p(-20),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    backgroundColor: COLORS.red_color
  },
  iconBtn: {
    elevation: 5,
    width: p(36),
    height: p(36),
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
})