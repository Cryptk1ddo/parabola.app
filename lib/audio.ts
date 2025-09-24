/**
 * Audio system for Parabola productivity OS
 * Handles ambient sounds, notifications, and binaural beats
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { usePreferences } from "./storage"

export type SoundType = "notification" | "ambient" | "binaural"
export type AmbientSound = "rain" | "forest" | "ocean" | "cafe" | "fireplace" | "whitenoise" | "brownoise"
export type NotificationSound = "bell" | "chime" | "success" | "gentle" | "focus-end"
export type BinauralType = "focus" | "calm" | "flow" | "sleep" | "creativity"

interface AudioContextType {
  audioContext?: AudioContext
  gainNode?: GainNode
  oscillators: Map<string, OscillatorNode>
  sources: Map<string, MediaElementAudioSourceNode>
}

// Mock audio URLs - in production these would be real audio files
const AUDIO_SOURCES = {
  ambient: {
    rain: "/audio/ambient/rain.mp3",
    forest: "/audio/ambient/forest.mp3",
    ocean: "/audio/ambient/ocean.mp3",
    cafe: "/audio/ambient/cafe.mp3",
    fireplace: "/audio/ambient/fireplace.mp3",
    whitenoise: "/audio/ambient/whitenoise.mp3",
    brownoise: "/audio/ambient/brownoise.mp3",
  },
  notifications: {
    bell: "/audio/notifications/bell.mp3",
    chime: "/audio/notifications/chime.mp3",
    success: "/audio/notifications/success.mp3",
    gentle: "/audio/notifications/gentle.mp3",
    "focus-end": "/audio/notifications/focus-end.mp3",
  },
  binaural: {
    focus: { base: 200, beat: 40 }, // 40Hz gamma waves
    calm: { base: 200, beat: 8 }, // 8Hz alpha waves
    flow: { base: 200, beat: 15 }, // 15Hz beta waves
    sleep: { base: 200, beat: 4 }, // 4Hz delta waves
    creativity: { base: 200, beat: 10 }, // 10Hz alpha waves
  },
}

export function useAudioSystem() {
  const [preferences] = usePreferences()
  const audioContextRef = useRef<AudioContextType>({
    oscillators: new Map(),
    sources: new Map(),
  })
  const [currentAmbient, setCurrentAmbient] = useState<AmbientSound | null>(null)
  const [currentBinaural, setCurrentBinaural] = useState<BinauralType | null>(null)
  const [volume, setVolume] = useState(0.3)
  const [isPlaying, setIsPlaying] = useState(false)

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current.audioContext) {
        audioContextRef.current.audioContext = new AudioContext()
        audioContextRef.current.gainNode = audioContextRef.current.audioContext.createGain()
        audioContextRef.current.gainNode.connect(audioContextRef.current.audioContext.destination)
      }
    }

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudioContext()
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }

    document.addEventListener("click", handleFirstInteraction)
    document.addEventListener("keydown", handleFirstInteraction)

    return () => {
      document.removeEventListener("click", handleFirstInteraction)
      document.removeEventListener("keydown", handleFirstInteraction)
    }
  }, [])

  // Update volume
  useEffect(() => {
    if (audioContextRef.current.gainNode) {
      audioContextRef.current.gainNode.gain.value = preferences.soundEnabled ? volume : 0
    }
  }, [volume, preferences.soundEnabled])

  // Play notification sound
  const playNotification = useCallback((type: NotificationSound = "chime") => {
    if (!preferences.soundEnabled) return

    // For demo, we'll use Web Audio API to generate tones
    // In production, you'd load actual audio files
    const audioContext = audioContextRef.current.audioContext
    if (!audioContext) return

    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.gainNode!)

    // Different frequencies for different notification types
    const frequencies = {
      bell: [523.25, 659.25], // C5, E5
      chime: [523.25, 659.25, 783.99], // C5, E5, G5
      success: [261.63, 329.63, 392.00], // C4, E4, G4
      gentle: [440], // A4
      "focus-end": [523.25, 392.00, 329.63], // C5, G4, E4
    }

    const noteFreqs = frequencies[type] || frequencies.chime
    
    noteFreqs.forEach((freq, index) => {
      setTimeout(() => {
        const osc = audioContext.createOscillator()
        const gain = audioContext.createGain()
        
        osc.connect(gain)
        gain.connect(audioContextRef.current.gainNode!)
        
        osc.frequency.setValueAtTime(freq, audioContext.currentTime)
        osc.type = "sine"
        
        gain.gain.setValueAtTime(0, audioContext.currentTime)
        gain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5)
        
        osc.start(audioContext.currentTime)
        osc.stop(audioContext.currentTime + 0.5)
      }, index * 150)
    })
  }, [preferences.soundEnabled])

  // Play binaural beats
  const playBinauralBeats = useCallback((type: BinauralType) => {
    if (!preferences.soundEnabled || !preferences.binauralEnabled) return

    const audioContext = audioContextRef.current.audioContext
    if (!audioContext) return

    // Stop current binaural if playing
    if (currentBinaural) {
      stopBinauralBeats()
    }

    const config = AUDIO_SOURCES.binaural[type]
    const leftOsc = audioContext.createOscillator()
    const rightOsc = audioContext.createOscillator()
    const leftGain = audioContext.createGain()
    const rightGain = audioContext.createGain()
    const merger = audioContext.createChannelMerger(2)

    // Left ear - base frequency
    leftOsc.frequency.setValueAtTime(config.base, audioContext.currentTime)
    leftOsc.connect(leftGain)
    leftGain.connect(merger, 0, 0)

    // Right ear - base frequency + beat frequency
    rightOsc.frequency.setValueAtTime(config.base + config.beat, audioContext.currentTime)
    rightOsc.connect(rightGain)
    rightGain.connect(merger, 0, 1)

    merger.connect(audioContextRef.current.gainNode!)

    // Set low volume for binaural beats
    leftGain.gain.setValueAtTime(0.05, audioContext.currentTime)
    rightGain.gain.setValueAtTime(0.05, audioContext.currentTime)

    leftOsc.start()
    rightOsc.start()

    audioContextRef.current.oscillators.set("binaural-left", leftOsc)
    audioContextRef.current.oscillators.set("binaural-right", rightOsc)

    setCurrentBinaural(type)
    setIsPlaying(true)
  }, [preferences.soundEnabled, preferences.binauralEnabled, currentBinaural])

  // Stop binaural beats
  const stopBinauralBeats = useCallback(() => {
    const leftOsc = audioContextRef.current.oscillators.get("binaural-left")
    const rightOsc = audioContextRef.current.oscillators.get("binaural-right")

    if (leftOsc) {
      leftOsc.stop()
      audioContextRef.current.oscillators.delete("binaural-left")
    }
    if (rightOsc) {
      rightOsc.stop()
      audioContextRef.current.oscillators.delete("binaural-right")
    }

    setCurrentBinaural(null)
    setIsPlaying(false)
  }, [])

  // Play ambient sound (mock implementation)
  const playAmbientSound = useCallback((type: AmbientSound) => {
    // In a real implementation, you'd load and play audio files
    // For now, we'll just track the state
    setCurrentAmbient(type)
    setIsPlaying(true)
  }, [])

  // Stop ambient sound
  const stopAmbientSound = useCallback(() => {
    setCurrentAmbient(null)
    setIsPlaying(false)
  }, [])

  // Stop all audio
  const stopAllAudio = useCallback(() => {
    stopBinauralBeats()
    stopAmbientSound()
  }, [stopBinauralBeats, stopAmbientSound])

  return {
    // State
    currentAmbient,
    currentBinaural,
    volume,
    isPlaying,
    
    // Controls
    setVolume,
    playNotification,
    playBinauralBeats,
    stopBinauralBeats,
    playAmbientSound,
    stopAmbientSound,
    stopAllAudio,
    
    // Available sounds
    availableAmbientSounds: Object.keys(AUDIO_SOURCES.ambient) as AmbientSound[],
    availableBinauralTypes: Object.keys(AUDIO_SOURCES.binaural) as BinauralType[],
    availableNotificationSounds: Object.keys(AUDIO_SOURCES.notifications) as NotificationSound[],
  }
}