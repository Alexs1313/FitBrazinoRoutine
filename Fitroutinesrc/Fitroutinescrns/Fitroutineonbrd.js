import { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onboard } from '../Fitroutinecnsts/Fitroutinestls';

const Fitroutineonbrd = () => {
  const [currSlideNum, setCurrSlideNum] = useState(0);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);
  const navigation = useNavigation();
  const [isProfileExists, setIsProfileExists] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    scaleAnim.setValue(0.95);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        delay: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currSlideNum]);

  const fitRoutineonbrddta = [
    {
      img: require('../../assets/images/onboard1.png'),
      title: 'Hello!',
      subtitle:
        'I’m Lucas! Add a name, photo, and a short motivation — this will help me guide you every day.',
    },
    {
      img: require('../../assets/images/onboard2.png'),
      title: 'Choose a club of the day.',
      subtitle: `Every day you choose one club: Power, Focus, or Relax.
After choosing, I’ll give you 5 useful tasks for today.`,
    },
    {
      img: require('../../assets/images/onboard3.png'),
      title: 'Complete and record',
      subtitle: `Completed the task — write down your thoughts and add a photo. 
Turn on the reminder so you don’t 
miss your day.
Every day I’ll give you a new phrase and tips.`,
    },
    {
      img: require('../../assets/images/onboard4.png'),
      title: 'Privacy Policy',
      subtitle: `Fit Brazino Routine does not collect or share your data with third parties.
All photos, notes, and profile information are stored only on your device.
The app does not use analytics, advertising, or online services. You can delete all data in the settings at any time.`,
    },
  ];

  useEffect(() => {
    checkIsExistsProfile();
  }, []);

  const checkIsExistsProfile = async () => {
    const strdPrflDta = await AsyncStorage.getItem('fitroutineSavedProfile');

    if (strdPrflDta) {
      setIsProfileExists(true);
    }
  };

  const onboardidx = fitRoutineonbrddta[currSlideNum];

  return (
    <ImageBackground
      source={require('../../assets/images/backgroundImageOnb.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={onboard.wrapper}>
          {currSlideNum < 2 && (
            <TouchableOpacity
              style={{ position: 'absolute', top: 70, right: 20, zIndex: 10 }}
              onPress={() =>
                isProfileExists
                  ? navigation.replace('Fitroutineonchsclb')
                  : navigation.replace('Fitroutineoncrtprfl')
              }
            >
              <Text style={onboard.skipBtnText}>SKIP</Text>
            </TouchableOpacity>
          )}
          <View>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              <Image
                source={onboardidx.img}
                style={[
                  currSlideNum === 2 && { marginBottom: 60 },
                  currSlideNum === 3 && { marginBottom: 20 },
                ]}
              />
            </Animated.View>

            {currSlideNum === 1 && (
              <View style={{ position: 'absolute', left: -30, top: -30 }}>
                <Image
                  source={require('../../assets/images/stickone.png')}
                  style={{ position: 'absolute', left: -40, top: 40 }}
                />
                <Image
                  source={require('../../assets/images/sticktwo.png')}
                  style={{ position: 'absolute', left: 0, top: 5 }}
                />
                <Image
                  source={require('../../assets/images/stickthree.png')}
                  style={{ position: 'absolute', left: 30, top: -25 }}
                />
              </View>
            )}
          </View>

          <View style={onboard.welcomecontainer}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Text style={onboard.welctitle}>{onboardidx.title}</Text>
              <Text style={onboard.welcsubtitle}>{onboardidx.subtitle}</Text>
            </Animated.View>

            {currSlideNum === 3 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  gap: 8,
                }}
              >
                <TouchableOpacity
                  onPress={() => setIsPrivacyChecked(!isPrivacyChecked)}
                  activeOpacity={0.4}
                  style={onboard.checkBox}
                >
                  {isPrivacyChecked && (
                    <Image
                      source={require('../../assets/images/checkedBox.png')}
                    />
                  )}
                </TouchableOpacity>
                <Text style={onboard.agreeText}>I agree</Text>
              </View>
            )}
          </View>

          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }}
          >
            {currSlideNum < 3 ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCurrSlideNum(currSlideNum + 1)}
                style={onboard.nextbutton}
              >
                <Image source={require('../../assets/images/nextButton.png')} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={!isPrivacyChecked}
                onPress={() => {
                  if (!isPrivacyChecked) return;
                  isProfileExists
                    ? navigation.replace('Fitroutineonchsclb')
                    : navigation.replace('Fitroutineoncrtprfl');
                }}
              >
                <LinearGradient
                  colors={
                    isPrivacyChecked
                      ? ['#FFE400', '#FFBA00']
                      : ['#7E7E7E', '#7E7E7E']
                  }
                  style={onboard.nextgradientbutton}
                >
                  <Text style={onboard.nextgradientbuttontext}>Start</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default Fitroutineonbrd;
