"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Copy,
  Wand2,
  History,
  Send,
  Sparkles,
  Languages,
  ImageIcon,
  MapPin,
  Clock,
  Cloud,
  Palette,
  Camera,
  Video,
  Star,
  Github,
  Settings,
  Plus,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  Eye,
  Upload,
  X,
  Monitor,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TypingHero } from "@/components/typing-hero"
import RollingGallery from "@/components/rolling-gallery"

interface PromptHistory {
  id: string
  original: string
  enhanced: string
  type: string
  style: string
  language: string
  aspectRatio: string
  setting: string
  mood: string
  time: string
  weather: string
  contentType: string
  accessory: string
  emotion: string
  backgroundOption: string
  resolution: string
  cameraAngle: string
  hasReferenceImage: boolean
  timestamp: Date
}

const promptTypes = [
  { id: "image", label: "Generasi Gambar", description: "Untuk DALL-E, Midjourney, Stable Diffusion", icon: ImageIcon },
  { id: "video", label: "Generasi Video", description: "Untuk Sora, RunwayML, Pika Labs", icon: Video },
  { id: "text", label: "Generasi Teks", description: "Untuk ChatGPT, Claude, Gemini", icon: Wand2 },
  { id: "code", label: "Generasi Kode", description: "Untuk tugas pemrograman", icon: Settings },
]

const contentTypes = {
  image: [
    {
      id: "product",
      label: "Gambar Produk",
      keywords: {
        id: "fotografi produk, latar belakang bersih, pencahayaan studio",
        en: "product photography, clean background, studio lighting",
      },
    },
    {
      id: "icon",
      label: "Icon",
      keywords: { id: "ikon, simbol, desain minimalis, vektor", en: "icon, symbol, minimalist design, vector" },
    },
    {
      id: "logo",
      label: "Logo",
      keywords: {
        id: "logo, identitas brand, desain grafis, profesional",
        en: "logo, brand identity, graphic design, professional",
      },
    },
    {
      id: "sticker",
      label: "Sticker",
      keywords: {
        id: "stiker, ilustrasi lucu, warna cerah, kartun",
        en: "sticker, cute illustration, bright colors, cartoon",
      },
    },
    {
      id: "illustration",
      label: "Ilustrasi",
      keywords: {
        id: "ilustrasi, seni digital, kreatif, artistik",
        en: "illustration, digital art, creative, artistic",
      },
    },
    {
      id: "poster",
      label: "Poster / Banner",
      keywords: { id: "poster, banner, desain grafis, tipografi", en: "poster, banner, graphic design, typography" },
    },
    {
      id: "scene",
      label: "Scene / Background",
      keywords: {
        id: "pemandangan, latar belakang, lingkungan, atmosfer",
        en: "scenery, background, environment, atmosphere",
      },
    },
    {
      id: "character",
      label: "Karakter / Portrait",
      keywords: { id: "karakter, potret, wajah, ekspresi", en: "character, portrait, face, expression" },
    },
    {
      id: "infographic",
      label: "Infografik",
      keywords: {
        id: "infografik, data visualisasi, diagram, informasi",
        en: "infographic, data visualization, diagram, information",
      },
    },
    {
      id: "mockup",
      label: "Mockup",
      keywords: {
        id: "mockup, presentasi produk, template, profesional",
        en: "mockup, product presentation, template, professional",
      },
    },
    {
      id: "wallpaper",
      label: "Wallpaper",
      keywords: {
        id: "wallpaper, latar belakang desktop, resolusi tinggi",
        en: "wallpaper, desktop background, high resolution",
      },
    },
    {
      id: "map",
      label: "Peta / Map",
      keywords: { id: "peta, navigasi, geografis, lokasi", en: "map, navigation, geographic, location" },
    },
    {
      id: "ui-design",
      label: "UI/UX Design",
      keywords: {
        id: "desain UI, antarmuka pengguna, aplikasi, website",
        en: "UI design, user interface, application, website",
      },
    },
    {
      id: "comic",
      label: "Komik / Panel",
      keywords: { id: "komik, panel, cerita bergambar, manga", en: "comic, panel, graphic story, manga" },
    },
    {
      id: "typography",
      label: "Text-based Art / Typography",
      keywords: { id: "tipografi, seni teks, huruf, kaligrafi", en: "typography, text art, lettering, calligraphy" },
    },
  ],
  video: [
    {
      id: "promo",
      label: "Video Promosi / Iklan",
      keywords: {
        id: "video promosi, iklan, marketing, komersial",
        en: "promotional video, advertisement, marketing, commercial",
      },
    },
    {
      id: "product-video",
      label: "Video Produk",
      keywords: {
        id: "video produk, demonstrasi, showcase, review",
        en: "product video, demonstration, showcase, review",
      },
    },
    {
      id: "animation",
      label: "Video Animasi (2D/3D)",
      keywords: { id: "animasi, kartun, motion graphics, 3D", en: "animation, cartoon, motion graphics, 3D" },
    },
    {
      id: "cinematic",
      label: "Cinematic Scene",
      keywords: { id: "sinematik, film, dramatis, kualitas tinggi", en: "cinematic, film, dramatic, high quality" },
    },
    {
      id: "tutorial",
      label: "Tutorial / Edukasi",
      keywords: { id: "tutorial, edukasi, pembelajaran, instruksi", en: "tutorial, education, learning, instruction" },
    },
    {
      id: "music-video",
      label: "Video Musik / Visualizer",
      keywords: { id: "video musik, visualizer, ritme, artistik", en: "music video, visualizer, rhythm, artistic" },
    },
    {
      id: "loop",
      label: "Video Loop / Background",
      keywords: {
        id: "video loop, latar belakang, seamless, berulang",
        en: "video loop, background, seamless, repeating",
      },
    },
    {
      id: "character-video",
      label: "Video Karakter / Tokoh",
      keywords: {
        id: "karakter bergerak, tokoh, animasi karakter",
        en: "moving character, figure, character animation",
      },
    },
    {
      id: "game-style",
      label: "Video Game Style",
      keywords: { id: "gaya game, pixel art, retro gaming, 8-bit", en: "game style, pixel art, retro gaming, 8-bit" },
    },
    {
      id: "ar-vr",
      label: "Video AR/VR",
      keywords: {
        id: "augmented reality, virtual reality, 360 derajat, immersive",
        en: "augmented reality, virtual reality, 360 degree, immersive",
      },
    },
    {
      id: "documentary",
      label: "Video Dokumenter Pendek",
      keywords: {
        id: "dokumenter, faktual, informatif, jurnalistik",
        en: "documentary, factual, informative, journalistic",
      },
    },
    {
      id: "simulation",
      label: "Video Simulasi",
      keywords: { id: "simulasi, modeling, teknis, ilmiah", en: "simulation, modeling, technical, scientific" },
    },
    {
      id: "comedy",
      label: "Video Komedi / Meme",
      keywords: { id: "komedi, lucu, meme, viral, humor", en: "comedy, funny, meme, viral, humor" },
    },
    {
      id: "transition",
      label: "Video Transisi / Efek",
      keywords: { id: "transisi, efek visual, motion, dinamis", en: "transition, visual effects, motion, dynamic" },
    },
    {
      id: "storytelling",
      label: "Video Storytelling / Naratif",
      keywords: { id: "bercerita, naratif, emosional, plot", en: "storytelling, narrative, emotional, plot" },
    },
  ],
}

const aspectRatios = {
  image: [
    { id: "1:1", label: "1:1 (Square)", description: "Instagram post, profile picture" },
    { id: "16:9", label: "16:9 (Landscape)", description: "Desktop wallpaper, YouTube thumbnail" },
    { id: "9:16", label: "9:16 (Portrait)", description: "Instagram story, TikTok, phone wallpaper" },
    { id: "4:3", label: "4:3 (Classic)", description: "Traditional photo format" },
    { id: "3:2", label: "3:2 (DSLR)", description: "Standard camera ratio" },
    { id: "21:9", label: "21:9 (Ultrawide)", description: "Cinematic, ultrawide monitor" },
    { id: "2:3", label: "2:3 (Portrait)", description: "Book cover, poster" },
    { id: "5:4", label: "5:4 (Medium Format)", description: "Professional photography" },
  ],
  video: [
    { id: "16:9", label: "16:9 (Landscape)", description: "YouTube, TV, desktop" },
    { id: "9:16", label: "9:16 (Portrait)", description: "TikTok, Instagram Reels, Stories" },
    { id: "1:1", label: "1:1 (Square)", description: "Instagram feed video" },
    { id: "4:5", label: "4:5 (Vertical)", description: "Instagram feed, Facebook" },
    { id: "21:9", label: "21:9 (Cinematic)", description: "Movie format, ultrawide" },
  ],
}

