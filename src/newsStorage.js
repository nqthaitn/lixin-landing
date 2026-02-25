import { supabase } from './supabase.js';

// ============================================================
// Chế độ Mock (LocalStorage) hoặc Supabase thật
// Đổi USE_MOCK = false khi đã cấu hình Supabase URL/Key
// ============================================================
const USE_MOCK = false;

// ============================================================
// HELPER: Tạo ID cho mock
// ============================================================
const mockId = () => Date.now() + Math.floor(Math.random() * 1000);

// ============================================================
// 1. NEWS (Tin tức)
// Cột Supabase: id, created_at, updated_at, published_at,
//   author, author_role, status, is_highlight,
//   cover_image, thumbnail, category, tags,
//   title_vi, excerpt_vi, content_vi,
//   title_en, excerpt_en, content_en,
//   title_zh, excerpt_zh, content_zh,
//   slug, meta_desc_vi, meta_desc_en, meta_desc_zh,
//   view_count, like_count
// ============================================================

const DEFAULT_NEWS = [
  {
    id: 1,
    created_at: '2026-02-25T10:00:00Z',
    author: 'AI Agent Lixin',
    author_role: 'ai_agent',
    status: 'published',
    is_highlight: true,
    cover_image:
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    category: 'tax_update',
    tags: ['thuế khoán', 'hộ kinh doanh', '2026'],
    title_vi: 'Bãi bỏ thuế khoán từ 01/01/2026: Hộ kinh doanh cần chuẩn bị gì?',
    excerpt_vi:
      'Từ ngày 1/1/2026, hình thức thuế khoán chính thức bị bãi bỏ theo Nghị quyết 198/2025/QH15. Hộ kinh doanh phải chuyển sang tự kê khai, tự tính và tự nộp thuế.',
    content_vi: `<h2>Thuế khoán chính thức bị bãi bỏ</h2>
<p>Theo <strong>Nghị quyết 198/2025/QH15</strong> của Quốc hội, kể từ ngày <strong>01/01/2026</strong>, toàn bộ hộ kinh doanh sẽ không còn được áp dụng phương pháp thuế khoán (thuế ấn định). Thay vào đó, hộ kinh doanh phải thực hiện:</p>
<ul>
<li><strong>Tự kê khai</strong> doanh thu thực tế phát sinh</li>
<li><strong>Tự tính thuế</strong> dựa trên doanh thu hoặc lợi nhuận</li>
<li><strong>Tự nộp thuế</strong> đúng hạn theo quy định</li>
</ul>
<h2>Ngưỡng doanh thu mới: 500 triệu đồng/năm</h2>
<p>Ngưỡng doanh thu không phải nộp thuế GTGT và TNCN được <strong>nâng từ 100 triệu lên 500 triệu đồng/năm</strong>. Hộ kinh doanh có doanh thu dưới mức này vẫn phải thông báo doanh thu cho cơ quan thuế trước ngày 31/1 hàng năm.</p>
<h2>Thuế suất theo bậc doanh thu</h2>
<blockquote>Doanh thu 500 triệu – 3 tỷ: thuế suất TNCN <strong>15%</strong> trên lợi nhuận<br>Doanh thu 3 tỷ – 50 tỷ: thuế suất TNCN <strong>17%</strong><br>Doanh thu trên 50 tỷ: thuế suất TNCN <strong>20%</strong></blockquote>
<p>Đồng thời, <strong>lệ phí môn bài cũng được bãi bỏ</strong> từ 01/01/2026, giúp giảm gánh nặng cho hộ kinh doanh nhỏ.</p>
<p><em>Lixin khuyến nghị các hộ kinh doanh nên bắt đầu chuẩn bị hệ thống sổ sách ngay từ bây giờ để sẵn sàng cho quy trình mới.</em></p>`,
    title_en: 'Abolition of Lump-Sum Tax from Jan 2026: What Household Businesses Must Prepare',
    excerpt_en:
      'From January 1, 2026, the lump-sum tax method is officially abolished under Resolution 198. Household businesses must transition to self-declaration and self-assessment.',
    content_en: `<h2>Lump-Sum Tax Officially Abolished</h2>
<p>Under <strong>Resolution 198/2025/QH15</strong>, effective <strong>January 1, 2026</strong>, all household businesses in Vietnam will no longer use the lump-sum tax method. Instead, they must:</p>
<ul>
<li><strong>Self-declare</strong> actual revenue</li>
<li><strong>Self-calculate</strong> taxes based on revenue or profit</li>
<li><strong>Self-pay</strong> taxes on schedule</li>
</ul>
<h2>New Revenue Threshold: VND 500 Million/Year</h2>
<p>The tax-exempt threshold has been <strong>raised from VND 100 million to VND 500 million per year</strong>. Businesses below this threshold are exempt from VAT and PIT but must still report actual revenue by January 31 annually.</p>
<h2>Tiered Tax Rates by Revenue</h2>
<blockquote>VND 500M – 3B revenue: PIT at <strong>15%</strong> on profit<br>VND 3B – 50B: PIT at <strong>17%</strong><br>Above VND 50B: PIT at <strong>20%</strong></blockquote>
<p>Additionally, <strong>business license tax is also abolished</strong> from January 1, 2026.</p>`,
    title_zh: '2026年1月起废除定额税：个体户需要准备什么？',
    excerpt_zh:
      '自2026年1月1日起，越南正式废除定额税征收方式。个体经营户必须转为自行申报、自行计算、自行缴税。',
    content_zh: `<h2>定额税正式废除</h2>
<p>根据<strong>第198/2025/QH15号决议</strong>，自<strong>2026年1月1日</strong>起，所有个体经营户将不再适用定额税方式，必须：</p>
<ul><li>自行申报实际营收</li><li>自行计算应缴税款</li><li>按时自行缴纳税款</li></ul>
<h2>免税门槛提高至5亿越盾/年</h2>
<p>增值税和个人所得税的免税营收门槛从1亿提高至<strong>5亿越盾/年</strong>。</p>`,
    view_count: 342,
    like_count: 89,
  },
  {
    id: 2,
    created_at: '2026-02-20T08:00:00Z',
    author: 'Lixin Admin',
    author_role: 'admin',
    status: 'published',
    is_highlight: true,
    cover_image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    category: 'tax_update',
    tags: ['thuế TNDN', 'doanh nghiệp nhỏ', 'ưu đãi'],
    title_vi: 'Thuế TNDN mới: Doanh nghiệp siêu nhỏ chỉ nộp 15%, doanh nghiệp nhỏ 17%',
    excerpt_vi:
      'Luật thuế TNDN mới (Luật 67/2025/QH15) có hiệu lực từ 01/10/2025 mang đến thuế suất ưu đãi cho doanh nghiệp vừa và nhỏ. đây là cơ hội lớn cho SMEs.',
    content_vi: `<h2>Thuế suất ưu đãi cho SMEs</h2>
<p>Luật thuế Thu nhập Doanh nghiệp mới (<strong>Luật 67/2025/QH15</strong>) chính thức có hiệu lực từ <strong>01/10/2025</strong>, mang đến 3 mức thuế suất:</p>
<ul>
<li>🟢 <strong>15%</strong> — Doanh nghiệp siêu nhỏ (doanh thu dưới 3 tỷ đồng/năm)</li>
<li>🟡 <strong>17%</strong> — Doanh nghiệp nhỏ (doanh thu 3 – 50 tỷ đồng/năm)</li>
<li>🔴 <strong>20%</strong> — Doanh nghiệp thông thường (mức chuẩn)</li>
</ul>
<h2>Mở rộng chi phí được khấu trừ</h2>
<p>Luật mới cho phép khấu trừ nhiều loại chi phí hơn:</p>
<ul>
<li>Chi phí <strong>R&D, đổi mới sáng tạo</strong></li>
<li>Chi phí <strong>chuyển đổi số</strong></li>
<li>Chi phí <strong>ESG</strong> (Môi trường, Xã hội, Quản trị)</li>
<li>Chi phí <strong>phát triển bền vững</strong></li>
</ul>
<h2>Ưu đãi cho ngành chiến lược</h2>
<p>Ưu đãi thuế TNDN tập trung vào các ngành: <strong>AI, bán dẫn, năng lượng xanh, công nghệ cao, trung tâm R&D</strong>. Đồng thời, ưu đãi cho khu công nghiệp đã bị loại bỏ.</p>`,
    title_en: 'New CIT Law: Micro-enterprises Pay Only 15%, Small Businesses 17%',
    excerpt_en:
      'The new Corporate Income Tax Law (Law 67/2025) effective October 2025 introduces tiered preferential rates for SMEs — a major opportunity for small businesses.',
    content_en: `<h2>Preferential Tax Rates for SMEs</h2>
<p>The new CIT Law (<strong>Law 67/2025/QH15</strong>) effective <strong>October 1, 2025</strong> introduces:</p>
<ul>
<li>🟢 <strong>15%</strong> — Micro-enterprises (revenue under VND 3 billion)</li>
<li>🟡 <strong>17%</strong> — Small enterprises (VND 3–50 billion revenue)</li>
<li>🔴 <strong>20%</strong> — Standard rate</li>
</ul>
<h2>Expanded Deductible Expenses</h2>
<p>R&D, digital transformation, ESG, and sustainability costs are now deductible.</p>
<h2>Strategic Sector Incentives</h2>
<p>Tax incentives now target <strong>AI, semiconductors, green energy, high-tech, and R&D centers</strong>.</p>`,
    title_zh: '新企业所得税法：微型企业仅需缴纳15%，小型企业17%',
    excerpt_zh: '新企业所得税法（第67/2025号法律）自2025年10月起生效，为中小企业引入分级优惠税率。',
    content_zh: `<h2>中小企业优惠税率</h2><p>新法引入三级税率：微型企业<strong>15%</strong>，小型企业<strong>17%</strong>，标准税率<strong>20%</strong>。</p>`,
    view_count: 456,
    like_count: 112,
  },
  {
    id: 3,
    created_at: '2026-02-15T09:30:00Z',
    author: 'AI Agent Lixin',
    author_role: 'ai_agent',
    status: 'published',
    is_highlight: true,
    cover_image:
      'https://images.unsplash.com/photo-1563986768609-322da13575f2?auto=format&fit=crop&q=80&w=800',
    category: 'legal',
    tags: ['sàn TMĐT', 'thuế', 'kinh doanh online'],
    title_vi: 'Sàn thương mại điện tử phải khấu trừ và nộp thuế thay người bán từ 2025',
    excerpt_vi:
      'Kể từ 01/04/2025, các sàn TMĐT có chức năng thanh toán chính thức phải kê khai và nộp thuế thay cho người bán trên nền tảng. Đây là bước ngoặt cho kinh doanh online.',
    content_vi: `<h2>Sàn TMĐT nộp thuế thay người bán</h2>
<p>Theo <strong>Luật số 56/2024/QH15</strong>, từ ngày <strong>01/04/2025</strong>, các sàn thương mại điện tử có chức năng thanh toán sẽ phải:</p>
<ul>
<li>Khấu trừ thuế GTGT và TNCN ngay tại nguồn</li>
<li>Kê khai và nộp thuế thay cho hộ kinh doanh / cá nhân kinh doanh</li>
<li>Gửi dữ liệu giao dịch cho cơ quan thuế</li>
</ul>
<h2>Hóa đơn điện tử bắt buộc</h2>
<p>Từ <strong>01/06/2025</strong> (Nghị định 70/2025/NĐ-CP), hộ kinh doanh có doanh thu <strong>từ 1 tỷ đồng/năm</strong> phải sử dụng hóa đơn điện tử khởi tạo từ máy tính tiền có kết nối với cơ quan thuế.</p>
<h2>Thanh toán không dùng tiền mặt</h2>
<p>Từ <strong>01/07/2025</strong>, mọi giao dịch mua bán hàng hóa/dịch vụ từ <strong>5 triệu đồng trở lên</strong> bắt buộc phải thanh toán không dùng tiền mặt để được khấu trừ thuế GTGT đầu vào.</p>`,
    title_en: 'E-commerce Platforms Must Withhold and Pay Taxes for Sellers from 2025',
    excerpt_en:
      'From April 2025, e-commerce platforms with payment functions must declare and pay taxes on behalf of sellers. A watershed moment for online business taxation.',
    content_en: `<h2>Platforms Pay Tax on Behalf of Sellers</h2>
<p>Under <strong>Law No. 56/2024/QH15</strong>, from <strong>April 1, 2025</strong>, e-commerce platforms must withhold VAT and PIT at source and file taxes for individual sellers.</p>
<h2>Mandatory E-invoices</h2>
<p>From June 2025, household businesses with revenue over <strong>VND 1 billion/year</strong> must use e-invoices linked to tax authorities.</p>
<h2>Non-Cash Payments Required</h2>
<p>From July 2025, all transactions over <strong>VND 5 million</strong> must use non-cash payment to claim input VAT credits.</p>`,
    title_zh: '2025年起电商平台必须代扣代缴卖家税款',
    excerpt_zh:
      '自2025年4月起，具有支付功能的电商平台必须代卖家申报和缴纳税款。这是线上商业税务的重大变革。',
    content_zh: `<h2>平台代扣代缴</h2><p>根据第56/2024/QH15号法律，电商平台需代扣增值税和个人所得税。</p>`,
    view_count: 289,
    like_count: 76,
  },
  {
    id: 4,
    created_at: '2026-02-10T14:00:00Z',
    author: 'Lixin Admin',
    author_role: 'admin',
    status: 'published',
    is_highlight: true,
    cover_image:
      'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?auto=format&fit=crop&q=80&w=800',
    category: 'accounting',
    tags: ['TNCN', 'giảm trừ', 'lũy tiến'],
    title_vi: 'Biểu thuế TNCN lũy tiến mới: Giảm từ 7 bậc xuống 5 bậc, giảm trừ gia cảnh tăng',
    excerpt_vi:
      'Luật thuế TNCN mới có hiệu lực từ 07/2026 giảm biểu thuế lũy tiến từ 7 xuống 5 bậc. Mức giảm trừ gia cảnh tăng lên 15,5 triệu/tháng cho người nộp thuế.',
    content_vi: `<h2>Biểu thuế lũy tiến mới</h2>
<p><strong>Luật thuế TNCN mới (Luật 109/2025/QH15)</strong> có hiệu lực từ <strong>01/07/2026</strong> mang đến thay đổi lớn:</p>
<ul>
<li>Giảm từ <strong>7 bậc xuống 5 bậc</strong> thuế lũy tiến</li>
<li>Nới rộng ngưỡng thu nhập cho mỗi bậc</li>
<li>Giảm gánh nặng thuế cho người thu nhập trung bình</li>
</ul>
<h2>Giảm trừ gia cảnh tăng mạnh</h2>
<p>Có hiệu lực từ <strong>tháng 3/2026</strong>:</p>
<ul>
<li>Người nộp thuế: <strong>15,5 triệu đồng/tháng</strong> (tăng từ 11 triệu)</li>
<li>Người phụ thuộc: <strong>6,2 triệu đồng/tháng</strong> (tăng từ 4,4 triệu)</li>
</ul>
<h2>Mở rộng thu nhập miễn thuế</h2>
<p>Các khoản thu nhập mới được miễn thuế TNCN:</p>
<ul>
<li>Tiền làm ca đêm, làm thêm giờ</li>
<li>Tiền nghỉ phép năm chưa sử dụng</li>
<li>Thù lao hoạt động khoa học, công nghệ, đổi mới sáng tạo</li>
</ul>`,
    title_en: 'New PIT Progressive Tax: Reduced from 7 to 5 Brackets, Higher Deductions',
    excerpt_en:
      'The new PIT Law effective July 2026 simplifies progressive tax from 7 to 5 brackets. Personal deduction increases to VND 15.5 million/month.',
    content_en: `<h2>Simplified Progressive Tax</h2>
<p>The new PIT Law (<strong>Law 109/2025/QH15</strong>) effective <strong>July 1, 2026</strong>:</p>
<ul>
<li>Reduces from <strong>7 to 5</strong> progressive tax brackets</li>
<li>Raises income thresholds per bracket</li>
</ul>
<h2>Increased Personal Deductions (from March 2026)</h2>
<ul>
<li>Taxpayer: <strong>VND 15.5 million/month</strong> (up from 11M)</li>
<li>Dependent: <strong>VND 6.2 million/month</strong> (up from 4.4M)</li>
</ul>
<h2>New Tax-Exempt Income</h2>
<ul><li>Night shift and overtime pay</li><li>Unused annual leave compensation</li><li>Scientific and innovation remuneration</li></ul>`,
    title_zh: '新个税累进税率：从7级减至5级，个人扣除额提高',
    excerpt_zh:
      '新个人所得税法自2026年7月起生效，将累进税率从7级简化为5级。个人免税额提高至每月1550万越盾。',
    content_zh: `<h2>简化累进税率</h2><p>从7级减至<strong>5级</strong>，提高各级收入门槛。</p><h2>提高个人扣除额</h2><p>纳税人：<strong>1550万/月</strong>，被抚养人：<strong>620万/月</strong>。</p>`,
    view_count: 523,
    like_count: 145,
  },
  {
    id: 5,
    created_at: '2026-02-05T11:00:00Z',
    author: 'AI Agent Lixin',
    author_role: 'ai_agent',
    status: 'published',
    is_highlight: false,
    cover_image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    category: 'ai_insight',
    tags: ['CCCD', 'mã số thuế', 'số hóa'],
    title_vi: 'Số CCCD thay mã số thuế từ 01/07/2025: Doanh nghiệp và cá nhân cần làm gì?',
    excerpt_vi:
      'Từ 01/07/2025, số định danh cá nhân 12 chữ số trên CCCD sẽ thay thế mã số thuế trong mọi giao dịch thuế. Mã số thuế cũ vẫn có hiệu lực đến 30/06/2025.',
    content_vi: `<h2>Số CCCD thay mã số thuế</h2>
<p>Theo <strong>Thông tư 86/2024/TT-BTC</strong>, kể từ ngày <strong>01/07/2025</strong>:</p>
<ul>
<li>Số định danh cá nhân (12 chữ số trên CCCD) sẽ thay thế mã số thuế</li>
<li>Áp dụng cho mọi giao dịch thuế: kê khai, nộp thuế, hoàn thuế</li>
<li>Mã số thuế cũ vẫn có hiệu lực đến hết 30/06/2025</li>
</ul>
<h2>Bảo hiểm xã hội bắt buộc cho chủ hộ kinh doanh</h2>
<p>Cũng từ <strong>01/07/2025</strong>, chủ hộ kinh doanh có đăng ký kinh doanh sẽ thuộc đối tượng tham gia <strong>bảo hiểm xã hội bắt buộc</strong>, mức đóng tối thiểu <strong>585.000 đồng/tháng</strong>.</p>
<p><em>Lixin đang hỗ trợ khách hàng chuyển đổi hệ thống quản lý sang số CCCD. Liên hệ chúng tôi để được tư vấn miễn phí.</em></p>`,
    title_en: 'National ID Replaces Tax Code from July 2025: What You Need to Do',
    excerpt_en:
      'From July 1, 2025, the 12-digit personal ID number on citizen ID cards will replace tax codes for all tax transactions in Vietnam.',
    content_en: `<h2>ID Number Replaces Tax Code</h2>
<p>Under <strong>Circular 86/2024/TT-BTC</strong>, the 12-digit citizen ID number replaces traditional tax codes for all tax filings, payments, and refunds from <strong>July 1, 2025</strong>.</p>
<h2>Mandatory Social Insurance for Business Owners</h2>
<p>From July 2025, registered household business owners must participate in <strong>mandatory social insurance</strong>, minimum contribution <strong>VND 585,000/month</strong>.</p>`,
    title_zh: '2025年7月起身份证号替代税号：需要做什么？',
    excerpt_zh: '自2025年7月1日起，公民身份证上的12位身份证号将在所有税务交易中替代税号。',
    content_zh: `<h2>身份证号替代税号</h2><p>根据第86/2024/TT-BTC号通知，12位公民身份证号将替代传统税号。</p>`,
    view_count: 187,
    like_count: 43,
  },
];

