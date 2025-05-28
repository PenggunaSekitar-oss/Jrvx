"use client"

import { useState, useEffect } from "react"
import { Sparkles, Zap, Wand2 } from "lucide-react"

const phrases = [
  "Buat Prompt AI yang Sempurna",
  "Hasilkan Gambar yang Menakjubkan",
  "Buat Video yang Luar Biasa",
  "Tulis Konten yang Lebih Baik",
  "Coding Seperti Profesional",
]

export function TypingHero() {
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }
    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        const fullText = phrases[currentPhrase]

        if (isPaused) {
          setIsPaused(false)
          setIsDeleting(true)
          return
        }

        if (isDeleting) {
          setCurrentText(fullText.substring(0, currentText.length - 1))

          if (currentText === "") {
            setIsDeleting(false)
            setCurrentPhrase((prev) => (prev + 1) % phrases.length)
          }
        } else {
          setCurrentText(fullText.substring(0, currentText.length + 1))

          if (currentText === fullText) {
            setIsPaused(true)
          }
        }
      },
      isDeleting ? 50 : isPaused ? 2000 : 100,
    )

    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, isPaused, currentPhrase])

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`relative py-10 sm:py-16 md:py-20 px-3 sm:px-4 text-center overflow-hidden ${isDarkMode ? "bg-black" : ""}`}
    >
      {/* Background Elements - Removed */}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Brand Name */}
        <div className="mb-4">
          <div className="flex justify-center">
            <img
              src="/jarvx-logo.png"
              alt="JARVX Logo"
              className="w-[300px] sm:w-[420px] md:w-[525px] lg:w-[600px] xl:w-[675px] 2xl:w-[750px] h-auto mb-2 sm:mb-3"
            />
          </div>
          <p className={`text-lg md:text-xl font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Generator Prompt AI
          </p>
        </div>

        {/* Typing Animation */}
        <div className="mb-8">
          <h2
            className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4 min-h-[2.5rem] sm:min-h-[3.5rem] md:min-h-[4rem] flex items-center justify-center ${isDarkMode ? "text-white" : "text-gray-900"}`}
          >
            <span className="inline-block">
              {currentText}
              <span className="inline-block w-1 h-8 md:h-12 bg-blue-600 ml-1 animate-pulse" />
            </span>
          </h2>
          <p
            className={`text-base sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Ubah ide Anda menjadi prompt yang detail dan profesional untuk model AI apapun dengan generator cerdas kami
          </p>
        </div>

        {/* Feature Highlights Carousel */}
        <div className="max-w-3xl mx-auto mb-12 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${(currentFeature * 100) / 3}%)` }}
          >
            <div className="flex-shrink-0 w-full md:w-1/3 px-2">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 dark:bg-black/70 dark:border-black/30 dark:shadow-blue-500/20 dark:hover:shadow-blue-500/40">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Wand2 className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-300">Bertenaga AI</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-500">Peningkatan cerdas</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-1/3 px-2">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 dark:bg-black/70 dark:border-black/30 dark:shadow-purple-500/20 dark:hover:shadow-purple-500/40">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-300">Multi-Modal</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-500">Gambar, video, teks</p>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 w-full md:w-1/3 px-2">
              <div className="flex flex-col items-center gap-2 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-105 dark:bg-black/70 dark:border-black/30 dark:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-300">Instan</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-500">Hasil real-time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentFeature === index ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => setCurrentFeature(index)}
              />
            ))}
          </div>
        </div>

        {/* CTA Hint */}
        <div className="text-center">
          <p className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            ↓ Mulai buat prompt sempurna Anda di bawah ↓
          </p>
        </div>
      </div>
    </div>
  )
}
