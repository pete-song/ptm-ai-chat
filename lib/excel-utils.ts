import * as XLSX from 'xlsx';
import path from 'path';

export interface ExcelData {
  [key: string]: any[];
}

export async function loadExcelData(): Promise<ExcelData> {
  try {
    // Use the working approach: read file as buffer then parse with XLSX
    const filePath = '/tmp/P5.xlsx';
    console.log(`Loading Excel file from: ${filePath}`);
    
    const fs = require('fs');
    if (fs.existsSync(filePath)) {
      console.log('✅ File exists');
      
      // Read file as buffer
      const fileBuffer = fs.readFileSync(filePath);
      console.log(`✅ File read as buffer, size: ${fileBuffer.length} bytes`);
      
      // Parse with XLSX
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      console.log(`Successfully loaded Excel file with ${workbook.SheetNames.length} sheets: ${workbook.SheetNames.join(', ')}`);
      
      const data: ExcelData = {};
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        data[sheetName] = jsonData;
      });
      
      console.log(`Processed ${Object.keys(data).length} sheets with ${Object.values(data)[0]?.length || 0} rows`);
      return data;
    } else {
      console.log('❌ File does not exist');
      throw new Error(`File not found at: ${filePath}`);
    }
  } catch (error) {
    console.error('Error loading Excel file:', error);
    return {};
  }
}

export function formatExcelDataForAI(data: ExcelData): string {
  let context = "Available data from P5.xlsx:\n\n";
  
  Object.entries(data).forEach(([sheetName, sheetData]) => {
    if (sheetData.length > 0) {
      context += `Sheet: ${sheetName}\n`;
      context += `Total rows: ${sheetData.length}\n`;
      
      const headers = sheetData[0] as string[];
      if (headers && headers.length > 0) {
        // Translate Thai headers to English for better AI understanding
        const translatedHeaders = headers.map(header => {
          if (header === 'ชื่อสินค้า') return 'Product Name';
          if (header === 'ราคาไม่แวท') return 'Price (No VAT)';
          return header;
        });
        
        context += `Columns: ${translatedHeaders.join(', ')}\n`;
        
        const sampleRows = sheetData.slice(1, 6); // Show first 5 products
        if (sampleRows.length > 0) {
          context += "Sample products:\n";
          sampleRows.forEach((row: any[], index: number) => {
            const rowData = translatedHeaders.map((header, i) => `${header}: ${row[i] || ''}`).join(', ');
            context += `Product ${index + 1}: ${rowData}\n`;
          });
        }
      }
      context += "\n";
    }
  });
  
  return context;
}
