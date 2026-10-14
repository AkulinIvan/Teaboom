/**
 * Teaboom.ru — карточка товара «Ананасовый улун».
 * - Переключение фасовок (цена, старая цена, артикул).
 * - Табы «Описание / Свойства / Отзывы».
 * - Кнопка «В корзину»: визуальная обратная связь.
 * - Отключение перехода по ссылкам-заглушкам.
 * Без зависимостей. ES2015+.
 */
(function () {
  'use strict';

  // ============ 1. Фасовки ============
  const form            = document.getElementById('product-form');
  const totalPriceEl    = document.getElementById('total-price');
  const totalOldPriceEl = document.getElementById('total-old-price');
  const totalSkuEl      = document.getElementById('total-sku');
  const addBtn          = document.getElementById('add-to-cart');
  const addBtnLabel     = addBtn ? addBtn.querySelector('.product__add-to-cart-label') : null;

  /**
   * Форматирует число в цену с пробелами-разделителями (рус. формат).
   * @param {string|number} value
   * @returns {string}
   */
  function formatPrice(value) {
    const num = parseFloat(String(value).replace(/\s/g, '').replace(',', '.'));
    if (Number.isNaN(num)) return '';
    return num.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  /**
   * Обновляет сводный блок по выбранной фасовке.
   * @param {HTMLInputElement} input
   */
  function updateSummary(input) {
    const price    = input.dataset.price;
    const oldPrice = input.dataset.oldPrice;
    const sku      = input.dataset.sku;
    if (!price) return;

    totalPriceEl.innerHTML = formatPrice(price) + ' <i>₽</i>';
    totalPriceEl.setAttribute('content', price);

    totalOldPriceEl.innerHTML = oldPrice ? formatPrice(oldPrice) + ' <i>₽</i>' : '';
    totalSkuEl.textContent = 'Артикул: ' + sku;
  }

  if (form) {
    form.addEventListener('change', function (e) {
      if (e.target.matches('.variant__input')) updateSummary(e.target);
    });

    const initial = form.querySelector('.variant__input:checked');
    if (initial) updateSummary(initial);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const selected = form.querySelector('.variant__input:checked');
      if (!selected || !addBtn || addBtn.disabled) return;

      addBtn.disabled = true;
      addBtn.classList.add('is-added');
      if (addBtnLabel) addBtnLabel.textContent = 'Добавлено';

      setTimeout(function () {
        addBtn.disabled = false;
        addBtn.classList.remove('is-added');
        if (addBtnLabel) addBtnLabel.textContent = 'В корзину';
      }, 1500);
    });
  }

  // ============ 2. Табы ============
  const tabButtons = document.querySelectorAll('.tabs__btn');
  const tabPanels  = document.querySelectorAll('.tabs__panel');

  function activateTab(target) {
    tabButtons.forEach(function (btn) {
      const isActive = btn === target;
      btn.classList.toggle('tabs__btn--active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    const panelId = target.getAttribute('aria-controls');
    tabPanels.forEach(function (panel) {
      const isActive = panel.id === panelId;
      panel.classList.toggle('tabs__panel--active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabButtons.forEach(function (btn, index) {
    btn.addEventListener('click', function () { activateTab(btn); });

    btn.addEventListener('keydown', function (e) {
      let nextIndex = null;
      if (e.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
      if (e.key === 'ArrowLeft')  nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (e.key === 'Home')       nextIndex = 0;
      if (e.key === 'End')        nextIndex = tabButtons.length - 1;

      if (nextIndex !== null) {
        e.preventDefault();
        tabButtons[nextIndex].focus();
        activateTab(tabButtons[nextIndex]);
      }
    });
  });

  // ============ 3. Отключаем переход по ссылкам-заглушкам ============
  document.addEventListener('click', function (e) {
    const link = e.target.closest('a[href="#"]');
    if (link) e.preventDefault();
  });
})();