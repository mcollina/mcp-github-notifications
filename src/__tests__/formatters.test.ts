/**
 * Tests for formatter utilities
 */
import { convertApiUrlToHtmlUrl } from '../utils/formatters';

describe('URL Conversion Tests', () => {
  test('converts pull request API URLs to HTML URLs correctly', () => {
    const apiUrl = 'https://api.github.com/repos/nodejs/node/pulls/57557';
    const expectedHtmlUrl = 'https://github.com/nodejs/node/pull/57557';
    
    expect(convertApiUrlToHtmlUrl(apiUrl)).toBe(expectedHtmlUrl);
  });

  test('converts issue API URLs to HTML URLs correctly', () => {
    const apiUrl = 'https://api.github.com/repos/nodejs/node/issues/12345';
    const expectedHtmlUrl = 'https://github.com/nodejs/node/issues/12345';
    
    expect(convertApiUrlToHtmlUrl(apiUrl)).toBe(expectedHtmlUrl);
  });

  test('converts repository API URLs to HTML URLs correctly', () => {
    const apiUrl = 'https://api.github.com/repos/nodejs/node';
    const expectedHtmlUrl = 'https://github.com/nodejs/node';
    
    expect(convertApiUrlToHtmlUrl(apiUrl)).toBe(expectedHtmlUrl);
  });

  test('handles URLs with additional path segments', () => {
    const apiUrl = 'https://api.github.com/repos/nodejs/node/pulls/57557/comments';
    const expectedHtmlUrl = 'https://github.com/nodejs/node/pull/57557/comments';
    
    expect(convertApiUrlToHtmlUrl(apiUrl)).toBe(expectedHtmlUrl);
  });
});
