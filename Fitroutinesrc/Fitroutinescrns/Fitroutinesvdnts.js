import React, { useCallback, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { savednotes } from '../Fitroutinecnsts/Fitroutinestls';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BlurView } from '@react-native-community/blur';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ImageBackground,
  Share,
  Platform,
  Animated,
} from 'react-native';
import { useStorage } from '../Fitroutinestrg/fitroutinecntxt';
import Toast from 'react-native-toast-message';

const Fitroutinesvdnts = () => {
  const [notes, setNotes] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigation = useNavigation();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const { isOnNotification } = useStorage();

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
      getSvdNts();
    }, []),
  );

  const getSvdNts = async () => {
    const svdNts = await AsyncStorage.getItem('fitroutine_completed_tasks');
    const prsdNts = svdNts ? JSON.parse(svdNts) : [];
    setNotes(prsdNts);
  };

  const cnfrmDlt = selIdx => {
    setDeleteIndex(selIdx);
  };

  const dltNt = async () => {
    const updNt = notes.filter((_, idx) => idx !== deleteIndex);
    setNotes(updNt);
    setDeleteIndex(null);

    if (isOnNotification) {
      Toast.show({ text1: 'Your note has been successfully deleted!' });
    }

    await AsyncStorage.setItem(
      'fitroutine_completed_tasks',
      JSON.stringify(updNt),
    );
  };

  const handleShrtsk = item => {
    Share.share({
      message: `Here's my note: ${item.feeling} on ${item.date}`,
    });
  };

  return (
    <ImageBackground
      source={require('../../assets/images/backgroundImage.png')}
      style={{ flex: 1 }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View style={savednotes.bg}>
          <Animated.View
            style={[
              savednotes.headerCard,
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
              <Text style={savednotes.headerTitle}>Notes</Text>
              <Text style={savednotes.headerText}>
                This is where your notes and photos that you leave as a keepsake
                after completing tasks will be stored.
              </Text>
            </View>
          </Animated.View>

          {notes.length === 0 && (
            <Animated.Text style={[savednotes.emptyText, { opacity: fade }]}>
              You don't have any saved notes yet.
            </Animated.Text>
          )}

          <View
            style={{ width: '100%', alignItems: 'center', paddingBottom: 20 }}
          >
            {notes.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  savednotes.noteCard,
                  {
                    opacity: fade,
                    transform: [{ scale: scale }],
                  },
                ]}
              >
                {item.photo && (
                  <Image
                    source={{ uri: item.photo }}
                    style={savednotes.noteImage}
                  />
                )}

                <View style={{ flex: 1 }}>
                  <Text style={savednotes.noteDate}>{item.date}</Text>
                  <Text style={savednotes.noteText}>{item.feeling}</Text>
                </View>

                <View style={savednotes.row}>
                  <TouchableOpacity
                    onPress={() => cnfrmDlt(index)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#E50000', '#360000']}
                      style={savednotes.shareBtn}
                    >
                      <Text style={savednotes.doneText}>Delete</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleShrtsk(item)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#D200E5', '#2E0032']}
                      style={savednotes.shareBtn}
                    >
                      <Text style={savednotes.doneText}>Share</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>

          <Modal
            transparent
            visible={deleteIndex !== null}
            animationType="fade"
          >
            {Platform.OS === 'ios' && (
              <BlurView
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                }}
                blurType="dark"
                blurAmount={1}
              />
            )}

            <View style={savednotes.modalBg}>
              <View>
                <View style={[savednotes.modalCard]}>
                  <Image
                    source={require('../../assets/images/fitRoutineMotivationMan.png')}
                  />
                  <View>
                    <Text style={savednotes.modalTitle}>Delete note?</Text>
                    <Text style={savednotes.modalText}>
                      If you delete it, you can't get it back.
                    </Text>
                  </View>
                </View>
                <View style={[savednotes.row, { width: '70%' }]}>
                  <TouchableOpacity onPress={dltNt} activeOpacity={0.7}>
                    <LinearGradient
                      colors={['#E50000', '#360000']}
                      style={savednotes.shareBtn}
                    >
                      <Text style={savednotes.doneText}>Delete</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setDeleteIndex(null)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={['#D200E5', '#2E0032']}
                      style={savednotes.shareBtn}
                    >
                      <Text style={savednotes.doneText}>Cancel</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>

      <Animated.View
        style={{
          alignItems: 'center',
          bottom: 40,
          position: 'absolute',
          width: '100%',
          opacity: fade,
          transform: [{ scale: scale }],
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={['#FFE400', '#FFBA00']}
            style={savednotes.homeBtn}
          >
            <Text style={savednotes.homeText}>Home</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <LinearGradient
        colors={['#00200000', '#002000']}
        style={{
          height: 130,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          pointerEvents: 'none',
        }}
      />
    </ImageBackground>
  );
};

export default Fitroutinesvdnts;
