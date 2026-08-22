// js/script.js

document.addEventListener('DOMContentLoaded', function () {

  /* =========================================================
     MOBILE NAV TOGGLE
  ========================================================= */
  var navToggle = document.getElementById('nav-toggle');
  var mainNav = document.getElementById('main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* =========================================================
     SCROLL FADE-IN (IntersectionObserver)
  ========================================================= */
  var fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeEls.length) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeEls.forEach(function (el) { fadeObserver.observe(el); });
  } else {
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* =========================================================
     STAT COUNTER (trust bar)
  ========================================================= */
  var statEls = document.querySelectorAll('.stat-number[data-target]');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1400;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && statEls.length) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statEls.forEach(function (el) { statObserver.observe(el); });
  } else {
    statEls.forEach(function (el) {
      el.textContent = el.getAttribute('data-target') || '0';
    });
  }

  /* =========================================================
     BOOKING MODAL
  ========================================================= */
  var modal = document.getElementById('booking-modal');

  if (modal) {
    var modalSteps = modal.querySelectorAll('.modal-step');
    var stepDots = modal.querySelectorAll('.step-dot');
    var topicCards = modal.querySelectorAll('.topic-card');
    var selectedTopic = null;

    var detailsField = document.getElementById('booking-details');
    var businessTypeField = document.getElementById('booking-business-type');
    var nameField = document.getElementById('booking-name');
    var phoneField = document.getElementById('booking-phone');
    var emailField = document.getElementById('booking-email');
    var contactMethodField = document.getElementById('booking-contact-method');
    var dateField = document.getElementById('booking-date');
    var timeField = document.getElementById('booking-time');
    var submitBtn = document.getElementById('booking-submit');
    var confirmName = document.getElementById('confirm-name');

    function showStep(stepKey) {
      modalSteps.forEach(function (s) {
        s.classList.toggle('active', s.getAttribute('data-step') === stepKey);
      });
      stepDots.forEach(function (dot) {
        var dotStep = dot.getAttribute('data-step-dot');
        dot.classList.remove('active', 'done');
        if (stepKey !== 'confirm') {
          if (dotStep === stepKey) dot.classList.add('active');
          else if (parseInt(dotStep, 10) < parseInt(stepKey, 10)) dot.classList.add('done');
        } else {
          dot.classList.add('done');
        }
      });
      modal.querySelector('.modal-content').scrollTop = 0;
    }

    function resetModal() {
      selectedTopic = null;
      topicCards.forEach(function (c) { c.classList.remove('selected'); });
      if (detailsField) detailsField.value = '';
      if (businessTypeField) businessTypeField.value = '';
      if (nameField) nameField.value = '';
      if (phoneField) phoneField.value = '';
      if (emailField) emailField.value = '';
      if (dateField) dateField.value = '';
      clearError('details');
      clearError('name');
      clearError('phone');
      clearError('email');
      showStep('1');
    }

    function openModal(topic) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (topic) {
        selectedTopic = topic;
        topicCards.forEach(function (c) {
          c.classList.toggle('selected', c.getAttribute('data-topic') === topic);
        });
        showStep('2');
        if (detailsField) detailsField.focus();
      } else {
        showStep('1');
      }
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(resetModal, 250);
    }

    document.querySelectorAll('.js-open-booking').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-topic'));
      });
    });

    modal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    topicCards.forEach(function (card) {
      card.addEventListener('click', function () {
        selectedTopic = card.getAttribute('data-topic');
        topicCards.forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        setTimeout(function () {
          showStep('2');
          if (detailsField) detailsField.focus();
        }, 150);
      });
    });

    function showError(fieldKey, message) {
      var errorEl = document.getElementById('error-' + fieldKey);
      var group = errorEl ? errorEl.closest('.form-group') : null;
      if (errorEl) errorEl.textContent = message;
      if (group) group.classList.add('has-error');
    }

    function clearError(fieldKey) {
      var errorEl = document.getElementById('error-' + fieldKey);
      var group = errorEl ? errorEl.closest('.form-group') : null;
      if (errorEl) errorEl.textContent = '';
      if (group) group.classList.remove('has-error');
    }

    function validateDetails() {
      if (!detailsField || !detailsField.value.trim()) {
        showError('details', 'Please briefly describe your situation.');
        return false;
      }
      clearError('details');
      return true;
    }

    function validateName() {
      if (!nameField || !nameField.value.trim()) {
        showError('name', 'Please enter your name.');
        return false;
      }
      clearError('name');
      return true;
    }

    function validatePhone() {
      var digits = phoneField ? phoneField.value.replace(/\D/g, '') : '';
      if (digits.length < 7) {
        showError('phone', 'Please enter a valid phone number.');
        return false;
      }
      clearError('phone');
      return true;
    }

    function validateEmail() {
      if (!emailField || !emailField.value.trim()) {
        clearError('email');
        return true;
      }
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(emailField.value.trim())) {
        showError('email', 'Please enter a valid email address.');
        return false;
      }
      clearError('email');
      return true;
    }

    if (detailsField) detailsField.addEventListener('input', validateDetails);
    if (nameField) nameField.addEventListener('input', validateName);
    if (phoneField) phoneField.addEventListener('input', validatePhone);
    if (emailField) emailField.addEventListener('input', validateEmail);

    modal.querySelectorAll('[data-next-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateDetails()) {
          showStep('3');
          if (nameField) nameField.focus();
        }
      });
    });

    modal.querySelectorAll('[data-prev-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = modal.querySelector('.modal-step.active').getAttribute('data-step');
        if (current === '3') showStep('2');
        else if (current === '2') showStep('1');
      });
    });

    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        var validName = validateName();
        var validPhone = validatePhone();
        var validEmail = validateEmail();

        if (validName && validPhone && validEmail) {
          if (confirmName) {
            var firstName = nameField.value.trim().split(' ')[0];
            confirmName.textContent = ', ' + firstName;
          }
          showStep('confirm');
        }
      });
    }
  }

  /* =========================================================
     SERVICE FINDER WIDGET (Home page)
  ========================================================= */
  var finder = document.getElementById('finder-widget');
  if (finder) {
    var finderQuestions = finder.querySelectorAll('[data-question]');
    var resultServiceEl = document.getElementById('finder-result-service');
    var finderCta = document.getElementById('finder-cta');
    var restartBtn = document.getElementById('finder-restart');

    function showFinderQuestion(key) {
      finderQuestions.forEach(function (q) {
        q.classList.toggle('active', q.getAttribute('data-question') === key);
      });
    }

    finder.querySelectorAll('[data-answer]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-answer') + '-2';
        showFinderQuestion(next);
      });
    });

    finder.querySelectorAll('[data-result]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var result = btn.getAttribute('data-result');
        if (resultServiceEl) resultServiceEl.textContent = result;
        if (finderCta) finderCta.setAttribute('data-topic', result);
        showFinderQuestion('result');
      });
    });

    if (restartBtn) {
      restartBtn.addEventListener('click', function () {
        showFinderQuestion('1');
      });
    }
  }

  /* =========================================================
     FAQ ACCORDION
  ========================================================= */
  var faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-answer');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var isMobile = window.innerWidth <= 768;

      if (isMobile) {
        document.querySelectorAll('.faq-question').forEach(function (otherBtn) {
          if (otherBtn !== btn) {
            otherBtn.setAttribute('aria-expanded', 'false');
            var otherAnswer = otherBtn.closest('.faq-item').querySelector('.faq-answer');
            otherAnswer.style.maxHeight = null;
          }
        });
      }

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* =========================================================
     NOTICES FILTER (type + category)
  ========================================================= */
  var noticesGrid = document.getElementById('notices-grid');
  if (noticesGrid) {
    var filterTabs = document.querySelectorAll('.filter-tab');
    var filterPills = document.querySelectorAll('.filter-pill');
    var noticeCards = noticesGrid.querySelectorAll('.notice-card');
    var noticesEmpty = document.getElementById('notices-empty');

    var activeType = 'all';
    var activeCategory = 'all';

    function applyFilters() {
      var visibleCount = 0;
      noticeCards.forEach(function (card) {
        var matchesType = activeType === 'all' || card.getAttribute('data-type') === activeType;
        var matchesCategory = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
        var show = matchesType && matchesCategory;
        card.hidden = !show;
        if (show) visibleCount++;
      });
      if (noticesEmpty) noticesEmpty.hidden = visibleCount > 0;
    }

    filterTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        filterTabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        activeType = tab.getAttribute('data-type');
        applyFilters();
      });
    });

    filterPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        filterPills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category');
        applyFilters();
      });
    });
  }

  /* =========================================================
     DEADLINE BANNER (dismissible, remembers via localStorage)
  ========================================================= */
  var deadlineBanner = document.getElementById('deadline-banner');
  if (deadlineBanner) {
    var bannerId = deadlineBanner.getAttribute('data-banner-id') || 'default';
    var storageKey = 'hisabkitab-banner-dismissed-' + bannerId;

    try {
      if (localStorage.getItem(storageKey) === 'true') {
        deadlineBanner.classList.add('dismissed');
      }
    } catch (e) { /* localStorage unavailable — banner just stays visible */ }

    var bannerClose = document.getElementById('deadline-banner-close');
    if (bannerClose) {
      bannerClose.addEventListener('click', function () {
        deadlineBanner.classList.add('dismissed');
        try {
          localStorage.setItem(storageKey, 'true');
        } catch (e) { /* ignore */ }
      });
    }
  }

  /* =========================================================
     DOCUMENT CHECKLIST TOOL
  ========================================================= */
  var checklistTabs = document.querySelectorAll('.checklist-tab');
  var checklistPanels = document.querySelectorAll('.checklist-panel');

  if (checklistTabs.length) {
    checklistTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-list');
        checklistTabs.forEach(function (t) { t.classList.toggle('active', t === tab); });
        checklistPanels.forEach(function (p) {
          p.classList.toggle('active', p.getAttribute('data-list') === target);
        });
      });
    });
  }

  function updateChecklistProgress(panel) {
    var listKey = panel.getAttribute('data-list');
    var progressEl = document.getElementById('checklist-progress-' + listKey);
    if (!progressEl) return;
    var checkboxes = panel.querySelectorAll('input[type="checkbox"]');
    var checked = panel.querySelectorAll('input[type="checkbox"]:checked').length;
    progressEl.textContent = checked + ' of ' + checkboxes.length;
  }

  checklistPanels.forEach(function (panel) {
    panel.querySelectorAll('input[type="checkbox"]').forEach(function (box) {
      box.addEventListener('change', function () { updateChecklistProgress(panel); });
    });
  });

  /* =========================================================
     LATE-FILING PENALTY ESTIMATOR
  ========================================================= */
  var estimatorBtn = document.getElementById('estimator-calculate');
  if (estimatorBtn) {
    var filingTypeSelect = document.getElementById('estimator-filing-type');
    var monthsInput = document.getElementById('estimator-months');
    var resultBox = document.getElementById('estimator-result');
    var rangeText = document.getElementById('estimator-range');

    var baseRates = {
      vat: 1000,
      income: 2000,
      tds: 1500,
      audit: 3000
    };

    estimatorBtn.addEventListener('click', function () {
      var type = filingTypeSelect.value;
      var months = Math.max(0, parseInt(monthsInput.value, 10) || 0);
      var base = baseRates[type] || 1000;

      var low = base * months;
      var high = Math.round(base * months * 1.6);

      if (months === 0) {
        rangeText.textContent = 'No penalty estimated for 0 months overdue.';
      } else {
        rangeText.textContent = 'NPR ' + low.toLocaleString('en-IN') + ' – NPR ' + high.toLocaleString('en-IN') + ' (estimated)';
      }

      resultBox.hidden = false;
    });
  }

});
