import { ImageBackground, ScrollView, StyleSheet } from 'react-native';

const Fitroutinescrllbck = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/backgroundImage.png')}
      style={styles.fitroutinebackground}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {children}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  fitroutinebackground: {
    flex: 1,
  },
});

export default Fitroutinescrllbck;
