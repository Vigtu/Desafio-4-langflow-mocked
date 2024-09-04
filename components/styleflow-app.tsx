'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Camera, Loader2, ArrowRight, User, Lock, Mail, Palette, Shirt, Watch, Info, Sun, Snowflake, Leaf, Cloud, ChevronUp, ChevronDown, DollarSign, Eye, ShoppingBag } from 'lucide-react'
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

// Mock API functions (replace with actual API calls in production)
const mockColorAnalysisAPI = async (imageFile: File) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    colorPalette: ['#F5E6D3', '#D4AF37', '#8FBC8F', '#E6D7C3', '#7AA37A'],
    season: 'Outono',
    characteristics: 'Tons de pele quentes, cores de cabelo ricas (ruivo, castanho) e cores de olhos profundas (castanho, avelã). Contraste natural médio a alto.',
    tips: 'Abrace cores quentes e ricas como vermelhos profundos, laranjas e amarelos dourados. Sobreponha texturas para profundidade e interesse em seus looks.'
  };
};

const mockRecommendationAPI = async (colorAnalysis: any, filters: any) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return [
    { id: 1, name: 'Blusa Elegante', price: 79.99, image: '/placeholder.svg?height=400&width=300&text=Blusa+Elegante' },
    { id: 2, name: 'Suéter Casual', price: 59.99, image: '/placeholder.svg?height=400&width=300&text=Suéter+Casual' },
    { id: 3, name: 'Jaqueta Formal', price: 129.99, image: '/placeholder.svg?height=400&width=300&text=Jaqueta+Formal' },
    { id: 4, name: 'Cardigan Aconchegante', price: 89.99, image: '/placeholder.svg?height=400&width=300&text=Cardigan+Aconchegante' },
    { id: 5, name: 'Top Estiloso', price: 49.99, image: '/placeholder.svg?height=400&width=300&text=Top+Estiloso' },
    { id: 6, name: 'Blazer Chique', price: 109.99, image: '/placeholder.svg?height=400&width=300&text=Blazer+Chique' },
  ];
};