const settings = [
  {
    id: "studio",
    label: "Studio",
    keywords: { id: "studio foto, latar belakang bersih", en: "photo studio, clean background" },
  },
  { id: "outdoor", label: "Luar Ruangan", keywords: { id: "luar ruangan, alam terbuka", en: "outdoor, open nature" } },
  { id: "indoor", label: "Dalam Ruangan", keywords: { id: "dalam ruangan, interior", en: "indoor, interior" } },
  { id: "urban", label: "Perkotaan", keywords: { id: "perkotaan, jalanan kota", en: "urban, city streets" } },
  { id: "forest", label: "Hutan", keywords: { id: "hutan lebat, pepohonan", en: "dense forest, trees" } },
  { id: "beach", label: "Pantai", keywords: { id: "pantai, pasir, ombak", en: "beach, sand, waves" } },
  {
    id: "mountain",
    label: "Pegunungan",
    keywords: { id: "pegunungan, puncak gunung", en: "mountains, mountain peaks" },
  },
  { id: "desert", label: "Gurun", keywords: { id: "gurun pasir, tandus", en: "desert, sand dunes" } },
  {
    id: "space",
    label: "Luar Angkasa",
    keywords: { id: "luar angkasa, galaksi, bintang", en: "outer space, galaxy, stars" },
  },
  { id: "underwater", label: "Bawah Air", keywords: { id: "bawah air, laut dalam", en: "underwater, deep sea" } },
  {
    id: "cafe",
    label: "Kafe",
    keywords: { id: "kafe, kedai kopi, suasana hangat", en: "cafe, coffee shop, cozy atmosphere" },
  },
  {
    id: "library",
    label: "Perpustakaan",
    keywords: { id: "perpustakaan, rak buku, tenang", en: "library, bookshelves, quiet" },
  },
  { id: "rooftop", label: "Atap Gedung", keywords: { id: "atap gedung, pemandangan kota", en: "rooftop, city view" } },
  { id: "garden", label: "Taman", keywords: { id: "taman, bunga-bunga, hijau", en: "garden, flowers, greenery" } },
  {
    id: "castle",
    label: "Kastil",
    keywords: { id: "kastil kuno, arsitektur gothic", en: "ancient castle, gothic architecture" },
  },
  {
    id: "cyberpunk-city",
    label: "Kota Cyberpunk",
    keywords: { id: "kota cyberpunk, neon, futuristik", en: "cyberpunk city, neon, futuristic" },
  },
]

const moods = [
  { id: "gloomy", label: "Suram", keywords: { id: "suram, gelap, melankolis", en: "gloomy, dark, melancholic" } },
  { id: "cheerful", label: "Ceria", keywords: { id: "ceria, bahagia, energik", en: "cheerful, happy, energetic" } },
  { id: "intense", label: "Intens", keywords: { id: "intens, dramatis, kuat", en: "intense, dramatic, powerful" } },
  {
    id: "mysterious",
    label: "Misterius",
    keywords: { id: "misterius, enigmatik, tersembunyi", en: "mysterious, enigmatic, hidden" },
  },
  { id: "peaceful", label: "Damai", keywords: { id: "damai, tenang, harmonis", en: "peaceful, calm, harmonious" } },
  { id: "romantic", label: "Romantis", keywords: { id: "romantis, lembut, mesra", en: "romantic, soft, intimate" } },
  { id: "epic", label: "Epik", keywords: { id: "epik, megah, heroik", en: "epic, grand, heroic" } },
  {
    id: "nostalgic",
    label: "Nostalgia",
    keywords: { id: "nostalgia, kenangan, vintage", en: "nostalgic, memories, vintage" },
  },
  { id: "surreal", label: "Surreal", keywords: { id: "surreal, aneh, tidak nyata", en: "surreal, strange, unreal" } },
  {
    id: "minimalist",
    label: "Minimalis",
    keywords: { id: "minimalist, sederhana, bersih", en: "minimalist, simple, clean" },
  },
]

const times = [
  {
    id: "sunrise",
    label: "Matahari Terbit",
    keywords: { id: "matahari terbit, fajar, cahaya emas", en: "sunrise, dawn, golden light" },
  },
  { id: "morning", label: "Pagi", keywords: { id: "pagi hari, cahaya lembut", en: "morning, soft light" } },
  { id: "noon", label: "Siang", keywords: { id: "siang hari, cahaya terang", en: "noon, bright light" } },
  {
    id: "golden-hour",
    label: "Golden Hour",
    keywords: { id: "golden hour, cahaya emas hangat", en: "golden hour, warm golden light" },
  },
  {
    id: "sunset",
    label: "Matahari Terbenam",
    keywords: { id: "matahari terbenam, senja, langit oranye", en: "sunset, dusk, orange sky" },
  },
  {
    id: "blue-hour",
    label: "Blue Hour",
    keywords: { id: "blue hour, senja biru, cahaya lembut", en: "blue hour, blue dusk, soft light" },
  },
  { id: "night", label: "Malam", keywords: { id: "malam hari, gelap", en: "night time, dark" } },
  { id: "midnight", label: "Tengah Malam", keywords: { id: "tengah malam, gelap gulita", en: "midnight, pitch dark" } },
  { id: "twilight", label: "Senja", keywords: { id: "senja, cahaya redup", en: "twilight, dim light" } },
]

const weathers = [
  { id: "sunny", label: "Cerah", keywords: { id: "cerah, matahari bersinar", en: "sunny, bright sunshine" } },
  { id: "cloudy", label: "Berawan", keywords: { id: "berawan, awan tebal", en: "cloudy, thick clouds" } },
  { id: "rainy", label: "Hujan", keywords: { id: "hujan, tetesan air, basah", en: "rainy, raindrops, wet" } },
  {
    id: "stormy",
    label: "Badai",
    keywords: { id: "badai, petir, angin kencang", en: "stormy, lightning, strong wind" },
  },
  {
    id: "snowy",
    label: "Bersalju",
    keywords: { id: "bersalju, salju turun, dingin", en: "snowy, falling snow, cold" },
  },
  { id: "foggy", label: "Berkabut", keywords: { id: "berkabut, kabut tebal, samar", en: "foggy, thick fog, misty" } },
  { id: "windy", label: "Berangin", keywords: { id: "berangin, angin kencang", en: "windy, strong breeze" } },
  { id: "overcast", label: "Mendung", keywords: { id: "mendung, langit abu-abu", en: "overcast, gray sky" } },
  { id: "drizzle", label: "Gerimis", keywords: { id: "gerimis, hujan ringan", en: "drizzle, light rain" } },
  { id: "hazy", label: "Berkabut Tipis", keywords: { id: "berkabut tipis, samar-samar", en: "hazy, light mist" } },
]

