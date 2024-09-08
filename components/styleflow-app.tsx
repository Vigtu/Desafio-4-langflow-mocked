'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Loader2, ArrowRight, User, Lock, Mail, Palette, Shirt, Watch, Info, Sun, Snowflake, Leaf, Cloud, ChevronUp, ChevronDown, DollarSign, Eye, ShoppingBag, Settings, Calendar, MapPin, Home, Palmtree, Umbrella, Building2, Mountain, Sunrise, Sunset, Clock, Wind, Dumbbell, Moon, Music, Briefcase, Coffee, Droplets, X, Palette as PaletteIcon, Contrast as ContrastIcon, Droplet as DropletIcon, Sun as SunIcon, Shirt as ShirtIcon, Scissors as ScissorsIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { toast } from "@/components/ui/use-toast"

import { uploadImage, analyze, getRecommendations, tryOn } from '../api'
import { ColorAnalysis, APIRecommendation, NamedColor } from "@/api/types"
import { usePreferences } from '@/hooks/usePreferences'
import { mockImagesTryOn } from '@/utils/mockImagesTryOn'

// Componente de loading simples
const SimpleLoading = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
  </div>
);

const ColorPalette: React.FC<{ colors: NamedColor[], title: string }> = ({ colors, title }) => (
  <div className="mb-4 flex flex-col items-center">
    <h4 className="text-sm font-medium text-stone-700 mb-2">{title}</h4>
    <div className="flex justify-center gap-4 w-full">
      {colors.map((color, colorIndex) => (
        <TooltipProvider key={colorIndex}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                style={{ backgroundColor: color.hex }}
                aria-label={`${title} cor ${colorIndex + 1}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{color.name} | {color.hex}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  </div>
);

export default function StyleflowApp() {
  const [stage, setStage] = useState('upload')
  const [activeTab, setActiveTab] = useState('upload')
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [photoUploaded, setPhotoUploaded] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showRegisterForm, setShowRegisterForm] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [colorAnalysis, setColorAnalysis] = useState<ColorAnalysis | null>(null)
  const [apiRecommendations, setApiRecommendations] = useState<APIRecommendation[]>([])
  const [selectedProduct, setSelectedProduct] = useState<APIRecommendation | null>(null)
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false)
  const [virtualTryOnImage, setVirtualTryOnImage] = useState('')
  const [isVirtualTryOnLoading, setIsVirtualTryOnLoading] = useState(false)
  const [preferencesComplete, setPreferencesComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPreferences, setShowPreferences] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [showSeasonalInfo, setShowSeasonalInfo] = useState(true)
  const { preferences, updatePreference, getPreferencesString, skipQuiz } = usePreferences()
  const [isLoading, setIsLoading] = useState(false)
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [isChatSent, setIsChatSent] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const placeholders = [
    "Look casual para o escritório",
    "Outfit para casamento, orçamento médio",
    "Roupa elegante para jantar importante",
    "Estilo confortável para viagem longa"
  ]

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    const interval = setInterval(() => {
      setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleChatSend = async () => {
    if (chatMessage.trim()) {
      setIsChatSent(true)
      setIsLoading(true)
      try {
        const preferencesString = chatMessage.trim()
        const filteredResponse = await getRecommendations(JSON.stringify(colorAnalysis), preferencesString)
        const extractedRecommendations = extractRecommendationsFromResponse(filteredResponse)
        setApiRecommendations(extractedRecommendations)
        setPreferencesComplete(true)
        setActiveTab('recommendations')
        toast({
          title: "Preferências enviadas",
          description: "Suas preferências foram registradas com sucesso.",
        })
      } catch (error) {
        console.error('Erro ao gerar recomendações:', error)
        toast({
          title: "Erro",
          description: "Falha ao gerar recomendações. Por favor, tente novamente.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        setTimeout(() => setIsTransitioning(true), 1000)
      }
    }
  }

  const handleChatSkip = async () => {
    setIsLoading(true)
    try {
      const preferencesString = " " // String vazia para preferências
      const filteredResponse = await getRecommendations(JSON.stringify(colorAnalysis), preferencesString)
      const extractedRecommendations = extractRecommendationsFromResponse(filteredResponse)
      setApiRecommendations(extractedRecommendations)
      setPreferencesComplete(true)
      setActiveTab('recommendations')
      toast({
        title: "Preferências ignoradas",
        description: "Você optou por pular esta etapa.",
      })
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error)
      toast({
        title: "Erro",
        description: "Falha ao gerar recomendações. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setIsTransitioning(true)
    }
  }

  // Adicionando um useEffect para logar as recomendações
  useEffect(() => {
    console.log('apiRecommendations atualizado:', apiRecommendations)
    console.log('Número de recomendações:', apiRecommendations.length)
    console.log('Active tab:', activeTab)
    console.log('Preferences complete:', preferencesComplete)
  }, [apiRecommendations, activeTab, preferencesComplete])

  const toggleSeasonalInfo = () => {
    setShowSeasonalInfo(!showSeasonalInfo)
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      setShowLoginForm(true)
      return
    }

    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      console.log('Iniciando processo de upload...');
      const uploadResult = await uploadImage(file)
      console.log('Resultado do upload:', JSON.stringify(uploadResult, null, 2));
      const imageUrl = uploadResult.fileUrl
      setUploadedImageUrl(imageUrl)
      
      console.log('URL da imagem hospedada:', imageUrl);

      const analysis = await analyze(imageUrl)
      console.log('Resultado da análise:', JSON.stringify(analysis, null, 2));
      setColorAnalysis(analysis)

      setPhotoUploaded(true)
      setStage('analysis')
      setActiveTab('analysis')
      setAnalysisComplete(true)
      setShowSeasonalInfo(true)

      toast({
        title: "Análise de foto concluída",
        description: "Seu perfil de estilo está pronto!",
      })
    } catch (error) {
      console.error('Erro durante o upload ou análise:', error)
      toast({
        title: "Erro",
        description: "Falha ao analisar a foto. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleTabChange = (value: string) => {
    if (value === 'analysis' && !photoUploaded) return
    if (value === 'preferences' && !analysisComplete) return
    if (value === 'recommendations' && !preferencesComplete) {
      toast({
        title: "Ação necessária",
        description: "Por favor, complete suas preferências de estilo antes de ver as recomendaçes.",
      })
      return
    }
    setActiveTab(value)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setShowLoginForm(false)
    toast({
      title: "Login realizado com sucesso",
      description: "Bem-vindo de volta!",
    })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
    setShowRegisterForm(false)
    toast({
      title: "Registro realizado com sucesso",
      description: "Bem-vindo ao Styleflow!",
    })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setAnalysisComplete(false)
    setPhotoUploaded(false)
    setActiveTab('upload')
    setStage('upload')
    setColorAnalysis(null)
    setApiRecommendations([])
    setPreferencesComplete(false)
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
  }

  const handleProductClick = (product: APIRecommendation) => {
    setSelectedProduct(product)
  }

  const handleVirtualTryOn = async () => {
    if (!selectedProduct || !uploadedImageUrl) {
      toast({
        title: "Erro",
        description: "Imagem do usuário ou produto não disponível.",
        variant: "destructive",
      });
      return;
    }

    setShowVirtualTryOn(true);
    setIsVirtualTryOnLoading(true);
    try {
      console.log("Iniciando prova virtual com:", uploadedImageUrl, selectedProduct.image);
      
      const tryOnResult = await tryOn(uploadedImageUrl, selectedProduct.image);
      
      if (tryOnResult) {
        setVirtualTryOnImage(tryOnResult);
        toast({
          title: "Prova virtual concluída",
          description: "Sua imagem de prova virtual está pronta!",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar a imagem de prova virtual.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro durante a prova virtual:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar a prova virtual. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsVirtualTryOnLoading(false);
    }
  };

  const handlePreferencesSubmit = async () => {
    setIsLoading(true);
    setPreferencesComplete(true);
    const preferencesString = getPreferencesString();
    console.log('Preferências do usuário:', preferencesString);
    
    try {
      const filteredResponse = await getRecommendations(JSON.stringify(colorAnalysis), preferencesString);
      console.log("Resposta filtrada da API de recomendações:", filteredResponse);
      
      // Processar a resposta e extrair as recomendações
      const extractedRecommendations = extractRecommendationsFromResponse(filteredResponse);
      
      // Atualizar o estado com as novas recomendações
      setApiRecommendations(extractedRecommendations);
      
      if (extractedRecommendations.length > 0) {
        setActiveTab('recommendations');
        toast({
          title: "Recomendações prontas",
          description: `${extractedRecommendations.length} itens recomendados para você.`,
        });
      } else {
        toast({
          title: "Sem recomendações",
          description: "Não foi possível gerar recomendações. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar recomendações. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractRecommendationsFromResponse = (response: any): APIRecommendation[] => {
    console.log("Resposta completa da API:", response)

    if (!response || typeof response !== 'object') {
      console.error('Resposta da API inválida')
      return []
    }

    const recommendations: APIRecommendation[] = []

    // Função auxiliar para adicionar um item à lista de recomendações
    const addRecommendation = (item: any) => {
      if (item && item.nome && item.link && item.imagem && item.preco) {
        recommendations.push({
          name: item.nome,
          link: item.link,
          image: item.imagem,
          price: parseFloat(item.preco)
        })
      }
    }

    // Adicionar itens do look completo
    if (response.look_completo) {
      addRecommendation(response.look_completo.peca_principal)
      addRecommendation(response.look_completo.calcado)
      addRecommendation(response.look_completo.acessorio)
      if (response.look_completo.peca_complementar) {
        addRecommendation(response.look_completo.peca_complementar)
      }
    }

    // Adicionar alternativas
    if (response.alternativas) {
      Object.values(response.alternativas).forEach(addRecommendation)
    }

    console.log("Recomendações extraídas:", recommendations)
    return recommendations
  }

  const handleContinueToRecommendations = async () => {
    setIsLoading(true)
    skipQuiz()
    setPreferencesComplete(true)
    const preferencesString = " " // String vazia para preferências
    console.log('Preferências do usuário:', preferencesString)
    
    try {
      const filteredResponse = await getRecommendations(JSON.stringify(colorAnalysis), preferencesString)
      console.log("Resposta filtrada da API de recomendações:", filteredResponse)
      
      // Processar a resposta e extrair as recomendações
      const extractedRecommendations: APIRecommendation[] = extractRecommendationsFromResponse(filteredResponse)
      
      setApiRecommendations(extractedRecommendations)
      setActiveTab('recommendations')
      toast({
        title: "Recomendações prontas",
        description: "Suas recomendações estão prontas para visualização.",
      })
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error)
      toast({
        title: "Erro",
        description: "Falha ao gerar recomendações. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressValue = () => {
    if (activeTab === 'upload') return 25
    if (activeTab === 'analysis') return 50
    if (activeTab === 'preferences') return 75
    if (activeTab === 'recommendations') return 100
    return 0
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 p-4 md:p-8">
      <header className="mb-8 flex justify-between items-center bg-[#f5e6d3] p-4 md:p-6 rounded-lg shadow-md">
        <div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-2 text-stone-800">STYLEFLOW</h1>
          <p className="text-xs md:text-sm text-stone-600">Descubra Seu Estilo Pessoal</p>
        </div>
        {isLoggedIn ? (
          <Button onClick={handleLogout} variant="outline" className="bg-white hover:bg-[#e6d7c3] border-[#d4af37] text-stone-800 transition-colors duration-300">
            Sair
          </Button>
        ) : (
          <div className="space-x-2">
            <Button onClick={() => setShowLoginForm(true)} variant="outline" className="bg-white hover:bg-[#e6d7c3] border-[#d4af37] text-stone-800 transition-colors duration-300">
              Entrar
            </Button>
            <Button onClick={() => setShowRegisterForm(true)} className="bg-[#d4af37] hover:bg-[#b8963c] text-white transition-colors duration-300">
              Registrar
            </Button>
          </div>
        )}
      </header>

      <AnimatePresence>
        {showLoginForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <Card className="w-full max-w-md p-6 bg-white shadow-lg">
              <h2 className="text-2xl font-light mb-6 text-stone-800">Entrar</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-stone-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 border-stone-300 focus:border-[#d4af37] focus:ring-[#d4af37]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-stone-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                    <Input
                      id="login-password"
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 border-stone-300 focus:border-[#d4af37] focus:ring-[#d4af37]"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#d4af37] hover:bg-[#b8963c] text-white transition-colors duration-300">
                  Entrar
                </Button>
              </form>
              <Button onClick={() => setShowLoginForm(false)} variant="link" className="mt-4 text-stone-600 hover:text-stone-800">
                Cancelar
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRegisterForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <Card className="w-full max-w-md p-6 bg-white shadow-lg">
              <h2 className="text-2xl font-light mb-6 text-stone-800">Registrar</h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name" className="text-stone-700">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                    <Input
                      id="register-name"
                      type="text"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-10 border-stone-300 focus:border-[#d4af37] focus:ring-[#d4af37]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-stone-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                    <Input
                      id="register-email"
                      type="email"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10 border-stone-300 focus:border-[#d4af37] focus:ring-[#d4af37]"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-stone-700">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                    <Input
                      id="register-password"
                      type="password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10 border-stone-300 focus:border-[#d4af37] focus:ring-[#d4af37]"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-[#d4af37] hover:bg-[#b8963c] text-white transition-colors duration-300">
                  Registrar
                </Button>
              </form>
              <Button onClick={() => setShowRegisterForm(false)} variant="link" className="mt-4 text-stone-600 hover:text-stone-800">
                Cancelar
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl mx-auto mb-8">
        <Progress value={getProgressValue()} className="w-full" />
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#f5e6d3] p-1 rounded-full shadow-md">
          <TabsTrigger value="upload" className="rounded-full transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md text-stone-700 hover:text-stone-900">Enviar</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!photoUploaded} className="rounded-full transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md text-stone-700 hover:text-stone-900">Análise</TabsTrigger>
          <TabsTrigger value="preferences" disabled={!analysisComplete} className="rounded-full transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md text-stone-700 hover:text-stone-900">Preferências</TabsTrigger>
          <TabsTrigger value="recommendations" disabled={!preferencesComplete} className="rounded-full transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md text-stone-700 hover:text-stone-900">Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card className="p-8 flex flex-col items-center justify-center min-h-[calc(100vh-300px)] bg-white shadow-lg rounded-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Camera className="w-24 h-24 mb-8 mx-auto text-[#d4af37]" />
              <h2 className="text-3xl font-light mb-4 text-stone-800">Envie Sua Foto</h2>
              <p className="text-stone-600 mb-8 max-w-md mx-auto">Descubra seu estilo perfeito enviando uma foto clara de você</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                ref={fileInputRef}
                className="hidden"
                aria-label="Enviar foto"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={()=>fileInputRef.current?.click()}
                      disabled={isUploading || !isLoggedIn}
                      className="bg-[#a5c7a5] hover:bg-[#8fbc8f] text-white px-8 py-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Upload className="mr-2 h-5 w-5" />
                      )}
                      {isUploading ? 'Enviando...' : 'Enviar Foto'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isLoggedIn ? 'Clique para enviar sua foto' : 'Você precisa fazer login para enviar uma foto'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-sm text-stone-500 mt-4">
                {isLoggedIn ? 'Clique para selecionar uma foto' : 'Você precisa fazer login para enviar uma foto'}
              </p>
            </motion.div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          <Card className="p-8 bg-white shadow-lg rounded-2xl min-h-[calc(100vh-300px)]">
            <AnimatePresence mode="wait">
              {stage === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <Loader2 className="w-16 h-16 animate-spin mx-auto text-[#d4af37] mb-6" />
                  <p className="text-stone-600 text-lg">Analisando seu estilo único...</p>
                </motion.div>
              )}
              {stage === 'analysis' && colorAnalysis && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-8">
                    <h2 className="text-3xl font-light text-stone-800">Análise de Imagem Concluída</h2>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-2 text-stone-500 hover:text-stone-700 transition-colors duration-200"
                            onClick={() => setShowDetailedAnalysis(true)}
                          >
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Expandir análise detalhada</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <motion.div
                      initial={{ opacity: 0, rotate: -5 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <Card className="p-4 aspect-square overflow-hidden transform rotate-3 shadow-md">
                        {uploadedImageUrl ? (
                          <img src={uploadedImageUrl} alt="Imagem do usuário enviada" className="w-full h-full object-cover" />
                        ) : (
                          <img src="/placeholder.svg" alt="Imagem do usuário enviada" className="w-full h-full object-cover" />
                        )}
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, rotate: 5 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex flex-col justify-center"
                    >
                      <h3 className="text-xl font-light mb-4 text-stone-800">Suas Paletas de Cores Personalizadas</h3>
                      <div className="space-y-6 w-full">
                        {[
                          { title: "Cores Neutras", colors: colorAnalysis.colorPaletteNeutras },
                          { title: "Cores Básicas", colors: colorAnalysis.colorPaletteBasicas },
                          { title: "Cores de Destaque", colors: colorAnalysis.colorPaletteDestaque },
                        ].map((palette, index) => (
                          <ColorPalette key={index} colors={palette.colors} title={palette.title} />
                        ))}
                      </div>
                      <p className="text-sm text-stone-500 mt-4">Passe o mouse sobre uma cor para ver seu nome e código</p>
                      <Button
                        onClick={toggleSeasonalInfo}
                        className="mt-4 bg-[#d4af37] hover:bg-[#b8963c] text-white transition-colors duration-300"
                      >
                        {showSeasonalInfo ? 'Ver Recomendações' : 'Ver Detalhes Sazonais'}
                      </Button>
                    </motion.div>
                  </div>
                  <AnimatePresence mode="wait">
                    {showSeasonalInfo ? (
                      <motion.div
                        key="seasonal-info"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="p-6 mb-8">
                          <h3 className="text-2xl font-light mb-4 text-stone-800 flex items-center justify-center">
                            {colorAnalysis.season === 'Inverno' && <Snowflake className="w-6 h-6 text-blue-500 mr-2" />}
                            {colorAnalysis.season === 'Primavera' && <Cloud className="w-6 h-6 text-pink-500 mr-2" />}
                            {colorAnalysis.season === 'Verão' && <Sun className="w-6 h-6 text-yellow-500 mr-2" />}
                            {colorAnalysis.season === 'Outono' && <Leaf className="w-6 h-6 text-orange-500 mr-2" />}
                            <span>Sua Estação: {colorAnalysis.season}</span>
                          </h3>
                          <p className="text-stone-700 mb-4">{colorAnalysis.seasonSummary}</p>
                          <h4 className="text-xl font-light mb-2 text-stone-800">Características:</h4>
                          <ul className="list-disc list-inside mb-4">
                            <li>Pele: {colorAnalysis.characteristics.pele}</li>
                            <li>Olhos: {colorAnalysis.characteristics.olhos}</li>
                            <li>Cabelo: {colorAnalysis.characteristics.cabelo}</li>
                          </ul>
                          <h4 className="text-lg font-semibold mb-2">Recomendações:</h4>
                          <p className="text-stone-700">{colorAnalysis.recommendationsSummary}</p>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="recommendations"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
                      >
                        <Card className="p-4 col-span-2">
                          <h3 className="text-xl font-light mb-4 text-stone-800 flex items-center justify-center">
                            <Palette className="mr-2 text-[#d4af37]" />
                            Combinações de Cores Recomendadas
                          </h3>
                          {colorAnalysis && colorAnalysis.combinacoes_cores && colorAnalysis.combinacoes_cores.length > 0 ? (
                            <ul className="space-y-2">
                              {colorAnalysis.combinacoes_cores.map((combinacao, index) => (
                                <li key={index} className="text-stone-700">
                                  <strong>{combinacao.descricao}:</strong>{' '}
                                  {combinacao.cores.join(', ')}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-stone-700">Nenhuma combinação de cores disponível.</p>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button className="mt-4 bg-[#d4af37] hover:bg-[#b8963c] text-white transition-colors duration-300">
                                Ver Combinações de Cores Detalhadas
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Suas Combinações de Cores Personalizadas</DialogTitle>
                                <DialogDescription>
                                  Explore estas combinações de cores criadas especialmente para você.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                {colorAnalysis && colorAnalysis.combinacoes_cores && colorAnalysis.combinacoes_cores.length > 0 ? (
                                  colorAnalysis.combinacoes_cores.map((combinacao, index) => (
                                    <Card key={index} className="p-4">
                                      <p><strong>{combinacao.descricao}:</strong>{' '}
                                      {combinacao.cores.join(', ')}</p>
                                    </Card>
                                  ))
                                ) : (
                                  <p>Nenhuma combinação de cores disponível.</p>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </Card>
                        <Card className="p-4">
                          <h3 className="text-xl font-light mb-4 text-stone-800 flex items-center justify-center">
                            <Watch className="mr-2 text-[#d4af37]" />
                            Cores a Evitar
                          </h3>
                          <ul className="space-y-2">
                            {colorAnalysis.colorsToAvoid.map((color, index) => (
                              <li key={index} className="text-stone-700">{color}</li>
                            ))}
                          </ul>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mb-8"
                  >
                    <p className="text-stone-700 text-lg mb-4">Seu perfil de estilo personalizado está pronto!</p>
                    <Button
                      onClick={() => setActiveTab('preferences')}
                      className="bg-[#8fbc8f] hover:bg-[#7aa37a] text-white px-8 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg text-lg"
                    >
                      Definir Suas Preferências de Estilo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showDetailedAnalysis && colorAnalysis && (
                <motion.div
                  initial={{ opacity: 0, x: '100%' }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: '100%' }}                  transition={{ type: 'tween', duration: 0.5 }}
                  className="fixed inset-y-0 right-0 w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white shadow-lg z-50 overflow-hidden"
                >
                  <div className="h-full flex flex-col">
                    <div className="p-6 bg-[#f5e6d3] shadow-md">
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-light text-stone-800">Análise Detalhada</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowDetailedAnalysis(false)}
                          className="text-stone-500 hover:text-stone-700 transition-colors duration-200"
                        >
                          <X className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="flex-grow">
                      <div className="p-6 space-y-8">
                        <section>
                          <h4 className="text-xl font-medium mb-4 flex items-center text-stone-800">
                            <Palette className="mr-2 text-[#d4af37]" />
                            Paleta de Cores
                          </h4>
                          <div className="space-y-4">
                            {[
                              { type: 'Neutras', colors: colorAnalysis.colorPaletteNeutras },
                              { type: 'Básicas', colors: colorAnalysis.colorPaletteBasicas },
                              { type: 'Destaque', colors: colorAnalysis.colorPaletteDestaque }
                            ].map(({ type, colors }, index) => (
                              <div key={index} className="bg-stone-100 p-4 rounded-lg">
                                <h5 className="text-sm font-medium text-stone-700 mb-2">Cores {type}</h5>
                                <div className="flex space-x-2">
                                  {colors.map((color, colorIndex) => (
                                    <div
                                      key={colorIndex}
                                      className="w-12 h-12 rounded-full shadow-md"
                                      style={{ backgroundColor: color.hex }}
                                      title={`${color.name} | ${color.hex}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                        <Separator className="bg-stone-200" />
                        <section>
                          <h4 className="text-xl font-medium mb-4 flex items-center text-stone-800">
                            <Sun className="mr-2 text-[#d4af37]" />
                            Estação
                          </h4>
                          <div className="bg-stone-100 p-4 rounded-lg">
                            <p className="text-lg font-medium text-stone-700 mb-2">{colorAnalysis.season}</p>
                            <p className="text-stone-600 mb-4">{colorAnalysis.seasonSummary}</p>
                            <div className="mt-4 space-y-2">
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-stone-700 w-20">Pele:</span>
                                <span className="text-sm text-stone-600">{colorAnalysis.characteristics.pele}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-stone-700 w-20">Olhos:</span>
                                <span className="text-sm text-stone-600">{colorAnalysis.characteristics.olhos}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium text-stone-700 w-20">Cabelo:</span>
                                <span className="text-sm text-stone-600">{colorAnalysis.characteristics.cabelo}</span>
                              </div>
                            </div>
                            <div className="mt-4">
                              <h5 className="text-md font-medium text-stone-700 mb-2">Recomendações:</h5>
                              <p className="text-stone-600">{colorAnalysis.recommendationsSummary}</p>
                            </div>
                          </div>
                        </section>
                        <Separator className="bg-stone-200" />
                        <section>
                          <h4 className="text-xl font-medium mb-4 flex items-center text-stone-800">
                            <Shirt className="mr-2 text-[#d4af37]" />
                            Recomendações de Estilo
                          </h4>
                          <div className="bg-stone-100 p-4 rounded-lg space-y-4">
                            {Object.entries(colorAnalysis.recommendations).map(([category, recs], index) => (
                              <div key={index}>
                                <h5 className="text-sm font-medium text-stone-700 mb-2 capitalize">{category}</h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {Array.isArray(recs) ? recs.map((rec, recIndex) => (
                                    <li key={recIndex} className="text-stone-600">{rec}</li>
                                  )) : (
                                    <li className="text-stone-600">{String(recs)}</li>
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                    </ScrollArea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div
              className={`fixed inset-0 bg-black transition-opacity duration-500 ${
                showDetailedAnalysis ? 'opacity-50' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setShowDetailedAnalysis(false)}
            ></div>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-8 bg-white shadow-lg rounded-2xl min-h-[calc(100vh-300px)] flex flex-col justify-center items-center">
            <h2 className="text-4xl font-light mb-12 text-center text-stone-800">Suas Preferências</h2>
            
            <AnimatePresence>
              {!showPreferences && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center space-x-6 mb-12"
                >
                  <Button
                    onClick={() => setShowPreferences(true)}
                    className="bg-[#d4af37] hover:bg-[#b8963c] text-white px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                  >
                    <Settings className="mr-3 h-6 w-6" />
                    Personalizar Minhas Preferências
                  </Button>
                  <Button
                    onClick={handleContinueToRecommendations}
                    className="bg-[#8fbc8f] hover:bg-[#7aa37a] text-white px-8 py-4 text-lg rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <SimpleLoading />
                    ) : (
                      <>
                        Continuar e Ver Recomendações
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showPreferences && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-2xl"
                >
                  <div className="flex flex-col items-center space-y-8">
                    <motion.p 
                      className="text-center text-stone-600 mb-6 text-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Descreva brevemente o estilo ou ocasião que você busca.
                    </motion.p>
                    <motion.div 
                      className="w-full relative"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    >
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder={placeholders[placeholderIndex]}
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="pr-32 pl-6 py-8 text-xl rounded-full border-2 border-[#d4af37] focus:ring-2 focus:ring-[#8fbc8f] transition-all duration-300"
                        disabled={isChatSent}
                      />
                      <Button
                        onClick={handleChatSend}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 bg-[#d4af37] hover:bg-[#b8963c] text-white text-lg rounded-full transition-all duration-300 h-[calc(100%-8px)]"
                        disabled={isChatSent || isLoading}
                      >
                        {isLoading ? <SimpleLoading /> : 'Enviar'}
                      </Button>
                    </motion.div>
                    {!isChatSent && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Button
                          onClick={handleChatSkip}
                          variant="outline"
                          className="mt-6 border-2 border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-all duration-300 text-lg px-8 py-4 rounded-full"
                          disabled={isLoading}
                        >
                          Pular esta etapa
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isTransitioning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 15 }}
                  className="flex flex-col items-center justify-center space-y-12 mt-16"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-2xl text-stone-600 text-center"
                  >
                    Preferências registradas com sucesso!
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <Button 
                      onClick={() => setActiveTab('recommendations')}
                      className="bg-[#d4af37] hover:bg-[#b8963c] text-white px-10 py-5 text-xl rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      Ver Recomendações
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="p-8 bg-white shadow-lg rounded-2xl min-h-[calc(100vh-300px)]">
            <h2 className="text-3xl font-light mb-8 text-center text-stone-800">Suas Recomendações Personalizadas</h2>
            {apiRecommendations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {apiRecommendations.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card 
                      className="overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-pointer relative"
                      onClick={() => handleProductClick(item)}
                    >
                      <div className="relative overflow-hidden bg-[#f3f3f3]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
                          >
                            <Eye className="text-white w-10 h-10" />
                          </motion.div>
                        </div>
                      </div>
                      <div className="p-4 bg-white">
                        <h3 className="font-light text-lg mb-2 text-stone-800">{item.name}</h3>
                        <p className="text-sm text-[#d4af37]">R${item.price.toFixed(2)}</p>
                      </div>
                      <motion.div 
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                      </motion.div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-stone-600">Nenhuma recomendação disponível no momento.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Explore este item ou experimente-o virtualmente.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <img
              src={selectedProduct?.image}
              alt={selectedProduct?.name}
              className="w-full h-64 object-cover rounded-lg"
            />
            <p className="text-2xl font-semibold text-[#d4af37]">
              R${selectedProduct?.price.toFixed(2)}
            </p>
          </div>
          <div className="flex justify-between">
            <Button
              onClick={() => window.open(selectedProduct?.link, '_blank')}
              className="bg-[#d4af37] hover:bg-[#b8963c] text-white"
            >
              Ver Produto
            </Button>
            <Button onClick={handleVirtualTryOn} variant="outline">
              Experimentar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVirtualTryOn} onOpenChange={setShowVirtualTryOn}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Prova Virtual</DialogTitle>
            <DialogDescription>
              Veja como este item fica em você!
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isVirtualTryOnLoading ? (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200 rounded-lg">
                <motion.div
                  animate={{
                    scale: [1, 2, 2, 1, 1],
                    rotate: [0, 0, 270, 270, 0],
                    borderRadius: ["20%", "20%", "50%", "50%", "20%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.2, 0.5, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="w-16 h-16 bg-[#d4af37]"
                />
              </div>
            ) : (
              <img
                src={virtualTryOnImage}
                alt="Prova Virtual"
                className="w-full h-auto rounded-lg"
              />
            )}
          </div>
          <Button
            onClick={() => selectedProduct && window.open(selectedProduct.link, '_blank')}
            className="bg-[#d4af37] hover:bg-[#b8963c] text-white"
          >
            Comprar Item
          </Button>
        </DialogContent>
      </Dialog>

      {isLoading && <SimpleLoading />}
    </div>
  )
}
