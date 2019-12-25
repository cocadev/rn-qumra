import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { p } from '../../common/normalize';
import { COLORS } from '../../common/colors';
import { Actions } from 'react-native-router-flux';
import { Loading } from '../../components/atoms';
import Icon from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating';
import { images } from '../../common/images';

const width = Dimensions.get('window').width

export default class PhotographerResume extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fullname: '',
      summary: '',
      filePath: '',
      rate: "0",
      isOn: false,
      location: {
        latitude: null,
        longitude: null
      },
      gender: true,
      photos: "0",
      reviews: "0",
      backImg: null,
      isWaiting: false,
      profilePics: []
    }
  };

  render() {

    const { isWaiting } = this.state
    const { photographer } = this.props

    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#EEE8E7' }}>

        {isWaiting && <Loading />}

        <View style={{ backgroundColor: COLORS.dark_color }}>
          <Image source={images.bg_photographer} style={{ width: width, height: p(220) }} />
        </View>

        <TouchableOpacity
          style={{ position: 'absolute', top: p(5), left: p(12) }}
          onPress={() => Actions.pop()}
        >
          <Icon name="ios-arrow-round-back" color={COLORS.white} size={p(36)} />
        </TouchableOpacity>

        <View
          style={{
            borderBottomColor: '#d8d8d8',
            borderBottomWidth: p(2),
            paddingVertical: p(10),
          }}>

          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: p(-160) }}>
            <Text style={[styles.headText, { textAlign: 'center'}]}>{photographer.fullName}</Text>
            <Text style={[styles.headText, { fontSize: p(18)}]}>Photographer</Text>

            <Image
              style={styles.avatar}
              source={(photographer.avatar == '' || photographer.avatar == null) ? require('../../../assets/image/manplace.jpg') : {
                uri: photographer.avatar,
              }} />
          </View>

          <View style={{ width: p(100), alignSelf: 'center' }}>
            <StarRating
              disabled={true}
              emptyStar={'ios-star-outline'}
              fullStar={'ios-star'}
              halfStar={'ios-star-half'}
              iconSet={'Ionicons'}
              maxStars={5}
              starStyle={{ paddingHorizontal: 1, marginHorizontal: 1, marginLeft: p(-1) }}
              starSize={p(25)}
              rating={0}
              fullStarColor={'#fcb040'}
            />

          </View>

          <View style={styles.item}>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.titleText}>0</Text>
              <Text style={[styles.titleText, { color: '#b5b5b5' }]}>{'Places'}</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.titleText}>{photographer.photos ? photographer.photos : 0}</Text>
              <Text style={[styles.titleText, { color: '#b5b5b5' }]}>{'Photos'}</Text>
            </View>

            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.titleText}>{photographer.reviews ? photographer.reviews : 0}</Text>
              <Text style={[styles.titleText, { color: '#b5b5b5' }]}>{'Reviews'}</Text>
            </View>

          </View>

          <View style={styles.body}>

            <View style={{ alignSelf: 'center', marginTop: p(12) }}>
              <Text style={[styles.titleText, { textAlign: 'center' }]}>40 feet away!</Text>
              <TouchableOpacity 
                style={styles.btnUpload} 
                onPress={()=>Actions.requestPhotographer({ photographer: photographer})}
              >
                <Text style={{ color: '#fff', fontSize: p(13), fontFamily: 'CarinoSans-Bold' }}>Request photographer</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal>
                {
                 photographer.myProfilePics && photographer.myProfilePics.map((item, index) =>
                  <Image key={index} source={{ uri: item }} style={styles.imgProfile}/>
                  )
                }
              </ScrollView>

          </View>
        </View>

        <View style={{ padding: p(12), flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={(photographer.avatar == '' || photographer.avatar == null) ? require('../../../assets/image/manplace.jpg') : {
              uri: photographer.avatar,
            }}
            style={styles.small_avatar} 
          />
          <Text style={styles.titleText}>{photographer.fullName}</Text>
        </View>

        <Text style={{ fontSize: p(13), color: '#635D61', marginHorizontal: p(12), marginBottom: p(16), fontFamily: 'CarinoSans'}}>
          {photographer.summary}
        </Text>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  avatar: {
    width: p(150),
    height: p(150),
    borderRadius: p(76),
    borderWidth: p(7),
    borderColor: "#fff",
    marginBottom: p(10),
    marginTop: p(10)
  },

  body: {
    marginTop: p(5),
  },

  bodyContent: {
    flex: 1,
    padding: p(16),
  },

  buttonContainer: {
    alignSelf: 'center',
    marginTop: p(10),
    height: p(27),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p(20),
    width: p(150),
    borderRadius: p(10),
    backgroundColor: COLORS.red_color,
  },

  btnUpload: {
    alignSelf: 'center',
    height: p(20),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: p(2),
    marginTop: p(5),
    paddingHorizontal: p(20),
    paddingVertical: p(15),
    backgroundColor: COLORS.light_color,
  },

  UploadPictureContainer: {
    marginTop: p(10),
    height: p(45),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: p(20),
    width: p(150),
    borderRadius: p(15),
    backgroundColor: "#00BFFF",
  },

  item: {
    flexDirection: 'row',
  },

  textinput: {
    width: p(130),
    fontSize: p(11),
    borderColor: '#333',
    borderWidth: p(1.2)
  },
  textarea: {
    fontSize: p(11),
    borderRadius: p(3),
    height: p(40),
    borderColor: '#333',
    borderWidth: p(1.2)
  },
  titleText: {
    color: '#333',
    fontSize: p(14), 
    fontFamily: 'CarinoSans'
  },
  small_avatar: {
    width: p(60),
    height: p(60),
    marginRight: p(15),
    borderRadius: p(30)
  },
  headText: {
    fontSize: p(35),
    color: '#fff', 
    fontFamily: 'CarinoSans-Bold'
  },
  imgProfile: {
    marginTop: p(12),
    width: p(70),
    height: p(70),
    borderRadius: p(5),
    marginHorizontal: p(8),
    resizeMode: 'cover'
  }
});