const accessories = [
  { id: "hat", label: "Topi", keywords: { id: "topi, penutup kepala", en: "hat, headwear" } },
  { id: "cap", label: "Topi Baseball", keywords: { id: "topi baseball, snapback", en: "baseball cap, snapback" } },
  { id: "beanie", label: "Kupluk", keywords: { id: "kupluk, topi rajut", en: "beanie, knit hat" } },
  { id: "fedora", label: "Topi Fedora", keywords: { id: "topi fedora, topi klasik", en: "fedora hat, classic hat" } },
  { id: "beret", label: "Beret", keywords: { id: "beret, topi pelukis", en: "beret, artist hat" } },
  { id: "helmet", label: "Helm", keywords: { id: "helm, pelindung kepala", en: "helmet, head protection" } },
  { id: "crown", label: "Mahkota", keywords: { id: "mahkota, tiara", en: "crown, tiara" } },
  { id: "headband", label: "Bandana", keywords: { id: "bandana, ikat kepala", en: "headband, bandana" } },
  { id: "glasses", label: "Kacamata", keywords: { id: "kacamata, eyewear", en: "glasses, eyewear" } },
  {
    id: "sunglasses",
    label: "Kacamata Hitam",
    keywords: { id: "kacamata hitam, kacamata gelap", en: "sunglasses, dark glasses" },
  },
  {
    id: "reading-glasses",
    label: "Kacamata Baca",
    keywords: { id: "kacamata baca, kacamata minus", en: "reading glasses, prescription glasses" },
  },
  {
    id: "safety-glasses",
    label: "Kacamata Safety",
    keywords: { id: "kacamata safety, pelindung mata", en: "safety glasses, protective eyewear" },
  },
  { id: "monocle", label: "Monokle", keywords: { id: "monokle, kacamata satu mata", en: "monocle, single eyeglass" } },
  { id: "ring", label: "Cincin", keywords: { id: "cincin, perhiasan jari", en: "ring, finger jewelry" } },
  { id: "necklace", label: "Kalung", keywords: { id: "kalung, perhiasan leher", en: "necklace, neck jewelry" } },
  { id: "earrings", label: "Anting", keywords: { id: "anting, perhiasan telinga", en: "earrings, ear jewelry" } },
  { id: "bracelet", label: "Gelang", keywords: { id: "gelang, perhiasan tangan", en: "bracelet, wrist jewelry" } },
  { id: "watch", label: "Jam Tangan", keywords: { id: "jam tangan, arloji", en: "watch, timepiece" } },
  {
    id: "gloves",
    label: "Sarung Tangan",
    keywords: { id: "sarung tangan, pelindung tangan", en: "gloves, hand protection" },
  },
  { id: "scarf", label: "Syal", keywords: { id: "syal, selendang", en: "scarf, neck wrap" } },
  { id: "tie", label: "Dasi", keywords: { id: "dasi, aksesoris formal", en: "tie, formal accessory" } },
  { id: "bow-tie", label: "Dasi Kupu-kupu", keywords: { id: "dasi kupu-kupu, bow tie", en: "bow tie, formal bow" } },
  { id: "mask", label: "Masker", keywords: { id: "masker, penutup wajah", en: "mask, face covering" } },
  { id: "backpack", label: "Tas Ransel", keywords: { id: "tas ransel, backpack", en: "backpack, rucksack" } },
  { id: "handbag", label: "Tas Tangan", keywords: { id: "tas tangan, handbag", en: "handbag, purse" } },
  { id: "belt", label: "Ikat Pinggang", keywords: { id: "ikat pinggang, sabuk", en: "belt, waist strap" } },
  { id: "suspenders", label: "Suspender", keywords: { id: "suspender, tali bahu", en: "suspenders, braces" } },
  { id: "badge", label: "Lencana", keywords: { id: "lencana, pin", en: "badge, pin" } },
  {
    id: "flower",
    label: "Bunga Hias",
    keywords: { id: "bunga hias, aksesoris bunga", en: "decorative flower, floral accessory" },
  },
]

const emotions = [
  { id: "happy", label: "Bahagia", keywords: { id: "bahagia, gembira, riang", en: "happy, joyful, cheerful" } },
  { id: "smile", label: "Senyum", keywords: { id: "senyum, tersenyum manis", en: "smile, smiling sweetly" } },
  { id: "laugh", label: "Tertawa", keywords: { id: "tertawa, terbahak", en: "laughing, bursting with laughter" } },
  { id: "grin", label: "Seringai", keywords: { id: "seringai, senyum lebar", en: "grin, wide smile" } },
  { id: "sad", label: "Sedih", keywords: { id: "sedih, murung, duka", en: "sad, melancholy, sorrowful" } },
  { id: "cry", label: "Menangis", keywords: { id: "menangis, berlinang air mata", en: "crying, tears flowing" } },
  { id: "pout", label: "Cemberut", keywords: { id: "cemberut, merajuk, ngambek", en: "pouting, sulking" } },
  { id: "frown", label: "Mengernyit", keywords: { id: "mengernyit, kerutan dahi", en: "frowning, furrowed brow" } },
  { id: "angry", label: "Marah", keywords: { id: "marah, murka, berang", en: "angry, furious, enraged" } },
  { id: "rage", label: "Mengamuk", keywords: { id: "mengamuk, sangat marah", en: "raging, extremely angry" } },
  { id: "annoyed", label: "Kesal", keywords: { id: "kesal, jengkel, dongkol", en: "annoyed, irritated, vexed" } },
  {
    id: "surprised",
    label: "Terkejut",
    keywords: { id: "terkejut, kaget, tercengang", en: "surprised, shocked, astonished" },
  },
  { id: "amazed", label: "Takjub", keywords: { id: "takjub, terpesona, kagum", en: "amazed, fascinated, in awe" } },
  {
    id: "confused",
    label: "Bingung",
    keywords: { id: "bingung, kebingungan, heran", en: "confused, puzzled, bewildered" },
  },
  { id: "worried", label: "Khawatir", keywords: { id: "khawatir, cemas, gelisah", en: "worried, anxious, concerned" } },
  { id: "scared", label: "Takut", keywords: { id: "takut, ketakutan, ngeri", en: "scared, frightened, terrified" } },
  { id: "shy", label: "Malu", keywords: { id: "malu, pemalu, canggung", en: "shy, bashful, embarrassed" } },
  {
    id: "confident",
    label: "Percaya Diri",
    keywords: { id: "percaya diri, yakin, mantap", en: "confident, self-assured, determined" },
  },
  { id: "proud", label: "Bangga", keywords: { id: "bangga, sombong, angkuh", en: "proud, arrogant, haughty" } },
  { id: "calm", label: "Tenang", keywords: { id: "tenang, damai, santai", en: "calm, peaceful, relaxed" } },
  { id: "serious", label: "Serius", keywords: { id: "serius, sungguh-sungguh", en: "serious, earnest" } },
  { id: "thoughtful", label: "Berpikir", keywords: { id: "berpikir, merenungkan", en: "thoughtful, contemplating" } },
  { id: "sleepy", label: "Mengantuk", keywords: { id: "mengantuk, lelah, letih", en: "sleepy, tired, drowsy" } },
  { id: "excited", label: "Bersemangat", keywords: { id: "bersemangat, antusias", en: "excited, enthusiastic" } },
  { id: "bored", label: "Bosan", keywords: { id: "bosan, jenuh, lesu", en: "bored, weary, listless" } },
  { id: "disgusted", label: "Jijik", keywords: { id: "jijik, muak, mual", en: "disgusted, nauseated, repulsed" } },
  { id: "love", label: "Jatuh Cinta", keywords: { id: "jatuh cinta, kasmaran", en: "in love, smitten" } },
  { id: "flirty", label: "Menggoda", keywords: { id: "menggoda, merayu, genit", en: "flirty, seductive, coquettish" } },
  { id: "mysterious", label: "Misterius", keywords: { id: "misterius, enigmatik", en: "mysterious, enigmatic" } },
  { id: "playful", label: "Jahil", keywords: { id: "jahil, nakal, usil", en: "playful, mischievous, cheeky" } },
]

