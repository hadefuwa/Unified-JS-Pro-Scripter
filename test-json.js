// Simple test script to validate templates.json
const fs = require('fs');
const path = require('path');

console.log('Starting JSON test script...');

try {
  // Get the file path
  const jsonPath = path.join(__dirname, 'templates.json');
  console.log(`Reading file: ${jsonPath}`);
  
  // Check if file exists
  if (!fs.existsSync(jsonPath)) {
    console.error('ERROR: templates.json file not found!');
    process.exit(1);
  }
  
  // Read the file content
  let fileContent;
  try {
    fileContent = fs.readFileSync(jsonPath, 'utf8');
    console.log(`File size: ${fileContent.length} bytes`);
    console.log(`First 100 characters: ${fileContent.substring(0, 100).replace(/\n/g, '\\n')}`);
  } catch (readError) {
    console.error('ERROR reading file:', readError.message);
    process.exit(1);
  }
  
  // Check for BOM
  if (fileContent.charCodeAt(0) === 0xFEFF) {
    console.log('WARNING: File has UTF-8 BOM marker, removing it');
    fileContent = fileContent.slice(1);
  }
  
  // Try to parse the JSON
  try {
    const data = JSON.parse(fileContent);
    console.log('JSON parsed successfully!');
    
    // Check templates array
    if (!data.templates) {
      console.error('ERROR: No templates array found in JSON!');
      process.exit(1);
    }
    
    console.log(`Found ${data.templates.length} templates in JSON file`);
    
    // List all templates
    console.log('\nTemplates found:');
    data.templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.id} - ${template.title} (${template.category})`);
    });
    
    // List all categories
    const categories = [...new Set(data.templates.map(t => t.category))];
    console.log(`\nFound ${categories.length} categories: ${categories.join(', ')}`);
    
    console.log('\nJSON validation successful!');
  } catch (parseError) {
    console.error('ERROR parsing JSON:', parseError.message);
    
    // Try to identify where the JSON syntax error might be
    const errorMatch = parseError.message.match(/position (\d+)/);
    if (errorMatch && errorMatch[1]) {
      const position = parseInt(errorMatch[1]);
      const start = Math.max(0, position - 20);
      const end = Math.min(fileContent.length, position + 20);
      console.error(`Error near position ${position}:`);
      console.error(fileContent.substring(start, end).replace(/\n/g, '\\n'));
      console.error(' '.repeat(Math.min(20, position - start)) + '^');
    }
    
    // Try to fix common JSON issues
    console.log('\nAttempting to fix JSON...');
    
    // Fix 1: Try to parse with JSON5 (more lenient JSON parser)
    try {
      // Use eval as a last resort (in controlled environment)
      const fixedData = eval('(' + fileContent + ')');
      console.log('Fixed JSON using eval!');
      
      // Write the fixed JSON back
      const fixedJson = JSON.stringify(fixedData, null, 2);
      fs.writeFileSync(jsonPath + '.fixed', fixedJson, 'utf8');
      console.log(`Fixed JSON written to ${jsonPath}.fixed`);
      
      // Count templates
      if (fixedData.templates) {
        console.log(`Found ${fixedData.templates.length} templates in fixed JSON`);
      }
    } catch (evalError) {
      console.error('Could not fix JSON with eval:', evalError.message);
    }
    
    process.exit(1);
  }
} catch (error) {
  console.error('General error:', error.message);
  process.exit(1);
} 