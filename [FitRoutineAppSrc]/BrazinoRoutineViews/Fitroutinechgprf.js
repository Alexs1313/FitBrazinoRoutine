import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import Fitroutinescrllbck from '../RoutineComponents/Fitroutinescrllbck';
import { editprofile, settings } from '../FitRoutineConstants/Fitroutinestls';
import { useFocusEffect } from '@react-navigation/native';

const gradientColorsActive = ['#F5C242', '#F29E2D'];

const Fitroutinechgprf = ({ navigation }) => {
  const [name, setName] = useState('');
  const [motivation, setMotivation] = useState('');
  const [photo, setPhoto] = useState(null);
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const strtAnmt = () => {
    fade.setValue(0);
    slide.setValue(30);
    scale.setValue(0.95);

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useFocusEffect(
    useCallback(() => {
      strtAnmt();
      getProfile();
    }, []),
  );

  const getProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('fitroutineSavedProfile');

      if (savedProfile) {
        //parse
        const profileData = JSON.parse(savedProfile);

        setName(profileData.fitRoutineUserName || '');
        setMotivation(profileData.fitRoutineMotivation || '');
        setPhoto(profileData.fitRoutinePhoto || null);
      }
    } catch (error) {
      console.error('Error retrieving profile:', error);
    }
  };

  const handlePickPhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, response => {
      if (response && !response.didCancel && response.assets?.length > 0) {
        setPhoto(response.assets[0].uri);
      } else if (response.didCancel) {
        console.log('User canceled the photo picker.');
      } else {
        console.log('No photo was selected.');
      }
    });
  };

  const addProfile = async () => {
    try {
      const updatedProfile = {
        fitRoutineUserName: name,
        fitRoutineMotivation: motivation,
        fitRoutinePhoto: photo,
        updatedAt: Date.now(),
      };

      await AsyncStorage.setItem(
        'fitroutineSavedProfile',
        JSON.stringify(updatedProfile),
      );

      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const deleteProfile = async () => {
    try {
      await AsyncStorage.removeItem('fitroutineSavedProfile');

      setName('');
      setMotivation('');
      setPhoto(null);

      navigation.navigate('Fitroutineonbrd');
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
    <Fitroutinescrllbck>
      <View style={editprofile.bg}>
        <Animated.View
          style={[
            editprofile.card,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        >
          <Text style={editprofile.title}>Your profile</Text>

          <TouchableOpacity
            style={editprofile.photoBox}
            onPress={handlePickPhoto}
          >
            {photo && (
              <Image source={{ uri: photo }} style={editprofile.photo} />
            )}
            <Image
              source={require('../../assets/images/addPhotoImg.png')}
              style={editprofile.photoIcon}
            />
          </TouchableOpacity>

          <View style={editprofile.inputWrapper}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#FFFFFF80"
              style={editprofile.input}
            />
          </View>

          <View style={[editprofile.inputWrapper, editprofile.textAreaWrapper]}>
            <TextInput
              value={motivation}
              onChangeText={setMotivation}
              placeholder="Your motivation"
              placeholderTextColor="#FFFFFF80"
              style={[editprofile.input, editprofile.textArea]}
              multiline
            />
          </View>
        </Animated.View>

        <Animated.View
          style={[
            editprofile.row,
            {
              alignSelf: 'center',
              top: -45,
              gap: 40,
              opacity: fade,
              transform: [{ scale: scale }],
            },
          ]}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LinearGradient
              colors={['#00E500', '#002C00']}
              style={editprofile.changeBtn}
            >
              <Text style={editprofile.changeText}>Cancel</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={addProfile}>
            <LinearGradient
              colors={gradientColorsActive}
              style={editprofile.changeBtn}
            >
              <Text style={[editprofile.changeText, { color: '#002000' }]}>
                Change
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fade,
            transform: [{ scale: scale }],
            width: '100%',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={deleteProfile}
            style={{ width: '90%' }}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#E50000', '#360000']}
              style={[settings.resetBtn]}
            >
              <Text style={settings.resetText}>Delete profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fade,
            transform: [{ scale: scale }],
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <LinearGradient
              colors={gradientColorsActive}
              style={editprofile.homeBtn}
            >
              <Text style={editprofile.homeText}>Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Fitroutinescrllbck>
  );
};

export default Fitroutinechgprf;