export const getNews = async () => {
  if (USE_MOCK) {
    const DATA_VERSION = 'v2'; // Bump this when DEFAULT_NEWS changes
    const raw = localStorage.getItem('lixin_news');
    const ver = localStorage.getItem('lixin_news_version');
    if (!raw || ver !== DATA_VERSION) {
      localStorage.setItem('lixin_news', JSON.stringify(DEFAULT_NEWS));
      localStorage.setItem('lixin_news_version', DATA_VERSION);
      return DEFAULT_NEWS;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      localStorage.setItem('lixin_news', JSON.stringify(DEFAULT_NEWS));
      localStorage.setItem('lixin_news_version', DATA_VERSION);
      return DEFAULT_NEWS;
    }
  } else {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching news:', error);
    return data || [];
  }
};

export const saveNews = async (item) => {
  if (USE_MOCK) {
    const news = await getNews();
    item.id = mockId();
    item.created_at = new Date().toISOString();
    news.unshift(item);
    localStorage.setItem('lixin_news', JSON.stringify(news));
    return item;
  } else {
    const { data, error } = await supabase.from('news').insert([item]).select();

    if (error) {
      console.error('Error saving news:', error);
      throw error;
    }
    return data[0];
  }
};

export const deleteNews = async (id) => {
  if (USE_MOCK) {
    const news = await getNews();
    const filtered = news.filter((n) => n.id !== id);
    localStorage.setItem('lixin_news', JSON.stringify(filtered));
  } else {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) console.error('Error deleting news:', error);
  }
};

