const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../3 四级-乱序.txt');
const outputDir = path.join(__dirname, '../split_files');

// 创建输出目录
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取文件内容
const content = fs.readFileSync(inputFile, 'utf-8');
const lines = content.split('\n').filter(line => line.trim() !== '');

const linesPerFile = 1000;
const totalFiles = Math.ceil(lines.length / linesPerFile);

console.log(`总行数: ${lines.length}`);
console.log(`将拆分为 ${totalFiles} 个文件，每个文件 ${linesPerFile} 行`);

// 拆分文件
for (let i = 0; i < totalFiles; i++) {
  const start = i * linesPerFile;
  const end = Math.min(start + linesPerFile, lines.length);
  const chunk = lines.slice(start, end);
  
  const outputFile = path.join(outputDir, `3 四级-乱序_part_${i + 1}.txt`);
  fs.writeFileSync(outputFile, chunk.join('\n') + '\n', 'utf-8');
  
  console.log(`已创建: ${outputFile} (行 ${start + 1}-${end})`);
}

console.log('\n拆分完成！');

