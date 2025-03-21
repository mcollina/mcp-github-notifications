/**
 * Manual test script for URL conversion
 * 
 * Run with:
 * ts-node src/scripts/test-url-conversion.ts
 */
import { convertApiUrlToHtmlUrl } from '../utils/formatters.js';

// Test cases
const testCases = [
  'https://api.github.com/repos/nodejs/node/pulls/57557',
  'https://api.github.com/repos/nodejs/node/pulls/57557/comments',
  'https://api.github.com/repos/nodejs/node/issues/12345',
  'https://api.github.com/repos/nodejs/node',
];

// Run tests
console.log('Testing URL conversion:\n');

testCases.forEach(apiUrl => {
  const htmlUrl = convertApiUrlToHtmlUrl(apiUrl);
  console.log(`API URL:  ${apiUrl}`);
  console.log(`HTML URL: ${htmlUrl}`);
  console.log('');
});
