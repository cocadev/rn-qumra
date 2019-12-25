/*This is an Example of Grid View in React Native*/
import React, { Component } from 'react';
//import rect in our project
import {
	StyleSheet,
	View,
	FlatList,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
//import all the components we will need
import { p } from '../common/normalize';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			dataSource: {},
		};
	}
	componentDidMount() {
		var that = this;
		let items = Array.apply(null, Array(60)).map((v, i) => {
			return { id: i, src: 'https://unsplash.it/400/400?image=' + (i + 1) };
		});
		that.setState({
			dataSource: items,
		});
	}
	render() {
		return (
			<View style={styles.MainContainer}>
				<View style={{ margin: 12 }}>
					<FlatList
						data={this.state.dataSource}
						renderItem={({ item }) => (
							<View style={{ flex: 1, flexDirection: 'column', margin: 12 }}>
								<Image style={styles.imageThumbnail} source={{ uri: item.src }} />
								<View style={styles.border}>
									<Text style={{ fontSize: p(10), color: '#8593a8'}}>Product Name</Text>
									<Text style={{ fontSize: p(10), color: '#8593a8'}}>200 $</Text>

								</View>
							</View>
						)}
						numColumns={2}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	MainContainer: {
		justifyContent: 'center',
		flex: 1,
		paddingTop: 30,
		backgroundColor: '#f0f0f0'
	},
	imageThumbnail: {
		justifyContent: 'center',
		alignItems: 'center',
		height: p(100),
	},
	border: {
		backgroundColor: '#fff',
		borderWidth:1,
		borderColor: '#eaedf4',
		padding: 8
	}
});