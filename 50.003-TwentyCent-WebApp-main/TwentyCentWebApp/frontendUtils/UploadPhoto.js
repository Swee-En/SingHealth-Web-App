import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker'

const FBimage = require('../checklistFiles/FBimage.json')
const nonFBimage = require('../checklistFiles/nonFBimage.json')

function UploadPhotos1() {
	const [selectImg, setSelectedImg] = useState(null)
	
	let openImage = async () => {
		let permission = await ImagePicker.requestCameraRollPermissionsAsync();


		if (permission.granted === false) {
			return;
		}

		let picker = await ImagePicker.launchImageLibraryAsync()

		if (picker.cancelled === true) {
			return;
		}
		setSelectedImg({ localUri: picker.uri })
		FBimage.image1 = picker.uri
		
	}

	return (
		<View style={styles.container}>
			{
				selectImg !== null ? (
					<Image
						style={styles.image}
						source={{ uri: (FBimage.image1 !== null) ? selectImg.localUri : null }} />
				) : null
			}
			<Button
				title="Upload Photos"
				onPress={openImage}
			/>
		</View>
	);
}

function UploadPhotos2() {
	const [selectImg, setSelectedImg] = useState(null)
	
	let openImage = async () => {
		let permission = await ImagePicker.requestCameraRollPermissionsAsync();


		if (permission.granted === false) {
			return;
		}

		let picker = await ImagePicker.launchImageLibraryAsync()

		if (picker.cancelled === true) {
			return;
		}
		setSelectedImg({ localUri: picker.uri })
		FBimage.image2 = picker.uri
		
	}

	return (
		<View style={styles.container}>
			{
				selectImg !== null ? (
					<Image
						style={styles.image}
						source={{ uri: (FBimage.image2 !== null) ? selectImg.localUri : null }} />
				) : null
			}
			<Button
				title="Upload Photos"
				onPress={openImage}
			/>
		</View>
	);
}

function UploadPhotos3() {
	const [selectImg, setSelectedImg] = useState(null)
	
	let openImage = async () => {
		let permission = await ImagePicker.requestCameraRollPermissionsAsync();


		if (permission.granted === false) {
			return;
		}

		let picker = await ImagePicker.launchImageLibraryAsync()

		if (picker.cancelled === true) {
			return;
		}
		setSelectedImg({ localUri: picker.uri })
		FBimage.image3 = picker.uri
		
	}

	return (
		<View style={styles.container}>
			{
				selectImg !== null ? (
					<Image
						style={styles.image}
						source={{ uri: (FBimage.image3 !== null) ? selectImg.localUri : null }} />
				) : null
			}
			<Button
				title="Upload Photos"
				onPress={openImage}
			/>
		</View>
	);
}

function UploadPhotos5() {
	const [selectImg, setSelectedImg] = useState(null)
	
	let openImage = async () => {
		let permission = await ImagePicker.requestCameraRollPermissionsAsync();


		if (permission.granted === false) {
			return;
		}

		let picker = await ImagePicker.launchImageLibraryAsync()

		if (picker.cancelled === true) {
			return;
		}
		setSelectedImg({ localUri: picker.uri })
		FBimage.image5 = picker.uri
		
	}

	return (
		<View style={styles.container}>
			{
				selectImg !== null ? (
					<Image
						style={styles.image}
						source={{ uri: (FBimage.image5 !== null) ? selectImg.localUri : null }} />
				) : null
			}
			<Button
				title="Upload Photos"
				onPress={openImage}
			/>
		</View>
	);
}

function UploadPhotos11() {
	const [selectImg, setSelectedImg] = useState(null)
	
	let openImage = async () => {
		let permission = await ImagePicker.requestCameraRollPermissionsAsync();


		if (permission.granted === false) {
			return;
		}

		let picker = await ImagePicker.launchImageLibraryAsync()

		if (picker.cancelled === true) {
			return;
		}
		setSelectedImg({ localUri: picker.uri })
		nonFBimage.image1 = picker.uri
		
	}

	return (
		<View style={styles.container}>
			{
				selectImg !== null ? (
					<Image
						style={styles.image}
						source={{ uri: (nonFBimage.image1 !== null) ? selectImg.localUri : null }} />
				) : null
			}
			<Button
				title="Upload Photos"
				onPress={openImage}
			/>
		</View>
	);
}

function UploadPhotos12() {
	const [selectImg, setSelectedImg] = useState(null)
	
	let openImage = async () => {
		let permission = await ImagePicker.requestCameraRollPermissionsAsync();


		if (permission.granted === false) {
			return;
		}

		let picker = await ImagePicker.launchImageLibraryAsync()

		if (picker.cancelled === true) {
			return;
		}
		setSelectedImg({ localUri: picker.uri })
		nonFBimage.image2 = picker.uri
		
	}

	return (
		<View style={styles.container}>
			{
				selectImg !== null ? (
					<Image
						style={styles.image}
						source={{ uri: (nonFBimage.image2 !== null) ? selectImg.localUri : null }} />
				) : null
			}
			<Button
				title="Upload Photos"
				onPress={openImage}
			/>
		</View>
	);
}

function UploadPhotos13() {
	const [selectImg, setSelectedImg] = useState(null)
	
	let openImage = async () => {
		let permission = await ImagePicker.requestCameraRollPermissionsAsync();


		if (permission.granted === false) {
			return;
		}

		let picker = await ImagePicker.launchImageLibraryAsync()

		if (picker.cancelled === true) {
			return;
		}
		setSelectedImg({ localUri: picker.uri })
		nonFBimage.image3 = picker.uri
		
	}

	return (
		<View style={styles.container}>
			{
				selectImg !== null ? (
					<Image
						style={styles.image}
						source={{ uri: (nonFBimage.image3 !== null) ? selectImg.localUri : null }} />
				) : null
			}
			<Button
				title="Upload Photos"
				onPress={openImage}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginVertical: 20,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},

	image: {
		width: 300,
		height: 300,
		resizeMode: 'contain'
	}
});

export { UploadPhotos1, UploadPhotos2, UploadPhotos3, UploadPhotos5, UploadPhotos11, UploadPhotos12, UploadPhotos13  }