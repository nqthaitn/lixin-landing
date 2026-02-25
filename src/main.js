import './style.css';
import { translations } from './i18n.js';
import { getNews, saveContactRequest } from './newsStorage.js';

let currentLang = 'vi';

function applyTranslations(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update texts
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerHTML = translations[lang][key];
      }
    }
  });

  // Update language switcher UI
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update select option texts
  document.querySelectorAll('[data-i18n-option]').forEach(option => {
    const key = option.getAttribute('data-i18n-option');
    if (translations[lang] && translations[lang][key]) {
      option.textContent = translations[lang][key];
    }
  });

  // Re-render news with new language
  renderNews();
}

// ============================================================
// Render News cards (uses flat column names from Supabase schema)
// ============================================================
async function renderNews() {
  const container = document.getElementById('news-container');
  if (!container) return;

  const allNews = await getNews();
  const newsItems = allNews.filter(n => n.is_highlight);

  container.innerHTML = newsItems.map(item => {
    // Dynamically pick the correct language column
    const title = item[`title_${currentLang}`] || item.title_vi || '';
    const excerpt = item[`excerpt_${currentLang}`] || item.excerpt_vi || '';
    const isAi = item.author_role === 'ai_agent';
    const dateStr = item.created_at ? item.created_at.split('T')[0] : '';

    return `
    <div class="news-card pre-animate">
      <img src="${item.cover_image}" alt="${title}" class="news-img" />
      <div class="news-content">
        <div class="news-date">${dateStr}</div>
        <h3 class="news-title">${title}</h3>
        <p class="news-excerpt">${excerpt}</p>
        <div class="news-author">
          ${isAi
        ? '<span class="ai-badge">AI Agent</span>'
        : '<span class="ai-badge" style="background:var(--accent-secondary)">Admin</span>'}
          <span>${item.author}</span>
        </div>
      </div>
    </div>
  `;
  }).join('');

  // Observe new elements for scroll animations
  initObserver();
}

// ============================================================
// Intersection Observer (scroll animations)
// ============================================================
let observer;
function initObserver() {
  if (!observer) {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-up');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);
  }

  document.querySelectorAll('.pre-animate:not(.animate-up)').forEach(el => {
    observer.observe(el);
  });
}

// ============================================================
// Contact form submission
// Maps to Supabase `contacts` table columns
// ============================================================
async function handleContactFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get('name');
  const phone = formData.get('phone');
  const email = formData.get('email');
  const company_name = formData.get('company_name');
  const service_type = formData.get('service_type');
  const message = formData.get('message');

  const submitBtn = document.querySelector('.contact-form button[type="submit"]');
  const orgText = submitBtn.innerText;

  submitBtn.innerText = "...";
  submitBtn.disabled = true;

  try {
    await saveContactRequest({
      name,
      phone,
      email: email || null,
      company_name: company_name || null,
      service_type: service_type || 'general',
      message: message || null,
      language: currentLang
    });

    // Success feedback (multi-language)
    const msgs = {
      vi: 'Cảm ơn! Yêu cầu của bạn đã được gửi thành công. Lixin sẽ liên hệ sớm.',
      en: 'Thank you! Your request was sent successfully. Lixin will contact you soon.',
      zh: '谢谢！您的请求已成功发送。力信将尽快与您联系。'
    };
    alert(msgs[currentLang] || msgs.vi);
    e.target.reset();
  } catch (err) {
    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
  } finally {
    submitBtn.innerText = orgText;
    submitBtn.disabled = false;
  }
}

// ============================================================
// DOM Ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Language switcher
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      applyTranslations(e.target.getAttribute('data-lang'));
    });
  });

  // Register scroll animation targets
  document.querySelectorAll('section, .service-card, .feat-item, .glass-card, .cta-box').forEach(el => {
    el.classList.add('pre-animate');
  });

  // Attach contact form handler
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactFormSubmit);
  }

  // Default language
  applyTranslations('vi');
});

// ============================================================
// Hamburger Menu & Scroll UI
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.querySelector('.scroll-top');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const expanded = navLinks.classList.contains('active');
      hamburger.setAttribute('aria-expanded', expanded);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll events
  window.addEventListener('scroll', () => {
    // Sticky navbar
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll to top button
    if (scrollTopBtn) {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});
