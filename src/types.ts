export type AppVersion = 'v1' | 'v2' | 'v3' | 'v4';

export type EpochCategory = 'REDUCTION' | 'AUTOMATION' | 'DISCOVERY_RESISTANCE';

export interface EpochInfo {
  id: EpochCategory;
  name: string;
  desc: string;
}

export type MachineId =
  | 'MARKOV'
  | 'DAHL_PEDAL'
  | 'CALVINO_MACHINE'
  | 'BORGES_LIBRARY'
  | 'MAX_BENSE'
  | 'EXPRESSION_SCRIBER'
  | 'PARRISH_SYNTHESIZER'
  | 'KINETIC_BREATH'
  | 'SENTENCE_GO';

export const MachineId = {
  MARKOV: 'MARKOV',
  DAHL_PEDAL: 'DAHL_PEDAL',
  CALVINO_MACHINE: 'CALVINO_MACHINE',
  BORGES_LIBRARY: 'BORGES_LIBRARY',
  MAX_BENSE: 'MAX_BENSE',
  EXPRESSION_SCRIBER: 'EXPRESSION_SCRIBER',
  PARRISH_SYNTHESIZER: 'PARRISH_SYNTHESIZER',
  KINETIC_BREATH: 'KINETIC_BREATH',
  SENTENCE_GO: 'SENTENCE_GO',
} as const;

export interface ExhibitItem {
  id: MachineId;
  name: string;
  creator: string;
  year: string;
  description: string;
  historicalContext: string;
  category: EpochCategory;
}

export interface DahlParams {
  subject: string;
  genre: string;
  tension: number;
  surprise: number;
  humor: number;
  pathos: number;
  mystery: number;
  passion: number;
  calmness: number;
}

export interface BarakaInput {
  text: string;
  audio?: string;
  image?: string;
}

export interface CompassWords {
  top: string;
  bottom: string;
  left: string;
  right: string;
}

export interface LatentSynthesisResult {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  center: string;
}

export interface PoeticFlintResult {
  sparkWord: string;
  poem: string;
}
