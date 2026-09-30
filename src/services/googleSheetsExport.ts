import { Quest } from '../types/quest';
import { Character } from '../types/character';

export interface PlayerStats {
  totalGold: number;
  totalExp: number;
  completedCount: number;
}

export interface SheetsExportResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

/**
 * Exports active quests and player statistics directly into a newly created Google Sheet
 */
export async function exportToGoogleSheets(
  accessToken: string,
  activeQuests: Quest[],
  playerStats: PlayerStats,
  character?: Character | null,
  customTitle?: string
): Promise<SheetsExportResult> {
  const dateStr = new Date().toISOString().slice(0, 10);
  const title =
    customTitle ||
    `RPG Quest Journal & Stats - ${character ? character.name + ' - ' : ''}${dateStr}`;

  // Step 1: Create the spreadsheet with two tabs: "Career Stats" and "Active Quests"
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Career Stats',
            gridProperties: { rowCount: 25, columnCount: 8 },
          },
        },
        {
          properties: {
            title: 'Active Quests',
            gridProperties: {
              rowCount: Math.max(activeQuests.length + 10, 30),
              columnCount: 12,
            },
          },
        },
      ],
    }),
  });

  if (!createResponse.ok) {
    let err = `Failed to create Google Sheet (${createResponse.status})`;
    try {
      const j = await createResponse.json();
      if (j.error?.message) err = j.error.message;
    } catch {
      // ignore
    }
    throw new Error(err);
  }

  const sheetData = await createResponse.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = sheetData.spreadsheetUrl;

  // Step 2: Prepare values for batchUpdate
  const careerStatsValues: Array<Array<string | number>> = [
    ['METRIC / STATISTIC', 'VALUE', 'UNIT / CONTEXT'],
    ['Total Gold Accumulated', playerStats.totalGold, 'Gold Pieces (GP)'],
    ['Total Experience Points', playerStats.totalExp, 'EXP'],
    ['Quests Completed', playerStats.completedCount, 'Notices successfully finished'],
    ['Active Quests In Progress', activeQuests.length, 'Currently tracked in journal'],
    ['Export Timestamp', new Date().toLocaleString(), 'UTC / Local'],
  ];

  if (character) {
    careerStatsValues.push(
      ['Active Hero Name', character.name, 'Party Leader'],
      ['Hero Level', character.level, `Class: ${character.class} (${character.subclass})`],
      ['Hero Race / Heritage', character.race, `Alignment: ${character.alignment}`],
      ['Max HP / Armor Class', `${character.hpMax} HP / ${character.armorClass} AC`, 'Combat Defense'],
      ['Hero Purse', `${character.gold} GP`, 'Personal Wealth']
    );
  }

  const questsHeaders = [
    'No.',
    'Quest ID',
    'Title',
    'Type',
    'Recommended Level',
    'Difficulty',
    'Biome / Setting',
    'Gold Reward (GP)',
    'EXP Reward',
    'Loot Items',
    'Objectives & Status',
    'Summary',
    'Player Notes',
  ];

  const questsRows: Array<Array<string | number>> = activeQuests.map((q, idx) => [
    idx + 1,
    q.id,
    q.title,
    q.type.toUpperCase(),
    q.recommendedLevel,
    q.difficulty,
    q.location?.biome || '',
    q.rewards.gold,
    q.rewards.exp,
    q.rewards.items.map((i) => i.name).join(', ') || 'None',
    q.objectives.map((o) => `[${o.completed ? 'COMPLETED' : 'PENDING'}] ${o.text}`).join(' | '),
    q.summary,
    q.notes || '',
  ]);

  const activeQuestsValues = [questsHeaders, ...questsRows];

  // Step 3: Populate cells using batchUpdate
  const updateResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          {
            range: "'Career Stats'!A1",
            values: careerStatsValues,
          },
          {
            range: "'Active Quests'!A1",
            values: activeQuestsValues,
          },
        ],
      }),
    }
  );

  if (!updateResponse.ok) {
    console.warn('Could not populate Google Sheet values:', await updateResponse.text());
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
  };
}
