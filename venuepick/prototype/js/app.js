/* ============================================================
   VenuePick prototype interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initDonutCharts();
  initWordclouds();
  initReviewModal();
  initMyPageActions();
  initEditReviewModal();
  initFacilityGrid();
  initFacilityDetail();
  initAuth();
});

/* ---------- Google 소셜 로그인 (Supabase Auth) ----------
   supabase-client.js 에서 만든 전역 supabaseClient 를 사용해
   세션 상태에 따라 헤더의 로그인/로그아웃 버튼을 전환한다. */
function loginWithGoogle() {
  return supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.href.split("#")[0] },
  });
}

function initAuth() {
  const authBtn = document.getElementById("authBtn");
  if (!authBtn || typeof supabaseClient === "undefined") return;

  function render(session) {
    authBtn.textContent = session ? "로그아웃" : "로그인";
  }

  supabaseClient.auth.getSession().then(({ data }) => render(data.session));
  supabaseClient.auth.onAuthStateChange((_event, session) => render(session));

  authBtn.addEventListener("click", async () => {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session) {
      await supabaseClient.auth.signOut();
    } else {
      await loginWithGoogle();
    }
  });
}

/* ---------- 공통: JSON 데이터 경로 ----------
   index.html(루트)과 prototype/index.html, prototype/facility.html이
   같은 app.js를 공유하므로, 현재 경로가 /prototype/ 하위인지로
   facilities.json / reviews.json 의 상대 경로를 판단한다. */
function inPrototypeDir() {
  return location.pathname.includes("/prototype/");
}
function jsonPath(file) {
  return (inPrototypeDir() ? "../" : "") + file;
}

/* ---------- 홈: 시설 카드 목록 (facilities.json) ---------- */
function initFacilityGrid() {
  const grid = document.querySelector(".facility-grid");
  if (!grid) return;
  const hrefBase = inPrototypeDir() ? "" : "prototype/";

  fetch(jsonPath("facilities.json"))
    .then((res) => res.json())
    .then((facilities) => {
      grid.innerHTML = facilities
        .map(
          (f) => `
      <a href="${hrefBase}facility.html?id=${f.id}" class="glass-card card-facility fade-up" style="text-decoration:none; color:inherit;">
        <div class="thumb">${f.name}</div>
        <h3 class="name">${f.name}</h3>
        <div class="region">${f.region} · ${f.type}</div>
        <div class="meta-row">
          <span class="rating-num">★ ${f.rating}</span>
          <span class="review-count">리뷰 ${f.totalReviewCount}개</span>
        </div>
      </a>`
        )
        .join("");
    })
    .catch((err) => console.error("시설 목록을 불러오지 못했습니다.", err));
}

