import React, { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Audio } from 'expo-av'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import * as Haptics from 'expo-haptics'

import { QUIZ } from '../../data/quiz'
import { historyAdd } from '../../storage/quizHistoryStorage'

import { Loading } from '../../components/Loading'
import { Question } from '../../components/Question'
import { QuizHeader } from '../../components/QuizHeader'
import { ConfirmButton } from '../../components/ConfirmButton'
import { OutlineButton } from '../../components/OutlineButton'
import { ProgressBar } from '../../components/ProgressBar'
import { OverlayFeedback, Status } from '../../components/OverlayFeedback'

import { THEME } from '../../styles/theme'
import { styles } from './styles'

interface Params {
  id: string
}

const CARD_INCLINATION = 20 as const
const CARD_SKIP_THRESHOLD = -200 as const

type QuizProps = (typeof QUIZ)[0]

export function Quiz() {
  const [points, setPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quiz, setQuiz] = useState<QuizProps>({} as QuizProps)
  const [alternativeSelected, setAlternativeSelected] = useState<null | number>(
    null,
  )
  const [statusReply, setStatusReply] = useState<Status>('default')

  const playSound = async (isCorrect: boolean) => {
    const audioFile = isCorrect
      ? require('../../assets/correct.mp3')
      : require('../../assets/wrong.mp3')

    const { sound } = await Audio.Sound.createAsync(audioFile, {
      shouldPlay: true,
    })
    await sound.setPositionAsync(0)
    await sound.playAsync()
  }

  const { navigate } = useNavigation()

  const route = useRoute()
  const { id } = route.params as Params

  const shake = useSharedValue(0)
  const shakeAnimation = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    shake.value = withSequence(
      withTiming(3, { duration: 400, easing: Easing.bounce }),
      withTiming(0, undefined, (finished) => {
        'worklet'
        if (finished) {
          runOnJS(handleNextQuestion)()
        }
      }),
    )
  }
  const shakeStyleAnimated = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shake.value,
          [0, 0.5, 1, 1.5, 2, 2.5, 3],
          [0, -15, 0, 15, 0, -15, 0],
        ),
      },
    ],
  }))

  function handleSkipConfirm() {
    Alert.alert('Pular', 'Deseja realmente pular a questão?', [
      { text: 'Sim', onPress: () => handleNextQuestion() },
      { text: 'Não', onPress: () => {} },
    ])
  }

  async function handleFinished() {
    await historyAdd({
      id: new Date().getTime().toString(),
      title: quiz.title,
      level: quiz.level,
      points,
      questions: quiz.questions.length,
    })

    navigate('finish', {
      points: String(points),
      total: String(quiz.questions.length),
    })
  }

  function handleNextQuestion() {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prevState) => prevState + 1)
    } else {
      handleFinished()
    }
  }

  async function handleConfirm() {
    if (alternativeSelected === null) {
      return handleSkipConfirm()
    }

    if (quiz.questions[currentQuestion].correct === alternativeSelected) {
      setPoints((prevState) => prevState + 1)
      await playSound(true)
      setStatusReply('correct')
      handleNextQuestion()
    } else {
      await playSound(false)
      setStatusReply('error')
      shakeAnimation()
    }

    setAlternativeSelected(null)
  }

  function handleStop() {
    Alert.alert('Parar', 'Deseja parar agora?', [
      {
        text: 'Não',
        style: 'cancel',
      },
      {
        text: 'Sim',
        style: 'destructive',
        onPress: () => navigate('home'),
      },
    ])

    return true
  }

  useEffect(() => {
    const quizSelected = QUIZ.filter((item) => item.id === id)[0]
    setQuiz(quizSelected)
    setIsLoading(false)
  }, [])// eslint-disable-line



  const scrollY = useSharedValue(0)
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })
  const fixedProgressBarStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      paddingTop: 50,
      backgroundColor: THEME.COLORS.GREY_500,
      width: '110%',
      left: '-5%',
      zIndex: 1,
      opacity: interpolate(
        scrollY.value,
        [50, 90],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [50, 100],
            [-40, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    }
  })

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [40, 80], [1, 0], Extrapolation.CLAMP),
  }))

  const cardPosition = useSharedValue(0)
  const onPan = Gesture.Pan()
    .activateAfterLongPress(200)
    .onUpdate((event) => {
      const moveToLeft = event.translationX < 0
      if (moveToLeft) {
        cardPosition.value = event.translationX
      }
    })
    .onEnd((event) => {
      if (event.translationX < CARD_SKIP_THRESHOLD) {
        runOnJS(handleSkipConfirm)()
      }
      cardPosition.value = withTiming(0)
    })

  const dragStyles = useAnimatedStyle(() => {
    const rotateZ = cardPosition.value / CARD_INCLINATION
    return {
      transform: [
        {
          translateX: cardPosition.value,
        },
        { rotateZ: `${rotateZ}deg` },
      ],
    }
  })

  if (isLoading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <OverlayFeedback status={statusReply} />
      <Animated.View style={fixedProgressBarStyle}>
        <Text style={styles.title}>{quiz.title}</Text>
        <ProgressBar
          current={currentQuestion + 1}
          total={quiz.questions.length}
        />
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.question}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // smooth IOS scroll
      >
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <QuizHeader
            title={quiz.title}
            currentQuestion={currentQuestion + 1}
            totalOfQuestions={quiz.questions.length}
          />
        </Animated.View>

        <GestureDetector gesture={onPan}>
          <Animated.View style={[shakeStyleAnimated, dragStyles]}>
            <Question
              key={quiz.questions[currentQuestion].title}
              question={quiz.questions[currentQuestion]}
              alternativeSelected={alternativeSelected}
              setAlternativeSelected={setAlternativeSelected}
              // onUnmount={() => setStatusReply('default')}
            />
          </Animated.View>
        </GestureDetector>
        <View style={styles.footer}>
          <OutlineButton title="Parar" onPress={handleStop} />
          <ConfirmButton onPress={handleConfirm} />
        </View>
      </Animated.ScrollView>
    </View>
  )
}
