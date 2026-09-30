import { Character } from '../types/character';
import { Quest } from '../types/quest';
import {
  generateHeroPDF,
  generateQuestLogPDF,
  generateCampaignDossierPDF,
} from './pdfGenerator';

export interface PlayerStats {
  totalGold: number;
  totalExp: number;
  completedCount: number;
}

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink?: string;
  mimeType: string;
  size?: string;
}

/**
 * Uploads a file (blob) to Google Drive v3 using multipart upload.
 */
export async function uploadToDrive(
  accessToken: string,
  fileName: string,
  mimeType: string,
  fileBlob: Blob
): Promise<DriveUploadResult> {
  const metadata = {
    name: fileName,
    mimeType: mimeType,
    description: 'Exported from RPG Quest Generator & Tabletop Forge',
  };

  const boundary = `-------rpg_boundary_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadataHeader = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
    metadata
  )}`;
  const fileHeader = `${delimiter}Content-Type: ${mimeType}\r\n\r\n`;

  const multipartBlob = new Blob(
    [metadataHeader, fileHeader, fileBlob, closeDelimiter],
    { type: `multipart/related; boundary=${boundary}` }
  );

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,mimeType,size',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: multipartBlob,
    }
  );

  if (!response.ok) {
    let errorMessage = `Google Drive upload failed with status ${response.status}`;
    try {
      const errorJson = await response.json();
      if (errorJson.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch {
      const text = await response.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

/**
 * Builds JSON payload for Hero Profile
 */
export function buildHeroJSON(character: Character): string {
  const payload = {
    exportType: 'RPG_HERO_PROFILE',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    hero: character,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Builds JSON payload for Quest Log Summary
 */
export function buildQuestLogJSON(activeQuests: Quest[], playerStats: PlayerStats): string {
  const payload = {
    exportType: 'RPG_QUEST_LOG_SUMMARY',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    playerStats,
    activeQuests,
    summary: {
      activeCount: activeQuests.length,
      completedCount: playerStats.completedCount,
      totalRewardPotentialGold: activeQuests.reduce((sum, q) => sum + q.rewards.gold, 0),
      totalRewardPotentialExp: activeQuests.reduce((sum, q) => sum + q.rewards.exp, 0),
    },
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Builds JSON payload for Complete Campaign Dossier
 */
export function buildCampaignJSON(
  character: Character | null,
  activeQuests: Quest[],
  playerStats: PlayerStats
): string {
  const payload = {
    exportType: 'RPG_CAMPAIGN_DOSSIER',
    version: '1.0',
    exportedAt: new Date().toISOString(),
    hero: character,
    playerStats,
    activeQuests,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Exports a Hero Profile to connected Google Drive
 */
export async function exportHeroToDrive(
  character: Character,
  format: 'pdf' | 'json',
  accessToken: string,
  customName?: string
): Promise<DriveUploadResult> {
  const safeHeroName = character.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const dateStr = new Date().toISOString().slice(0, 10);

  if (format === 'pdf') {
    const fileName = customName || `${safeHeroName}_Level${character.level}_Sheet_${dateStr}.pdf`;
    const blob = generateHeroPDF(character);
    return uploadToDrive(accessToken, fileName, 'application/pdf', blob);
  } else {
    const fileName = customName || `${safeHeroName}_Profile_${dateStr}.json`;
    const jsonStr = buildHeroJSON(character);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    return uploadToDrive(accessToken, fileName, 'application/json', blob);
  }
}

/**
 * Exports the Active Quest Log to connected Google Drive
 */
export async function exportQuestLogToDrive(
  activeQuests: Quest[],
  playerStats: PlayerStats,
  format: 'pdf' | 'json',
  accessToken: string,
  customName?: string
): Promise<DriveUploadResult> {
  const dateStr = new Date().toISOString().slice(0, 10);

  if (format === 'pdf') {
    const fileName = customName || `Guild_Quest_Log_${dateStr}.pdf`;
    const blob = generateQuestLogPDF(activeQuests, playerStats);
    return uploadToDrive(accessToken, fileName, 'application/pdf', blob);
  } else {
    const fileName = customName || `Guild_Quest_Log_${dateStr}.json`;
    const jsonStr = buildQuestLogJSON(activeQuests, playerStats);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    return uploadToDrive(accessToken, fileName, 'application/json', blob);
  }
}

/**
 * Exports a Complete Campaign Dossier (Hero + Quests) to connected Google Drive
 */
export async function exportCampaignDossierToDrive(
  character: Character | null,
  activeQuests: Quest[],
  playerStats: PlayerStats,
  format: 'pdf' | 'json',
  accessToken: string,
  customName?: string
): Promise<DriveUploadResult> {
  const heroTag = character ? character.name.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Adventurer';
  const dateStr = new Date().toISOString().slice(0, 10);

  if (format === 'pdf') {
    const fileName = customName || `${heroTag}_Campaign_Dossier_${dateStr}.pdf`;
    const blob = generateCampaignDossierPDF(character, activeQuests, playerStats);
    return uploadToDrive(accessToken, fileName, 'application/pdf', blob);
  } else {
    const fileName = customName || `${heroTag}_Campaign_Dossier_${dateStr}.json`;
    const jsonStr = buildCampaignJSON(character, activeQuests, playerStats);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    return uploadToDrive(accessToken, fileName, 'application/json', blob);
  }
}
