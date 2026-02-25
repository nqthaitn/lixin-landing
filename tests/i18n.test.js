import { describe, it, expect } from 'vitest';
import { translations } from '../src/i18n.js';

describe('i18n translations', () => {
  const languages = ['vi', 'en', 'zh'];

  it('should have all 3 languages', () => {
    languages.forEach((lang) => {
      expect(translations[lang]).toBeDefined();
    });
  });

  it('should have matching keys across all languages', () => {
    const viKeys = Object.keys(translations.vi).sort();
    const enKeys = Object.keys(translations.en).sort();
    const zhKeys = Object.keys(translations.zh).sort();

    expect(enKeys).toEqual(viKeys);
    expect(zhKeys).toEqual(viKeys);
  });

  it('should not have empty translation values', () => {
    languages.forEach((lang) => {
      Object.entries(translations[lang]).forEach(([key, value]) => {
        expect(value, `${lang}.${key} is empty`).toBeTruthy();
        expect(typeof value, `${lang}.${key} is not string`).toBe('string');
      });
    });
  });

  it('should have nav keys in all languages', () => {
    const navKeys = ['nav.services', 'nav.about', 'nav.news', 'nav.contact', 'nav.cta'];
    languages.forEach((lang) => {
      navKeys.forEach((key) => {
        expect(translations[lang][key], `Missing ${lang}.${key}`).toBeDefined();
      });
    });
  });

  it('should have form option keys in all languages', () => {
    const optKeys = [
      'form.opt.general',
      'form.opt.tax',
      'form.opt.accounting',
      'form.opt.signature',
      'form.opt.setup',
      'form.opt.other',
    ];
    languages.forEach((lang) => {
      optKeys.forEach((key) => {
        expect(translations[lang][key], `Missing ${lang}.${key}`).toBeDefined();
      });
    });
  });

  it('hero.title should contain highlight span in all languages', () => {
    languages.forEach((lang) => {
      expect(translations[lang]['hero.title']).toContain("class='highlight'");
    });
  });
});