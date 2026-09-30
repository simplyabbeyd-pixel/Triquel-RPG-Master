import { jsPDF } from 'jspdf';
import { Character } from '../types/character';
import { Quest } from '../types/quest';
import { getModifier, formatModifier } from '../utils/characterGenerator';

interface PlayerStats {
  totalGold: number;
  totalExp: number;
  completedCount: number;
}

/**
 * Generates a styled Tabletop RPG Character Sheet PDF
 */
export function generateHeroPDF(character: Character): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Background tint (parchment feel)
  doc.setFillColor(250, 248, 243);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer border & frame
  doc.setDrawColor(180, 150, 100);
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);

  doc.setDrawColor(215, 195, 155);
  doc.setLineWidth(0.4);
  doc.rect(margin - 2, margin - 2, pageWidth - (margin - 2) * 2, pageHeight - (margin - 2) * 2);

  let y = margin + 4;

  // Header Banner
  doc.setFillColor(50, 35, 20);
  doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

  doc.setTextColor(245, 220, 160);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(character.name.toUpperCase(), margin + 6, y + 9);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(210, 190, 150);
  const subtitle = `Level ${character.level} ${character.race} • ${character.class} (${character.subclass}) • ${character.alignment}`;
  doc.text(subtitle, margin + 6, y + 17);

  y += 28;

  // Vitals Row (HP, Armor Class, Gold, Background)
  const vitals = [
    { label: 'MAX HP', val: `${character.hpMax}` },
    { label: 'ARMOR CLASS', val: `${character.armorClass}` },
    { label: 'BACKGROUND', val: character.background },
    { label: 'PURSE', val: `${character.gold} GP` },
  ];

  const vitalBoxWidth = (pageWidth - margin * 2 - 9) / 4;
  vitals.forEach((v, idx) => {
    const vx = margin + idx * (vitalBoxWidth + 3);
    doc.setFillColor(240, 235, 220);
    doc.setDrawColor(200, 175, 130);
    doc.setLineWidth(0.5);
    doc.roundedRect(vx, y, vitalBoxWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120, 80, 40);
    doc.text(v.label, vx + vitalBoxWidth / 2, y + 4.5, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(40, 30, 20);
    doc.text(v.val, vx + vitalBoxWidth / 2, y + 11, { align: 'center' });
  });

  y += 19;

  // Ability Scores Grid (6 Attributes)
  const abilityOrder: Array<{ key: keyof Character['stats']; name: string }> = [
    { key: 'str', name: 'STR' },
    { key: 'dex', name: 'DEX' },
    { key: 'con', name: 'CON' },
    { key: 'int', name: 'INT' },
    { key: 'wis', name: 'WIS' },
    { key: 'cha', name: 'CHA' },
  ];

  const attrBoxWidth = (pageWidth - margin * 2 - 15) / 6;
  abilityOrder.forEach((attr, idx) => {
    const ax = margin + idx * (attrBoxWidth + 3);
    const score = character.stats[attr.key];
    const mod = getModifier(score);

    doc.setFillColor(242, 237, 224);
    doc.setDrawColor(190, 160, 110);
    doc.setLineWidth(0.6);
    doc.roundedRect(ax, y, attrBoxWidth, 24, 2, 2, 'FD');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(110, 70, 30);
    doc.text(attr.name, ax + attrBoxWidth / 2, y + 5.5, { align: 'center' });

    // Big Modifier
    doc.setFontSize(13);
    doc.setTextColor(30, 25, 20);
    doc.text(formatModifier(mod), ax + attrBoxWidth / 2, y + 14, { align: 'center' });

    // Raw Score pill
    doc.setFillColor(220, 210, 190);
    doc.roundedRect(ax + attrBoxWidth / 2 - 5, y + 17, 10, 5, 1, 1, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 60, 50);
    doc.text(`${score}`, ax + attrBoxWidth / 2, y + 20.8, { align: 'center' });
  });

  y += 29;

  // Two Column Section: Appearance & Equipment (Left) vs Lore & Personality (Right)
  const colWidth = (pageWidth - margin * 2 - 6) / 2;

  // Left Column: Physical Appearance & Equipment
  doc.setFillColor(243, 238, 226);
  doc.setDrawColor(200, 175, 130);
  doc.roundedRect(margin, y, colWidth, 75, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('PHYSICAL PROFILE & APPEARANCE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 45, 40);

  const appItems = [
    `Gender / Age: ${character.appearance.gender}, ${character.appearance.age} years old`,
    `Build / Stature: ${character.appearance.build} (${character.appearance.height}, ${character.appearance.weight})`,
    `Hair: ${character.appearance.hairColorName} - ${character.appearance.hairStyle}`,
    `Eyes / Skin: ${character.appearance.eyeColorName} eyes, ${character.appearance.skinToneName} complexion`,
    `Distinguishing Feature: ${character.appearance.distinguishingFeature}`,
  ];

  let appY = y + 12;
  appItems.forEach((item) => {
    doc.text(`• ${item}`, margin + 4, appY);
    appY += 5;
  });

  // Equipment List
  appY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('STARTING EQUIPMENT & ARMS', margin + 4, appY);

  appY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 45, 40);

  if (character.equipment && character.equipment.length > 0) {
    character.equipment.slice(0, 6).forEach((eq) => {
      doc.text(`- ${eq}`, margin + 5, appY);
      appY += 4.5;
    });
  } else {
    doc.text('- Standard adventurer pack', margin + 5, appY);
  }

  // Right Column: Personality, Ideals, Bonds & Backstory
  const rightX = margin + colWidth + 6;
  doc.setFillColor(243, 238, 226);
  doc.setDrawColor(200, 175, 130);
  doc.roundedRect(rightX, y, colWidth, 75, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('PERSONALITY & CODE', rightX + 4, y + 6);

  let loreY = y + 12;
  const loreItems = [
    { title: 'Trait', text: character.personalityTrait || 'Disciplined and vigilant.' },
    { title: 'Ideal', text: character.ideal || 'Honor and protection of the innocent.' },
    { title: 'Bond', text: character.bond || 'Loyal to comrades in arms.' },
    { title: 'Flaw', text: character.flaw || 'Prone to taking reckless risks in battle.' },
  ];

  loreItems.forEach((li) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(90, 50, 20);
    doc.text(`${li.title}:`, rightX + 4, loreY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 45, 40);
    const splitText = doc.splitTextToSize(li.text, colWidth - 22);
    doc.text(splitText, rightX + 18, loreY);
    loreY += Math.max(splitText.length * 3.5, 6) + 1.5;
  });

  y += 80;

  // Origin Narrative & Backstory Box
  doc.setFillColor(243, 238, 226);
  doc.setDrawColor(200, 175, 130);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 50, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('ORIGIN NARRATIVE / BACKSTORY', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 45, 40);
  const backstoryLines = doc.splitTextToSize(
    character.backstory || 'Born under mysterious auspices, this hero heeds the call to adventure.',
    pageWidth - margin * 2 - 8
  );
  doc.text(backstoryLines, margin + 4, y + 12);

  // Footer stamp
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(130, 115, 95);
  doc.text(
    `Exported to Google Drive via RPG Quest Generator • ID: ${character.id} • ${new Date().toLocaleDateString()}`,
    margin,
    pageHeight - 8
  );

  return doc.output('blob');
}

/**
 * Generates an Active Quest Log Summary PDF
 */
export function generateQuestLogPDF(activeQuests: Quest[], playerStats: PlayerStats): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Background
  doc.setFillColor(250, 248, 243);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Frame
  doc.setDrawColor(180, 150, 100);
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);

  let y = margin + 4;

  // Header Banner
  doc.setFillColor(45, 30, 20);
  doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

  doc.setTextColor(245, 220, 160);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ADVENTURER\'S GUILD QUEST LOG', margin + 6, y + 9);

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(210, 190, 150);
  doc.text(
    `Official Dispatch • ${activeQuests.length} Active Contracts Tracked • Date: ${new Date().toLocaleDateString()}`,
    margin + 6,
    y + 16
  );

  y += 28;

  // Career Stats Row
  const statsCols = [
    { label: 'TOTAL GOLD EARNED', val: `${playerStats.totalGold.toLocaleString()} GP` },
    { label: 'TOTAL EXP ACCUMULATED', val: `${playerStats.totalExp.toLocaleString()} EXP` },
    { label: 'QUESTS COMPLETED', val: `${playerStats.completedCount}` },
    { label: 'ACTIVE CONTRACTS', val: `${activeQuests.length}` },
  ];

  const colWidth = (pageWidth - margin * 2 - 9) / 4;
  statsCols.forEach((stat, idx) => {
    const sx = margin + idx * (colWidth + 3);
    doc.setFillColor(240, 235, 220);
    doc.setDrawColor(200, 175, 130);
    doc.roundedRect(sx, y, colWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(120, 80, 40);
    doc.text(stat.label, sx + colWidth / 2, y + 4.5, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(30, 25, 20);
    doc.text(stat.val, sx + colWidth / 2, y + 11, { align: 'center' });
  });

  y += 20;

  // Quests Section
  if (activeQuests.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(11);
    doc.setTextColor(120, 110, 95);
    doc.text('No active contracts currently recorded in the journal.', margin + 4, y + 10);
  } else {
    activeQuests.forEach((q, qIndex) => {
      // Check page overflow
      if (y > pageHeight - 50) {
        doc.addPage();
        y = margin + 4;
        // Background on new page
        doc.setFillColor(250, 248, 243);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setDrawColor(180, 150, 100);
        doc.setLineWidth(1.2);
        doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);
      }

      const qBoxY = y;
      doc.setFillColor(245, 240, 228);
      doc.setDrawColor(200, 175, 130);
      doc.setLineWidth(0.6);

      // Quest Title & Metadata
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(80, 40, 10);
      doc.text(`${qIndex + 1}. ${q.title}`, margin + 4, y + 6);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(110, 95, 80);
      doc.text(
        `Type: ${q.type.toUpperCase()} • Level ${q.recommendedLevel} (${q.difficulty}) • Biome: ${q.location?.biome || ''}`,
        margin + 4,
        y + 11
      );

      // Summary
      doc.setFontSize(8);
      doc.setTextColor(40, 35, 30);
      const descLines = doc.splitTextToSize(q.summary, pageWidth - margin * 2 - 8);
      doc.text(descLines, margin + 4, y + 16);

      let innerY = y + 16 + descLines.length * 3.5 + 2;

      // Objectives Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(100, 60, 20);
      doc.text('OBJECTIVES:', margin + 4, innerY);
      innerY += 4.5;

      // Objective items with checkbox
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      q.objectives.forEach((obj) => {
        doc.setTextColor(obj.completed ? 30 : 50, obj.completed ? 120 : 45, obj.completed ? 60 : 40);
        const check = obj.completed ? '[X]' : '[  ]';
        const objLines = doc.splitTextToSize(`${check} ${obj.text}`, pageWidth - margin * 2 - 12);
        doc.text(objLines, margin + 6, innerY);
        innerY += objLines.length * 3.5 + 1;
      });

      // Player Notes if present
      if (q.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(90, 65, 35);
        const noteLines = doc.splitTextToSize(`Field Notes: ${q.notes}`, pageWidth - margin * 2 - 12);
        doc.text(noteLines, margin + 6, innerY + 1);
        innerY += noteLines.length * 3.5 + 2;
      }

      // Rewards line
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(120, 75, 10);
      const rewardsText = `Rewards: ${q.rewards.gold.toLocaleString()} GP | ${q.rewards.exp.toLocaleString()} EXP | Loot: ${
        q.rewards.items.map((i) => i.name).join(', ') || 'Standard Bounty'
      }`;
      doc.text(rewardsText, margin + 4, innerY + 2);

      const qBoxHeight = innerY + 6 - qBoxY;
      doc.roundedRect(margin, qBoxY, pageWidth - margin * 2, qBoxHeight, 2, 2, 'D');

      y = qBoxY + qBoxHeight + 5;
    });
  }

  // Footer stamp
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(130, 115, 95);
  doc.text(
    `Exported to Google Drive via RPG Quest Generator • ${new Date().toLocaleString()}`,
    margin,
    pageHeight - 8
  );

  return doc.output('blob');
}

