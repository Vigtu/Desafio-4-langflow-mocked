import { uploadImageToBytescale } from './uploadImage';
import { analyzeImage } from './analyzeImage';
import { mockAnalyzeImage, mockGetRecommendations, mockTryOnAPI } from '@/components/mockAnalyzeImage';
import { getRecommendations as apiGetRecommendations } from './recommendationAPI';
import { callTryOnAPI } from './tryOnAPI';

const USE_MOCK = true; // Define como false para usar a API real

export const uploadImage = uploadImageToBytescale;

export const analyze = USE_MOCK ? mockAnalyzeImage : analyzeImage;
export const getRecommendations = USE_MOCK ? mockGetRecommendations : apiGetRecommendations;
export const tryOn = USE_MOCK ? mockTryOnAPI : callTryOnAPI;