const mockVirtualTryOnAPI = async (userImage: string, clothingImage: string) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '/placeholder.svg?height=600&width=400&text=Prova+Virtual';
};

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
  const [colorAnalysis, setColorAnalysis] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false)
  const [virtualTryOnImage, setVirtualTryOnImage] = useState('')
  const [isVirtualTryOnLoading, setIsVirtualTryOnLoading] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 200])
  const [occasion, setOccasion] = useState('')
  const [detailedOccasion, setDetailedOccasion] = useState('')
  const [location, setLocation] = useState('')
  const [weather, setWeather] = useState('')
  const [time, setTime] = useState('')
  const [exactTime, setExactTime] = useState('')
  const [preferencesComplete, setPreferencesComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isLoggedIn) {
      setShowLoginForm(true)
      return
    }

    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const analysis = await mockColorAnalysisAPI(file);
      setColorAnalysis(analysis);
      setPhotoUploaded(true)
      setStage('analysis')
      setActiveTab('analysis')
      setAnalysisComplete(true)
      toast({
        title: "Análise de foto concluída",
        description: "Seu perfil de estilo está pronto!",
      })
    } catch (error) {
      console.error('Erro durante a análise de cores:', error);
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
        description: "Por favor, complete suas preferências de estilo antes de ver as recomendações.",
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
    setRecommendations([])
    setPreferencesComplete(false)
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso.",
    })
  }

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
  }

  const handleVirtualTryOn = async () => {
    if (!selectedProduct) return

    setShowVirtualTryOn(true)
    setIsVirtualTryOnLoading(true)
    try {
      const tryOnImage = await mockVirtualTryOnAPI('/placeholder.svg?height=600&width=400&text=Imagem+do+Usuário', selectedProduct.image);
      setVirtualTryOnImage(tryOnImage);
    } catch (error) {
      console.error('Erro durante a prova virtual:', error);
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
    setPreferencesComplete(true)
    const filters = {
      priceRange,
      occasion,
      detailedOccasion,
      location,
      weather,
      time,
      exactTime
    }
    try {
      const newRecommendations = await mockRecommendationAPI(colorAnalysis, filters);
      setRecommendations(newRecommendations);
      setActiveTab('recommendations')
      toast({
        title: "Preferências salvas",
        description: "Suas recomendações personalizadas estão prontas.",
      })
    } catch (error) {
      console.error('Erro ao gerar recomendações:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar recomendações. Por favor, tente novamente.",
        variant: "destructive",
      })
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
                        <img src="/placeholder.svg" alt="Imagem do usuário enviada" className="w-full h-full object-cover" />
                      </Card>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, rotate: 5 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="flex flex-col justify-center"
                    >
                      <h3 className="text-xl font-light mb-4 text-stone-800">Sua Paleta de Cores Personalizada</h3>
                      <div className="flex flex-wrap justify-center gap-4 mb-4">
                        {colorAnalysis.colorPalette.map((color: string, index: number) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="w-12 h-12 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37]"
                                  style={{ backgroundColor: color }}
                                  aria-label={`Amostra de cor ${index + 1}`}
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Código da cor: {color}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                      <p className="text-sm text-stone-600">Passe o mouse sobre uma cor para ver seu código</p>
                    </motion.div>
                  </div>
                  <Card className="p-6 mb-8">
                    <h3 className="text-2xl font-light mb-4 text-stone-800 flex items-center">
                      {colorAnalysis.season === 'Inverno' && <Snowflake className="w-6 h-6 text-blue-500 mr-2" />}
                      {colorAnalysis.season === 'Primavera' && <Cloud className="w-6 h-6 text-pink-500 mr-2" />}
                      {colorAnalysis.season === 'Verão' && <Sun className="w-6 h-6 text-yellow-500 mr-2" />}
                      {colorAnalysis.season === 'Outono' && <Leaf className="w-6 h-6 text-orange-500 mr-2" />}
                      <span>Sua Estação: {colorAnalysis.season}</span>
                    </h3>
                    <p className="text-stone-700 mb-4">{colorAnalysis.characteristics}</p>
                    <h4 className="text-xl font-light mb-2 text-stone-800">Dicas Sazonais:</h4>
                    <p className="text-stone-700">{colorAnalysis.tips}</p>
                  </Card>
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
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="price">
                <AccordionTrigger>Faixa de Preço</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Label htmlFor="price-range" className="text-stone-700 mb-2 block">Faixa de Preço: R${priceRange[0]} - R${priceRange[1]}</Label>
                    <Slider
                      id="price-range"
                      min={0}
                      max={500}
                      step={10}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-4"
                    />
                    <div className="flex justify-between space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setPriceRange([0, 50])}
                        className="flex-1 bg-white hover:bg-[#f5e6d3] border-[#d4af37] text-stone-800"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Até R$50
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setPriceRange([50, 100])}
                        className="flex-1 bg-white hover:bg-[#f5e6d3] border-[#d4af37] text-stone-800"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        R$50-R$100
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setPriceRange([100, 500])}
                        className="flex-1 bg-white hover:bg-[#f5e6d3] border-[#d4af37] text-stone-800"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Acima de R$100
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="occasion">
                <AccordionTrigger>Ocasião</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Label htmlFor="occasion" className="text-stone-700">Ocasião</Label>
                    <Select value={occasion} onValueChange={setOccasion}>
                      <SelectTrigger id="occasion">
                        <SelectValue placeholder="Selecione uma ocasião" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="sport">Esportivo</SelectItem>
                        <SelectItem value="evening">Noite</SelectItem>
                        <SelectItem value="party">Festa</SelectItem>
                        <SelectItem value="work">Trabalho</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="detailed-occasion"
                      placeholder="Especifique uma ocasião detalhada (ex: Primeiro Encontro, Reunião de Negócios)"
                      value={detailedOccasion}
                      onChange={(e) => setDetailedOccasion(e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="location">
                <AccordionTrigger>Localização</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Label htmlFor="location" className="text-stone-700">Localização</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Selecione uma localização" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indoor">Ambiente Interno</SelectItem>
                        <SelectItem value="outdoor">Ambiente Externo</SelectItem>
                        <SelectItem value="beach">Praia</SelectItem>
                        <SelectItem value="city">Cidade</SelectItem>
                        <SelectItem value="countryside">Campo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="weather">
                <AccordionTrigger>Clima</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Label htmlFor="weather" className="text-stone-700">Clima</Label>
                    <Select value={weather} onValueChange={setWeather}>
                      <SelectTrigger id="weather">
                        <SelectValue placeholder="Selecione as condições climáticas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="warm">Quente</SelectItem>
                        <SelectItem value="cold">Frio</SelectItem>
                        <SelectItem value="humid">Úmido</SelectItem>
                        <SelectItem value="dry">Seco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="time">
                <AccordionTrigger>Horário</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <Label htmlFor="time" className="text-stone-700">Horário do Dia</Label>
                    <Select value={time} onValueChange={setTime}>
                      <SelectTrigger id="time">
                        <SelectValue placeholder="Selecione o horário do dia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Manhã</SelectItem>
                        <SelectItem value="afternoon">Tarde</SelectItem>
                        <SelectItem value="evening">Noite</SelectItem>
                        <SelectItem value="all-day">O Dia Todo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="exact-time"
                      type="time"
                      value={exactTime}
                      onChange={(e) => setExactTime(e.target.value)}
                      placeholder="Especifique um horário exato (opcional)"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handlePreferencesSubmit} 
                className="bg-[#d4af37] hover:bg-[#b8963c] text-white px-8 py-3 text-lg rounded-full"
              >
                Ver Recomendações
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card className="p-8 bg-white shadow-lg rounded-2xl min-h-[calc(100vh-300px)]">
            <h2 className="text-3xl font-light mb-8 text-center text-stone-800">Suas Recomendações Personalizadas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendations.map((item, index) => (
                <motion.div
                  key={item.id}
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
              onClick={() => window.open('https://example.com/product', '_blank')}
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
            onClick={() => window.open('https://example.com/product', '_blank')}
            className="bg-[#d4af37] hover:bg-[#b8963c] text-white"
          >
            Comprar Item
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}