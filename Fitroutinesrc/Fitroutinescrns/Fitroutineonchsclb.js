import React, { useCallback, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Fitroutinescrllbck from '../Fitroutinecmpnts/Fitroutinescrllbck';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { chooseclub } from '../Fitroutinecnsts/Fitroutinestls';

const Fitroutineonchsclb = () => {
  const [selectedClub, setSelectedClub] = useState(null);
  const navigation = useNavigation();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const fitRoutineClubConfig = {
    RELAX: {
      title: 'Relax Club',
      image: require('../../assets/images/fitRoutineClub1.png'),
    },
    POWER: {
      title: 'Power Club',
      image: require('../../assets/images/fitRoutineClub2.png'),
    },
    FOCUS: {
      title: 'Focus Club',
      image: require('../../assets/images/fitRoutineClub3.png'),
    },
  };

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
    }, []),
  );

  const handleSelectFitClub = async selClub => {
    await AsyncStorage.setItem('fitroutine_selected_club', selClub);
    setSelectedClub(selClub);
  };

  return (
    <Fitroutinescrllbck>
      <View style={chooseclub.bg}>
        <Animated.Image
          source={require('../../assets/images/loaderLogo.png')}
          style={[
            chooseclub.logo,
            {
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
        />

        {selectedClub === null && (
          <Animated.View
            style={[
              chooseclub.card,
              {
                opacity: fade,
                transform: [{ scale: scale }],
              },
            ]}
          >
            <Text style={chooseclub.title}>Choose a club for today</Text>

            <View style={chooseclub.row}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectFitClub('RELAX')}
              >
                <View style={chooseclub.clubBox}>
                  <Image
                    source={fitRoutineClubConfig.RELAX.image}
                    style={chooseclub.clubImg}
                  />
                </View>
                <View style={chooseclub.clubBtn}>
                  <Text style={chooseclub.clubBtnText}>Relax Club</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectFitClub('POWER')}
              >
                <View style={chooseclub.clubBox}>
                  <Image
                    source={fitRoutineClubConfig.POWER.image}
                    style={chooseclub.clubImg}
                  />
                </View>
                <View style={chooseclub.clubBtn}>
                  <Text style={chooseclub.clubBtnText}>Power Club</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSelectFitClub('FOCUS')}
              style={{ marginTop: 12 }}
            >
              <View style={chooseclub.clubBox}>
                <Image
                  source={fitRoutineClubConfig.FOCUS.image}
                  style={chooseclub.clubImg}
                />
              </View>
              <View style={chooseclub.clubBtn}>
                <Text style={chooseclub.clubBtnText}>Focus Club</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {selectedClub && (
          <Animated.View
            style={[
              chooseclub.card,
              {
                opacity: fade,
                transform: [{ translateY: slide }],
              },
            ]}
          >
            <Text style={chooseclub.title}>
              {fitRoutineClubConfig[selectedClub].title}
            </Text>

            <View style={chooseclub.selectedBox}>
              <Image
                source={fitRoutineClubConfig[selectedClub].image}
                style={chooseclub.selectedImg}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('Fitroutinetsks')}
            >
              <LinearGradient
                colors={['#FFE400', '#FFBA00']}
                style={chooseclub.actionBtn}
              >
                <Text style={chooseclub.actionText}>Go to tasks</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {selectedClub && (
          <Animated.View
            style={{
              opacity: fade,
              transform: [{ scale: scale }],
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.replace('Fitroutinehm')}
            >
              <LinearGradient
                colors={['#FFE400', '#FFBA00']}
                style={chooseclub.homeBtn}
              >
                <Text style={chooseclub.homeText}>Home</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </Fitroutinescrllbck>
  );
};

export default Fitroutineonchsclb;