// ============================================================
// 2. CONTACTS (Khách hàng gửi yêu cầu tư vấn)
// Cột Supabase: id, created_at, updated_at,
//   name, phone, email, company_name, tax_code,
//   service_type, message, language,
//   source, utm_source, utm_medium, utm_campaign,
//   status, assigned_to, priority, notes, followed_up_at,
//   ip_address, user_agent
// ============================================================

export const saveContactRequest = async (contactData) => {
  if (USE_MOCK) {
    const existingStr = localStorage.getItem('lixin_contacts');
    const contacts = existingStr ? JSON.parse(existingStr) : [];

    const newContact = {
      id: mockId(),
      created_at: new Date().toISOString(),
      status: 'new',
      priority: 'normal',
      source: 'website',
      ...contactData,
    };

    contacts.push(newContact);
    localStorage.setItem('lixin_contacts', JSON.stringify(contacts));
    console.log('Mock saved contact:', newContact);
    return newContact;
  } else {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          ...contactData,
          source: 'website',
          user_agent: navigator.userAgent,
        },
      ])
      .select();

    if (error) {
      console.error('Error saving contact:', error);
      throw error;
    }
    return data[0];
  }
};

export const getContacts = async () => {
  if (USE_MOCK) {
    const raw = localStorage.getItem('lixin_contacts');
    return raw ? JSON.parse(raw) : [];
  } else {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching contacts:', error);
    return data || [];
  }
};
