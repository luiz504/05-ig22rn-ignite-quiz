import { Pressable, PressableProps, Text } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

import { THEME } from '../../styles/theme'
import { styles } from './styles'

const TYPE_COLORS = {
  EASY: THEME.COLORS.BRAND_LIGHT,
  HARD: THEME.COLORS.DANGER_LIGHT,
  MEDIUM: THEME.COLORS.WARNING_LIGHT,
}

type Props = PressableProps & {
  title: string
  isChecked?: boolean
  type?: keyof typeof TYPE_COLORS
}

export function Level({
  title,
  type = 'EASY',
  isChecked = false,
  ...rest
}: Props) {
  const scale = useSharedValue(1)

  const animatedContainerStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const COLOR = TYPE_COLORS[type]

  function onPressIn() {
    const value = 1.1
    // scale.value = withSpring(1.2)
    scale.value = withTiming(value)
  }

  function onPressOut() {
    const value = 1
    // scale.value = withSpring(1)
    scale.value = withTiming(value)
  }

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} {...rest}>
      <Animated.View
        style={[
          styles.container,
          animatedContainerStyles,
          {
            borderColor: COLOR,
            backgroundColor: isChecked ? COLOR : 'transparent',
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isChecked ? THEME.COLORS.GREY_100 : COLOR },
          ]}
        >
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  )
}
