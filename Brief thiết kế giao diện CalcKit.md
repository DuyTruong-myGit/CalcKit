# Brief thiết kế giao diện CalcKit

**Dành cho:** designer, developer thực thi UI
**Cập nhật lần cuối:** 26/11/2026
**Site live:** calckit.site
**Stack thực tế:** Astro (static), TypeScript strict, plain CSS với CSS custom properties, deploy trên Cloudflare Pages. Không dùng React, Vue, Tailwind hay bất kỳ UI framework nào.
**Ngôn ngữ trên site:** Tiếng Anh Mỹ. Brief này viết tiếng Việt để trao đổi nội bộ.

---

## Tóm tắt nhanh

CalcKit là bộ công cụ tính vật liệu xây dựng và làm vườn miễn phí dành cho chủ nhà người Mỹ tự làm (DIY). Hiện có **20 calculator** bao gồm: mulch, gravel, topsoil, sand, concrete slab, concrete post hole, paver, retaining wall block, roofing, drywall, flooring, tile, paint, deck board, fence, grass seed, sod, raised bed soil, square footage, cubic yard.

Người dùng thường vào từ Google trên điện thoại, tay cầm thước dây, cần ra con số trong vài giây. Thiết kế phải nhanh, rõ, đáng tin, và thực dụng như một công cụ đo đạc — không phải landing page bán hàng.

---

## 1. Đối tượng người dùng

### Nhóm chính: Chủ nhà DIY người Mỹ

**Chân dung điển hình:**
- Tên: Mike, 38 tuổi, Texas hoặc Ohio
- Cuối tuần phủ mulch cho vườn trước, hoặc đang chuẩn bị đổ bê tông sân sau
- Vừa đo xong bằng thước dây, còn đang nhớ số vừa đo
- Mở Google và gõ *"how many bags of mulch for 200 sq ft 3 inches deep"*
- Điện thoại cầm một tay, trời sáng, có thể đang đứng ngoài nắng
- Không phải thợ chuyên; không nhớ công thức; cần con số đúng để mua đúng lượng vật liệu
- Không có kiên nhẫn đọc giải thích dài trước khi thấy kết quả

**Điều họ cần từ công cụ:**
1. Nhập 2–4 con số (chiều dài, chiều rộng, độ dày...)
2. Thấy ngay: cần bao nhiêu túi / cubic yard / tấn
3. Tin con số đó là đúng (công thức rõ ràng, có ví dụ)
4. Copy hoặc ghi nhanh rồi đi mua hàng

### Nhóm phụ: Thợ nhỏ và nhà thầu cá nhân

- Người dùng lặp lại (quay lại nhiều lần trong một dự án)
- Quan tâm thêm: hệ số hao hụt (waste factor), quy đổi đơn vị Mỹ ↔ mét, số lượng theo đơn vị thương mại (pallet, ton, bundle, sheet)
- Dùng cả trên điện thoại lẫn máy tính bảng ngoài công trường

### Điều **không** cần thiết kế cho:

- Người cần tài khoản, lưu lịch sử, chia sẻ dự án
- Người cần thiết kế 3D, bản vẽ kỹ thuật
- Trẻ em hoặc người dùng không biết gì về xây dựng

---

## 2. Triết lý thiết kế: "Clipboard & Tape Measure"

Trang web trông **như một công cụ**, không phải như một thương hiệu lifestyle. Phong cách gần với giao diện máy tính công trường hoặc bảng tính kỹ thuật — sạch, chính xác, không trang trí dư thừa.

**Nguyên tắc cốt lõi:**
- Mọi quyết định thiết kế phục vụ một mục tiêu: người dùng thấy con số kết quả **nhanh nhất có thể**
- Toàn bộ sự nổi bật trực quan được "tiêu" vào **duy nhất một chỗ**: khối kết quả
- Phần còn lại (input, label, section, navigation) giữ im lặng
- Người dùng scan qua trang không thể bỏ qua con số kết quả

**Điều cần tránh hoàn toàn:**
- Hero image lớn trước công cụ
- Gradient trang trí
- Animation xuất hiện khi cuộn (scroll-triggered reveal)
- Thẻ bo tròn giống hệt nhau với shadow đồng đều
- Background cream/off-white hoặc dark mode neon
- Eyebrow label all-caps phía trên mọi tiêu đề
- Popup, modal, hộp đăng ký email
- Video tự phát, slideshow
- Stock photo người cười cầm dụng cụ

---

## 3. Màu sắc và nhận diện

