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
import Fitroutinescrllbck from '../Fitroutinecmpnts/Fitroutinescrllbck';
import { editprofile, settings } from '../Fitroutinecnsts/Fitroutinestls';
import { useFocusEffect } from '@react-navigation/native';

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
      getPrfl();
    }, []),
  );

  const getPrfl = async () => {
    const svdPrfl = await AsyncStorage.getItem('fitroutineSavedProfile');
    if (svdPrfl) {
      const svdPrflDt = JSON.parse(svdPrfl);
      setName(svdPrflDt.fitRoutineUserName || '');
      setMotivation(svdPrflDt.fitRoutineMotivation || '');
      setPhoto(svdPrflDt.fitRoutinePhoto || null);
    }
  };

  const hndlPckPht = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, image => {
      if (!image.didCancel && image.assets?.length) {
        setPhoto(image.assets[0].uri);
      }
    });
  };

  const addPrfl = async () => {
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
  };

  const dltPrfl = async () => {
    await AsyncStorage.removeItem('fitroutineSavedProfile');
    setName('');
    setMotivation('');
    setPhoto(null);
    navigation.navigate('Fitroutineonbrd');
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

          <TouchableOpacity style={editprofile.photoBox} onPress={hndlPckPht}>
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

          <TouchableOpacity onPress={addPrfl}>
            <LinearGradient
              colors={['#FFE400', '#FFBA00']}
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
            onPress={dltPrfl}
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
              colors={['#FFE400', '#FFBA00']}
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
