import { uploadImageToBytescale } from './uploadImage';
import { analyzeImage } from './analyzeImage';
import { mockAnalyzeImage } from '@/components/mockAnalyzeImage';

const USE_MOCK = true; // Define como false para usar a API real

export const uploadImage = uploadImageToBytescale;

export const analyze = USE_MOCK ? mockAnalyzeImage : analyzeImage;