/* ---------- 상세: 시설 정보 + 리뷰 목록 (facilities.json / reviews.json) ---------- */
function initFacilityDetail() {
  const titleEl = document.querySelector(".detail-title");
  if (!titleEl) return;

  const facilityId = Number(new URLSearchParams(location.search).get("id")) || 1;

  Promise.all([
    fetch(jsonPath("facilities.json")).then((res) => res.json()),
    fetch(jsonPath("reviews.json")).then((res) => res.json()),
  ])
    .then(([facilities, reviews]) => {
      const facility = facilities.find((f) => f.id === facilityId) || facilities[0];
      const facilityReviews = reviews.filter((r) => r.facilityId === facility.id);

      document.title = `${facility.name} | 베뉴픽`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          "content",
          `${facility.name} 실사용자 인증 리뷰, AI 장단점 요약, 항목별 만족도 대시보드.`
        );
      }
      const breadcrumbType = document.querySelector(".breadcrumb-type");
      if (breadcrumbType) breadcrumbType.textContent = facility.type;

      titleEl.textContent = facility.name;
      const subEl = document.querySelector(".detail-sub");
      if (subEl) {
        subEl.textContent = `${facility.region} · ${facility.type} · 최대 ${facility.capacity.toLocaleString()}명 수용`;
      }
      const ratingNumEl = document.querySelector(".detail-rating-row .rating-num.lg");
      if (ratingNumEl) ratingNumEl.textContent = facility.rating.toFixed(1);
      const reviewCountEl = document.querySelector(".detail-rating-row .review-count");
      if (reviewCountEl) {
        reviewCountEl.textContent = `리뷰 ${facility.totalReviewCount}개 · 인증 리뷰 ${facility.verifiedRatio}%`;
      }

      const summaryHeading = document.querySelector(".ai-summary-head h3");
      if (summaryHeading) summaryHeading.textContent = `${facility.totalReviewCount}개 리뷰에서 자동으로 뽑은 장단점`;
      const prosList = document.querySelector(".ai-col.pros ul");
      if (prosList) prosList.innerHTML = facility.pros.map((p) => `<li>${p}</li>`).join("");
      const consList = document.querySelector(".ai-col.cons ul");
      if (consList) consList.innerHTML = facility.cons.map((c) => `<li>${c}</li>`).join("");

      const statValues = document.querySelectorAll(".stat-card .stat-value");
      if (statValues[0]) statValues[0].innerHTML = `${facility.rating.toFixed(1)}<small>/ 5.0</small>`;
      if (statValues[1]) statValues[1].innerHTML = `${facility.totalReviewCount}<small>건</small>`;
      if (statValues[2]) statValues[2].innerHTML = `${facility.verifiedRatio}<small>%</small>`;

      const donut = document.querySelector("[data-donut] .donut");
      if (donut && facilityReviews.length) {
        const avg = (key) =>
          Number((facilityReviews.reduce((sum, r) => sum + r[key], 0) / facilityReviews.length).toFixed(1));
        donut.dataset.segments = JSON.stringify([
          { label: "시설", value: avg("facilityRating"), color: "#3e6bff" },
          { label: "서비스", value: avg("serviceRating"), color: "#4f8cff" },
          { label: "접근성", value: avg("accessibilityRating"), color: "#6fa0ff" },
          { label: "가격", value: avg("priceRating"), color: "#8ab4ff" },
        ]);
        initDonutCharts();
      }

      const sectionTitle = document.querySelector(".section-title");
      if (sectionTitle) sectionTitle.textContent = `이용자 리뷰 ${facility.totalReviewCount}개`;
      const sectionDesc = document.querySelector(".section-desc");
      if (sectionDesc) sectionDesc.textContent = `전체 리뷰 중 대표 리뷰 ${facilityReviews.length}개를 보여드려요.`;

      const list = document.querySelector(".review-list");
      if (list) {
        list.innerHTML = facilityReviews
          .map(
            (r) => `
        <div class="glass-card review-card fade-up">
          <div class="review-top">
            <div class="review-name">${r.date} 이용</div>
            ${r.isVerified ? '<span class="badge-verified">✓ 인증된 이용 후기</span>' : ""}
          </div>
          <div class="review-rating-row">
            <span class="rating-chip">가격 <span class="rating-num">★${r.priceRating}</span></span>
            <span class="rating-chip">접근성 <span class="rating-num">★${r.accessibilityRating}</span></span>
            <span class="rating-chip">시설 <span class="rating-num">★${r.facilityRating}</span></span>
            <span class="rating-chip">서비스 <span class="rating-num">★${r.serviceRating}</span></span>
          </div>
          <p class="review-body">${r.text}</p>
        </div>`
          )
          .join("");
      }
    })
    .catch((err) => console.error("시설 상세 정보를 불러오지 못했습니다.", err));
}

/* ---------- mobile nav ---------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const isOpen = links.style.display === "flex";
    links.style.display = isOpen ? "none" : "flex";
    links.style.cssText = isOpen
      ? "display:none;"
      : "display:flex; position:absolute; top:100%; left:0; right:0; flex-direction:column; background:var(--glass-light-strong); backdrop-filter:blur(16px); padding:16px 24px; gap:16px; border-bottom:1px solid var(--glass-border-light);";
  });
}

/* ---------- donut chart (항목별 만족도) ----------
   .donut 요소의 data-segments="라벨:점수:색상,라벨:점수:색상,..." 를 읽어
   conic-gradient 로 렌더링하고, 옆에 legend row 를 자동 생성한다. */
