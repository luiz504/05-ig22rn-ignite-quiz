import { BlurMask, Canvas, Rect } from '@shopify/react-native-skia'
import { FC, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { THEME } from '../../styles/theme'

export type Status = 'default' | 'correct' | 'error'

const COLOR_BY_STATUS: Record<Status, string> = {
  default: 'transparent',
  correct: THEME.COLORS.BRAND_LIGHT,
  error: THEME.COLORS.DANGER_LIGHT,
}

type Props = {
  status?: Status
}
export const OverlayFeedback: FC<Props> = ({ status = 'default' }) => {
  const color = COLOR_BY_STATUS[status]
  const { height, width } = useWindowDimensions()
  const opacity = useSharedValue(0)

  const styleAnimated = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  useEffect(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: 400, easing: Easing.bounce }),
      withTiming(0),
    )
  }, [status, opacity])

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          position: 'absolute',
        },
        styleAnimated,
      ]}
    >
      <Canvas style={{ flex: 1 }}>
        <Rect x={0} y={0} width={width} height={height} color={color}>
          <BlurMask blur={50} style={'inner'} />
        </Rect>
      </Canvas>
    </Animated.View>
  )
}
