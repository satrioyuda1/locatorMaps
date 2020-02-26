import React, { Component } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import MapView, { UrlTile, Marker, Circle } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			latitude: null,
			longitude: null,
			markerCoords: null
		};
	}

	componentDidMount() {
		Geolocation.getCurrentPosition(
			(position) => {
				this.setState({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude
				});
			},
			(err) => alert(err.message),
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 2000 }
		);
	}

	render() {
		const { latitude, longitude, longitudeDelta, latitudeDelta } = this.state;
		return this.state.latitude ? (
			<View style={styles.container}>
				<MapView
					style={styles.map}
					initialRegion={{
						latitude: this.state.latitude,
						longitude: this.state.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					}}
					showsUserLocation
					mapType='none'
					onPress={(e) => this.setState({ markerCoords: e.nativeEvent.coordinate })}>
					<Circle
						center={{ latitude: latitude, longitude: longitude }}
						radius={1000}
						strokeWidth={1}
						strokeColor={'#1a66ff'}
						fillColor={'rgba(r,g,b,0.5)'}
						zIndex={2}
					/>
					<UrlTile
						urlTemplate={
							'https://services.arcgisonline.com/arcgis/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
						}
					/>
					{this.state.markerCoords && (
						<Marker
							draggable
							coordinate={this.state.markerCoords}
							onPress={(e) => this.setState({ markerCoords: null })}
							onDragEnd={(e) => this.setState({ markerCoords: e.nativeEvent.coordinate })}
						/>
					)}
					{this.state.markerCoords && (
						<Circle
							center={this.state.markerCoords}
							radius={1000}
							strokeWidth={1}
							strokeColor={'#1a66ff'}
							fillColor={'rgba(r,g,b,0.5)'}
							zIndex={2}
						/>
					)}
				</MapView>

				<Text style={styles.markerCoords}>
					{this.state.markerCoords ? (
						`(${this.state.markerCoords.latitude})-(${this.state.markerCoords.longitude})`
					) : (
						`(${this.state.latitude})-(${this.state.longitude})`
					)}
				</Text>
			</View>
		) : (
			<ActivityIndicator style={{ flex: 1 }} animating size='large' />
		);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0
	},
	markerCoords: {
		position: 'absolute',
		padding: 20
	}
});