function initDonutCharts() {
  document.querySelectorAll("[data-donut]").forEach((wrap) => {
    const donut = wrap.querySelector(".donut");
    const legend = wrap.querySelector(".donut-legend");
    const segments = JSON.parse(donut.dataset.segments);
    const total = segments.reduce((s, seg) => s + seg.value, 0);

    let acc = 0;
    const stops = segments
      .map((seg) => {
        const start = (acc / total) * 360;
        acc += seg.value;
        const end = (acc / total) * 360;
        return `${seg.color} ${start}deg ${end}deg`;
      })
      .join(", ");
    donut.style.background = `conic-gradient(${stops})`;

    const avg = (segments.reduce((s, seg) => s + seg.value, 0) / segments.length).toFixed(1);
    const centerNum = donut.querySelector(".donut-center .num");
    if (centerNum) centerNum.textContent = avg;

    if (legend) {
      legend.innerHTML = segments
        .map(
          (seg) => `
        <div class="donut-legend-row">
          <span class="swatch" style="background:${seg.color}"></span>
          <span class="name">${seg.label}</span>
          <span class="val">${seg.value.toFixed(1)}</span>
        </div>`
        )
        .join("");
    }
  });
}

/* ---------- wordcloud ----------
   .wordcloud 요소의 data-words="단어:빈도,단어:빈도,..." 를 읽어
   빈도에 따라 font-size / 색상 진하기를 계산해 렌더링한다. */
function initWordclouds() {
  document.querySelectorAll(".wordcloud[data-words]").forEach((el) => {
    const words = el.dataset.words.split(",").map((pair) => {
      const [word, freq] = pair.split(":");
      return { word, freq: Number(freq) };
    });
    const max = Math.max(...words.map((w) => w.freq));
    const min = Math.min(...words.map((w) => w.freq));
    const range = max - min || 1;

    el.innerHTML = words
      .map((w) => {
        const t = (w.freq - min) / range; // 0~1
        const size = 13 + t * 19; // 13px ~ 32px
        // 옅은 파랑(primary-tint) -> 진한 파랑(primary) 보간
        const color = mixColor("#8ab4ff", "#3e6bff", t);
        return `<span style="font-size:${size.toFixed(0)}px;color:${color}">${w.word}</span>`;
      })
      .join("");
  });
}

function mixColor(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}
function hexToRgb(hex) {
  const v = hex.replace("#", "");
  return {
    r: parseInt(v.substring(0, 2), 16),
    g: parseInt(v.substring(2, 4), 16),
    b: parseInt(v.substring(4, 6), 16),
  };
}

/* ---------- review modal ---------- */
function initReviewModal() {
  const overlay = document.getElementById("reviewModal");
  if (!overlay) return;
  const openBtns = document.querySelectorAll("[data-open-review-modal]");
  const closeBtns = overlay.querySelectorAll("[data-close-modal]");
  const textarea = overlay.querySelector(".form-textarea");
  const counter = overlay.querySelector(".char-counter");
  const submitBtn = overlay.querySelector("[data-submit-review]");
  const fileInput = overlay.querySelector(".form-file-input");
  const fileError = overlay.querySelector(".file-error");
  const MIN_CHARS = 20;
  const MAX_FILE_MB = 5;

  const openModal = () => {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  openBtns.forEach((btn) =>
    btn.addEventListener("click", async () => {
      if (typeof supabaseClient !== "undefined") {
        const { data } = await supabaseClient.auth.getSession();
        if (!data.session) {
          showToast("리뷰를 작성하려면 로그인이 필요해요.");
          await loginWithGoogle();
          return;
        }
      }
      openModal();
    })
  );
  closeBtns.forEach((btn) => btn.addEventListener("click", closeModal));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  function validate() {
    const len = textarea.value.trim().length;
    counter.textContent = `${len} / ${MIN_CHARS}자 이상`;
    counter.classList.toggle("ok", len >= MIN_CHARS);
    submitBtn.disabled = len < MIN_CHARS;
  }
  if (textarea) {
    textarea.addEventListener("input", validate);
    validate();
  }

  // 별점 선택
  overlay.querySelectorAll(".star-picker").forEach((picker) => {
    const stars = [...picker.querySelectorAll("button")];
    stars.forEach((star, idx) => {
      star.addEventListener("click", () => {
        stars.forEach((s, i) => s.classList.toggle("filled", i <= idx));
        picker.dataset.value = idx + 1;
      });
    });
  });

  // 첨부파일 5MB 초과 체크
  if (fileInput) {
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file && file.size > MAX_FILE_MB * 1024 * 1024) {
        fileError.style.display = "block";
        fileError.textContent = `첨부파일은 ${MAX_FILE_MB}MB 이하만 가능해요.`;
        fileInput.value = "";
      } else {
        fileError.style.display = "none";
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (submitBtn.disabled) return;
      closeModal();
      showToast("리뷰가 등록되었어요. 소중한 경험 감사합니다!");
      if (textarea) {
        textarea.value = "";
        validate();
      }
    });
  }
}