### Palette hiện tại (đã implement trong code)

| Token CSS | Màu | Vai trò |
|---|---|---|
| `--ink` | `#1a2332` | Body text, heading, button text |
| `--page` | `#ffffff` | Nền trang, nền input |
| `--rule` | `#dde3ec` | Viền input, đường kẻ section |
| `--muted` | `#64748b` | Help text, label phụ, secondary result |
| `--action` | `#1d53c4` | Button chính, link, focus ring, header |
| `--signal` | `#f59e0b` | **Duy nhất cho kết quả chính** (amber) |
| `--error` | `#c0392b` | Thông báo lỗi |

**Tương phản (đã verify):**
- `--ink` trên `--page`: 15.1:1 → vượt WCAG AAA
- `--page` trên `--action`: 7.8:1 → vượt WCAG AA và AAA
- Mọi màu chức năng đều đạt tối thiểu AA

### Logo

```
[C] CalcKit
```
- SVG inline: hình chữ C navy `#14213D` trên nền vàng `#F5B700`, kèm ô vuông nhỏ góc phải dưới (biểu tượng đơn vị diện tích)
- Header background: `--action` xanh navy `#1d53c4`, logo màu trắng
- Kích thước icon: 28×28 px trong header, 22×22 px trong footer

### Gợi ý mở rộng palette (designer đề xuất nếu cần)

Palette hiện tại tối giản có chủ ý. Nếu muốn thêm sắc thái:
- Màu nền category badges: hiện dùng `#e8eefb` (xanh nhạt) + text `--action`
- Result panel background: hiện dùng `#fafcff` (gần như trắng) + viền trái 4px `--signal`
- Có thể thêm `--surface: #f9fafb` cho các vùng nền nhẹ (footer, ad slot)

---

## 4. Typography

