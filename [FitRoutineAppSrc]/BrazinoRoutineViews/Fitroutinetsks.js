import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Share,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import Fitroutinescrllbck from '../RoutineComponents/Fitroutinescrllbck';
import { useStorage } from '../FitStorage/fitroutinecntxt';
import Toast from 'react-native-toast-message';
import { task } from '../FitRoutineConstants/Fitroutinestls';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

const gradientColorsActive = ['#F5C242', '#F29E2D'];

const Fitroutinetsks = () => {
  const [club, setClub] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [fitChckd, setFitChckd] = useState([]);
  const [fitStp, setFitStp] = useState('intro');
  const [feeling, setFeeling] = useState('');
  const [photo, setPhoto] = useState(null);
  const { isOnNotification } = useStorage();
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
      strtAnmt();
    }, []),
  );

  const fitRtnClbTsks = {
    POWER: [
      'Do 15 sit-ups.',
      'Walk 800 steps.',
      'Stretch for 20 seconds.',
      'Raise your arms above your head 15 times.',
      'Do a light neck warm-up.',
    ],
    RELAX: [
      'Take 3 deep breaths.',
      'Stretch your neck for 10 seconds.',
      'Do 1 minute of slow breathing.',
      'Smile to yourself.',
      'Sit down and relax your shoulders.',
    ],
    FOCUS: [
      'Stand on one leg for 5 seconds.',
      'Inhale for 3, exhale for 3.',
      'Look at one point for 5 seconds.',
      'Slowly count from 1 to 10.',
      'Focus on your breath for 10 seconds.',
    ],
  };

  const fitRtnClbCfg = {
    POWER: {
      title: 'Power Club',
      image: require('../../assets/images/fitRoutineClub2.png'),
    },
    RELAX: {
      title: 'Relax Club',
      image: require('../../assets/images/fitRoutineClub1.png'),
    },
    FOCUS: {
      title: 'Focus Club',
      image: require('../../assets/images/fitRoutineClub3.png'),
    },
  };

  useEffect(() => {
    getFitClubTasks();
  }, []);

  const getFitClubTasks = async () => {
    const savedClub = await AsyncStorage.getItem('fitroutine_selected_club');
    if (!savedClub) return;

    const clubTasks = fitRtnClbTsks[savedClub] || [];

    const savedResults = await AsyncStorage.getItem(
      'fitroutine_completed_tasks',
    );
    const parsedResults = savedResults ? JSON.parse(savedResults) : [];

    const formattedDate = formatFitDate(Date.now());
    const todayResults = parsedResults.find(
      res => res.club === savedClub && res.date === formattedDate,
    );

    setClub(savedClub);
    setTasks(clubTasks);

    if (todayResults?.completedTasks) {
      setFitChckd(
        buildCheckedFromCompleted(clubTasks, todayResults.completedTasks),
      );
      setFitStp('tasks');
    } else {
      setFitChckd(Array(clubTasks.length).fill(false));
    }
  };

  const toggleTask = async taskIndex => {
    try {
      const updatedCheckedTasks = [...fitChckd];
      updatedCheckedTasks[taskIndex] = !updatedCheckedTasks[taskIndex];
      setFitChckd(updatedCheckedTasks);

      const completedTasks = tasks.filter((_, i) => updatedCheckedTasks[i]);
      const formattedDate = formatFitDate(Date.now());

      const savedCompletedTasks = await AsyncStorage.getItem(
        'fitroutine_completed_tasks',
      );
      const parsedTasks = savedCompletedTasks
        ? JSON.parse(savedCompletedTasks)
        : [];

      const existingIndex = parsedTasks.findIndex(
        item => item.club === club && item.date === formattedDate,
      );

      if (existingIndex !== -1) {
        parsedTasks[existingIndex].completedTasks = completedTasks;
      } else {
        parsedTasks.unshift({
          club,
          completedTasks,
          date: formattedDate,
          timestamp: Date.now(),
        });
      }

      await AsyncStorage.setItem(
        'fitroutine_completed_tasks',
        JSON.stringify(parsedTasks),
      );
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const formatFitDate = date => {
    const currentDate = new Date(date);
    return `${String(currentDate.getDate()).padStart(2, '0')}/${String(
      currentDate.getMonth() + 1,
    ).padStart(2, '0')}/${currentDate.getFullYear()}`;
  };

  const buildCheckedFromCompleted = (selTasks, completedTasks) =>
    selTasks.map(t => completedTasks.includes(t));

  const getCompletedTasks = () => tasks.filter((_, index) => fitChckd[index]);

  const addFitResults = async () => {
    try {
      const completedTasks = getCompletedTasks();
      const fitToday = formatFitDate(Date.now());

      if (isOnNotification) {
        Toast.show({ text1: 'Your results have been successfully saved!' });
      }

      const savedResults = await AsyncStorage.getItem(
        'fitroutine_completed_tasks',
      );
      const parsedResults = savedResults ? JSON.parse(savedResults) : [];

      const existingIndex = parsedResults.findIndex(
        item => item.club === club && item.date === fitToday,
      );

      if (existingIndex !== -1) {
        parsedResults[existingIndex] = {
          ...parsedResults[existingIndex],
          feeling,
          photo,
          timestamp: Date.now(),
        };
      } else {
        parsedResults.unshift({
          club,
          completedTasks,
          feeling,
          photo,
          date: fitToday,
          timestamp: Date.now(),
        });
      }

      await AsyncStorage.setItem(
        'fitroutine_completed_tasks',
        JSON.stringify(parsedResults),
      );

      navigation.replace('Fitroutinehm');
    } catch (error) {
      console.error('Error saving Fit results:', error);
    }
  };

  const getFitPhoto = () => {
    try {
      launchImageLibrary(
        { mediaType: 'photo', quality: 0.9 },
        selectedImage => {
          if (!selectedImage.didCancel && selectedImage.assets?.length > 0) {
            setPhoto(selectedImage.assets[0].uri);
          } else if (selectedImage.didCancel) {
            console.log('Image selection was canceled by the user.');
          } else {
            console.log('No valid image was selected.');
          }
        },
      );
    } catch (error) {
      console.error('Error opening image library:', error);
    }
  };

  const handleShareTask = () => {
    try {
      const clubTitle = fitRtnClbCfg[club]?.title;

      if (!clubTitle) {
        console.error('Club title is missing or invalid.');
        return;
      }

      Share.share({
        message: `I just completed all my tasks in the ${clubTitle}!`,
      });
    } catch (error) {
      console.error('Error sharing task:', error);
    }
  };

  const fitTsksDn = fitChckd.length > 0 && fitChckd.every(Boolean);

  if (!club) return null;

  return (
    <Fitroutinescrllbck>
      <View style={task.bg}>
        {fitStp === 'intro' && (
          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: fade,
              transform: [{ translateY: slide }],
            }}
          >
            <View style={task.introCard}>
              <Image
                source={require('../../assets/images/fitRoutineTasksMan.png')}
              />
              <View style={{ flex: 1 }}>
                <Text style={task.introTitle}>What to do?</Text>
                <Text style={task.introText}>
                  You have {tasks.length} tasks in total today.
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => setFitStp('tasks')}>
              <LinearGradient
                colors={gradientColorsActive}
                style={task.startBtn}
              >
                <Text style={task.startText}>Start</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}

        {fitStp !== 'intro' && (
          <Animated.View style={{ opacity: fade }}>
            <Text style={task.clubTitle}>{fitRtnClbCfg[club].title}</Text>
            <View style={task.clubImageBox}>
              <Image source={fitRtnClbCfg[club].image} style={task.clubImage} />
            </View>
          </Animated.View>
        )}

        {fitStp === 'tasks' && (
          <>
            <Animated.View style={[task.card, { opacity: fade }]}>
              <Text style={task.cardTitle}>Your tasks for today:</Text>
              <ScrollView showsVerticalScrollIndicator={false}>
                {tasks.map((t, i) => (
                  <TouchableOpacity
                    key={i}
                    style={task.taskRow}
                    onPress={() => toggleTask(i)}
                  >
                    <View style={[task.checkbox, fitChckd[i] && task.checked]}>
                      {fitChckd[i] && (
                        <Image
                          source={require('../../assets/images/checkedBox.png')}
                        />
                      )}
                    </View>
                    <Text style={task.taskText}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>

            {fitTsksDn && (
              <Animated.View style={{ transform: [{ scale: scale }] }}>
                <TouchableOpacity onPress={() => setFitStp('done')}>
                  <LinearGradient
                    colors={['#00E500', '#002C00']}
                    style={task.doneBtn}
                  >
                    <Text style={task.doneText}>Done!</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        )}

        {fitStp === 'done' && (
          <Animated.View
            style={[
              task.doneCard,
              { opacity: fade, transform: [{ scale: scale }] },
            ]}
          >
            <Text style={task.doneTitle}>
              Well done!{'\n'}You completed all the tasks!
            </Text>

            <View style={task.inputWrapper}>
              <TextInput
                placeholder="Describe your feelings"
                placeholderTextColor="#FFFFFF80"
                value={feeling}
                onChangeText={setFeeling}
                style={task.input}
                multiline
              />
            </View>

            <TouchableOpacity style={task.photoBox} onPress={getFitPhoto}>
              {photo ? (
                <Image source={{ uri: photo }} style={task.photo} />
              ) : (
                <Image
                  source={require('../../assets/images/addPhotoImg.png')}
                  style={{ bottom: 12 }}
                />
              )}
            </TouchableOpacity>

            {photo && feeling && (
              <View style={task.row}>
                <TouchableOpacity onPress={addFitResults}>
                  <LinearGradient
                    colors={['#00E500', '#002C00']}
                    style={task.shareBtn}
                  >
                    <Text style={task.doneText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShareTask}>
                  <LinearGradient
                    colors={['#D200E5', '#2E0032']}
                    style={task.shareBtn}
                  >
                    <Text style={task.doneText}>Share</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}

        <Animated.View style={{ opacity: fade }}>
          <TouchableOpacity onPress={() => navigation.navigate('Fitroutinehm')}>
            <LinearGradient colors={gradientColorsActive} style={task.homeBtn}>
              <Text style={task.homeText}>Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Fitroutinescrllbck>
  );
};

export default Fitroutinetsks;
