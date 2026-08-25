/* ============================================================
   VenuePick prototype interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initDonutCharts();
  initWordclouds();
  initReviewModal();
  initFacilityGrid();
  initFacilityDetail();
  initAuth();
  initMyPage();
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

/* ---------- 상세: 시설 정보 + 리뷰 목록 (facilities.json / reviews.json + 실시간 작성 리뷰) ----------
   currentFacility / currentFacilityReviews 는 리뷰 작성 모달(initReviewModal)에서도 참조해
   새로 등록한 리뷰를 같은 목록에 즉시 반영하는 데 사용한다. */
let currentFacility = null;
let currentFacilityReviews = [];

function renderReviewList() {
  const sectionTitle = document.querySelector(".section-title");
  if (sectionTitle) sectionTitle.textContent = `이용자 리뷰 ${currentFacility.totalReviewCount}개`;
  const sectionDesc = document.querySelector(".section-desc");
  if (sectionDesc) sectionDesc.textContent = `전체 리뷰 중 대표 리뷰 ${currentFacilityReviews.length}개를 보여드려요.`;

  const list = document.querySelector(".review-list");
  if (!list) return;
  list.innerHTML = currentFacilityReviews
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
      currentFacility = facility;
      currentFacilityReviews = facilityReviews;

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

      renderReviewList();
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

  const starPickers = [...overlay.querySelectorAll(".star-picker[data-key]")];

  function validate() {
    const len = textarea.value.trim().length;
    counter.textContent = `${len} / ${MIN_CHARS}자 이상`;
    counter.classList.toggle("ok", len >= MIN_CHARS);
    const allRated = starPickers.every((picker) => Number(picker.dataset.value) >= 1);
    submitBtn.disabled = len < MIN_CHARS || !allRated;
  }
  if (textarea) {
    textarea.addEventListener("input", validate);
    validate();
  }

  function resetForm() {
    textarea.value = "";
    starPickers.forEach((picker) => {
      picker.dataset.value = "0";
      picker.querySelectorAll("button").forEach((s) => s.classList.remove("filled"));
    });
    validate();
  }

  // 별점 선택
  starPickers.forEach((picker) => {
    const stars = [...picker.querySelectorAll("button")];
    stars.forEach((star, idx) => {
      star.addEventListener("click", () => {
        stars.forEach((s, i) => s.classList.toggle("filled", i <= idx));
        picker.dataset.value = idx + 1;
        validate();
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
    submitBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      if (submitBtn.disabled || !currentFacility) return;

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) {
        showToast("리뷰를 작성하려면 로그인이 필요해요.");
        closeModal();
        await loginWithGoogle();
        return;
      }

      const ratings = {};
      starPickers.forEach((picker) => {
        ratings[picker.dataset.key] = Number(picker.dataset.value);
      });
      const reviewText = textarea.value.trim();

      const hasAllRatings = ["price", "accessibility", "facility", "service"].every(
        (key) => Number.isInteger(ratings[key]) && ratings[key] >= 1 && ratings[key] <= 5
      );
      if (!hasAllRatings) {
        showToast("모든 항목의 별점을 선택해주세요.");
        return;
      }

      submitBtn.disabled = true;
      const { error } = await supabaseClient.from("reviews").insert({
        facility_id: currentFacility.id,
        user_id: user.id,
        price_rating: ratings.price,
        accessibility_rating: ratings.accessibility,
        facility_rating: ratings.facility,
        service_rating: ratings.service,
        review_text: reviewText,
      });

      if (error) {
        console.error("리뷰 등록 실패", error);
        showToast("리뷰 등록에 실패했어요. 잠시 후 다시 시도해주세요.");
        submitBtn.disabled = false;
        return;
      }

      currentFacility.totalReviewCount += 1;
      currentFacilityReviews = [
        {
          facilityId: currentFacility.id,
          isVerified: false,
          priceRating: ratings.price,
          accessibilityRating: ratings.accessibility,
          facilityRating: ratings.facility,
          serviceRating: ratings.service,
          text: reviewText,
          date: new Date().toISOString().slice(0, 7),
        },
        ...currentFacilityReviews,
      ];
      renderReviewList();

      closeModal();
      showToast("리뷰가 등록되었어요. 소중한 경험 감사합니다!");
      resetForm();
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

/* ---------- 마이페이지: 내가 쓴 리뷰 (Supabase reviews 조회) ----------
   비로그인 / 로그인+리뷰없음 / 로그인+리뷰있음 세 가지 상태를 전환하며,
   facility_id는 facilities.json 과 매칭해 시설명을 보여준다. */
function initMyPage() {
  const list = document.getElementById("myReviewList");
  if (!list || typeof supabaseClient === "undefined") return;

  const loginRequired = document.getElementById("loginRequiredState");
  const emptyState = document.getElementById("myEmptyState");
  const profileCard = document.getElementById("profileCard");
  const pageHeader = document.getElementById("myPageHeader");
  const countEl = document.getElementById("myReviewCount");
  const loginBtn = document.getElementById("myPageLoginBtn");

  if (loginBtn) loginBtn.addEventListener("click", () => loginWithGoogle());

  function showOnly(target) {
    [emptyState, list].forEach((node) => {
      if (node) node.style.display = node === target ? "" : "none";
    });
  }

  function formatDate(isoString) {
    const d = new Date(isoString);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  }

  supabaseClient.auth.getUser().then(async ({ data: { user } }) => {
    if (!user) {
      if (profileCard) profileCard.style.display = "none";
      if (pageHeader) pageHeader.style.display = "none";
      list.style.display = "none";
      if (emptyState) emptyState.style.display = "none";
      if (loginRequired) loginRequired.style.display = "";
      return;
    }

    if (loginRequired) loginRequired.style.display = "none";
    if (profileCard) profileCard.style.display = "";
    if (pageHeader) pageHeader.style.display = "";

    const emailEl = document.getElementById("profileEmail");
    if (emailEl) emailEl.textContent = user.email || "";
    const avatarEl = document.getElementById("profileAvatar");
    if (avatarEl) avatarEl.textContent = (user.email || "?").charAt(0).toUpperCase();

    const [{ data: reviews, error }, facilities] = await Promise.all([
      supabaseClient
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      fetch(jsonPath("facilities.json")).then((res) => res.json()),
    ]);

    if (error) {
      console.error("내 리뷰를 불러오지 못했습니다.", error);
      showOnly(emptyState);
      return;
    }

    if (countEl) countEl.textContent = reviews.length;

    if (!reviews.length) {
      showOnly(emptyState);
      return;
    }

    list.innerHTML = reviews
      .map((r) => {
        const facility = facilities.find((f) => f.id === r.facility_id);
        const facilityLabel = facility
          ? `<a href="facility.html?id=${facility.id}">${facility.name}</a>`
          : "알 수 없는 시설";
        return `
      <div class="glass-card my-review-card fade-up">
        <div class="review-top">
          <div>
            <div class="my-review-facility">${facilityLabel}</div>
            <div class="review-meta">${formatDate(r.created_at)} 작성</div>
          </div>
          ${r.is_verified ? '<span class="badge-verified">✓ 인증된 이용 후기</span>' : ""}
        </div>
        <div class="review-rating-row">
          <span class="rating-chip">가격 <span class="rating-num">★${r.price_rating}</span></span>
          <span class="rating-chip">접근성 <span class="rating-num">★${r.accessibility_rating}</span></span>
          <span class="rating-chip">시설 <span class="rating-num">★${r.facility_rating}</span></span>
          <span class="rating-chip">서비스 <span class="rating-num">★${r.service_rating}</span></span>
        </div>
        <p class="review-body">${r.review_text}</p>
      </div>`;
      })
      .join("");
    showOnly(list);
  });
}
