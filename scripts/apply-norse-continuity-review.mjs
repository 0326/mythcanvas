import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const cardsDir = path.resolve('docs/cards/norse/M01-norse-genesis/cards');

const updates = {
  1003010002: {
    attempt: 3,
    references: [1003010002],
    notes: [
      'Continuity master regenerated: same colossal shaggy primeval-cow identity and horn silhouette, with both horn tips inside the crop-safe area.',
      'Previous approved image was superseded by this continuity pass; explicit approval is required again.',
    ],
  },
  1003010020: {
    attempt: 3,
    references: [1003010020],
    notes: [
      'Canonical Yggdrasil master regenerated after one rejected continuity candidate.',
      'Verified deep evergreen foliage, one lower trunk, high three-leader crown split, three dominant buttress roots, and charcoal bark with silver fissures.',
    ],
  },
  1003010025: {
    attempt: 2,
    references: [],
    notes: ['Removed planetary ring and game-map-map density; one raw coastline now controls the newborn-Midgard composition.'],
  },
  1003010026: {
    attempt: 2,
    references: [1003010012, 1003010013],
    notes: ['Removed the wolf and science-fiction S-track; solar and lunar paths are restrained atmospheric arcs.'],
  },
  1003010030: {
    attempt: 2,
    references: [1003010001],
    notes: ['Ymir face, frost-stone skin, white hair and beard, and colossal scale were regenerated from the character master.'],
  },
  1003010031: {
    attempt: 2,
    references: [1003010002],
    notes: ['Ordinary dairy cow was replaced with the canonical colossal shaggy Auðumbla.'],
  },
  1003010032: {
    attempt: 2,
    references: [1003010001, 1003010002],
    notes: ['Ymir and Auðumbla now match their masters; four milk streams read as clean mythic rivulets without grotesque anatomy.'],
  },
  1003010033: {
    attempt: 3,
    references: [1003010002, 1003010003],
    notes: [
      'Búri was corrected from an elderly white-bearded man to the same handsome, powerful adult identity as card 1003010003.',
      'One intermediate candidate was rejected because Auðumbla horn cropping failed the safe-zone gate.',
    ],
  },
  1003010034: {
    attempt: 2,
    references: [1003010001, 1003010004, 1003010005, 1003010006],
    notes: ['Ymir and all three brothers now reuse their canonical silhouettes; raven, spear, missing-eye and throne leakage were removed.'],
  },
  1003010035: {
    attempt: 2,
    references: [1003010001, 1003010004, 1003010005, 1003010006],
    notes: ['Ymir and the three brothers now preserve the same scale, hair-color split and costume palette as their character cards.'],
  },
  1003010036: {
    attempt: 3,
    references: [1003010001],
    notes: [
      'Ymir identity was restored and the event was reframed as a non-graphic geological transformation.',
      'One wording-sensitive generation was blocked before output; the successful attempt removed exposed-body and flesh detail.',
    ],
  },
  1003010039: {
    attempt: 2,
    references: [1003010004, 1003010005, 1003010006],
    notes: ['The three brothers now match their masters and lift a readable hollow skull vault rather than a planet or moon.'],
  },
  1003010041: {
    attempt: 2,
    references: [1003010004, 1003010005, 1003010006, 1003010007, 1003010008],
    notes: ['Exactly three creator brothers and the canonical Ask/Embla pair are present; all five identities and hair colors were restored.'],
  },
  1003010042: {
    attempt: 2,
    references: [1003010020],
    notes: ['White foliage and realm-platform imagery were removed; the card now reuses the canonical evergreen Yggdrasil structure.'],
  },
  1003010043: {
    attempt: 2,
    references: [1003010020],
    notes: ['Mixed green/white foliage was removed; three roots now diverge from the same canonical trunk toward restrained water cues.'],
  },
  1003010044: {
    attempt: 2,
    references: [1003010009, 1003010010, 1003010011, 1003010020],
    notes: ['The elderly substitute was removed; Urðr, Verðandi and Skuld now match the three young-adult character masters beside the canonical root.'],
  },
  1003010045: {
    attempt: 2,
    references: [1003010012, 1003010013],
    notes: ['Sól is golden-blond again and Máni retains his silver-haired cool identity; both follow separate restrained paths.'],
  },
  1003010046: {
    attempt: 2,
    references: [1003010014, 1003010015, 1003010016, 1003010020],
    notes: ['Sköll now pursues the sun, Hati the moon, and wingless Níðhöggr gnaws the same evergreen Yggdrasil root without fire breath.'],
  },
  1003010047: {
    attempt: 2,
    references: [1003010012],
    notes: ['Red-haired substitute and ornate game-CG vehicle were replaced with canonical golden-blond Sól and a restrained wood-and-bronze chariot.'],
  },
  1003010049: {
    attempt: 2,
    references: [1003010001, 1003010002, 1003010003],
    notes: ['Landscape ensemble now preserves Ymir, Auðumbla and young-adult Búri with a clear scale hierarchy and one creation flow.'],
  },
  1003010050: {
    attempt: 2,
    references: [1003010009, 1003010010, 1003010011, 1003010012, 1003010013, 1003010020],
    notes: ['Finale regenerated last: canonical evergreen Yggdrasil dominates, the three locked Norns remain secondary by the well, and sun/moon figures remain distant tertiary cues.'],
  },
};

for (const [cardId, update] of Object.entries(updates)) {
  const cardPath = path.join(cardsDir, `${cardId}.json`);
  const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
  const replayPrompt = execFileSync(
    process.execPath,
    ['scripts/compose-norse-card-prompt.mjs', cardId],
    { encoding: 'utf8' },
  );

  card.prompt.final = replayPrompt;
  card.prompt.notes = 'Continuity-aware replay prompt composed from the per-card brief plus M01_VISUAL_CONTINUITY.json. The accepted candidate used the same listed canonical image references.';
  card.generation = {
    status: 'generated',
    attempt: update.attempt,
    approvedAt: null,
    referenceImageFile: `${cardId}.png`,
    notes: `Continuity regeneration completed. Canonical reference card IDs: ${update.references.length ? update.references.join(', ') : 'none (environment-only scene)'}. Pending explicit user approval.`,
  };
  card.qa = {
    status: 'review',
    reviewNotes: [
      ...update.notes,
      'Pure artwork only: no typography, logo, card frame, number, watermark, or UI.',
      'Machine-side continuity review passed; explicit visual approval is still required.',
    ],
  };

  fs.writeFileSync(cardPath, `${JSON.stringify(card, null, 2)}\n`);
}

console.log(`Updated ${Object.keys(updates).length} card JSON files.`);
