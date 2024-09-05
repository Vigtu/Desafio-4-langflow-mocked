import { useState, useCallback } from 'react'

export interface Preferences {
  priceRange: number[]
  occasion: string
  detailedOccasion: string
  location: string
  weather: string
  time: string
  exactTime: string
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>({
    priceRange: [0, 200],
    occasion: '',
    detailedOccasion: '',
    location: '',
    weather: '',
    time: '',
    exactTime: '',
  })
  const [quizSkipped, setQuizSkipped] = useState(false)

  const updatePreference = useCallback((key: keyof Preferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }, [])

  const skipQuiz = useCallback(() => {
    setQuizSkipped(true)
  }, [])

  const getPreferencesString = useCallback(() => {
    if (quizSkipped) return " "

    const parts = []
    if (preferences.priceRange[0] !== 0 || preferences.priceRange[1] !== 200) {
      parts.push(`Faixa de preço: R$${preferences.priceRange[0]} - R$${preferences.priceRange[1]}`)
    }
    if (preferences.occasion) parts.push(`Ocasião: ${preferences.occasion}`)
    if (preferences.detailedOccasion) parts.push(`Ocasião detalhada: ${preferences.detailedOccasion}`)
    if (preferences.location) parts.push(`Localização: ${preferences.location}`)
    if (preferences.weather) parts.push(`Clima: ${preferences.weather}`)
    if (preferences.time) parts.push(`Horário: ${preferences.time}`)
    if (preferences.exactTime) parts.push(`Horário exato: ${preferences.exactTime}`)

    return parts.length > 0 ? parts.join(', ') : " "
  }, [preferences, quizSkipped])

  return {
    preferences,
    updatePreference,
    getPreferencesString,
    skipQuiz,
  }
}
