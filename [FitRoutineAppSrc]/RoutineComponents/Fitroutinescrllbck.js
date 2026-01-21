import { ImageBackground, ScrollView, StyleSheet } from 'react-native';

const Fitroutinescrllbck = ({ children }) => {
  return (
    <ImageBackground
      source={require('../../assets/images/backgroundImage.png')}
      style={styles.fitroutinebackground}
      blurRadius={1.5}
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