const stylePresets = {
  image: [
    {
      id: "photorealistic",
      label: "Fotorealistik",
      keywords: {
        id: "fotorealistik, sangat detail, resolusi 8K, fotografi profesional",
        en: "photorealistic, highly detailed, 8K resolution, professional photography",
      },
    },
    {
      id: "cyberpunk",
      label: "Cyberpunk",
      keywords: {
        id: "cyberpunk, cahaya neon, futuristik, atmosfer gelap, fokus tajam",
        en: "cyberpunk, neon glow, futuristic, dark atmosphere, sharp focus",
      },
    },
    {
      id: "anime",
      label: "Gaya Anime",
      keywords: {
        id: "gaya anime, manga, cel-shaded, warna cerah",
        en: "anime style, manga, cel-shaded, vibrant colors",
      },
    },
    {
      id: "renaissance-oil",
      label: "Lukisan Minyak Renaissance",
      keywords: {
        id: "lukisan minyak, gaya renaissance, tekstur sapuan kuas",
        en: "oil painting, renaissance style, brush stroke texture",
      },
    },
    {
      id: "watercolor",
      label: "Cat Air",
      keywords: {
        id: "cat air, pastel lembut, tepi basah",
        en: "watercolor, soft pastels, wet edges",
      },
    },
    {
      id: "pencil-sketch",
      label: "Sketsa Pensil",
      keywords: {
        id: "sketsa pensil, monokrom, arsiran silang",
        en: "pencil sketch, monochrome, cross hatching",
      },
    },
    {
      id: "ink-drawing",
      label: "Gambar Tinta",
      keywords: {
        id: "gambar tinta, kontras tinggi, stippling",
        en: "ink drawing, high contrast, stippling",
      },
    },
    {
      id: "digital-concept",
      label: "Seni Konsep Digital",
      keywords: {
        id: "seni digital, seni konsep, ilustrasi fantasi",
        en: "digital art, concept art, fantasy illustration",
      },
    },
    {
      id: "charcoal",
      label: "Gambar Arang",
      keywords: {
        id: "arang di atas kertas, bayangan kasar",
        en: "charcoal on paper, rough shading",
      },
    },
    {
      id: "cinematic-photo",
      label: "Fotografi Sinematik",
      keywords: {
        id: "foto sinematik, kedalaman bidang dangkal, lens flare",
        en: "cinematic photo, shallow depth of field, lens flare",
      },
    },
    {
      id: "vintage-film",
      label: "Foto Film Vintage",
      keywords: {
        id: "foto film vintage, tekstur berbintik, nada redup",
        en: "vintage film photo, grainy texture, muted tones",
      },
    },
    {
      id: "macro-photo",
      label: "Fotografi Makro",
      keywords: {
        id: "fotografi makro, ultra close-up, tekstur detail",
        en: "macro photography, ultra close-up, detailed textures",
      },
    },
    {
      id: "black-white",
      label: "Fotografi Hitam Putih",
      keywords: {
        id: "fotografi hitam putih, kontras tinggi",
        en: "black and white photography, high contrast",
      },
    },
    {
      id: "hdr-photo",
      label: "Fotografi HDR",
      keywords: {
        id: "foto HDR, detail hiperrealistik",
        en: "HDR photo, hyperrealistic details",
      },
    },
    {
      id: "long-exposure",
      label: "Long Exposure",
      keywords: {
        id: "long exposure, jejak cahaya, kota malam",
        en: "long exposure, light trails, night city",
      },
    },
    {
      id: "japanese-woodblock",
      label: "Ukiran Kayu Jepang",
      keywords: {
        id: "gaya ukiran kayu Jepang kuno",
        en: "ancient Japanese woodblock print style",
      },
    },
    {
      id: "mughal-miniature",
      label: "Miniatur Mughal",
      keywords: {
        id: "seni miniatur Mughal",
        en: "Mughal miniature art",
      },
    },
    {
      id: "art-nouveau",
      label: "Art Nouveau",
      keywords: {
        id: "Art Nouveau, ornamen bunga, garis mengalir",
        en: "Art Nouveau, floral ornamentation, flowing lines",
      },
    },
    {
      id: "baroque",
      label: "Lukisan Baroque",
      keywords: {
        id: "lukisan Baroque, pencahayaan dramatis",
        en: "Baroque painting, dramatic lighting",
      },
    },
    {
      id: "pop-art",
      label: "Pop Art",
      keywords: {
        id: "Pop Art, warna cerah, garis tebal",
        en: "Pop Art, bright colors, bold outlines",
      },
    },
    {
      id: "steampunk",
      label: "Steampunk",
      keywords: {
        id: "steampunk, roda gigi kuningan, estetika Victoria",
        en: "steampunk, brass gears, Victorian aesthetics",
      },
    },
    {
      id: "fantasy-magical",
      label: "Fantasi Magis",
      keywords: {
        id: "gaya fantasi, cahaya magis, elemen etereal",
        en: "fantasy style, magical glow, ethereal elements",
      },
    },
    {
      id: "dark-fantasy",
      label: "Fantasi Gelap",
      keywords: {
        id: "fantasi gelap, atmosfer suram, pencahayaan bayangan",
        en: "dark fantasy, grim atmosphere, shadowy lighting",
      },
    },
    {
      id: "sci-fi",
      label: "Sci-Fi",
      keywords: {
        id: "sci-fi, arsitektur futuristik, panel bercahaya",
        en: "sci-fi, futuristic architecture, glowing panels",
      },
    },
    {
      id: "pixel-art",
      label: "Pixel Art",
      keywords: {
        id: "pixel art, 8-bit, estetika game retro",
        en: "pixel art, 8-bit, retro game aesthetic",
      },
    },
    {
      id: "low-poly",
      label: "Low Poly 3D",
      keywords: {
        id: "seni 3D low poly, modeling bergaya",
        en: "low poly 3D art, stylized modeling",
      },
    },
    {
      id: "disney-pixar",
      label: "Gaya Disney/Pixar",
      keywords: {
        id: "gaya Disney/Pixar, mata besar, fitur berlebihan",
        en: "Disney/Pixar style, big eyes, exaggerated features",
      },
    },
    {
      id: "studio-ghibli",
      label: "Studio Ghibli",
      keywords: {
        id: "Studio Ghibli, pencahayaan lembut, suasana whimsical",
        en: "Studio Ghibli, soft lighting, whimsical mood",
      },
    },
    {
      id: "surrealism",
      label: "Surrealisme",
      keywords: {
        id: "surrealisme, elemen seperti mimpi, geometri mustahil",
        en: "surrealism, dreamlike elements, impossible geometry",
      },
    },
    {
      id: "geometric-abstract",
      label: "Abstrak Geometris",
      keywords: {
        id: "abstraksi geometris, bentuk dan warna berani",
        en: "geometric abstraction, bold shapes and colors",
      },
    },
    {
      id: "collage",
      label: "Gaya Kolase",
      keywords: {
        id: "gaya kolase, tekstur kertas, potong dan tempel",
        en: "collage style, paper texture, cut-and-paste",
      },
    },
    {
      id: "glitch-art",
      label: "Glitch Art",
      keywords: {
        id: "glitch art, visual terdistorsi, aberasi kromatik",
        en: "glitch art, distorted visuals, chromatic aberration",
      },
    },
    {
      id: "vaporwave",
      label: "Vaporwave",
      keywords: {
        id: "vaporwave, retro 90an, grid pastel",
        en: "vaporwave, 90s retro, pastel grid",
      },
    },
    {
      id: "natgeo",
      label: "National Geographic",
      keywords: {
        id: "gaya national geographic, fotografi satwa liar",
        en: "national geographic style, wildlife photography",
      },
    },
    {
      id: "botanical",
      label: "Ilustrasi Botani",
      keywords: {
        id: "ilustrasi botani, gambar ilmiah",
        en: "botanical illustration, scientific drawing",
      },
    },
    {
      id: "aerial-drone",
      label: "Foto Drone Udara",
      keywords: {
        id: "foto drone udara, lanskap luas",
        en: "aerial drone shot, wide landscape",
      },
    },
    {
      id: "underwater-photo",
      label: "Fotografi Bawah Air",
      keywords: {
        id: "fotografi bawah air, nada biru, sinar cahaya",
        en: "underwater photography, blue tones, light rays",
      },
    },
    {
      id: "melancholic",
      label: "Suasana Melankolis",
      keywords: {
        id: "suasana melankolis, palet warna dingin",
        en: "melancholic mood, cold color palette",
      },
    },
    {
      id: "romantic",
      label: "Pencahayaan Romantis",
      keywords: {
        id: "pencahayaan romantis, nada hangat, cahaya lembut",
        en: "romantic lighting, warm tones, soft glow",
      },
    },
    {
      id: "mysterious",
      label: "Atmosfer Misterius",
      keywords: {
        id: "atmosfer misterius, lingkungan berkabut",
        en: "mysterious atmosphere, foggy environment",
      },
    },
    {
      id: "dramatic-chiaroscuro",
      label: "Chiaroscuro Dramatis",
      keywords: {
        id: "pencahayaan dramatis, chiaroscuro, kontras tinggi",
        en: "dramatic lighting, chiaroscuro, high contrast",
      },
    },
  ],
  video: [
    {
      id: "cinematic",
      label: "Sinematik",
      keywords: {
        id: "sinematik, kualitas film, pencahayaan dramatis, gerakan kamera halus",
        en: "cinematic, film quality, dramatic lighting, smooth camera movement",
      },
    },
    {
      id: "documentary",
      label: "Dokumenter",
      keywords: {
        id: "gaya dokumenter, pencahayaan alami, kamera handheld, realistis",
        en: "documentary style, natural lighting, handheld camera, realistic",
      },
    },
    {
      id: "music-video",
      label: "Video Musik",
      keywords: {
        id: "potongan dinamis, editing ritmis, transisi kreatif, artistik",
        en: "dynamic cuts, rhythmic editing, creative transitions, artistic",
      },
    },
    {
      id: "commercial",
      label: "Komersial",
      keywords: {
        id: "kualitas komersial, pencahayaan terang, profesional, halus",
        en: "commercial quality, bright lighting, professional, polished",
      },
    },
  ],
  text: [
    {
      id: "creative",
      label: "Penulisan Kreatif",
      keywords: {
        id: "kreatif, imajinatif, deskriptif, narasi menarik",
        en: "creative, imaginative, descriptive, engaging narrative",
      },
    },
    {
      id: "technical",
      label: "Teknis",
      keywords: {
        id: "teknis, presisi, detail, profesional, informatif",
        en: "technical, precise, detailed, professional, informative",
      },
    },
    {
      id: "casual",
      label: "Kasual",
      keywords: {
        id: "percakapan, ramah, mudah didekati, mudah dipahami",
        en: "conversational, friendly, approachable, easy to understand",
      },
    },
    {
      id: "academic",
      label: "Akademik",
      keywords: {
        id: "akademik, ilmiah, berbasis penelitian, formal, analitis",
        en: "academic, scholarly, research-based, formal, analytical",
      },
    },
  ],
  code: [
    {
      id: "clean",
      label: "Kode Bersih",
      keywords: {
        id: "bersih, terdokumentasi dengan baik, efisien, praktik terbaik, mudah dipelihara",
        en: "clean, well-documented, efficient, best practices, maintainable",
      },
    },
    {
      id: "performance",
      label: "Performa",
      keywords: {
        id: "dioptimalkan, cepat, efisien, skalabel, performa tinggi",
        en: "optimized, fast, efficient, scalable, high-performance",
      },
    },
    {
      id: "beginner",
      label: "Ramah Pemula",
      keywords: {
        id: "sederhana, berkomentar baik, edukatif, langkah demi langkah",
        en: "simple, well-commented, educational, step-by-step",
      },
    },
  ],
}

