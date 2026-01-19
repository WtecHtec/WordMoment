
const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '../src/data/zh_data.json');
const outputDir = path.join(__dirname, '../src/data');

try {
    const rawData = fs.readFileSync(srcPath, 'utf8');
    const data = JSON.parse(rawData);
    
    console.log(`Total units found: ${data.length}`);
    
    const chunkSize = 50;
    let fileCount = 0;

    for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        fileCount++;
        const outputPath = path.join(outputDir, `ja_data_part_${fileCount}.json`);
        
        fs.writeFileSync(outputPath, JSON.stringify(chunk, null, 4));
        console.log(`Created ${path.basename(outputPath)} with ${chunk.length} units (Units ${i + 1} to ${i + chunk.length})`);
    }

    console.log(`\nSuccessfully split into ${fileCount} files.`);

} catch (err) {
    console.error("Error during split:", err);
    process.exit(1);
}
