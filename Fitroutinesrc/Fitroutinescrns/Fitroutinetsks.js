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
import Fitroutinescrllbck from '../Fitroutinecmpnts/Fitroutinescrllbck';
import { useStorage } from '../Fitroutinestrg/fitroutinecntxt';
import Toast from 'react-native-toast-message';
import { task } from '../Fitroutinecnsts/Fitroutinestls';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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
    getFitClbTsks();
  }, []);

  const getFitClbTsks = async () => {
    const svdClb = await AsyncStorage.getItem('fitroutine_selected_club');
    if (!svdClb) return;

    const clbTsks = fitRtnClbTsks[svdClb] || [];

    const svdRs = await AsyncStorage.getItem('fitroutine_completed_tasks');
    const prsd = svdRs ? JSON.parse(svdRs) : [];

    const fitTd = fitFormDt(Date.now());
    const tdRs = prsd.find(res => res.club === svdClb && res.date === fitTd);

    setClub(svdClb);
    setTasks(clbTsks);

    if (tdRs?.completedTasks) {
      setFitChckd(buildCheckedFromCompleted(clbTsks, tdRs.completedTasks));
      setFitStp('tasks');
    } else {
      setFitChckd(Array(clbTsks.length).fill(false));
    }
  };

  const tgglTsk = async fitIdx => {
    const fitCp = [...fitChckd];
    fitCp[fitIdx] = !fitCp[fitIdx];
    setFitChckd(fitCp);

    const cmpltTsks = tasks.filter((_, i) => fitCp[i]);
    const fitTd = fitFormDt(Date.now());

    const svdCmplTsks = await AsyncStorage.getItem(
      'fitroutine_completed_tasks',
    );
    const prsd = svdCmplTsks ? JSON.parse(svdCmplTsks) : [];

    const exsIdx = prsd.findIndex(
      idx => idx.club === club && idx.date === fitTd,
    );

    if (exsIdx !== -1) {
      prsd[exsIdx].completedTasks = cmpltTsks;
    } else {
      prsd.unshift({
        club,
        completedTasks: cmpltTsks,
        date: fitTd,
        timestamp: Date.now(),
      });
    }

    await AsyncStorage.setItem(
      'fitroutine_completed_tasks',
      JSON.stringify(prsd),
    );
  };

  const fitFormDt = date => {
    const dtnw = new Date(date);
    return `${String(dtnw.getDate()).padStart(2, '0')}/${String(
      dtnw.getMonth() + 1,
    ).padStart(2, '0')}/${dtnw.getFullYear()}`;
  };

  const buildCheckedFromCompleted = (selTasks, completedTasks) =>
    selTasks.map(t => completedTasks.includes(t));

  const getCompletedTasks = () => tasks.filter((_, index) => fitChckd[index]);

  const addFitrslts = async () => {
    const cmpltTsks = getCompletedTasks();
    const fitTd = fitFormDt(Date.now());

    if (isOnNotification) {
      Toast.show({ text1: 'Your results have been successfully saved!' });
    }

    const svd = await AsyncStorage.getItem('fitroutine_completed_tasks');
    const prsd = svd ? JSON.parse(svd) : [];

    const exsIdx = prsd.findIndex(
      item => item.club === club && item.date === fitTd,
    );

    if (exsIdx !== -1) {
      prsd[exsIdx] = {
        ...prsd[exsIdx],
        feeling,
        photo,
        timestamp: Date.now(),
      };
    } else {
      prsd.unshift({
        club,
        completedTasks: cmpltTsks,
        feeling,
        photo,
        date: fitTd,
        timestamp: Date.now(),
      });
    }

    await AsyncStorage.setItem(
      'fitroutine_completed_tasks',
      JSON.stringify(prsd),
    );

    navigation.replace('Fitroutinehm');
  };

  const getFitpht = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, selImg => {
      if (!selImg.didCancel && selImg.assets?.length) {
        setPhoto(selImg.assets[0].uri);
      }
    });
  };

  const handleShrtsk = () => {
    Share.share({
      message: `I just completed all my tasks in the ${fitRtnClbCfg[club].title}!`,
    });
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
                colors={['#FFE400', '#FFBA00']}
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
                    onPress={() => tgglTsk(i)}
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

            <TouchableOpacity style={task.photoBox} onPress={getFitpht}>
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
                <TouchableOpacity onPress={addFitrslts}>
                  <LinearGradient
                    colors={['#00E500', '#002C00']}
                    style={task.shareBtn}
                  >
                    <Text style={task.doneText}>Save</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShrtsk}>
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
            <LinearGradient
              colors={['#FFE400', '#FFBA00']}
              style={task.homeBtn}
            >
              <Text style={task.homeText}>Home</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Fitroutinescrllbck>
  );
};

export default Fitroutinetsks;