const backgroundOptions = [
  { id: "auto", label: "Otomatis", description: "Biarkan AI memutuskan" },
  { id: "with-background", label: "Dengan Latar Belakang", description: "Gambar dengan background lengkap" },
  { id: "no-background", label: "Tanpa Latar Belakang", description: "PNG transparan tanpa background" },
]

const resolutionOptions = {
  image: [
    { id: "hd", label: "HD (1280x720)", description: "Standard high definition" },
    { id: "full-hd", label: "Full HD (1920x1080)", description: "Full high definition" },
    { id: "2k", label: "2K (2048x1080)", description: "Cinema standard" },
    { id: "4k", label: "4K (3840x2160)", description: "Ultra high definition" },
    { id: "8k", label: "8K (7680x4320)", description: "Super high resolution" },
    { id: "ultra-realistic", label: "Ultra Realistic", description: "Maximum detail and realism" },
  ],
  video: [
    { id: "hd", label: "HD (1280x720)", description: "Standard high definition" },
    { id: "full-hd", label: "Full HD (1920x1080)", description: "Full high definition" },
    { id: "4k", label: "4K (3840x2160)", description: "Ultra high definition" },
    { id: "8k", label: "8K (7680x4320)", description: "Super high resolution" },
    { id: "cinematic", label: "Cinematic Quality", description: "Film-grade quality" },
  ],
}

const cameraAngles = [
  { id: "eye-level", label: "Eye Level", description: "Natural human perspective" },
  { id: "low-angle", label: "Low Angle", description: "Camera below subject, looking up" },
  { id: "high-angle", label: "High Angle", description: "Camera above subject, looking down" },
  { id: "bird-eye", label: "Bird's Eye View", description: "Directly from above" },
  { id: "worm-eye", label: "Worm's Eye View", description: "Directly from below" },
  { id: "dutch-angle", label: "Dutch Angle", description: "Tilted camera angle" },
  { id: "over-shoulder", label: "Over the Shoulder", description: "Behind subject's shoulder" },
  { id: "close-up", label: "Close-up", description: "Very close to subject" },
  { id: "medium-shot", label: "Medium Shot", description: "Waist up view" },
  { id: "wide-shot", label: "Wide Shot", description: "Full body or environment" },
  { id: "extreme-wide", label: "Extreme Wide Shot", description: "Very wide environmental view" },
  { id: "macro", label: "Macro", description: "Extreme close-up detail" },
  { id: "aerial", label: "Aerial View", description: "From aircraft or drone" },
  { id: "ground-level", label: "Ground Level", description: "Camera at ground height" },
  { id: "profile", label: "Profile Shot", description: "Side view of subject" },
]

// Product photo specific suggestions
const getProductPhotoSuggestions = (productType?: string) => {
  const baseSuggestions = {
    settings: ["studio", "outdoor"],
    moods: ["minimalist", "cheerful"],
    times: ["golden-hour", "morning"],
    weathers: ["sunny", "cloudy"],
    styles: ["photorealistic", "cinematic-photo", "macro-photo"],
    resolutions: ["4k", "8k", "ultra-realistic"],
    cameraAngles: ["eye-level", "low-angle", "macro"],
    backgroundOptions: ["with-background", "no-background"],
    additionalKeywords: [
      "commercial photography",
      "product showcase",
      "clean composition",
      "professional lighting",
      "high-end marketing",
      "e-commerce ready",
      "advertising quality",
      "brand photography",
    ],
  }

  return baseSuggestions
}

// Auto-apply product photo optimizations
const applyProductPhotoOptimizations = (
  setters: any,
  setting: string,
  mood: string,
  selectedStyle: string,
  resolution: string,
  cameraAngle: string,
  backgroundOption: string,
) => {
  const suggestions = getProductPhotoSuggestions()

  // Auto-set optimal settings for product photography
  if (setting === "none") setters.setSetting("studio")
  if (mood === "none") setters.setMood("minimalist")
  if (selectedStyle === "none") setters.setSelectedStyle("photorealistic")
  if (resolution === "none") setters.setResolution("4k")
  if (cameraAngle === "none") setters.setCameraAngle("eye-level")
  if (backgroundOption === "auto") setters.setBackgroundOption("with-background")
}

