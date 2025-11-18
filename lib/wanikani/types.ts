// WaniKani API Types

export interface WKResource<T> {
  id: number;
  object: string;
  url: string;
  data_updated_at: string;
  data: T;
}

export interface WKCollection<T> {
  object: "collection";
  url: string;
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  total_count: number;
  data_updated_at: string;
  data: WKResource<T>[];
}

export interface User {
  id: string;
  username: string;
  level: number;
  profile_url: string;
  started_at: string;
  current_vacation_started_at: string | null;
  subscription: {
    active: boolean;
    type: string;
    max_level_granted: number;
    period_ends_at: string | null;
  };
  preferences: {
    lessons_autoplay_audio: boolean;
    lessons_batch_size: number;
    lessons_presentation_order: string;
    reviews_autoplay_audio: boolean;
    reviews_display_srs_indicator: boolean;
  };
}

export interface LevelProgression {
  level: number;
  created_at: string;
  unlocked_at: string | null;
  started_at: string | null;
  passed_at: string | null;
  completed_at: string | null;
  abandoned_at: string | null;
}

export interface Assignment {
  available_at: string | null;
  burned_at: string | null;
  created_at: string;
  hidden: boolean;
  passed_at: string | null;
  resurrected_at: string | null;
  srs_stage: number;
  started_at: string | null;
  subject_id: number;
  subject_type: string;
  unlocked_at: string | null;
}

export interface Subject {
  auxiliary_meanings: Array<{
    meaning: string;
    type: string;
  }>;
  characters: string | null;
  created_at: string;
  document_url: string;
  hidden_at: string | null;
  lesson_position: number;
  level: number;
  meaning_mnemonic: string;
  meanings: Array<{
    meaning: string;
    primary: boolean;
    accepted_answer: boolean;
  }>;
  slug: string;
  spaced_repetition_system_id: number;
}

export interface Radical extends Subject {
  amalgamation_subject_ids: number[];
  character_images: Array<{
    url: string;
    metadata: {
      inline_styles?: boolean;
      color?: string;
      dimensions?: string;
      style_name?: string;
    };
    content_type: string;
  }>;
}

export interface Kanji extends Subject {
  amalgamation_subject_ids: number[];
  component_subject_ids: number[];
  meaning_hint: string | null;
  reading_hint: string | null;
  reading_mnemonic: string;
  readings: Array<{
    reading: string;
    primary: boolean;
    accepted_answer: boolean;
    type: string;
  }>;
  visually_similar_subject_ids: number[];
}

export interface Vocabulary extends Subject {
  component_subject_ids: number[];
  context_sentences: Array<{
    en: string;
    ja: string;
  }>;
  meaning_mnemonic: string;
  parts_of_speech: string[];
  pronunciation_audios: Array<{
    url: string;
    metadata: {
      gender: string;
      source_id: number;
      pronunciation: string;
      voice_actor_id: number;
      voice_actor_name: string;
      voice_description: string;
    };
    content_type: string;
  }>;
  readings: Array<{
    reading: string;
    primary: boolean;
    accepted_answer: boolean;
  }>;
}

export interface ReviewStatistic {
  created_at: string;
  hidden: boolean;
  meaning_correct: number;
  meaning_current_streak: number;
  meaning_incorrect: number;
  meaning_max_streak: number;
  percentage_correct: number;
  reading_correct: number;
  reading_current_streak: number;
  reading_incorrect: number;
  reading_max_streak: number;
  subject_id: number;
  subject_type: string;
}

export interface Summary {
  lessons: Array<{
    available_at: string;
    subject_ids: number[];
  }>;
  next_reviews_at: string | null;
  reviews: Array<{
    available_at: string;
    subject_ids: number[];
  }>;
}

export interface Reset {
  confirmed_at: string | null;
  created_at: string;
  original_level: number;
  target_level: number;
}

export interface ApiError {
  error: string;
  code: number;
}
