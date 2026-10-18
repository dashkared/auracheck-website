/**
 * AuraCheck Landing Page Interactive Scripts
 * Lightweight, zero-dependency, modern ES6+
 */

document.addEventListener('DOMContentLoaded', () => {
  initDemoTabs();
  initInvestorCalculator();
  initMobileMenu();
  initSmoothScroll();
});

/**
 * 1. Product Demo Tabs & Sidebar Interaction
 */
function initDemoTabs() {
  const tabButtons = document.querySelectorAll('.demo-tab-btn');
  const viewPanes = document.querySelectorAll('.demo-view-pane');
  const sidebarItems = document.querySelectorAll('.mock-nav-item');

  // Mapping between tab targets and sidebar nav IDs
  const targetToNavMap = {
    'view-conflicts': 'sideNavConflicts',
    'view-deadlines': 'sideNavCourts',
    'view-finance': 'sideNavFinance',
    'view-blockchain': 'sideNavAudit'
  };

  function switchTab(targetId) {
    // 1. Update tab buttons
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-target') === targetId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 2. Update visible pane
    viewPanes.forEach(pane => {
      if (pane.id === targetId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // 3. Update active sidebar item
    sidebarItems.forEach(item => item.classList.remove('active'));
    const navId = targetToNavMap[targetId];
    if (navId) {
      const activeNav = document.getElementById(navId);
      if (activeNav) activeNav.classList.add('active');
    }
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      switchTab(target);
    });
  });

  // Also allow clicking mock sidebar items to switch tabs
  const navToTargetMap = {
    'sideNavConflicts': 'view-conflicts',
    'sideNavCourts': 'view-deadlines',
    'sideNavFinance': 'view-finance',
    'sideNavAudit': 'view-blockchain'
  };

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = navToTargetMap[item.id];
      if (target) {
        switchTab(target);
      }
    });
  });
}

/**
 * 2. Interactive Investor ARR Calculator
 */
function initInvestorCalculator() {
  const cabSlider = document.getElementById('cabSlider');
  const buroSlider = document.getElementById('buroSlider');
  const cabCountVal = document.getElementById('cabCountVal');
  const buroCountVal = document.getElementById('buroCountVal');
  const calcArrTotal = document.getElementById('calcArrTotal');
  const calcMrrTotal = document.getElementById('calcMrrTotal');

  if (!cabSlider || !buroSlider) return;

  const PRICE_CABINET = 3990;  // руб / мес
  const PRICE_BURO = 12990;    // руб / мес
  const TOTAL_CABINETS = 22705; // Всего в РФ
  const TOTAL_BUROS = 1028;     // Всего в РФ

  function updateCalculator() {
    const cabs = parseInt(cabSlider.value, 10);
    const buros = parseInt(buroSlider.value, 10);

    const cabPercent = ((cabs / TOTAL_CABINETS) * 100).toFixed(1);
    const buroPercent = ((buros / TOTAL_BUROS) * 100).toFixed(1);

    cabCountVal.textContent = `${cabs.toLocaleString('ru-RU')} кабинетов (${cabPercent}%)`;
    buroCountVal.textContent = `${buros.toLocaleString('ru-RU')} бюро (${buroPercent}%)`;

    const mrr = (cabs * PRICE_CABINET) + (buros * PRICE_BURO);
    const arr = mrr * 12;

    calcArrTotal.textContent = `${arr.toLocaleString('ru-RU')} ₽`;
    calcMrrTotal.textContent = `${mrr.toLocaleString('ru-RU')} ₽`;
  }

  cabSlider.addEventListener('input', updateCalculator);
  buroSlider.addEventListener('input', updateCalculator);

  updateCalculator();
}

/**
 * 3. Mobile Navigation Menu
 */
function initMobileMenu() {
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.querySelector('.nav-links');

  if (!mobileBtn || !navLinks) return;

  mobileBtn.addEventListener('click', () => {
    const isVisible = navLinks.style.display === 'flex';
    navLinks.style.display = isVisible ? 'none' : 'flex';
    if (!isVisible) {
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '76px';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = '#090615';
      navLinks.style.padding = '24px';
      navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        navLinks.style.display = 'none';
      }
    });
  });
}

/**
 * 4. Smooth Anchor Scrolling
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 5. Pitch Deck Request Modal Dialog
 */
function openPitchModal(purpose = '') {
  const modal = document.getElementById('pitchModal');
  if (!modal) return;

  if (purpose) {
    const noteSelect = document.getElementById('leadNote');
    if (noteSelect) {
      for (let i = 0; i < noteSelect.options.length; i++) {
        if (noteSelect.options[i].text.includes(purpose) || noteSelect.options[i].value.includes(purpose)) {
          noteSelect.selectedIndex = i;
          break;
        }
      }
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePitchModal() {
  const modal = document.getElementById('pitchModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal on click outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('pitchModal');
  if (e.target === modal) {
    closePitchModal();
  }
});

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closePitchModal();
  }
});

/**
 * 6. Handle Lead Submission
 */
function handleLeadSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('leadName').value;
  const email = document.getElementById('leadEmail').value;
  const contact = document.getElementById('leadContact').value;

  const formBox = document.querySelector('#pitchModal .modal-box');
  if (formBox) {
    formBox.innerHTML = `
      <span class="modal-close" onclick="closePitchModal()">&times;</span>
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:3rem;margin-bottom:12px;">✅</div>
        <h3 style="font-size:1.5rem;font-weight:800;margin-bottom:8px;">Спасибо, ${escapeHtml(name)}!</h3>
        <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:24px;">
          Запрос успешно отправлен лидеру проекта (Константину Сивенкову). Инвестиционный меморандум и презентация будут высланы на <strong>${escapeHtml(email)}</strong> и в контакт <strong>${escapeHtml(contact)}</strong> в течение нескольких минут.
        </p>
        <button class="btn btn-primary" onclick="closePitchModal()">Закрыть</button>
      </div>
    `;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
