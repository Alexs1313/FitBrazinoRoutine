import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Fitroutinescrllbck from './Fitroutinescrllbck';

const Fitroutineldng = () => {
  const fitroutineloader = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: transparent;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .wrapper {
    --duration: 2.1s;
    --size: 42px;
    --color: #1a650fff;

    display: grid;
    grid-template-columns: repeat(7, var(--size));
    perspective: 360px;
    font-family: system-ui, -apple-system;
    font-weight: 800;
    font-size: 1.6em;
  }

  .cube {
    position: relative;
    width: var(--size);
    height: var(--size);
    transform-style: preserve-3d;
    animation: rise var(--duration) ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.2s);
  }

  .face {
    position: absolute;
    width: var(--size);
    height: var(--size);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    box-shadow: inset 0 0 8px #0002;
    animation: face var(--duration) ease-in-out infinite;
    animation-delay: inherit;
  }

  .front {
    transform: translateZ(calc(var(--size) / 2));
    animation: face var(--duration) ease-in-out infinite,
               glow var(--duration) ease-in-out infinite;
  }

  .back  { transform: rotateY(180deg) translateZ(calc(var(--size) / 2)); opacity:.4 }
  .left  { transform: rotateY(-90deg) translateZ(calc(var(--size) / 2)); opacity:.4 }
  .right { transform: rotateY(90deg) translateZ(calc(var(--size) / 2)); opacity:.4 }
  .top   { transform: rotateX(90deg) translateZ(calc(var(--size) / 2)); opacity:.6 }
  .bot   { transform: rotateX(-90deg) translateZ(calc(var(--size) / 2)); opacity:.6 }

  @keyframes rise {
    0%, 40%, 100% { transform: translateZ(-2px); }
    30% { transform: translateZ(14px); }
  }

  @keyframes face {
    0%, 50%, 100% { background: transparent; }
    10% { background: var(--color); }
  }

  @keyframes glow {
    0%, 50%, 100% { color: transparent; }
    30% {
      color: #fff;
      filter: drop-shadow(0 10px 10px var(--color));
    }
  }
</style>
</head>

<body>
  <div class="wrapper">
    ${['L', 'O', 'A', 'D', 'I', 'N', 'G']
      .map(
        (l, i) => `
      <div class="cube" style="--i:${i}">
        <div class="face front">${l}</div>
        <div class="face back"></div>
        <div class="face left"></div>
        <div class="face right"></div>
        <div class="face top"></div>
        <div class="face bot"></div>
      </div>`,
      )
      .join('')}
  </div>
</body>
</html>
`;

  return (
    <Fitroutinescrllbck>
      <View style={styles.imagewrapper}>
        <Image source={require('../../assets/images/loaderLogo.png')} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: fitroutineloader }}
          style={styles.loaderwebview}
          scrollEnabled={false}
        />
      </View>
    </Fitroutinescrllbck>
  );
};

const styles = StyleSheet.create({
  imagewrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderwebview: {
    width: 360,
    height: 120,
    backgroundColor: 'transparent',
  },
});

export default Fitroutineldng;
