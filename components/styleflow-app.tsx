'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Loader2, ArrowRight, User, Lock, Mail, Palette, Shirt, Watch, Info, Sun, Snowflake, Leaf, Cloud, ChevronUp, ChevronDown, DollarSign, Eye, ShoppingBag, Settings, Calendar, MapPin, Home, Palmtree, Umbrella, Building2, Mountain, Sunrise, Sunset, Clock, Wind, Dumbbell, Moon, Music, Briefcase, Coffee, Droplets } from 'lucide-react'
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

import { uploadImageToBytescale, analyzeImage } from '../api'
import { ColorAnalysis, Recommendation, VirtualTryOnResult, APIRecommendation } from "@/api/types"
import { usePreferences } from '@/hooks/usePreferences'
import { getRecommendations } from '@/api/recommendationAPI'
import LoopEffect from '@/components/ui/LoopEffect'
import { callTryOnAPI } from '@/api/tryOnAPI'

// Componente de loading simples
const SimpleLoading = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d4af37]"></div>
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
  const [showSeasonalInfo, setShowSeasonalInfo] = useState(false)
  const { preferences, updatePreference, getPreferencesString, skipQuiz } = usePreferences()
  const [isLoading, setIsLoading] = useState(false)

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
      const uploadResult = await uploadImageToBytescale(file)
      console.log('Resultado do upload:', JSON.stringify(uploadResult, null, 2));
      const imageUrl = uploadResult.fileUrl
      setUploadedImageUrl(imageUrl)
      
      console.log('URL da imagem hospedada:', imageUrl);

      const analysis = await analyzeImage(imageUrl)
      console.log('Resultado da análise:', JSON.stringify(analysis, null, 2));
      setColorAnalysis(analysis)

      setPhotoUploaded(true)
      setStage('analysis')
      setActiveTab('analysis')
      setAnalysisComplete(true)

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
      })
      return
    }

    setShowVirtualTryOn(true)
    setIsVirtualTryOnLoading(true)
    try {
      console.log("Iniciando prova virtual com:", uploadedImageUrl, selectedProduct.image)
      
      // Garantir que as URLs estão corretas
      const userImageUrl = new URL(uploadedImageUrl).toString()
      const productImageUrl = new URL(selectedProduct.image).toString()

      const tryOnResult = await callTryOnAPI(userImageUrl, productImageUrl)
      console.log("Resultado da prova virtual:", tryOnResult)
      setVirtualTryOnImage(tryOnResult)
      toast({
        title: "Prova virtual concluída",
        description: "Sua imagem de prova virtual está pronta!",
      })
    } catch (error) {
      console.error('Erro durante a prova virtual:', error)
      toast({
        title: "Erro",
        description: "Falha ao gerar a prova virtual. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsVirtualTryOnLoading(false)
    }
  }

  const handlePreferencesSubmit = async () => {
    setIsLoading(true)
    setPreferencesComplete(true)
    const preferencesString = getPreferencesString()
    console.log('Preferências do usuário:', preferencesString)
    
    try {
      const filteredResponse = await getRecommendations(JSON.stringify(colorAnalysis), preferencesString)
      console.log("Resposta filtrada da API de recomendações:", filteredResponse)
      
      // Processar a resposta e extrair as recomendações
      const extractedRecommendations = extractRecommendationsFromResponse(filteredResponse)
      
      // Atualizar o estado com as novas recomendações
      setApiRecommendations(extractedRecommendations)
      
      if (extractedRecommendations.length > 0) {
        setActiveTab('recommendations')
        toast({
          title: "Recomendações prontas",
          description: `${extractedRecommendations.length} itens recomendados para você.`,
        })
      } else {
        toast({
          title: "Sem recomendações",
          description: "Não foi possível gerar recomendações. Tente novamente.",
          variant: "destructive",
        })
      }
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
                  <h2 className="text-3xl font-light mb-8 text-stone-800">Análise de Imagem Concluída</h2>
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
                          <div key={index} className="mb-4 flex flex-col items-center">
                            <h4 className="text-sm font-medium text-stone-700 mb-2">{palette.title}</h4>
                            <div className="flex justify-center gap-4 w-full">
                              {palette.colors.map((color, colorIndex) => (
                                <TooltipProvider key={colorIndex}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        className="w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                                        style={{ backgroundColor: color }}
                                        aria-label={`${palette.title} cor ${colorIndex + 1}`}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Código da cor: {color}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-stone-600 mt-4">Passe o mouse sobre uma cor para ver seu código</p>
                      <Button
                        onClick={toggleSeasonalInfo}
                        className="mt-4 bg-[#d4af37] hover:bg-[#b8963c] text-white transition-colors duration-300"
                      >
                        {showSeasonalInfo ? 'Ver Recomendações' : 'Ver Detalhes Sazonais'}
                      </Button>
                    </motion.div>
                  </div>
                  <AnimatePresence mode="wait">
                    {!showSeasonalInfo && (
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
                          {colorAnalysis && colorAnalysis.combinacoes_cores ? (
                            <ul className="space-y-2">
                              {colorAnalysis.combinacoes_cores.map((combinacao, index) => (
                                <li key={index} className="text-stone-700">
                                  {combinacao}
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
                                {colorAnalysis && colorAnalysis.combinacoes_cores ? (
                                  colorAnalysis.combinacoes_cores.map((combinacao, index) => (
                                    <Card key={index} className="p-4">
                                      <p>{combinacao}</p>
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
                    {showSeasonalInfo && (
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
                          <h4 className="text-lg font-semibold mb-2">Justificativa:</h4>
                          <p className="text-stone-700">{colorAnalysis.justification}</p>
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
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-8 bg-white shadow-lg rounded-2xl min-h-[calc(100vh-300px)]">
            <h2 className="text-3xl font-light mb-8 text-center text-stone-800">Preferências de Estilo</h2>
            
            <AnimatePresence>
              {!showPreferences && (
                <motion.div 
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center space-x-4 mb-8"
                >
                  <Button
                    onClick={() => setShowPreferences(true)}
                    className="bg-[#d4af37] hover:bg-[#b8963c] text-white px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    Personalizar Minhas Preferências
                  </Button>
                  <Button
                    onClick={handleContinueToRecommendations}
                    className="bg-[#8fbc8f] hover:bg-[#7aa37a] text-white px-6 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <SimpleLoading />
                    ) : (
                      <>
                        Continuar e Ver Recomendações
                        <ArrowRight className="ml-2 h-5 w-5" />
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
                >
                  <Accordion type="single" collapsible className="w-full mb-8">
                    <AccordionItem value="price">
                      <AccordionTrigger>
                        <DollarSign className="w-5 h-5 mr-2" />
                        Faixa de Preço
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Label htmlFor="price-range" className="text-stone-700 mb-2 block">
                            Faixa de Preço: R${preferences.priceRange[0]} - R${preferences.priceRange[1]}
                          </Label>
                          <Slider
                            id="price-range"
                            min={0}
                            max={500}
                            step={10}
                            value={preferences.priceRange}
                            onValueChange={(value) => updatePreference('priceRange', value)}
                            className="mb-4"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="occasion">
                      <AccordionTrigger>
                        <Calendar className="w-5 h-5 mr-2" />
                        Ocasião
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Label htmlFor="occasion" className="text-stone-700">Ocasião</Label>
                          <Select value={preferences.occasion} onValueChange={(value) => updatePreference('occasion', value)}>
                            <SelectTrigger id="occasion">
                              <SelectValue placeholder="Selecione uma ocasião" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casual">
                                <div className="flex items-center">
                                  <Coffee className="w-4 h-4 mr-2" />
                                  Casual
                                </div>
                              </SelectItem>
                              <SelectItem value="formal">
                                <div className="flex items-center">
                                  <Briefcase className="w-4 h-4 mr-2" />
                                  Formal
                                </div>
                              </SelectItem>
                              <SelectItem value="sport">
                                <div className="flex items-center">
                                  <Dumbbell className="w-4 h-4 mr-2" />
                                  Esportivo
                                </div>
                              </SelectItem>
                              <SelectItem value="evening">
                                <div className="flex items-center">
                                  <Moon className="w-4 h-4 mr-2" />
                                  Noite
                                </div>
                              </SelectItem>
                              <SelectItem value="party">
                                <div className="flex items-center">
                                  <Music className="w-4 h-4 mr-2" />
                                  Festa
                                </div>
                              </SelectItem>
                              <SelectItem value="work">
                                <div className="flex items-center">
                                  <Briefcase className="w-4 h-4 mr-2" />
                                  Trabalho
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="detailed-occasion"
                            placeholder="Especifique uma ocasião detalhada (ex: Primeiro Encontro, Reunião de Negócios)"
                            value={preferences.detailedOccasion}
                            onChange={(e) => updatePreference('detailedOccasion', e.target.value)}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="location">
                      <AccordionTrigger>
                        <MapPin className="w-5 h-5 mr-2" />
                        Localização
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Label htmlFor="location" className="text-stone-700">Localização</Label>
                          <Select value={preferences.location} onValueChange={(value) => updatePreference('location', value)}>
                            <SelectTrigger id="location">
                              <SelectValue placeholder="Selecione uma localização" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indoor">
                                <div className="flex items-center">
                                  <Home className="w-4 h-4 mr-2" />
                                  Ambiente Interno
                                </div>
                              </SelectItem>
                              <SelectItem value="outdoor">
                                <div className="flex items-center">
                                  <Palmtree className="w-4 h-4 mr-2" />
                                  Ambiente Externo
                                </div>
                              </SelectItem>
                              <SelectItem value="beach">
                                <div className="flex items-center">
                                  <Umbrella className="w-4 h-4 mr-2" />
                                  Praia
                                </div>
                              </SelectItem>
                              <SelectItem value="city">
                                <div className="flex items-center">
                                  <Building2 className="w-4 h-4 mr-2" />
                                  Cidade
                                </div>
                              </SelectItem>
                              <SelectItem value="countryside">
                                <div className="flex items-center">
                                  <Mountain className="w-4 h-4 mr-2" />
                                  Campo
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="weather">
                      <AccordionTrigger>
                        <Cloud className="w-5 h-5 mr-2" />
                        Clima
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Label htmlFor="weather" className="text-stone-700">Clima</Label>
                          <Select value={preferences.weather} onValueChange={(value) => updatePreference('weather', value)}>
                            <SelectTrigger id="weather">
                              <SelectValue placeholder="Selecione as condições climáticas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="warm">
                                <div className="flex items-center">
                                  <Sun className="w-4 h-4 mr-2" />
                                  Quente
                                </div>
                              </SelectItem>
                              <SelectItem value="cold">
                                <div className="flex items-center">
                                  <Snowflake className="w-4 h-4 mr-2" />
                                  Frio
                                </div>
                              </SelectItem>
                              <SelectItem value="humid">
                                <div className="flex items-center">
                                  <Droplets className="w-4 h-4 mr-2" />
                                  Úmido
                                </div>
                              </SelectItem>
                              <SelectItem value="dry">
                                <div className="flex items-center">
                                  <Wind className="w-4 h-4 mr-2" />
                                  Seco
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="time">
                      <AccordionTrigger>
                        <Clock className="w-5 h-5 mr-2" />
                        Horário
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Label htmlFor="time" className="text-stone-700">Horário do Dia</Label>
                          <Select value={preferences.time} onValueChange={(value) => updatePreference('time', value)}>
                            <SelectTrigger id="time">
                              <SelectValue placeholder="Selecione o horário do dia" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="morning">
                                <div className="flex items-center">
                                  <Sunrise className="w-4 h-4 mr-2" />
                                  Manhã
                                </div>
                              </SelectItem>
                              <SelectItem value="afternoon">
                                <div className="flex items-center">
                                  <Sun className="w-4 h-4 mr-2" />
                                  Tarde
                                </div>
                              </SelectItem>
                              <SelectItem value="evening">
                                <div className="flex items-center">
                                  <Sunset className="w-4 h-4 mr-2" />
                                  Noite
                                </div>
                              </SelectItem>
                              <SelectItem value="all-day">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  O Dia Todo
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            id="exact-time"
                            type="time"
                            value={preferences.exactTime}
                            onChange={(e) => updatePreference('exactTime', e.target.value)}
                            placeholder="Especifique um horário exato (opcional)"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center"
                  >
                    <Button 
                      onClick={handlePreferencesSubmit} 
                      className="bg-[#d4af37] hover:bg-[#b8963c] text-white px-8 py-3 text-lg rounded-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <SimpleLoading />
                      ) : (
                        <>
                          Ver Recomendações
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
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
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
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