/* ---------- toast ---------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="check">✓</span> ${message}`;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

/* ---------- mypage: 삭제 데모 ---------- */
function initMyPageActions() {
  const list = document.getElementById("myReviewList");
  if (!list) return;

  function syncEmptyState() {
    const remaining = list.querySelectorAll(".my-review-card").length;
    const countEl = document.getElementById("myReviewCount");
    const emptyEl = document.getElementById("myEmptyState");
    if (countEl) countEl.textContent = remaining;
    if (emptyEl) emptyEl.style.display = remaining === 0 ? "block" : "none";
  }

  list.querySelectorAll("[data-delete-review]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".my-review-card");
      if (!card) return;
      if (confirm("이 리뷰를 삭제할까요?")) {
        card.remove();
        showToast("리뷰를 삭제했어요.");
        syncEmptyState();
      }
    });
  });

  syncEmptyState();
}

/* ---------- mypage: 리뷰 수정 모달 ---------- */
function initEditReviewModal() {
  const overlay = document.getElementById("editReviewModal");
  if (!overlay) return;

  const closeBtns = overlay.querySelectorAll("[data-close-edit-modal]");
  const textarea = overlay.querySelector("#editReviewText");
  const counter = overlay.querySelector(".char-counter");
  const monthInput = overlay.querySelector("#editReviewMonth");
  const submitBtn = overlay.querySelector("[data-submit-edit]");
  const pickers = overlay.querySelectorAll(".star-picker");
  const MIN_CHARS = 20;
  const CAT_LABEL = { price: "가격", access: "접근성", facility: "시설", service: "서비스" };

  let activeCard = null;

  function setPicker(picker, value) {
    const stars = [...picker.querySelectorAll("button")];
    stars.forEach((s, i) => s.classList.toggle("filled", i < value));
    picker.dataset.value = value;
  }

  function openModal(card) {
    activeCard = card;
    pickers.forEach((picker) => {
      const key = picker.dataset.key;
      setPicker(picker, Number(card.dataset[key] || 0));
    });
    textarea.value = card.dataset.text || "";
    monthInput.value = card.dataset.month || "";
    validate();
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    activeCard = null;
  }

  document.querySelectorAll("[data-edit-review]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".my-review-card");
      if (card) openModal(card);
    });
  });
  closeBtns.forEach((btn) => btn.addEventListener("click", closeModal));
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  function validate() {
    const len = textarea.value.trim().length;
    counter.textContent = `${len} / ${MIN_CHARS}자 이상`;
    counter.classList.toggle("ok", len >= MIN_CHARS);
    submitBtn.disabled = len < MIN_CHARS;
  }
  textarea.addEventListener("input", validate);

  pickers.forEach((picker) => {
    const stars = [...picker.querySelectorAll("button")];
    stars.forEach((star, idx) => {
      star.addEventListener("click", () => setPicker(picker, idx + 1));
    });
  });

  submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (submitBtn.disabled || !activeCard) return;

    const card = activeCard;
    const newText = textarea.value.trim();
    card.dataset.text = newText;
    card.dataset.month = monthInput.value;
    pickers.forEach((picker) => {
      card.dataset[picker.dataset.key] = picker.dataset.value;
    });

    const chipRow = card.querySelector(".review-rating-row");
    if (chipRow) {
      chipRow.innerHTML = Object.keys(CAT_LABEL)
        .map(
          (key) =>
            `<span class="rating-chip">${CAT_LABEL[key]} <span class="rating-num">★${card.dataset[key]}</span></span>`
        )
        .join("");
    }
    const body = card.querySelector(".review-body");
    if (body) body.textContent = newText;

    closeModal();
    showToast("리뷰가 수정되었어요.");
  });
}
