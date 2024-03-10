import { useEffect } from 'react'
import { Pressable, PressableProps } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { THEME } from '../../styles/theme'
import { styles } from './styles'

const PressableAnimated = Animated.createAnimatedComponent(Pressable)

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
  const checked = useSharedValue(1)
  const COLOR = TYPE_COLORS[type]
  const animatedContainerStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: interpolateColor(
      checked.value,
      [0, 1],
      ['transparent', COLOR],
    ),
  }))

  const animatedTextStyles = useAnimatedStyle(() => ({
    color: interpolateColor(
      checked.value,
      [0, 1],
      [COLOR, THEME.COLORS.GREY_100],
    ),
  }))

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

  useEffect(() => {
    checked.value = withTiming(isChecked ? 1 : 0)
  }, [isChecked, checked])

  return (
    <PressableAnimated
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      {...rest}
      style={[
        styles.container,
        animatedContainerStyles,
        {
          borderColor: COLOR,
        },
      ]}
    >
      <Animated.Text style={[styles.title, animatedTextStyles]}>
        {title}
      </Animated.Text>
    </PressableAnimated>
  )
}
