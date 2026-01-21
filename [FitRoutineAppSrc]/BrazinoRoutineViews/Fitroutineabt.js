import React, { useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Share,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { about } from '../FitRoutineConstants/Fitroutinestls';

const gradientColorsActive = ['#F5C242', '#F29E2D'];

const Fitroutineabt = () => {
  const navigation = useNavigation();

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useFocusEffect(
    useCallback(() => {
      startAnimation();
    }, []),
  );

  const startAnimation = () => {
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

  const handleShareAbout = async () => {
    try {
      await Share.share({
        message: `Fit Brazino Routine is a daily assistant for an easy rhythm of the day. 
Choose one stick — Power, Focus, or Relax — and get 5 simple tasks that will help 
you recharge, concentrate, or relax. After completing, you can add a short thought 
and a photo to see your progress. Every day, Lucas gives new motivation, and a 
reminder helps you not to miss your small step. All data is stored only on your device.`,
      });
    } catch (error) {
      console.error('Error sharing about the app:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/backgroundImage.png')}
      style={{ flex: 1 }}
      blurRadius={1.5}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={about.bg}>
          <Animated.View
            style={[
              about.headerCard,
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
              <Text style={about.headerTitle}>About the app.</Text>
              <Text style={about.headerText}>
                Here you can read more about our app and share it with your
                friends!
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              about.aboutCard,
              {
                opacity: fade,
                transform: [{ translateY: slide }],
              },
            ]}
          >
            {Platform.OS === 'ios' ? (
              <Image
                source={require('../../assets/images/loaderLogo.png')}
                style={about.logo}
              />
            ) : (
              <Image
                source={require('../../assets/images/andrFitLogo.png')}
                style={about.logo}
              />
            )}

            <Text style={about.aboutText}>
              Fit Brazino Routine is a daily assistant for an easy rhythm of the
              day. Choose one stick — Power, Focus or Relax — and get 5 simple
              tasks that will help you recharge, concentrate or relax. After
              completing, you can add a short thought and a photo to see your
              progress.{'\n\n'}
              Every day, Lucas gives new motivation, and a reminder helps you
              not to miss your small step. All data is stored only on your
              device.
            </Text>

            <Animated.View
              style={{
                opacity: fade,
                transform: [{ scale: scale }],
              }}
            >
              <TouchableOpacity onPress={handleShareAbout}>
                <LinearGradient
                  colors={['#D200E5', '#2E0032']}
                  style={about.shareBtn}
                >
                  <Text style={about.shareText}>Share</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
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
                style={about.homeBtn}
              >
                <Text style={about.homeText}>Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Fitroutineabt;
