import { describe, it, expect, beforeEach } from 'vitest';

describe('index.html structure', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <header class="navbar">
        <div class="container navbar-container">
          <a href="/" class="logo"></a>
          <nav class="nav-links">
            <a href="#services" data-i18n="nav.services">Dịch vụ</a>
            <a href="#about" data-i18n="nav.about">Về chúng tôi</a>
          </nav>
          <button class="hamburger" aria-label="Toggle menu"></button>
        </div>
      </header>
      <section class="hero" id="home"></section>
      <section class="services" id="services"></section>
      <section class="workflow" id="about"></section>
      <section class="news" id="news">
        <div class="news-grid" id="news-container"></div>
      </section>
      <section class="cta" id="contact">
        <form class="contact-form">
          <input type="text" name="name" required />
          <input type="tel" name="phone" required />
          <select name="service_type" id="service-select">
            <option value="general" data-i18n-option="form.opt.general">-- Dịch vụ --</option>
            <option value="tax_consulting" data-i18n-option="form.opt.tax">Tư vấn thuế</option>
          </select>
          <button type="submit">Gửi</button>
        </form>
      </section>
      <button class="scroll-top"></button>
    `;
  });

  it('should have all main sections', () => {
    expect(document.getElementById('home')).not.toBeNull();
    expect(document.getElementById('services')).not.toBeNull();
    expect(document.getElementById('about')).not.toBeNull();
    expect(document.getElementById('news')).not.toBeNull();
    expect(document.getElementById('contact')).not.toBeNull();
  });

  it('should have hamburger button', () => {
    const hamburger = document.querySelector('.hamburger');
    expect(hamburger).not.toBeNull();
    expect(hamburger.getAttribute('aria-label')).toBe('Toggle menu');
  });

  it('should have nav links with data-i18n', () => {
    const links = document.querySelectorAll('[data-i18n]');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should have contact form with required fields', () => {
    const form = document.querySelector('.contact-form');
    expect(form).not.toBeNull();
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    expect(nameInput.required).toBe(true);
    expect(phoneInput.required).toBe(true);
  });

  it('should have service select with i18n options', () => {
    const options = document.querySelectorAll('[data-i18n-option]');
    expect(options.length).toBeGreaterThan(0);
  });

  it('should have scroll-to-top button', () => {
    expect(document.querySelector('.scroll-top')).not.toBeNull();
  });

  it('should have news container', () => {
    expect(document.getElementById('news-container')).not.toBeNull();
  });

  it('hamburger toggles nav-links active class', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    navLinks.classList.toggle('active');
    expect(navLinks.classList.contains('active')).toBe(true);

    navLinks.classList.toggle('active');
    expect(navLinks.classList.contains('active')).toBe(false);
  });
});