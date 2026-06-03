// eBay Profit Calculator - content.js
// Injects profit overlay directly on eBay listing pages

(function() {
  'use strict';

  // Only run on eBay item pages
  if (!window.location.href.includes('/itm/')) return;

  // Extract price from eBay listing
  function getListingPrice() {
    const selectors = [
      '[itemprop="price"]',
      '.x-price-primary span.ux-textspans',
      '#prcIsum',
      '#mm-saleDscPrc',
      '.vi-price .notranslate'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = el.getAttribute('content') || el.textContent;
        const price = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (!isNaN(price) && price > 0) return price;
      }
    }
    return null;
  }

  // Extract shipping cost from listing
  function getShippingCost() {
    const selectors = [
      '#fshippingCost',
      '.vi-fnf-ship-cost',
      '[data-testid="ux-labels-values"] .ux-textspans--BOLD'
    ];

    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) {
        const text = el.textContent;
        if (text.toLowerCase().includes('free')) return 0;
        const cost = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (!isNaN(cost)) return cost;
      }
    }
    return null;
  }

  // Create and inject the profit overlay widget
  function createOverlay(salePrice, shippingCost) {
    // Remove existing overlay if present
    const existing = document.getElementById('ebay-profit-calc-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'ebay-profit-calc-overlay';
    overlay.innerHTML = `
      <div class="epc-header">
        <span>Profit Calculator</span>
        <button class="epc-toggle" title="Toggle">-</button>
      </div>
      <div class="epc-body">
        <div class="epc-row">
          <label>Item Cost ($)</label>
          <input type="number" id="epc-cost" placeholder="0.00" step="0.01">
        </div>
        <div class="epc-row">
          <label>eBay Fee</label>
          <select id="epc-fee-select">
            <option value="0.1325">13.25% (Most)</option>
            <option value="0.15">15% (Clothing)</option>
            <option value="0.065">6.5% (Collectibles)</option>
          </select>
        </div>
        <button id="epc-calc-btn">Calculate</button>
        <div class="epc-results" id="epc-results" style="display:none">
          <div class="epc-result-row"><span>Sale Price</span><span id="epc-price"></span></div>
          <div class="epc-result-row"><span>eBay Fee</span><span id="epc-ebay-fee"></span></div>
          <div class="epc-result-row"><span>Shipping</span><span id="epc-ship"></span></div>
          <div class="epc-result-row epc-total"><span>Net Profit</span><span id="epc-profit"></span></div>
          <div class="epc-result-row"><span>ROI</span><span id="epc-roi"></span></div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Pre-fill detected values
    if (salePrice) {
      overlay.querySelector('#epc-calc-btn').click;
    }

    // Toggle collapse
    overlay.querySelector('.epc-toggle').addEventListener('click', function() {
      const body = overlay.querySelector('.epc-body');
      if (body.style.display === 'none') {
        body.style.display = 'block';
        this.textContent = '-';
      } else {
        body.style.display = 'none';
        this.textContent = '+';
      }
    });

    // Calculate button
    overlay.querySelector('#epc-calc-btn').addEventListener('click', function() {
      const cost = parseFloat(overlay.querySelector('#epc-cost').value) || 0;
      const feeRate = parseFloat(overlay.querySelector('#epc-fee-select').value);
      const price = salePrice || 0;
      const ship = shippingCost || 0;

      const ebayFee = price * feeRate;
      const profit = price - ebayFee - ship - cost;
      const roi = cost > 0 ? (profit / cost) * 100 : 0;

      overlay.querySelector('#epc-results').style.display = 'block';
      overlay.querySelector('#epc-price').textContent = '$' + price.toFixed(2);
      overlay.querySelector('#epc-ebay-fee').textContent = '-$' + ebayFee.toFixed(2);
      overlay.querySelector('#epc-ship').textContent = '-$' + ship.toFixed(2);

      const profitEl = overlay.querySelector('#epc-profit');
      profitEl.textContent = (profit >= 0 ? '+$' : '-$') + Math.abs(profit).toFixed(2);
      profitEl.style.color = profit >= 0 ? '#00a650' : '#e53935';

      overlay.querySelector('#epc-roi').textContent = roi.toFixed(1) + '%';
    });

    // Make draggable
    let isDragging = false, startX, startY, startLeft, startTop;
    overlay.querySelector('.epc-header').addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startLeft = overlay.offsetLeft;
      startTop = overlay.offsetTop;
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      overlay.style.left = (startLeft + e.clientX - startX) + 'px';
      overlay.style.top = (startTop + e.clientY - startY) + 'px';
      overlay.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
  }

  // Wait for page to fully load then inject
  function init() {
    const price = getListingPrice();
    const shipping = getShippingCost();
    if (price !== null) {
      createOverlay(price, shipping);
    } else {
      // Retry after dynamic content loads
      setTimeout(() => {
        const retryPrice = getListingPrice();
        if (retryPrice !== null) createOverlay(retryPrice, getShippingCost());
      }, 2000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
