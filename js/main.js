// ============================================================
// Campus Placement Cell — shared interactions
// ============================================================

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.hamburger');
  const tabNav = document.querySelector('.tab-nav');
  if (burger && tabNav) {
    burger.addEventListener('click', () => {
      tabNav.classList.toggle('open-mobile');
      tabNav.style.display = tabNav.classList.contains('open-mobile') ? 'flex' : 'none';
      tabNav.style.flexDirection = 'column';
      tabNav.style.position = 'absolute';
      tabNav.style.top = '58px';
      tabNav.style.left = '0';
      tabNav.style.right = '0';
      tabNav.style.background = '#1b2a4a';
      tabNav.style.padding = '8px 20px 16px';
    });
  }

  // Job listing filter (jobs.html)
  const filterInputs = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-card]');
  if (filterInputs.length && cards.length) {
    const applyFilters = () => {
      const active = {};
      filterInputs.forEach(inp => {
        if (inp.value && inp.value !== 'all') active[inp.dataset.filter] = inp.value.toLowerCase();
      });
      cards.forEach(card => {
        let show = true;
        Object.keys(active).forEach(key => {
          const cardVal = (card.dataset[key] || '').toLowerCase();
          if (!cardVal.includes(active[key])) show = false;
        });
        card.style.display = show ? '' : 'none';
      });
    };
    filterInputs.forEach(inp => inp.addEventListener('input', applyFilters));
    filterInputs.forEach(inp => inp.addEventListener('change', applyFilters));
  }

  // Simple tab switcher (used in admin/company detail pages)
  document.querySelectorAll('[data-tabgroup]').forEach(group => {
    const buttons = group.querySelectorAll('[data-tabbtn]');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tabbtn;
        group.querySelectorAll('[data-tabbtn]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        group.querySelectorAll('[data-tabpanel]').forEach(panel => {
          panel.style.display = panel.dataset.tabpanel === target ? '' : 'none';
        });
      });
    });
  });

  // Prevent real submission on demo forms, show a confirmation stamp instead
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run field validation first — stop here if anything's invalid
      if (window.PortalValidation && !window.PortalValidation.validateForm(form)) {
        return;
      }

      const note = form.querySelector('[data-submit-note]');
      if (note) {
        note.style.display = 'block';
        note.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      item.classList.toggle('open');
    });
  });
});