**Font stack (không tải thêm font):**
```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

Lý do: trang load nhanh hơn, hiển thị quen thuộc theo hệ điều hành, không có cumulative layout shift từ font loading.

**Thang chữ đã xác định:**

| Vị trí | Size | Weight | Ghi chú |
|---|---|---|---|
| H1 tiêu đề trang | 1.5rem (24px) | 700 | Sentence case, `letter-spacing: -0.015em` |
| H2 section | 1.125rem (18px) | 600 | Sentence case |
| H3 card/item | 1rem (16px) | 700 | — |
| Body text | 1rem (16px) | 400 | Max `line-height: 1.6`, max width 68ch |
| Input label | 0.875rem (14px) | 500 | Luôn hiển thị, không bao giờ floating |
| Help text | 0.8125rem (13px) | 400 | Màu `--muted` |
| **Kết quả chính** | **1.75rem (28px)** | **700** | Tabular nums, màu `--ink` |
| Kết quả phụ | 1rem (16px) | 500 | Tabular nums, màu `--muted` |
| Button | 1rem (16px) | 600 | — |

**Số liệu kết quả dùng:**
```css
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum";
```
Lý do: số không nhảy khi thay đổi (đặc biệt quan trọng khi kết quả cập nhật real-time khi nhập).

---

## 5. Bố cục trang

### Layout tổng thể

- Một cột duy nhất từ mobile đến desktop
- Max content width: **720px**, căn giữa
- Horizontal padding: `1rem` mobile, `2rem` từ 480px trở lên
- Không dùng card grid cho layout chính — trang chính là công cụ

### Desktop (≥768px)

Cột chính tối đa 720px. Tùy designer đề xuất thêm cột phụ bên phải (khoảng 300px) cho quảng cáo và "Related calculators" — nhưng **công cụ và kết quả chính phải ở cột trái**.

### Thứ tự các khối trên trang calculator (mobile, 360px)

```
┌──────────────────────────────────────────┐
│ [C] CalcKit              [Calculators] [About] │  ← header 48px, navy bg
├──────────────────────────────────────────┤
│ Home / Landscaping / Mulch Calculator    │  ← breadcrumb, font 13px
├──────────────────────────────────────────┤
│                                          │
│  Mulch Calculator                        │  ← H1
│  Intro text 80–120 từ                   │
│                                          │
├──────────────────────────────────────────┤  ← --rule divider
│                                          │
│  [US (ft/in)]  [Metric (m/cm)]          │  ← unit toggle
│                                          │
│  Length (ft)                             │
│  ┌─────────────────────────── ft ─┐     │
│  │  10                             │     │  ← input, 44px height
│  └─────────────────────────────────┘     │
│                                          │
│  Width (ft)                              │
│  ┌─────────────────────────── ft ─┐     │
│  │  10                             │     │
│  └─────────────────────────────────┘     │
│                                          │
│  Depth (in)   Most beds use 2–3 in.     │
│  ┌─────────────────────────── in ─┐     │
│  │  3                              │     │
│  └─────────────────────────────────┘     │
│                                          │
│  Extra for waste (%)                     │
│  ┌─────────────────────────── % ──┐     │
│  │  10                             │     │
│  └─────────────────────────────────┘     │
│                                          │
│  ▼ Adjust assumptions                   │  ← collapsed by default
│                                          │
│  [Calculate]                            │  ← primary button
│                                          │
├──────────────────────────────────────────┤
│                                          │
│  ┃ 0.93 yd³                             │  ← signal 4px border trái
│    PRIMARY RESULT, 28px bold             │
│                                          │
│    25.0 ft³    13 bags                  │  ← secondary, 16px muted
│    Waste factor: 10%                     │
│                                          │
│  [Copy result]  [Reset values]          │  ← 44px min-height
│                                          │
├──────────────────────────────────────────┤
│  ░░░░░░░░ Advertisement ░░░░░░░░        │  ← ad slot #1 (placeholder)
├──────────────────────────────────────────┤
│  How it works                            │  ← H2
│  ...formula explanation...               │
│  Worked examples                         │
│  ...                                     │
│  Quick reference table                   │
│  ┌────────────────────────────────┐      │
│  │ Area │ Depth │ cu ft │ Bags   │      │  ← scrollable horizontal
│  └────────────────────────────────┘      │
│  Common mistakes                         │
│  ...                                     │
├──────────────────────────────────────────┤
│  ░░░░░░░░ Advertisement ░░░░░░░░        │  ← ad slot #2 (placeholder)
├──────────────────────────────────────────┤
│  FAQ                                     │  ← expandable items
│  ▶ How deep should mulch be?            │
│  ▶ Bags vs bulk: when to choose?        │
│  ...                                     │
├──────────────────────────────────────────┤
│  Related calculators                     │
│  → Gravel Calculator                    │
│  → Topsoil Calculator                   │
│  → Raised Bed Soil Calculator           │
├──────────────────────────────────────────┤
│  Results are estimates. Confirm with    │  ← disclaimer --muted
│  your supplier before ordering.         │
├──────────────────────────────────────────┤
│  About · Contact · Privacy · Terms      │  ← footer
│  © 2026 CalcKit                         │
└──────────────────────────────────────────┘
```

---

## 6. Hình ảnh minh họa (phần mới — điểm khác biệt so với brief cũ)

### Triết lý ảnh

Ảnh phải **đúng logic công cụ** — minh họa đúng vật liệu, đúng công việc, đúng bối cảnh. Không dùng ảnh stock chung chung (người cười tươi cầm dụng cụ, bàn tay trên bàn phím, v.v.).

Ưu tiên theo thứ tự:
1. **SVG minh họa kỹ thuật** (đơn giản, file nhẹ, scale tốt) — ví dụ: sơ đồ vườn với kích thước, mặt cắt lớp mulch
2. **Ảnh thực tế chất lượng cao, creative commons hoặc public domain** — ảnh vườn, ảnh công trường
3. **Ảnh sinh bằng AI** — chỉ khi không có ảnh thực tế phù hợp; phải đúng logic, không kỳ lạ

### Vị trí ảnh theo từng loại calculator

| Calculator | Vị trí ảnh phù hợp | Mô tả ảnh lý tưởng |
|---|---|---|
| Mulch Calculator | Bên phải H1 hoặc dưới kết quả | Vườn hoa có lớp mulch nâu đậm 3 inch, thước dây đặt cạnh |
| Gravel Calculator | Minh họa mặt cắt | Diagram: lớp gravel dày, mũi tên kích thước chiều sâu |
| Concrete Slab | Diagram kỹ thuật | Khung bê tông với kích thước L × W × D được đánh dấu |
| Paint Calculator | Infographic | Căn phòng đơn giản với tường được highlight, mũi tên diện tích |
| Flooring Calculator | Diagram | Sàn nhà với tấm sàn, hướng lắp đặt, khoảng hao hụt |
| Roofing Calculator | Diagram góc nghiêng | Mặt cắt mái với pitch (độ dốc) và bundle ngói |
| Fence Calculator | Diagram plan view | Hàng rào nhìn từ trên: post spacing, rail, board |
| Deck Board | Diagram | Deck boards với spacing, hướng lắp, khu vực waste |

### Yêu cầu kỹ thuật cho ảnh

- **SVG**: inline hoặc `<img>` với `width` và `height` khai báo rõ (tránh CLS)
- **Ảnh raster**: WebP, có `width` và `height`, có `loading="lazy"` ngoại trừ ảnh above-the-fold
- **Alt text**: mô tả nội dung ảnh, không phải keyword stuffing. Ví dụ: `alt="Garden bed with 3-inch mulch layer and tape measure showing 10 feet"` ✓, không phải `alt="mulch calculator bags cubic yards"` ✗
- Kích thước tối đa: ảnh hero 800×450px, diagram 600×400px
- Không dùng ảnh nặng trên fold — ưu tiên SVG minh họa kỹ thuật

### Ví dụ diagram SVG cho Mulch Calculator

```
      ← 10 ft →
  ┌──────────────────────────┐
  │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ↑
  │ ░░░░░ MULCH 3 in ░░░░░  │ 3 in
  │ ░░░░░░░░░░░░░░░░░░░░░░░ │ ↓
  ════════════════════════════  ← soil
  │          10 ft           │

  Volume = 10 × 10 × (3÷12) = 25 ft³
  = 0.93 yd³ = 13 bags (2 ft³/bag)
