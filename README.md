# Ignite Quiz

This readme serves as a guide for the "Ignite Quiz" a project designed for
exploration and experimentation with React Native animations.

## What's Inside?

Dive into the world of React Native animations with this project! It serves as
a practical space to play around with various animation techniques and libraries.

## Tech Stack Playground:

- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/): Animation engine
- [Skia](https://skia.org/): 2D graphics and animations
- [expo-av](https://docs.expo.dev/versions/latest/sdk/av/): Audio/Video APIs
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/): Haptics API

---

This project was built following the Rocketseat react-native bootcamp, its was
started from a basic template to get deep into animations in react-native,
being a good playground to flex.

## [React-native-reanimated](https://docs.swmansion.com/react-native-reanimated/)

React-reanimated is the library used to build the project animation, being today
the most relevant animation library in the environment, being well maintained,
wildly adopted, performative and well documented.

### Core concepts

    The RNR uses the cpu treads out-of-box.

- useSharedValue
  - Keep values to be used on animations, and the animation are reactive to its changes.
- useAnimatedStyles
  - Used to define the styles meant to be animated based on the sharedValues,must be used with Animated Components.
- AnimatedComponent
  - Its a Wrapper that injects animation props to components that don't have their animation requirements.
- Animations factories
  - like withTiming, withSpring, withDelay, withClamp,etc.. that help us create amazing animations.
- Layout Animations
  - The Keyframe class implements a sequential animation like the web version
  - That available plenty of predefined Animations transitions like, Linear, Sequenced, Fading,Curves,etc...
  - And its possible to create Custom animation
- Gesture / GestureDetector
  - Its classes that enables us to handle micro integrations with elements like Pan, Tap, Pinch, FLing,etc..

## [Skia](https://skia.org/)

It's a 2D graphics library that provides a engine to handle graphics and some animations.

## Usage

In this project we used Skia to drawn check boxes and animate it with its on
API tools.
It was used also to replicate SVGs elements layers and implementing amazing granular animation.

## Sound/Haptics Feedback

Here we used the package `expo-av` to load audio files and integrated it with out
actions effects to enrich the user feedback experience.
Another package used was the `expo-haptics` the provides a seemly API to handle
with the devices vibration system, integrated here with some actions side effects as well.

## Limitations

Atm this project runs expo@50.0.13 that recommends react-native-reanimated@3.6.2,
this RNR version has a well known problem with the Keyframe class integration,
causing crashes issues that was fixed in the version 3.7.0, here I tried to
upgrade/downgrade its version butI faced another integration issues, and due it
I preferred comment the Keyframe animation and I will comeback here as soon as
there is any official integration with the RNR newer version.

## Run the Project

1 - Clone the project in your machine

2 - Install dependencies

```bash
  npm run install
```

3 - Them start the project with expo-go

```bash
  npm run start
```
