const fs = require('fs');
const path = require('path');
const TextToIPA = require('text-to-ipa');
const Hypher = require('hypher');
const patterns = require('hyphenation.en-us');

const h = new Hypher(patterns);

// Load IPA dict
try {
    TextToIPA.loadDict();
} catch (e) {
    console.error("Failed to load IPA dict:", e);
}

const INPUT_FILE = path.join(__dirname, '3 四级-乱序.txt');
const OUTPUT_FILE = path.join(__dirname, 'cet4_words_node.json');

const EXCLUDE = new Set([
    'in', 'on', 'at', 'to', 'of', 'for', 'by', 'with', 'up', 'down',
    'from', 'about', 'into', 'over', 'after', 'the', 'and', 'but',
    'or', 'so', 'is', 'am', 'are', 'was', 'were', 'be', 'been',
    'a', 'an', 'it', 'he', 'she', 'they', 'we', 'you', 'i'
]);

function parseFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf-8');
    // Remove BOM
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }

    const lines = content.split('\n');
    const wordsMap = new Map();

    let stats = {
        total: lines.length,
        empty: 0,
        noMatch: 0,
        duplicate: 0,
        excluded: 0,
        short: 0,
        valid: 0,
        merged: 0
    };

    console.log(`First line: ${JSON.stringify(lines[0])}`);

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
            stats.empty++;
            continue;
        }

        let en = null;
        let zh = null;

        // Allow hyphens in words
        const match = trimmed.match(/^([a-zA-Z\-]+)\s+(.*)$/);
        if (match) {
            en = match[1];
            zh = match[2];
        } else {
            // Try to split by tab or multiple spaces if regex failed (e.g. word followed by tab)
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 2 && /^[a-zA-Z\-]+$/.test(parts[0])) {
                en = parts[0];
                zh = trimmed.substring(en.length).trim();
            } else {
                // console.log("No match:", trimmed);
                stats.noMatch++;
                continue;
            }
        }

        if (en && zh) {
            let enLower = en.toLowerCase();
            // Clean en (remove non-letters/hyphens if any - but we matched letters/hyphens)

            if (EXCLUDE.has(enLower)) {
                stats.excluded++;
                continue;
            }
            // User requested "no short prepositions", but maybe wants all other words.
            // We'll trust the EXCLUDE list and not arbitrarily remove short words.
            // But let's filter length 1 unless it's "a" or "I" (which are excluded anyway).
            if (en.length < 2) {
                stats.short++;
                continue;
            }

            if (wordsMap.has(enLower)) {
                // Merge definitions
                const existing = wordsMap.get(enLower);
                // Simple check to avoid exact duplicate definitions
                if (!existing.zh.includes(zh)) {
                    existing.zh += ` ; ${zh}`;
                    stats.merged++;
                } else {
                    stats.duplicate++;
                }
            } else {
                wordsMap.set(enLower, { en, zh });
                stats.valid++;
            }
        }
    }
    console.log("Parse Stats:", stats);
    return Array.from(wordsMap.values());
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function main() {
    console.log("Parsing file...");
    const words = parseFile(INPUT_FILE);
    console.log(`Parsed ${words.length} words.`);

    shuffleArray(words);

    const units = [];
    const chunkSize = 10;
    const totalUnits = Math.ceil(words.length / chunkSize);

    for (let i = 0; i < totalUnits; i++) {
        const chunk = words.slice(i * chunkSize, (i + 1) * chunkSize);

        const unitData = {
            level: "CET4",
            unit: `Unit ${i + 1}`,
            words: []
        };

        for (const item of chunk) {
            const en = item.en;
            const zh = item.zh;

            // Get IPA
            let phonetic = "";
            const ipaResult = TextToIPA.lookup(en);
            if (ipaResult && ipaResult.text) {
                // Remove OR variants if any, take first
                let text = ipaResult.text;
                if (text.includes(' OR ')) {
                    text = text.split(' OR ')[0];
                }

                // Normalize IPA symbols for learners
                text = text
                    .replace(/ɹ/g, 'r')    // Inverted r -> r
                    .replace(/ɚ/g, 'ər')   // R-colored schwa -> er
                    .replace(/ɝ/g, 'ɜr')   // Stressed r-colored vowel -> ur/er
                    .replace(/aj/g, 'aɪ')  // Diphthong ai
                    .replace(/aw/g, 'aʊ')  // Diphthong au
                    .replace(/oj/g, 'ɔɪ')  // Diphthong oi
                    .replace(/ej/g, 'eɪ')  // Diphthong ei
                    .replace(/ow/g, 'oʊ')  // Diphthong ou
                    .replace(/ɡ/g, 'g');   // Script g -> g

                phonetic = `/${text}/`;
            }

            // Get blocks
            const blocks = h.hyphenate(en);

            unitData.words.push({
                en,
                zh,
                block: blocks,
                phonetic
            });
        }
        units.push(unitData);
    }

    console.log("Writing JSON...");
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(units, null, 0)); // Compact JSON
    console.log(`Successfully generated ${units.length} units to ${OUTPUT_FILE}`);
}

main();