```

Developer sẽ implement dưới dạng SVG inline với màu từ design token.

---

## 7. Mô tả và hướng dẫn trong UI

### Nguyên tắc viết microcopy (copy trong UI)

- **Ngắn, cụ thể, chỉ dẫn hành động:** "Calculate", "Copy result", "Reset values" — không phải "Click here to calculate", "Get my result"
- **Help text giải thích giá trị mặc định:** field Depth 3in có help text `"Most beds use 2 to 3 inches."` → người dùng hiểu ngay sao lại điền sẵn 3
- **Lỗi nói rõ cách sửa:** `"Length must be greater than 0."` ✓; `"Invalid input"` ✗; `"Please try again"` ✗
- **Kết quả phụ giải thích đơn vị:** `13 bags (2 ft³ per bag)` thay vì `13 bags`

### Hướng dẫn trực quan — "How it works" section

Thay vì giải thích thuần túy bằng văn bản, dùng bố cục có sơ đồ hoặc ví dụ có số cụ thể:

**Tốt:**
> **Step 1 — Measure your bed**
> Walk the longest side: that's your Length. Walk the short side: that's your Width.
>
> **Step 2 — Pick your depth**
> New beds: 3 inches. Refreshing old mulch: 1–2 inches. Use 3 inches in hot climates.
>
> **Step 3 — Read the result**
> The calculator shows cubic yards (for bulk delivery) and bags (for store pickup).
> A standard bag is 2 ft³ — that's about the size of a large carry-on suitcase.

**Không tốt:**
> Enter the length and width of your garden bed in the input fields above, then enter the desired depth of mulch. The calculator will compute the total volume needed.

### Quick Reference Table — làm sống động

Thay vì bảng khô khan, thêm **context thực tế:**

| Bed Size | Depth | Bags Needed | Good for... |
|---|---|---|---|
| 50 sq ft | 2 in | 5 bags | Small border around a tree |
| 100 sq ft | 3 in | 14 bags | Typical front yard flower bed |
| 200 sq ft | 3 in | 28 bags | Side yard or foundation bed |
| 500 sq ft | 3 in | 69 bags | Large backyard project → consider bulk delivery |

### Lỗi thường gặp — viết theo dạng "Bẫy phổ biến"

Thay vì liệt kê, dùng format warning box ngắn gọn:

> ⚠️ **Don't pile mulch against tree trunks** — that "mulch volcano" traps moisture and rots the bark. Keep a 3-inch gap around the base.

> ⚠️ **2 ft³ bag ≠ 3 ft³ bag** — most big-box stores sell both. Check the label before loading your cart.

---

## 8. Trạng thái UI và tương tác

### Trạng thái các thành phần chính

| Component | Trạng thái |
|---|---|
| Input | default, focus (2px `--action` outline), error (1px red border + error message below), disabled |
| Calculate button | default, hover (10% darker `--action`), active/pressed, disabled (opacity 0.5) |
| Unit toggle | US active / Metric active — `aria-pressed` |
| Result panel | hidden (trước lần tính đầu tiên), visible (`aria-live="polite"`) |
| Adjust assumptions | collapsed (default, dạng `<details>`), expanded |
| Copy button | default, copied (text đổi thành "Copied!" trong 2 giây rồi trở lại) |
| FAQ item | collapsed, expanded |

### Hành vi cập nhật kết quả

- Kết quả cập nhật **real-time** khi người dùng gõ (không cần nhấn Calculate)
- Vẫn giữ nút **Calculate** cho người dùng quen kiểu cũ hoặc dùng bàn phím
- Result panel trong `aria-live="polite"` — screen reader thông báo khi kết quả thay đổi
- Khi nhập số không hợp lệ: hiển thị error message ngay dưới field đó, kết quả ẩn hoặc giữ nguyên giá trị cũ

### Kết quả dính (Sticky result — mobile)

**Yêu cầu thiết kế quan trọng:** trên màn hình 360×640px, người dùng nhập vào field cuối cùng thì phần kết quả có thể bị khuất. Designer cần đề xuất **ít nhất một phương án** để kết quả chính vẫn thấy được:

**Phương án A — Result strip dính dưới (recommended):**
Một dải nhỏ (40–48px) ở đáy viewport, hiển thị kết quả chính và badge đơn vị. Chỉ hiện khi khối result thật bị scroll ra khỏi viewport. Không đè lên nút.

**Phương án B — Result summary trong form:**
Một dòng kết quả mini nằm ngay trong khối form (phía dưới các field nhập, trên nút Calculate), luôn visible.

**Phương án C — Scroll to result:**
Sau khi tính, page tự smooth-scroll xuống khối result. Đơn giản nhất, phù hợp `prefers-reduced-motion: reduce`.

---

## 9. Quảng cáo

Quảng cáo (Google AdSense) chưa bật. `ADS_ENABLED=false` trong `src/config.ts`. `AdSlot.astro` đã có, giữ chỗ tránh layout shift.

**Vị trí đã xác định:**
- **Ad slot #1:** Giữa phần "How it works" và "Worked examples" (sau khi scroll qua kết quả)
- **Ad slot #2:** Sau FAQ, trước "Related calculators"

**Quy tắc bất biến:**
- Không đặt quảng cáo phía trên tool, giữa các field nhập, hay sát nút bấm/kết quả
- Tối đa 2 slots trên mobile
- Mỗi slot có nhãn nhỏ `"Advertisement"` màu `--muted`
- Slot giữ sẵn chiều cao (responsive ad unit 320×50 mobile, 728×90 desktop) để không gây CLS khi ad load
- Quảng cáo không được trông giống nút hoặc kết quả
- Không sticky ad ở đáy hoặc đầu màn hình mobile

---

## 10. SEO (ảnh hưởng trực tiếp đến thiết kế)

### Cấu trúc heading

- Mỗi trang đúng **một H1** = tên calculator
- H2: "How it works", "Worked examples", "Quick reference", "Common mistakes", "FAQ", "Related calculators"
- H3: từng FAQ question, từng example title

### Nội dung phải là văn bản HTML thật

- Không nhúng chữ vào ảnh
- FAQ dùng `<details>/<summary>` nhưng vẫn có text trong DOM
- Bảng tham khảo là `<table>` thật, có `<caption>`, cuộn ngang trong wrapper riêng trên mobile

### Internal linking

- Mỗi trang có 3–4 "Related calculators" dạng liên kết văn bản rõ (tên calculator làm anchor text)
- Breadcrumb trên mọi calculator page
- Footer có đủ: About, Contact, Privacy Policy, Terms

### Core Web Vitals

- LCP < 2.5s — không ảnh nặng above-fold
- CLS < 0.1 — khai báo width/height cho ảnh, giữ chỗ ad slot
- INP nhanh — calculator JS thuần, không framework nặng

### Schema markup

Chỉ thêm structured data khi có nội dung thật trên trang:
- `FAQPage` cho section FAQ
- `BreadcrumbList` cho breadcrumb
- `WebApplication` cho calculator (nếu phù hợp)

---

## 11. Trang chủ

**Mục tiêu:** Người dùng hiểu ngay site làm gì, tìm được calculator cần trong 1–2 tap.

**Bố cục:**
1. Hero section (không ảnh nặng): H1 nói rõ site làm gì + 1–2 câu lead
2. 8 calculator phổ biến nhất (grid 2 cột mobile, 4 cột desktop)
3. "Browse all categories →" button
4. Divider
5. Trust section: 3 điểm ngắn gọn (Exact math / Phone-ready / Private by design)
6. Footer

**8 calculator featured (theo code hiện tại):**
Mulch, Gravel, Topsoil, Sand, Raised Bed Soil, Concrete Slab, Paver, Retaining Wall Block

**Calculator card:**
- Badge nhỏ (Popular / Garden / Masonry / Landscaping)
- Tên calculator (H3, là link)
- 1–2 dòng mô tả
- Arrow icon → (hover: dịch phải, đổi màu sang `--action`)

---

## 12. Trang nhóm (Categories)

5 nhóm: Landscaping, Concrete & Masonry, Painting & Flooring, Outdoor Structures & Roofing, Utilities

Mỗi nhóm có:
- Tiêu đề H2 + icon SVG đơn giản (cái xẻng, cái thước, cái cuộn sơn...)
- Grid các calculator trong nhóm đó
- Liên kết sang nhóm khác

---

## 13. Danh sách thành phần cần thiết kế

### Core components

- [ ] Header (logo + nav)
- [ ] Footer (logo, tagline, links, copyright, disclaimer)
- [ ] Breadcrumb
- [ ] Unit toggle (US / Metric)
- [ ] Input field — 3 trạng thái: default, focus, error
- [ ] Calculate button — 4 trạng thái
- [ ] Result panel — primary result + secondary results + action buttons
- [ ] Copy button (default + copied state)
- [ ] Reset button
- [ ] "Adjust assumptions" accordion
- [ ] FAQ accordion item (closed + open)
- [ ] Related calculator card
- [ ] Ad slot placeholder (mobile 320×50, desktop 728×90)
- [ ] Disclaimer text block

### Content components

- [ ] Intro text block (H1 + lead paragraph)
- [ ] "How it works" section với step format
- [ ] Worked example block (có số cụ thể)
- [ ] Quick reference table (responsive, cuộn ngang)
- [ ] Warning/tip callout box
- [ ] Sticky result strip (mobile, optional)

### Trang

- [ ] Trang chủ — mobile 360px + desktop 1280px
- [ ] Trang calculator — đầy đủ với Mulch Calculator làm ví dụ
- [ ] Trang nhóm (categories)
- [ ] Trang văn bản dài (About hoặc Privacy Policy)
- [ ] Trang 404

---

## 14. Bàn giao

### Figma

- Mobile: 360px hoặc 390px
- Desktop: 1280px
- Cho: trang chủ, một calculator đầy đủ (Mulch), trang nhóm, một trang văn bản dài

### Design tokens

Bảng token đủ để convert sang biến CSS:

| Loại | Nội dung |
|---|---|
| Màu | Tất cả hex và tên token (xem palette mục 3) |
| Spacing | scale 4px: 4, 8, 12, 16, 20, 24, 32, 48 |
| Typography | size, weight, line-height cho từng role |
| Border radius | `--radius: 6px` hiện tại |
| Shadows | Chỉ result panel (nếu có) |

### Assets

- Logo SVG (full color + white version)
- Favicon SVG
- Icon set cho category headers (5 icons) — SVG
- Diagram minh họa cho ít nhất 3 calculator (SVG)

### Ghi chú hành vi

- Thứ tự focus khi dùng bàn phím
- Hành vi khi lỗi (focus về field lỗi, announce với screen reader)
- Animation: chỉ button press state; tôn trọng `prefers-reduced-motion`

---

## 15. Tiêu chí nghiệm thu

Thiết kế được coi là xong khi:

- [ ] Ở 360px, người dùng nhập xong fields và thấy kết quả chính mà không phải cuộn hoặc cuộn không quá một lần
- [ ] Tất cả vùng bấm ≥ 44px
- [ ] Tương phản đạt WCAG AA cho mọi text và icon chức năng
- [ ] Có đủ trạng thái cho mọi component chính
- [ ] Vị trí ad slot không vi phạm quy tắc (không sát tool, không giống kết quả)
- [ ] Không có phần tử nào bắt buộc dùng ảnh nặng hoặc thư viện nặng
- [ ] Bảng token đủ để map sang biến CSS không cần đoán
- [ ] Diagram/ảnh minh họa đúng logic từng công cụ, không generic
- [ ] Tất cả text trong UI trang là văn bản HTML, không nhúng vào ảnh
- [ ] Desktop layout không ẩn nội dung so với mobile

---

*Brief này phản ánh codebase thực tế tính đến 26/11/2026. Nếu có thay đổi về stack, số lượng calculator, hoặc palette, cập nhật đồng thời vào `docs/DESIGN.md` và file này.*
