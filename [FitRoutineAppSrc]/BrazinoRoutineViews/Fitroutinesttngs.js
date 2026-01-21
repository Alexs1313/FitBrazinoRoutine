import React, { useCallback, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Fitroutinescrllbck from '../RoutineComponents/Fitroutinescrllbck';
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { useStorage } from '../FitStorage/fitroutinecntxt';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { settings } from '../FitRoutineConstants/Fitroutinestls';

const gradientColorsActive = ['#F5C242', '#F29E2D'];

const Fitroutinesttngs = () => {
  const [profile, setProfile] = useState(null);
  const { isOnNotification, setIsOnNotification } = useStorage();
  const [hasProgress, setHasProgress] = useState(false);
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
      getProfile();
      checkProgress();
      strtAnmt();
    }, []),
  );

  const checkProgress = async () => {
    try {
      const savedClub = await AsyncStorage.getItem('fitroutine_selected_club');
      const savedNotes = await AsyncStorage.getItem(
        'fitroutine_completed_tasks',
      );

      const hasClub = Boolean(savedClub);

      const hasNotes = savedNotes && JSON.parse(savedNotes).length > 0;

      setHasProgress(hasClub || hasNotes);
    } catch (error) {
      console.error('Error checking progress:', error);
    }
  };

  const toggleNotification = async selectedValue => {
    Toast.show({
      text1: selectedValue
        ? 'Notifications turned on!'
        : 'Notifications turned off!',
    });

    try {
      await AsyncStorage.setItem(
        'notifications',
        JSON.stringify(selectedValue),
      );

      setIsOnNotification(selectedValue);
    } catch (error) {
      console.error('Error toggling notifications:', error);
    }
  };

  const getProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('fitroutineSavedProfile');

      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const resetProgress = () => {
    Alert.alert(
      'Reset progress?',
      'All your progress, notes, and tasks will be deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['fitroutine_completed_tasks']);

              setHasProgress(false);
            } catch (error) {
              console.error('Error resetting progress:', error);
            }
          },
        },
      ],
    );
  };

  return (
    <Fitroutinescrllbck>
      <View style={settings.bg}>
        <Animated.View
          style={[
            settings.introCard,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/fitRoutineMotivationMan.png')}
          />
          <View style={{ flex: 1 }}>
            <Text style={settings.introTitle}>This is a setting.</Text>
            <Text style={settings.introText}>
              Here you can configure the application to make it comfortable for
              you!
            </Text>
          </View>
        </Animated.View>

        {profile && (
          <Animated.View
            style={{
              width: '100%',
              alignItems: 'center',
              opacity: fade,
              transform: [{ scale: scale }],
            }}
          >
            <View style={settings.profileCard}>
              <Text style={settings.profileTitle}>Your profile</Text>

              <View style={settings.photoBox}>
                <Image
                  source={{ uri: profile.fitRoutinePhoto }}
                  style={settings.photo}
                />
                <Image
                  source={require('../../assets/images/addPhotoImg.png')}
                  style={settings.photoIcon}
                />
              </View>

              <View style={settings.profileField}>
                <Text style={settings.profileText}>
                  {profile.fitRoutineUserName}
                </Text>
              </View>

              <View style={[settings.profileField, { minHeight: 92 }]}>
                <Text style={settings.profileText}>
                  {profile.fitRoutineMotivation}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Fitroutinechgprf')}
            >
              <LinearGradient
                colors={gradientColorsActive}
                style={settings.changeBtn}
              >
                <Text style={settings.changeText}>Change profile</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View
          style={[
            settings.section,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        >
          <Text style={settings.sectionText}>Notification</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleNotification(!isOnNotification)}
            style={[
              settings.switchBg,
              isOnNotification && {
                backgroundColor: '#00A000',
                alignItems: 'flex-end',
              },
            ]}
          >
            <View
              style={{
                width: 13,
                height: 13,
                backgroundColor: '#FFFFFF',
                borderRadius: 100,
                bottom: isOnNotification ? 0 : 0.5,
              }}
            />
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
            onPress={resetProgress}
            style={{ width: '90%' }}
            disabled={!hasProgress}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={
                hasProgress ? ['#E50000', '#360000'] : ['#7E7E7E', '#7E7E7E']
              }
              style={[
                settings.resetBtn,
                !hasProgress && { borderColor: '#7E7E7E' },
              ]}
            >
              <Text style={settings.resetText}>Reset progress</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{
            opacity: fade,
            transform: [{ scale: scale }],
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={gradientColorsActive}
              style={settings.homeBtn}
            >
              <Text style={settings.homeText}>Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Fitroutinescrllbck>
  );
};

export default Fitroutinesttngs;
