export interface AdHook {
  text: string;
  type: string;
  conversionRating: number;
}

export interface AdScene {
  id: number;
  section: string;
  visual: string;
  audio: string;
  textOverlay: string;
}

export interface VideoScript {
  title: string;
  duration: number;
  scenes: AdScene[];
}

export interface SocialPost {
  caption: string;
  hashtags: string[];
}

export interface PlatformAd {
  platformName: string;
  hooks: AdHook[];
  videoScript: VideoScript;
  socialPost: SocialPost;
  targetingTips: string[];
}

export interface ABComparison {
  hookStrategyComparison: string;
  scriptFlowComparison: string;
  winningHypothesis: string;
}

export interface GenerationResponse {
  platforms: PlatformAd[];
  platformsB?: PlatformAd[];
  isABTest?: boolean;
  abComparison?: ABComparison;
}

export interface GenerationInput {
  productName: string;
  productDescription: string;
  targetAudience: string;
  campaignGoal: string;
  platforms: string[];
  toneStyle: string;
  abTestMode?: boolean;
}

export interface SavedAdCampaign {
  id: string;
  timestamp: string;
  input: GenerationInput;
  output: GenerationResponse;
  createdAt?: string;
}
