import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fitroutinescrllbck from '../RoutineComponents/Fitroutinescrllbck';
import LinearGradient from 'react-native-linear-gradient';
import { home } from '../FitRoutineConstants/Fitroutinestls';
import { useFocusEffect } from '@react-navigation/native';
import { useStorage } from '../FitStorage/fitroutinecntxt';

const fitrtnoneday = 24 * 60 * 60 * 1000;
const fitrtnmotivationkey = 'fitroutine_daily_motivation';
const fitrtnmotivationtimekey = 'fitroutine_daily_motivation_time';
const gradientColorsActive = ['#F5C242', '#F29E2D'];

const Fitroutinehm = ({ navigation }) => {
  const [fitRtnPrfl, setFitRtnPrfl] = useState(null);
  const [dailyMotivation, setDailyMotivation] = useState('');
  const [fitRtnTmLft, setFitRtnTmLft] = useState('');
  const timerRef = useRef(null);
  const { setIsOnNotification } = useStorage();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const strtAnmtn = () => {
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

  useEffect(() => {
    getFitRoutineProfile();
    getFitDailyMotivationPhrase();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      getFitRoutineProfile();
      getSettings();
      strtAnmtn();
    }, []),
  );

  const getSettings = async () => {
    try {
      const savedNotificationValue = await AsyncStorage.getItem(
        'notifications',
      );

      if (savedNotificationValue !== null) {
        setIsOnNotification(JSON.parse(savedNotificationValue));
      }
    } catch (error) {
      console.error('Error retrieving settings:', error);
    }
  };
  const getFitRoutineProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('fitroutineSavedProfile');

      if (savedProfile) {
        setFitRtnPrfl(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error retrieving the Fit Routine profile:', error);
    }
  };

  const phrss = [
    'You can do more than you think.',
    'A small step is a step.',
    'Today is your day. Take advantage of it.',
    'Don’t wait for the perfect moment — act.',
    'Stability is more important than speed.',
    'Breathe. Move. Keep going.',
    'You’re closer to your goal than you think.',
    'Try — and you’ll see the result.',
    'The main thing is to start.',
    'Listen to yourself. You know what to do.',
    'Every day is a new chance.',
    'It won’t be easy, but it will get better.',
    'You’re already doing enough.',
    'Don’t stop at small things.',
    'It all starts with one move.',
    'Be kind to yourself. But be consistent.',
    'Do what you can today.',
    'Resilience is your superpower.',
    'Just a little more and you’ll surprise yourself.',
    'The hardest part is taking the first step.',
    'Don’t rush. The main thing is to keep moving.',
    'Be proud of even small victories.',
    'You’re on the right track.',
    'Give yourself a chance.',
    'Do something for yourself today.',
    'Strength is not in pace, but in repetition.',
    'You’re already better than you were yesterday.',
    'Your body and mind will say “thank you” to you.',
    'Don’t think about everything. Think about the next step.',
    'I’m with you. Let’s go.',
  ];

  const getFitDailyMotivationPhrase = async () => {
    try {
      const savedPhrase = await AsyncStorage.getItem(fitrtnmotivationkey);
      const savedTime = await AsyncStorage.getItem(fitrtnmotivationtimekey);
      const now = Date.now();

      if (savedPhrase && savedTime && now - Number(savedTime) < fitrtnoneday) {
        setDailyMotivation(savedPhrase);
        updateFitRoutineTimer(Number(savedTime));
        return;
      }

      const newPhrase = phrss[Math.floor(Math.random() * phrss.length)];

      await AsyncStorage.setItem(fitrtnmotivationkey, newPhrase);
      await AsyncStorage.setItem(fitrtnmotivationtimekey, now.toString());

      setDailyMotivation(newPhrase);
      updateFitRoutineTimer(now);
    } catch (error) {
      console.error('Error fetching daily motivation phrase:', error);
    }
  };

  const updateFitRoutineTimer = start => {
    const tick = () => {
      const timeDiff = fitrtnoneday - (Date.now() - start);

      if (timeDiff <= 0) {
        getFitDailyMotivationPhrase();
        return;
      }

      setFitRtnTmLft(`${Math.floor(timeDiff / (1000 * 60 * 60))}h`);
    };

    tick();

    timerRef.current = setInterval(tick, 60000);
  };

  return (
    <Fitroutinescrllbck>
      <View style={home.bg}>
        {fitRtnPrfl && (
          <Animated.View
            style={[
              home.profileCard,
              {
                opacity: fade,
                transform: [{ translateY: slide }],
              },
            ]}
          >
            <Image
              source={{ uri: fitRtnPrfl.fitRoutinePhoto }}
              style={home.avatar}
            />
            <View>
              <Text style={home.welcome}>
                Welcome, {fitRtnPrfl.fitRoutineUserName}!
              </Text>
              <Text style={home.subTitle}>Your motivation:</Text>
              <Text style={home.motivationText}>
                {fitRtnPrfl.fitRoutineMotivation}
              </Text>
            </View>
          </Animated.View>
        )}

        <Animated.View
          style={{
            opacity: fade,
            transform: [{ scale: scale }],
          }}
        >
          {[
            { title: 'My tasks', screen: 'Fitroutinetsks' },
            { title: 'My notes', screen: 'Fitroutinesvdnts' },
            { title: 'Settings', screen: 'Fitroutinesttngs' },
            { title: 'About', screen: 'Fitroutineabt' },
          ].map(btn => (
            <TouchableOpacity
              key={btn.title}
              onPress={() => navigation.navigate(btn.screen)}
            >
              <LinearGradient
                colors={gradientColorsActive}
                style={home.mainBtn}
              >
                <Text style={home.mainBtnText}>{btn.title}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View
          style={[
            home.dailyCard,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/fitRoutineMotivationMan.png')}
            style={home.dailyImg}
          />

          <View style={{ flex: 1 }}>
            <Text style={home.dailyTitle}>Motivation for you:</Text>
            <Text style={home.dailyText}>{dailyMotivation}</Text>
          </View>

          {fitRtnTmLft && (
            <View style={home.timer}>
              <Image
                source={require('../../assets/images/fitRoutineTimer.png')}
              />
              <Text style={home.timerText}>{fitRtnTmLft}</Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Fitroutinescrllbck>
  );
};

export default Fitroutinehm;
