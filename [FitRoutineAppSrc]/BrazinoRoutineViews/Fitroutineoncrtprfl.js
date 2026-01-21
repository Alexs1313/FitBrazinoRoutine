import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity as FitRoutinTouchable,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fitroutinescrllbck from '../RoutineComponents/Fitroutinescrllbck';
import { useNavigation } from '@react-navigation/native';
import { profile } from '../FitRoutineConstants/Fitroutinestls';

const Fitroutineoncrtprfl = () => {
  const [fitRoutineSlide, setFitRoutineSlide] = useState(1);
  const [fitRoutinePhoto, setFitRoutinePhoto] = useState(null);
  const [fitRoutineUserName, setFitRoutineUserName] = useState('');
  const [fitRoutineMotivation, setFitRoutineMotivation] = useState('');
  const navigation = useNavigation();
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
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 350,
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

  useEffect(() => {
    fetchFitRoutineSavedProfileData();
    strtAnmt();
  }, []);

  useEffect(() => {
    strtAnmt();
  }, [fitRoutineSlide]);

  const fetchFitRoutineSavedProfileData = async () => {
    try {
      const savedUserProfile = await AsyncStorage.getItem(
        'fitroutineSavedProfile',
      );

      if (savedUserProfile) {
        const profileParsed = JSON.parse(savedUserProfile);

        setFitRoutineUserName(profileParsed.fitRoutineUserName || '');
        setFitRoutineMotivation(profileParsed.fitRoutineMotivation || '');
        setFitRoutinePhoto(profileParsed.fitRoutinePhoto || null);
      }
    } catch (error) {
      console.error('Error fetching Fit Routine saved profile data:', error);
    }
  };

  const handlePickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, response => {
      if (response && !response.didCancel && response.assets?.length > 0) {
        setFitRoutinePhoto(response.assets[0].uri);
      } else if (response.didCancel) {
        console.log('User canceled the image picker.');
      } else {
        console.log('No image was selected.');
      }
    });
  };

  const addUserProfile = async () => {
    try {
      const newProfileData = {
        fitRoutineUserName,
        fitRoutineMotivation,
        fitRoutinePhoto,
        createdAt: Date.now(),
      };

      await AsyncStorage.setItem(
        'fitroutineSavedProfile',
        JSON.stringify(newProfileData),
      );
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const infoIsCompleted =
    fitRoutineUserName.trim() && fitRoutineMotivation.trim();
  const photoIsCompleted = !!fitRoutinePhoto;

  return (
    <Fitroutinescrllbck>
      <View style={profile.bg}>
        <Animated.View
          style={[
            profile.topIconWrapper,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <Image source={require('../../assets/images/profileImg.png')} />
        </Animated.View>

        <Animated.View
          style={[
            profile.card,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
        >
          <Text style={profile.title}>Create a profile</Text>

          {fitRoutineSlide === 2 && (
            <Text
              style={{
                color: '#FFFFFFB0',
                marginBottom: 10,
                fontFamily: 'Rufina-Bold',
                fontSize: 16,
              }}
            >
              Add photo
            </Text>
          )}

          {fitRoutineSlide === 1 && (
            <>
              <View style={profile.inputWrapper}>
                <TextInput
                  placeholder="Your name"
                  placeholderTextColor="#FFFFFFB0"
                  value={fitRoutineUserName}
                  onChangeText={setFitRoutineUserName}
                  style={profile.input}
                  maxLength={14}
                />
              </View>

              <View style={[profile.inputWrapper, profile.textAreaWrapper]}>
                <TextInput
                  placeholder="What motivates you?"
                  placeholderTextColor="#FFFFFFB0"
                  value={fitRoutineMotivation}
                  onChangeText={setFitRoutineMotivation}
                  style={[profile.input, profile.textArea]}
                  multiline
                  maxLength={50}
                />
              </View>
            </>
          )}

          {fitRoutineSlide === 2 && (
            <FitRoutinTouchable
              activeOpacity={0.8}
              style={profile.photoBox}
              onPress={handlePickImage}
            >
              {fitRoutinePhoto ? (
                <View>
                  <Image
                    source={{ uri: fitRoutinePhoto }}
                    style={profile.photo}
                  />
                  <Image
                    source={require('../../assets/images/addPhotoImg.png')}
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      alignSelf: 'center',
                    }}
                  />
                </View>
              ) : (
                <View style={profile.photoPlaceholder}>
                  <Image
                    source={require('../../assets/images/addPhotoImg.png')}
                  />
                </View>
              )}
            </FitRoutinTouchable>
          )}
        </Animated.View>

        {fitRoutineSlide === 1 && infoIsCompleted && (
          <Animated.View style={{ transform: [{ scale }] }}>
            <FitRoutinTouchable
              activeOpacity={0.8}
              onPress={() => setFitRoutineSlide(2)}
            >
              <LinearGradient
                colors={['#FFE400', '#FFBA00']}
                style={profile.button}
              >
                <Text style={profile.buttonText}>Next</Text>
              </LinearGradient>
            </FitRoutinTouchable>
          </Animated.View>
        )}

        {fitRoutineSlide === 2 && (
          <Animated.View style={{ transform: [{ scale }] }}>
            <FitRoutinTouchable
              disabled={!photoIsCompleted}
              activeOpacity={0.8}
              onPress={async () => {
                await addUserProfile();
                navigation.replace('Fitroutineonchsclb');
              }}
            >
              <LinearGradient
                colors={['#FFE400', '#FFBA00']}
                style={profile.button}
              >
                <Text style={profile.buttonText}>Start</Text>
              </LinearGradient>
            </FitRoutinTouchable>
          </Animated.View>
        )}
      </View>
    </Fitroutinescrllbck>
  );
};

export default Fitroutineoncrtprfl;
