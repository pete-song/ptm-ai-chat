const path = require('path');
const fs = require('fs');

// Test what the API route sees
console.log('=== API Route Environment Test ===');
console.log('process.cwd():', process.cwd());
console.log('__dirname:', __dirname);

const testPaths = [
  path.join(process.cwd(), 'public', 'data', 'P5.xlsx'),
  './public/data/P5.xlsx',
  path.resolve('./public/data/P5.xlsx')
];

console.log('\nTesting file paths:');
testPaths.forEach((testPath, index) => {
  console.log(`${index + 1}. ${testPath}`);
  console.log(`   Exists: ${fs.existsSync(testPath)}`);
  if (fs.existsSync(testPath)) {
    const stats = fs.statSync(testPath);
    console.log(`   Size: ${stats.size} bytes`);
    console.log(`   Modified: ${stats.mtime}`);
  }
});

// Test reading the file
const filePath = path.join(process.cwd(), 'public', 'data', 'P5.xlsx');
if (fs.existsSync(filePath)) {
  try {
    const XLSX = require('xlsx');
    const workbook = XLSX.readFile(filePath);
    console.log('\n✅ Excel file loaded successfully!');
    console.log('Sheets:', workbook.SheetNames);
    console.log('First sheet data preview:');
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('Total rows:', jsonData.length);
    console.log('Headers:', jsonData[0]);
    console.log('First 3 products:');
    jsonData.slice(1, 4).forEach((row, index) => {
      console.log(`  ${index + 1}. ${row[0]} - ${row[1]} THB`);
    });
  } catch (error) {
    console.log('\n❌ Error reading Excel file:', error.message);
  }
} else {
  console.log('\n❌ Excel file not found');
}
