# Ignite Quiz

This project was built following the Rocketseat react-native bootcamp, its was
started from a basic template to get deep into animations in react-native,
being a good playground to flex.

## React-native-reanimated

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