export default function PromptGenerator() {
  const [input, setInput] = useState("")
  const [promptType, setPromptType] = useState("image")
  const [contentType, setContentType] = useState("none")
  const [selectedStyle, setSelectedStyle] = useState("none")
  const [aspectRatio, setAspectRatio] = useState("none")
  const [setting, setSetting] = useState("none")
  const [mood, setMood] = useState("none")
  const [time, setTime] = useState("none")
  const [weather, setWeather] = useState("none")
  const [accessory, setAccessory] = useState("none")
  const [emotion, setEmotion] = useState("none")
  const [backgroundOption, setBackgroundOption] = useState("auto")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [autoRefine, setAutoRefine] = useState(true)
  const [useEnglish, setUseEnglish] = useState(true)
  const [history, setHistory] = useState<PromptHistory[]>([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { toast } = useToast()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>("")
  const [resolution, setResolution] = useState("none")
  const [cameraAngle, setCameraAngle] = useState("none")

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  // Auto-optimize settings for product photography
  useEffect(() => {
    if (contentType === "product") {
      // Auto-suggest optimal settings for product photography
      if (setting === "none") setSetting("studio")
      if (mood === "none") setMood("minimalist")
      if (selectedStyle === "none") setSelectedStyle("photorealistic")
      if (resolution === "none") setResolution("4k")
      if (cameraAngle === "none") setCameraAngle("eye-level")

      // Show helpful toast
      toast({
        title: "🛍️ Mode Foto Produk Aktif",
        description: "Pengaturan telah dioptimalkan untuk fotografi produk komersial",
      })
    }
  }, [contentType, setting, mood, selectedStyle, resolution, cameraAngle])

  const generatePrompt = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Diperlukan",
        description: "Silakan masukkan ide atau deskripsi awal Anda.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const selectedOptions = {
        promptType,
        contentType: contentType !== "none" ? contentType : null,
        selectedStyle: selectedStyle !== "none" ? selectedStyle : null,
        aspectRatio: aspectRatio !== "none" ? aspectRatio : null,
        setting: setting !== "none" ? setting : null,
        mood: mood !== "none" ? mood : null,
        time: time !== "none" ? time : null,
        weather: weather !== "none" ? weather : null,
        accessory: accessory !== "none" ? accessory : null,
        emotion: emotion !== "none" ? emotion : null,
        backgroundOption: backgroundOption !== "auto" ? backgroundOption : null,
        resolution: resolution !== "none" ? resolution : null,
        cameraAngle: cameraAngle !== "none" ? cameraAngle : null,
        hasReferenceImage: referenceImage !== null,
        useEnglish,
        autoRefine,
      }

      const systemPrompt = `You are an expert AI prompt engineer specializing in commercial photography and product marketing. Your task is to create enhanced, detailed prompts for AI models based on user input and selected options.

User's original idea: "${input}"
Target language: ${useEnglish ? "English" : "Indonesian"}
Prompt type: ${promptType}

${
  contentType === "product"
    ? `
SPECIAL FOCUS: PRODUCT PHOTOGRAPHY FOR COMMERCIAL USE
This is a product photography request. Please enhance the prompt with:
- Commercial photography techniques and lighting
- Marketing and advertising appeal
- E-commerce and sales optimization
- Professional product presentation
- Brand-worthy quality specifications
- Consumer psychology elements that drive purchases
`
    : ""
}

Selected options:
${selectedOptions.contentType ? `- Content type: ${selectedOptions.contentType}` : ""}
${selectedOptions.selectedStyle ? `- Style: ${selectedOptions.selectedStyle}` : ""}
${selectedOptions.aspectRatio ? `- Aspect ratio: ${selectedOptions.aspectRatio}` : ""}
${selectedOptions.setting ? `- Setting: ${selectedOptions.setting}` : ""}
${selectedOptions.mood ? `- Mood: ${selectedOptions.mood}` : ""}
${selectedOptions.time ? `- Time: ${selectedOptions.time}` : ""}
${selectedOptions.weather ? `- Weather: ${selectedOptions.weather}` : ""}
${selectedOptions.accessory ? `- Accessory: ${selectedOptions.accessory}` : ""}
${selectedOptions.emotion ? `- Emotion: ${selectedOptions.emotion}` : ""}
${selectedOptions.backgroundOption ? `- Background: ${selectedOptions.backgroundOption}` : ""}
${selectedOptions.resolution ? `- Resolution: ${selectedOptions.resolution}` : ""}
${selectedOptions.cameraAngle ? `- Camera angle: ${selectedOptions.cameraAngle}` : ""}
${selectedOptions.hasReferenceImage ? "- Has reference image: User has uploaded a reference image for style/composition guidance" : ""}
${selectedOptions.autoRefine ? "- Auto refine: enabled" : ""}

Instructions:
1. If target language is English, translate the user's original idea to English and create the entire prompt in English
2. If target language is Indonesian, keep everything in Indonesian
3. Create a detailed, professional prompt that incorporates all the selected options

${
  contentType === "product"
    ? `
4. FOR PRODUCT PHOTOGRAPHY - Include these commercial elements:
   - Professional studio lighting (key light, fill light, rim light)
   - Commercial photography composition rules
   - Marketing appeal and visual psychology
   - Brand-quality presentation
   - E-commerce optimization (clear details, attractive presentation)
   - Sales-driving visual elements
   - Professional color grading and post-processing
   - Consumer trust and quality indicators
   - Advertising industry standards
`
    : `
4. For any option marked as "auto" or "otomatis", use your AI intelligence to choose the most appropriate setting based on the user's input and other selected options
`
}

5. If background option is "no-background", include specific instructions for transparent PNG output (e.g., "transparent background", "PNG with alpha channel", "isolated subject")
6. If background option is "with-background", ensure the prompt includes detailed background descriptions
7. Make the prompt suitable for ${promptType} generation
8. Include technical terms and specific details that will help AI models understand exactly what to create
9. The output should be a single, cohesive prompt ready to use with AI models

${
  contentType === "product"
    ? `
IMPORTANT: Since this is for product photography, emphasize commercial viability, marketing appeal, and sales conversion potential in your prompt enhancement.
`
    : ""
}

Please create an enhanced prompt based on these specifications:`

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD-jhGS07cwO3fFqwQ_u7hhlsIdBsHq0tQ`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: systemPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error("Invalid response from Gemini API")
      }

      const enhancedPrompt = data.candidates[0].content.parts[0].text.trim()
      setEnhancedPrompt(enhancedPrompt)

      const newHistoryItem: PromptHistory = {
        id: Date.now().toString(),
        original: input,
        enhanced: enhancedPrompt,
        type: promptType,
        style: selectedStyle,
        language: useEnglish ? "English" : "Indonesia",
        aspectRatio,
        setting,
        mood,
        time,
        weather,
        contentType,
        accessory,
        emotion,
        backgroundOption,
        resolution,
        cameraAngle,
        hasReferenceImage: referenceImage !== null,
        timestamp: new Date(),
      }
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)])

      toast({
        title: "Prompt Berhasil Dibuat!",
        description: "Prompt yang telah ditingkatkan siap digunakan.",
      })
    } catch (error) {
      console.error("Error generating prompt:", error)
      toast({
        title: "Pembuatan Gagal",
        description: "Terjadi kesalahan saat membuat prompt. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Tersalin!",
      description: "Prompt telah disalin ke clipboard.",
    })

    // Reset prompt setelah disalin
    setEnhancedPrompt("")
    setInput("")
    resetForm()
  }

  const deleteHistoryItem = (itemId: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== itemId))
    toast({
      title: "Riwayat Dihapus",
      description: "Item riwayat telah dihapus.",
    })
  }

  const copyHistoryPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    toast({
      title: "Tersalin!",
      description: "Prompt dari riwayat telah disalin ke clipboard.",
    })
  }

  const loadFromHistory = (item: PromptHistory) => {
    setInput(item.original)
    setPromptType(item.type)
    setContentType(item.contentType)
    setSelectedStyle(item.style)
    setUseEnglish(item.language === "English")
    setAspectRatio(item.aspectRatio)
    setSetting(item.setting)
    setMood(item.mood)
    setTime(item.time)
    setWeather(item.weather)
    setAccessory(item.accessory)
    setEmotion(item.emotion)
    setBackgroundOption(item.backgroundOption)
    setResolution(item.resolution || "none")
    setCameraAngle(item.cameraAngle || "none")
    setEnhancedPrompt(item.enhanced)
    // Note: Reference image cannot be restored from history
    setReferenceImage(null)
    setReferenceImagePreview("")
  }

  const resetForm = () => {
    setContentType("none")
    setSelectedStyle("none")
    setAspectRatio("none")
    setSetting("none")
    setMood("none")
    setTime("none")
    setWeather("none")
    setAccessory("none")
    setEmotion("none")
    setBackgroundOption("auto")
    setReferenceImage(null)
    setReferenceImagePreview("")
    setResolution("none")
    setCameraAngle("none")
  }

  const createNewPrompt = () => {
    setInput("")
    setEnhancedPrompt("")
    resetForm()
    toast({
      title: "Prompt Baru Dibuat",
      description: "Form telah direset untuk membuat prompt baru.",
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 10MB.",
          variant: "destructive",
        })
        return
      }

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format File Tidak Valid",
          description: "Hanya file gambar yang diperbolehkan.",
          variant: "destructive",
        })
        return
      }

      setReferenceImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setReferenceImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeReferenceImage = () => {
    setReferenceImage(null)
    setReferenceImagePreview("")
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-background" : "bg-gradient-to-br from-background via-background to-accent/5"}`}
    >
      {/* Header */}
      <header
        className={`border-b transition-colors duration-300 backdrop-blur-sm sticky top-0 z-50 ${isDarkMode ? "border-border bg-background/90" : "border-border bg-background/80"}`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <img src="/jarvx-logo.png" alt="JARVX Logo" className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="transition-colors duration-300 hover:bg-accent/20"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-primary" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:flex transition-colors duration-300 border-primary/20 hover:bg-primary/10"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Badge
                variant="secondary"
                className="hidden sm:flex transition-colors duration-300 bg-accent/20 text-accent-foreground"
              >
                <Star className="w-3 h-3 mr-1" />
                2.1k
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 transition-colors duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <TypingHero />

            {/* JARVX Gallery Section */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-foreground">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Galeri JARVX
                </CardTitle>
                <CardDescription className="text-sm sm:text-base text-muted-foreground">
                  Lihat contoh hasil AI yang dibuat dengan prompt berkualitas tinggi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 px-0 sm:px-6">
                <RollingGallery autoplay={true} pauseOnHover={true} isDarkMode={isDarkMode} />
                <div className="text-center mt-3 sm:mt-4">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    <span className="hidden sm:inline">Drag untuk memutar galeri • Hover untuk pause</span>
                    <span className="sm:hidden">Geser untuk memutar galeri</span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Prompt Type Selection */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <Label className="text-base font-medium block text-foreground">Pilih Jenis Generasi</Label>
                <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  {promptTypes.map((type) => {
                    const Icon = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => {
                          setPromptType(type.id)
                          resetForm()
                        }}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          promptType === type.id
                            ? "border-primary bg-primary/10 electric-glow"
                            : "border-border hover:border-primary/50 bg-card hover:bg-accent/5"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 mb-2 ${
                            promptType === type.id ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <div className="font-medium text-sm text-foreground">{type.label}</div>
                        <div className="text-xs mt-1 text-muted-foreground">{type.description}</div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Main Input */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <Label
                  htmlFor="input"
                  className="text-base font-medium block mb-3 px-3 py-2 rounded-lg bg-accent/10 text-foreground"
                >
                  Deskripsikan Ide Anda
                </Label>
                <Textarea
                  id="input"
                  placeholder="contoh: penari api di malam hari, tema fantasi"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[120px] resize-none focus:border-primary focus:ring-primary/20 bg-background border-border"
                />
              </CardContent>
            </Card>

            {/* Reference Image Upload - Only for image and video */}
            {(promptType === "image" || promptType === "video") && (
              <Card className="tech-card border-primary/20 shadow-lg">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <Label className="text-base font-medium block mb-3 px-3 py-2 rounded-lg bg-accent/10 text-foreground">
                    Gambar Referensi (Opsional)
                  </Label>
                  <p className="text-sm mb-4 text-muted-foreground">
                    Upload gambar sebagai referensi untuk gaya, komposisi, atau elemen visual yang diinginkan
                  </p>

                  {!referenceImagePreview ? (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="reference-image-upload"
                      />
                      <label
                        htmlFor="reference-image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-border hover:border-primary/50 bg-accent/5 hover:bg-accent/10"
                      >
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Klik untuk upload gambar referensi</p>
                        <p className="text-xs mt-1 text-muted-foreground">PNG, JPG, JPEG (Max 10MB)</p>
                      </label>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={referenceImagePreview || "/placeholder.svg"}
                        alt="Reference"
                        className="w-full h-48 object-cover rounded-lg border border-border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={removeReferenceImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>✓ Gambar referensi berhasil diupload</p>
                        <p className="text-xs mt-1">
                          AI akan menggunakan gambar ini sebagai panduan gaya dan komposisi
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Product Photography Tips - Only show when product is selected */}
            {contentType === "product" && (
              <Card className="tech-card border-accent/30 shadow-lg bg-gradient-to-br from-accent/5 to-primary/5">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-accent-foreground">
                    <span className="text-xl">🛍️</span>
                    Tips Foto Produk Komersial
                  </CardTitle>
                  <CardDescription className="text-accent-foreground/80">
                    Pengaturan telah dioptimalkan untuk fotografi produk yang menarik pembeli
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="space-y-3 text-sm text-accent-foreground">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-2">
                        <span className="text-accent">💡</span>
                        <div>
                          <p className="font-medium">Pencahayaan Studio</p>
                          <p className="text-xs opacity-80">3-point lighting untuk hasil profesional</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">📐</span>
                        <div>
                          <p className="font-medium">Komposisi Bersih</p>
                          <p className="text-xs opacity-80">Fokus pada produk tanpa distraksi</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-accent">🎯</span>
                        <div>
                          <p className="font-medium">Appeal Marketing</p>
                          <p className="text-xs opacity-80">Visual yang mendorong pembelian</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-primary">⚡</span>
                        <div>
                          <p className="font-medium">Kualitas E-commerce</p>
                          <p className="text-xs opacity-80">Siap untuk platform penjualan</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-accent/10">
                      <p className="text-xs font-medium mb-1">💼 Contoh deskripsi yang efektif:</p>
                      <p className="text-xs italic opacity-90">
                        "Smartphone flagship terbaru dengan layar premium, ditampilkan dengan pencahayaan studio yang
                        elegan untuk katalog e-commerce"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Options */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  {/* Content Type */}
                  {(promptType === "image" || promptType === "video") && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-foreground">
                        {promptType === "image" ? (
                          <Camera className="w-4 h-4 text-primary" />
                        ) : (
                          <Video className="w-4 h-4 text-primary" />
                        )}
                        Jenis {promptType === "image" ? "Gambar" : "Video"}
                      </Label>
                      <Select value={contentType} onValueChange={setContentType}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Tidak Ada</SelectItem>
                          <SelectItem value="auto">Otomatis</SelectItem>
                          {(contentTypes[promptType as keyof typeof contentTypes] || []).map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Style */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium px-3 py-2 rounded-lg bg-accent/10 text-foreground">
                      Preset Gaya
                    </Label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Pilih gaya" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Tidak Ada</SelectItem>
                        <SelectItem value="auto">Otomatis</SelectItem>
                        {(stylePresets[promptType as keyof typeof stylePresets] || []).map((style) => (
                          <SelectItem key={style.id} value={style.id}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Aspect Ratio */}
                  {(promptType === "image" || promptType === "video") && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 text-foreground">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Rasio Aspek
                      </Label>
                      <Select value={aspectRatio} onValueChange={setAspectRatio}>
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder="Pilih rasio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Tidak Ada</SelectItem>
                          <SelectItem value="auto">Otomatis</SelectItem>
                          {(aspectRatios[promptType as keyof typeof aspectRatios] || []).map((ratio) => (
                            <SelectItem key={ratio.id} value={ratio.id}>
                              <div>
                                <div className="font-medium">{ratio.label}</div>
                                <div className="text-sm text-muted-foreground">{ratio.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Advanced Options Toggle */}
                <div className="border-t border-border pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full justify-between hover:bg-accent/10 text-foreground"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Opsi Lanjutan
                    </span>
                    {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>

                  {showAdvanced && (
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                        {/* Setting */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                            <MapPin className="w-3 h-3 text-primary" />
                            Tempat
                          </Label>
                          <Select value={setting} onValueChange={setSetting}>
                            <SelectTrigger className="h-8 text-sm bg-background border-border">
                              <SelectValue placeholder="Tidak Ada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tidak Ada</SelectItem>
                              <SelectItem value="auto">Otomatis</SelectItem>
                              {settings.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Mood */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                            <Palette className="w-3 h-3 text-primary" />
                            Suasana
                          </Label>
                          <Select value={mood} onValueChange={setMood}>
                            <SelectTrigger className="h-8 text-sm bg-background border-border">
                              <SelectValue placeholder="Tidak Ada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tidak Ada</SelectItem>
                              <SelectItem value="auto">Otomatis</SelectItem>
                              {moods.map((m) => (
                                <SelectItem key={m.id} value={m.id}>
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Time */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                            <Clock className="w-3 h-3 text-primary" />
                            Waktu
                          </Label>
                          <Select value={time} onValueChange={setTime}>
                            <SelectTrigger className="h-8 text-sm bg-background border-border">
                              <SelectValue placeholder="Tidak Ada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tidak Ada</SelectItem>
                              <SelectItem value="auto">Otomatis</SelectItem>
                              {times.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Weather */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                            <Cloud className="w-3 h-3 text-primary" />
                            Cuaca
                          </Label>
                          <Select value={weather} onValueChange={setWeather}>
                            <SelectTrigger className="h-8 text-sm bg-background border-border">
                              <SelectValue placeholder="Tidak Ada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tidak Ada</SelectItem>
                              <SelectItem value="auto">Otomatis</SelectItem>
                              {weathers.map((w) => (
                                <SelectItem key={w.id} value={w.id}>
                                  {w.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Accessory */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                            <Sparkles className="w-3 h-3 text-primary" />
                            Aksesoris
                          </Label>
                          <Select value={accessory} onValueChange={setAccessory}>
                            <SelectTrigger className="h-8 text-sm bg-background border-border">
                              <SelectValue placeholder="Tidak Ada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tidak Ada</SelectItem>
                              <SelectItem value="auto">Otomatis</SelectItem>
                              {accessories.map((a) => (
                                <SelectItem key={a.id} value={a.id}>
                                  {a.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Emotion */}
                        <div className="space-y-2">
                          <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                            <ImageIcon className="w-3 h-3 text-primary" />
                            Emosi
                          </Label>
                          <Select value={emotion} onValueChange={setEmotion}>
                            <SelectTrigger className="h-8 text-sm bg-background border-border">
                              <SelectValue placeholder="Tidak Ada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Tidak Ada</SelectItem>
                              <SelectItem value="auto">Otomatis</SelectItem>
                              {emotions.map((e) => (
                                <SelectItem key={e.id} value={e.id}>
                                  {e.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Background Option - Only for image */}
                        {promptType === "image" && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                              <ImageIcon className="w-3 h-3 text-primary" />
                              Latar Belakang
                            </Label>
                            <Select value={backgroundOption} onValueChange={setBackgroundOption}>
                              <SelectTrigger className="h-8 text-sm bg-background border-border">
                                <SelectValue placeholder="Otomatis" />
                              </SelectTrigger>
                              <SelectContent>
                                {backgroundOptions.map((option) => (
                                  <SelectItem key={option.id} value={option.id}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Resolution - Only for image and video */}
                        {(promptType === "image" || promptType === "video") && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                              <Monitor className="w-3 h-3 text-primary" />
                              Resolusi
                            </Label>
                            <Select value={resolution} onValueChange={setResolution}>
                              <SelectTrigger className="h-8 text-sm bg-background border-border">
                                <SelectValue placeholder="Tidak Ada" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Tidak Ada</SelectItem>
                                <SelectItem value="auto">Otomatis</SelectItem>
                                {(resolutionOptions[promptType as keyof typeof resolutionOptions] || []).map((res) => (
                                  <SelectItem key={res.id} value={res.id}>
                                    <div>
                                      <div className="font-medium">{res.label}</div>
                                      <div className="text-xs text-muted-foreground">{res.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Camera Angle - Only for image and video */}
                        {(promptType === "image" || promptType === "video") && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium flex items-center gap-1 px-2 py-1 rounded bg-accent/10 text-foreground">
                              <Camera className="w-3 h-3 text-primary" />
                              Sudut Kamera
                            </Label>
                            <Select value={cameraAngle} onValueChange={setCameraAngle}>
                              <SelectTrigger className="h-8 text-sm bg-background border-border">
                                <SelectValue placeholder="Tidak Ada" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">Tidak Ada</SelectItem>
                                <SelectItem value="auto">Otomatis</SelectItem>
                                {cameraAngles.map((angle) => (
                                  <SelectItem key={angle.id} value={angle.id}>
                                    <div>
                                      <div className="font-medium">{angle.label}</div>
                                      <div className="text-xs text-muted-foreground">{angle.description}</div>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4 text-primary" />
                      <Switch id="use-english" checked={useEnglish} onCheckedChange={setUseEnglish} />
                      <Label htmlFor="use-english" className="text-sm font-medium text-foreground">
                        English
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <Switch id="auto-refine" checked={autoRefine} onCheckedChange={setAutoRefine} />
                      <Label htmlFor="auto-refine" className="text-sm font-medium text-foreground">
                        AI Enhancement
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:gap-3">
                  <Button
                    onClick={generatePrompt}
                    disabled={isLoading}
                    className="w-full electric-gradient hover:opacity-90 text-white py-3 rounded-xl font-medium electric-pulse"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Memproses...
                      </div>
                    ) : (
                      <>
                        Buat Prompt
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={createNewPrompt}
                    className="w-full hover:bg-accent/10 border-border"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Buat Prompt Baru
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Prompt Output */}
            {enhancedPrompt && (
              <Card className="tech-card border-accent/30 shadow-lg">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                    <Sparkles className="w-5 h-5 text-accent" />
                    Prompt yang Ditingkatkan
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Salin dan gunakan prompt ini di model AI pilihan Anda
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                  <div className="relative">
                    <Textarea
                      value={enhancedPrompt}
                      readOnly
                      className="min-h-[120px] resize-none font-mono text-sm bg-background border-border"
                    />
                    <Button
                      size="sm"
                      onClick={() => copyToClipboard(enhancedPrompt)}
                      className="absolute top-3 right-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* History */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-foreground">
                  <History className="w-5 h-5 text-muted-foreground" />
                  Riwayat Prompt
                </CardTitle>
                <CardDescription className="text-muted-foreground">Akses prompt yang dibuat sebelumnya</CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-border transition-colors hover:bg-accent/5"
                      >
                        <div
                          className="cursor-pointer p-2 -m-2 rounded transition-colors"
                          onClick={() => loadFromHistory(item)}
                        >
                          <p className="font-medium line-clamp-2 text-foreground">{item.original}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.type}
                            </Badge>
                            {item.contentType === "product" && (
                              <Badge variant="outline" className="text-xs">
                                🛍️ Produk
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 mt-2 sm:mt-3 pt-2 border-t border-border">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              copyHistoryPrompt(item.enhanced)
                            }}
                            className="flex-1 h-7 sm:h-8 text-xs border-border hover:bg-accent/10"
                          >
                            <Copy className="w-3 h-3 mr-1" />
                            <span className="sm:inline">Salin</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteHistoryItem(item.id)
                            }}
                            className="h-7 sm:h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-border"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-center py-8 text-muted-foreground">Belum ada riwayat prompt</p>
                )}
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg text-foreground">Tips untuk Prompt yang Lebih Baik</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Spesifik tentang gaya, suasana, dan komposisi</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Sertakan detail teknis seperti pencahayaan dan sudut kamera</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Gunakan kata kunci kualitas seperti "resolusi tinggi" atau "detail"</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <p>Gunakan prompt negatif untuk menghindari elemen yang tidak diinginkan</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Settings Preview */}
            <Card className="tech-card border-primary/20 shadow-lg">
              <CardHeader className="pb-2 sm:pb-4">
                <CardTitle className="text-lg text-foreground">Pengaturan Saat Ini</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis Prompt:</span>
                    <span className="font-medium text-foreground">
                      {promptTypes.find((t) => t.id === promptType)?.label}
                    </span>
                  </div>
                  {contentType !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Jenis Konten:</span>
                      <span className="font-medium text-foreground">
                        {
                          contentTypes[promptType as keyof typeof contentTypes]?.find((c) => c.id === contentType)
                            ?.label
                        }
                      </span>
                    </div>
                  )}
                  {selectedStyle !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gaya:</span>
                      <span className="font-medium text-foreground">
                        {
                          stylePresets[promptType as keyof typeof stylePresets]?.find((s) => s.id === selectedStyle)
                            ?.label
                        }
                      </span>
                    </div>
                  )}
                  {aspectRatio !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rasio Aspek:</span>
                      <span className="font-medium text-foreground">
                        {
                          aspectRatios[promptType as keyof typeof aspectRatios]?.find((a) => a.id === aspectRatio)
                            ?.label
                        }
                      </span>
                    </div>
                  )}
                  {setting !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tempat:</span>
                      <span className="font-medium text-foreground">
                        {settings.find((s) => s.id === setting)?.label}
                      </span>
                    </div>
                  )}
                  {mood !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Suasana:</span>
                      <span className="font-medium text-foreground">{moods.find((m) => m.id === mood)?.label}</span>
                    </div>
                  )}
                  {time !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Waktu:</span>
                      <span className="font-medium text-foreground">{times.find((t) => t.id === time)?.label}</span>
                    </div>
                  )}
                  {weather !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cuaca:</span>
                      <span className="font-medium text-foreground">
                        {weathers.find((w) => w.id === weather)?.label}
                      </span>
                    </div>
                  )}
                  {accessory !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aksesoris:</span>
                      <span className="font-medium text-foreground">
                        {accessories.find((a) => a.id === accessory)?.label}
                      </span>
                    </div>
                  )}
                  {emotion !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Emosi:</span>
                      <span className="font-medium text-foreground">
                        {emotions.find((e) => e.id === emotion)?.label}
                      </span>
                    </div>
                  )}
                  {backgroundOption !== "auto" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latar Belakang:</span>
                      <span className="font-medium text-foreground">
                        {backgroundOptions.find((b) => b.id === backgroundOption)?.label}
                      </span>
                    </div>
                  )}
                  {resolution !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resolusi:</span>
                      <span className="font-medium text-foreground">
                        {
                          resolutionOptions[promptType as keyof typeof resolutionOptions]?.find(
                            (r) => r.id === resolution,
                          )?.label
                        }
                      </span>
                    </div>
                  )}
                  {cameraAngle !== "none" && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sudut Kamera:</span>
                      <span className="font-medium text-foreground">
                        {cameraAngles.find((c) => c.id === cameraAngle)?.label}
                      </span>
                    </div>
                  )}
                  {referenceImage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gambar Referensi:</span>
                      <span className="font-medium text-foreground">✓ Terupload</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Support/Donation Card */}
            <Card className="tech-card border-accent/30 shadow-lg bg-gradient-to-br from-accent/5 to-primary/5 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                <div className="w-full h-full bg-gradient-to-br from-accent to-primary rounded-full transform translate-x-8 -translate-y-8"></div>
              </div>

              <CardHeader className="pb-2 sm:pb-4 relative">
                <CardTitle className="flex items-center gap-2 text-lg text-accent-foreground">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl">☕</span>
                    <span>Traktir saya kopi</span>
                  </div>
                </CardTitle>
                <CardDescription className="text-accent-foreground/80">
                  Dukung pengembangan JARVX agar terus berkembang dan gratis untuk semua
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6 pt-0 relative">
                <div className="space-y-3 text-sm text-accent-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-accent">💡</span>
                    <p>Setiap dukungan Anda membantu menambah fitur baru dan server yang lebih cepat</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-primary">🚀</span>
                    <p>100% gratis, tanpa iklan, dan akan selalu begitu!</p>
                  </div>
                </div>

                <a
                  href="https://saweria.co/alienrektz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 electric-gradient text-white shadow-lg electric-glow"
                >
                  <span className="text-lg">☕</span>
                  <span>Traktir Kopi</span>
                  <span className="text-xs opacity-80">(Rp 5.000)</span>
                </a>

                <p className="text-xs text-center mt-2 text-accent-foreground/60">
                  Terima kasih atas dukungan Anda! 🙏
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
