import { checkAuth, signIn, signOut } from './auth.js';
import { getNews, saveNews, deleteNews, getContacts } from './newsStorage.js';
import { supabase } from './supabase.js';

// Auth gate logic
async function initAuth() {
  const session = await checkAuth();
  const gate = document.getElementById('auth-gate');

  if (session) {
    gate.classList.add('hidden');
    initAdmin(); // existing admin init
  } else {
    gate.classList.remove('hidden');
  }
}

// Login form handler
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');

  try {
    await signIn(email, password);
    document.getElementById('auth-gate').classList.add('hidden');
    initAdmin();
  } catch (err) {
    errorEl.textContent = 'Invalid email or password';
    errorEl.style.display = 'block';
  }
});

// Sign out
document.getElementById('sign-out-btn')?.addEventListener('click', signOut);

async function loadDashboardStats() {
  const news = await getNews();
  const contacts = await getContacts();

  document.getElementById('stat-posts').textContent = news.length;
  document.getElementById('stat-contacts').textContent = contacts.length;
  document.getElementById('stat-new').textContent = contacts.filter(
    (c) => c.status === 'new'
  ).length;
  document.getElementById('stat-highlights').textContent = news.filter(
    (n) => n.is_highlight
  ).length;
}

// ============================================================
// Quill Editor Configuration
// ============================================================
const QUILL_TOOLBAR = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  [{ align: [] }],
  ['link', 'image'],
  ['clean'],
];

let quillVI, quillEN, quillZH;

function initQuillEditors() {
  const options = {
    theme: 'snow',
    modules: { toolbar: QUILL_TOOLBAR },
    placeholder: 'Write your content here...',
  };

  quillVI = new Quill('#editor-vi', {
    ...options,
    placeholder: 'Viết nội dung bài viết tại đây...',
  });

  quillEN = new Quill('#editor-en', {
    ...options,
    placeholder: 'Write your article content here...',
  });

  quillZH = new Quill('#editor-zh', {
    ...options,
    placeholder: '在此撰写文章内容...',
  });
}

// ============================================================
// DOM Ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
});