/**
 * Generates a Complete Campaign Dossier (Hero Profile + Active Quests + Career Stats)
 */
export function generateCampaignDossierPDF(
  character: Character | null,
  activeQuests: Quest[],
  playerStats: PlayerStats
): Blob {
  // If character is provided, generate hero PDF and append quests, or generate single multi-page document
  if (!character) {
    return generateQuestLogPDF(activeQuests, playerStats);
  }

  // Generate multi-page: Page 1 Hero Sheet, Page 2+ Quest Log
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // PAGE 1: HERO SHEET
  doc.setFillColor(250, 248, 243);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setDrawColor(180, 150, 100);
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);

  let y = margin + 4;
  doc.setFillColor(50, 35, 20);
  doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');
  doc.setTextColor(245, 220, 160);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(character.name.toUpperCase(), margin + 6, y + 9);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(210, 190, 150);
  doc.text(
    `Level ${character.level} ${character.race} • ${character.class} (${character.subclass}) • ${character.alignment}`,
    margin + 6,
    y + 17
  );

  y += 28;

  // Vitals
  const vitals = [
    { label: 'MAX HP', val: `${character.hpMax}` },
    { label: 'ARMOR CLASS', val: `${character.armorClass}` },
    { label: 'BACKGROUND', val: character.background },
    { label: 'PURSE', val: `${character.gold} GP` },
  ];

  const vitalBoxWidth = (pageWidth - margin * 2 - 9) / 4;
  vitals.forEach((v, idx) => {
    const vx = margin + idx * (vitalBoxWidth + 3);
    doc.setFillColor(240, 235, 220);
    doc.setDrawColor(200, 175, 130);
    doc.roundedRect(vx, y, vitalBoxWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120, 80, 40);
    doc.text(v.label, vx + vitalBoxWidth / 2, y + 4.5, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(40, 30, 20);
    doc.text(v.val, vx + vitalBoxWidth / 2, y + 11, { align: 'center' });
  });

  y += 19;

  // Ability Scores
  const abilityOrder: Array<{ key: keyof Character['stats']; name: string }> = [
    { key: 'str', name: 'STR' },
    { key: 'dex', name: 'DEX' },
    { key: 'con', name: 'CON' },
    { key: 'int', name: 'INT' },
    { key: 'wis', name: 'WIS' },
    { key: 'cha', name: 'CHA' },
  ];

  const attrBoxWidth = (pageWidth - margin * 2 - 15) / 6;
  abilityOrder.forEach((attr, idx) => {
    const ax = margin + idx * (attrBoxWidth + 3);
    const score = character.stats[attr.key];
    const mod = getModifier(score);

    doc.setFillColor(242, 237, 224);
    doc.setDrawColor(190, 160, 110);
    doc.roundedRect(ax, y, attrBoxWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(110, 70, 30);
    doc.text(attr.name, ax + attrBoxWidth / 2, y + 5.5, { align: 'center' });

    doc.setFontSize(13);
    doc.setTextColor(30, 25, 20);
    doc.text(formatModifier(mod), ax + attrBoxWidth / 2, y + 14, { align: 'center' });

    doc.setFillColor(220, 210, 190);
    doc.roundedRect(ax + attrBoxWidth / 2 - 5, y + 17, 10, 5, 1, 1, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 60, 50);
    doc.text(`${score}`, ax + attrBoxWidth / 2, y + 20.8, { align: 'center' });
  });

  y += 29;

  // Two columns
  const colWidth = (pageWidth - margin * 2 - 6) / 2;
  doc.setFillColor(243, 238, 226);
  doc.setDrawColor(200, 175, 130);
  doc.roundedRect(margin, y, colWidth, 75, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('PHYSICAL PROFILE & APPEARANCE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 45, 40);

  const appItems = [
    `Gender / Age: ${character.appearance.gender}, ${character.appearance.age} years old`,
    `Build / Stature: ${character.appearance.build} (${character.appearance.height}, ${character.appearance.weight})`,
    `Hair: ${character.appearance.hairColorName} - ${character.appearance.hairStyle}`,
    `Eyes / Skin: ${character.appearance.eyeColorName} eyes, ${character.appearance.skinToneName} complexion`,
    `Distinguishing Feature: ${character.appearance.distinguishingFeature}`,
  ];

  let appY = y + 12;
  appItems.forEach((item) => {
    doc.text(`• ${item}`, margin + 4, appY);
    appY += 5;
  });

  appY += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('STARTING EQUIPMENT & ARMS', margin + 4, appY);
  appY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 45, 40);
  (character.equipment || []).slice(0, 6).forEach((eq) => {
    doc.text(`- ${eq}`, margin + 5, appY);
    appY += 4.5;
  });

  const rightX = margin + colWidth + 6;
  doc.setFillColor(243, 238, 226);
  doc.setDrawColor(200, 175, 130);
  doc.roundedRect(rightX, y, colWidth, 75, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('PERSONALITY & CODE', rightX + 4, y + 6);

  let loreY = y + 12;
  const loreItems = [
    { title: 'Trait', text: character.personalityTrait || 'Disciplined and vigilant.' },
    { title: 'Ideal', text: character.ideal || 'Honor and protection of the innocent.' },
    { title: 'Bond', text: character.bond || 'Loyal to comrades in arms.' },
    { title: 'Flaw', text: character.flaw || 'Prone to taking reckless risks in battle.' },
  ];

  loreItems.forEach((li) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(90, 50, 20);
    doc.text(`${li.title}:`, rightX + 4, loreY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(50, 45, 40);
    const splitText = doc.splitTextToSize(li.text, colWidth - 22);
    doc.text(splitText, rightX + 18, loreY);
    loreY += Math.max(splitText.length * 3.5, 6) + 1.5;
  });

  y += 80;

  // Backstory
  doc.setFillColor(243, 238, 226);
  doc.setDrawColor(200, 175, 130);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 50, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(110, 60, 20);
  doc.text('ORIGIN NARRATIVE / BACKSTORY', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(50, 45, 40);
  const backstoryLines = doc.splitTextToSize(
    character.backstory || 'A lone wanderer answering destiny.',
    pageWidth - margin * 2 - 8
  );
  doc.text(backstoryLines, margin + 4, y + 12);

  // Footer on page 1
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(130, 115, 95);
  doc.text(`Page 1: Hero Character Sheet • Exported to Google Drive`, margin, pageHeight - 8);

  // PAGE 2: ACTIVE QUESTS & CAREER STATS
  doc.addPage();
  doc.setFillColor(250, 248, 243);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setDrawColor(180, 150, 100);
  doc.setLineWidth(1.2);
  doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);

  y = margin + 4;
  doc.setFillColor(45, 30, 20);
  doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

  doc.setTextColor(245, 220, 160);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`${character.name.toUpperCase()}'S CAMPAIGN QUEST LOG`, margin + 6, y + 9);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(210, 190, 150);
  doc.text(
    `Career Stats: ${playerStats.totalGold.toLocaleString()} GP • ${playerStats.totalExp.toLocaleString()} EXP • ${playerStats.completedCount} Completed`,
    margin + 6,
    y + 16
  );

  y += 28;

  if (activeQuests.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(120, 110, 95);
    doc.text('No active quests presently recorded.', margin + 4, y + 10);
  } else {
    activeQuests.forEach((q, qIndex) => {
      if (y > pageHeight - 45) {
        doc.addPage();
        y = margin + 4;
        doc.setFillColor(250, 248, 243);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        doc.setDrawColor(180, 150, 100);
        doc.setLineWidth(1.2);
        doc.rect(margin - 4, margin - 4, pageWidth - (margin - 4) * 2, pageHeight - (margin - 4) * 2);
      }

      const qBoxY = y;
      doc.setFillColor(245, 240, 228);
      doc.setDrawColor(200, 175, 130);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(80, 40, 10);
      doc.text(`${qIndex + 1}. ${q.title} (Lvl ${q.recommendedLevel})`, margin + 4, y + 6);

      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(110, 95, 80);
      doc.text(`Type: ${q.type.toUpperCase()} • Biome: ${q.location?.biome || ''}`, margin + 4, y + 11);

      doc.setFontSize(8);
      doc.setTextColor(40, 35, 30);
      const descLines = doc.splitTextToSize(q.summary, pageWidth - margin * 2 - 8);
      doc.text(descLines, margin + 4, y + 16);

      let innerY = y + 16 + descLines.length * 3.5 + 2;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      q.objectives.forEach((obj) => {
        const check = obj.completed ? '[X]' : '[  ]';
        const objLines = doc.splitTextToSize(`${check} ${obj.text}`, pageWidth - margin * 2 - 12);
        doc.text(objLines, margin + 6, innerY);
        innerY += objLines.length * 3.5 + 1;
      });

      if (q.notes) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(90, 65, 35);
        const noteLines = doc.splitTextToSize(`Field Notes: ${q.notes}`, pageWidth - margin * 2 - 12);
        doc.text(noteLines, margin + 6, innerY + 1);
        innerY += noteLines.length * 3.5 + 2;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 75, 10);
      doc.text(
        `Loot: ${q.rewards.gold} GP, ${q.rewards.exp} EXP${
          q.rewards.items.length ? `, Items: ${q.rewards.items.map((i) => i.name).join(', ')}` : ''
        }`,
        margin + 4,
        innerY + 2
      );

      const qBoxHeight = innerY + 6 - qBoxY;
      doc.roundedRect(margin, qBoxY, pageWidth - margin * 2, qBoxHeight, 2, 2, 'D');

      y = qBoxY + qBoxHeight + 5;
    });
  }

  return doc.output('blob');
}