function initAdmin() {
  const formContainer = document.getElementById('post-form-container');
  const toggleBtn = document.getElementById('toggle-form-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const newsForm = document.getElementById('news-form');
  const newsTableBody = document.getElementById('news-table-body');
  const contactsTableBody = document.getElementById('contacts-table-body');

  // ============================================================
  // Tab switching (News / Contacts)
  // ============================================================
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach((tc) => {
        tc.style.display = tc.id === tab ? 'block' : 'none';
      });
    });
  });

  // ============================================================
  // Language editor tab switching (VI / EN / ZH)
  // ============================================================
  document.querySelectorAll('.lang-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-editor-lang');
      document.querySelectorAll('.lang-editor-panel').forEach((p) => {
        p.classList.toggle('active', p.id === `editor-panel-${lang}`);
      });
    });
  });

  // ============================================================
  // Toggle post form
  // ============================================================
  toggleBtn.addEventListener('click', () => {
    formContainer.style.display = 'block';
    toggleBtn.style.display = 'none';

    // Init Quill editors if first time
    if (!quillVI) {
      initQuillEditors();
    }
  });

  cancelBtn.addEventListener('click', () => {
    formContainer.style.display = 'none';
    toggleBtn.style.display = 'inline-block';
    newsForm.reset();
    // Clear Quill content
    if (quillVI) quillVI.setContents([]);
    if (quillEN) quillEN.setContents([]);
    if (quillZH) quillZH.setContents([]);
  });

  // ============================================================
  // Submit new news post
  // ============================================================
  newsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const authorVal = document.getElementById('news-author').value;
    const isAi = authorVal === 'ai_agent';

    // Get rich text content as HTML
    const contentVI = quillVI ? quillVI.root.innerHTML : '';
    const contentEN = quillEN ? quillEN.root.innerHTML : '';
    const contentZH = quillZH ? quillZH.root.innerHTML : '';

    // Check if Quill has actual content (not just empty paragraphs)
    const getTextLength = (quill) => (quill ? quill.getText().trim().length : 0);

    const newPost = {
      author: isAi ? 'AI Agent Lixin' : 'Lixin Admin',
      author_role: authorVal,
      status: 'published',
      is_highlight: document.getElementById('news-highlight').checked,
      cover_image: document.getElementById('news-img').value,
      category: document.getElementById('news-category').value,

      title_vi: document.getElementById('news-title-vi').value,
      excerpt_vi: document.getElementById('news-excerpt-vi').value,
      content_vi: getTextLength(quillVI) > 0 ? contentVI : null,

      title_en: document.getElementById('news-title-en').value,
      excerpt_en: document.getElementById('news-excerpt-en').value,
      content_en: getTextLength(quillEN) > 0 ? contentEN : null,

      title_zh: document.getElementById('news-title-zh').value,
      excerpt_zh: document.getElementById('news-excerpt-zh').value,
      content_zh: getTextLength(quillZH) > 0 ? contentZH : null,
    };

    await saveNews(newPost);
    formContainer.style.display = 'none';
    toggleBtn.style.display = 'inline-block';
    newsForm.reset();
    if (quillVI) quillVI.setContents([]);
    if (quillEN) quillEN.setContents([]);
    if (quillZH) quillZH.setContents([]);
    await renderNewsTable();

    alert('✅ Post published successfully!');
  });

  // ============================================================
  // Render News table
  // ============================================================
  async function renderNewsTable() {
    const news = await getNews();
    newsTableBody.innerHTML = news
      .map((item) => {
        const isAi = item.author_role === 'ai_agent';
        const dateStr = item.created_at ? item.created_at.split('T')[0] : '';
        const hasContent = item.content_vi || item.content_en || item.content_zh;
        return `
      <tr>
        <td>${dateStr}</td>
        <td>
          ${isAi ? '<span class="ai-badge">AI</span>' : '<span class="ai-badge" style="background:var(--accent-secondary)">Admin</span>'}
          ${item.author}
        </td>
        <td>
          ${item.title_en || item.title_vi}
          ${hasContent ? '<br><small style="color:#6b7280">📄 Has rich content</small>' : ''}
        </td>
        <td><span class="category-tag">${item.category || 'general'}</span></td>
        <td>${item.is_highlight ? '⭐' : '—'}</td>
        <td>
          ${hasContent ? `<button class="action-btn" onclick="previewPost(${item.id})" style="margin-right:0.5rem">👁 Preview</button>` : ''}
          <button class="action-btn" onclick="deletePost(${item.id})">🗑 Delete</button>
        </td>
      </tr>
    `;
      })
      .join('');
  }

  // ============================================================
  // Preview post content in modal
  // ============================================================
  window.previewPost = async (id) => {
    const news = await getNews();
    const post = news.find((n) => n.id === id);
    if (!post) return;

    const content =
      post.content_en || post.content_vi || post.content_zh || '<p>No content available</p>';
    const title = post.title_en || post.title_vi || 'Untitled';

    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText =
      'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;padding:2rem;';
    modal.innerHTML = `
      <div style="background:#1a1b1e;border:1px solid rgba(255,255,255,0.1);border-radius:16px;max-width:800px;width:100%;max-height:80vh;overflow-y:auto;padding:3rem;position:relative;">
        <button onclick="this.closest('div[style*=fixed]').remove()" style="position:absolute;top:1rem;right:1.5rem;background:none;border:none;color:#9ca3af;font-size:1.5rem;cursor:pointer;">✕</button>
        <div style="margin-bottom:1rem;">
          <span class="category-tag">${post.category || 'general'}</span>
          <span style="color:#6b7280;margin-left:0.75rem;font-size:0.9rem">${post.created_at ? post.created_at.split('T')[0] : ''}</span>
        </div>
        <h2 style="color:#fff;margin-bottom:1.5rem;font-size:1.75rem;">${title}</h2>
        <div style="color:#d1d5db;line-height:1.8;font-size:1rem;" class="preview-content">${content}</div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  };

  // ============================================================
  // Render Contacts table
  // ============================================================
  async function renderContactsTable() {
    const contacts = await getContacts();
    if (!contactsTableBody) return;

    if (contacts.length === 0) {
      contactsTableBody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;color:var(--text-secondary)">No contact requests yet</td></tr>';
      return;
    }

    contactsTableBody.innerHTML = contacts
      .map((c) => {
        const dateStr = c.created_at ? c.created_at.split('T')[0] : '';
        return `
      <tr>
        <td>${dateStr}</td>
        <td><strong>${c.name}</strong></td>
        <td>${c.phone}</td>
        <td>${c.email || '—'}</td>
        <td>${c.company_name || '—'}</td>
        <td>${c.service_type || 'general'}</td>
        <td>
            <select class="status-select" data-id="${c.id}" onchange="updateContactStatus(this)">
              <option value="new" ${c.status === 'new' ? 'selected' : ''}>🆕 New</option>
              <option value="contacted" ${c.status === 'contacted' ? 'selected' : ''}>📞 Contacted</option>
              <option value="in_progress" ${c.status === 'in_progress' ? 'selected' : ''}>⏳ In Progress</option>
              <option value="quoted" ${c.status === 'quoted' ? 'selected' : ''}>💰 Quoted</option>
              <option value="converted" ${c.status === 'converted' ? 'selected' : ''}>✅ Converted</option>
              <option value="lost" ${c.status === 'lost' ? 'selected' : ''}>❌ Lost</option>
            </select>
        </td>
        <td>${c.language || 'vi'}</td>
      </tr>
    `;
      })
      .join('');
  }

  // Global update contact status
  window.updateContactStatus = async (selectEl) => {
    const id = selectEl.getAttribute('data-id');
    const newStatus = selectEl.value;
    const { error } = await supabase.from('contacts').update({ status: newStatus }).eq('id', id);
    if (error) {
      alert('Failed to update status');
      console.error(error);
    } else {
      loadDashboardStats();
    }
  };

  // Global delete function
  window.deletePost = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deleteNews(id);
      await renderNewsTable();
      loadDashboardStats();
    }
  };

  // Initial render
  renderNewsTable();
  renderContactsTable();
  loadDashboardStats();
}
