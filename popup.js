// eBay Profit Calculator - popup.js
// Handles all calculation logic and UI interactions

const STORAGE_KEY = 'ebay_calc_settings';

// eBay fee rates by category
const EBAY_FEES = {
  '0.1325': 'Most Categories',
  '0.15': 'Clothing & Accessories',
  '0.0915': 'Heavy Equipment',
  '0.0865': 'Musical Instruments',
  '0.065': 'Select Collectibles'
};

function formatCurrency(amount) {
  return '$' + Math.abs(amount).toFixed(2);
}

function formatPercent(value) {
  return value.toFixed(1) + '%';
}

function calculate() {
  const salePrice = parseFloat(document.getElementById('salePrice').value) || 0;
  const itemCost = parseFloat(document.getElementById('itemCost').value) || 0;
  const shippingCost = parseFloat(document.getElementById('shippingCost').value) || 0;
  const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;

  const categoryEl = document.getElementById('ebayCategory');
  let ebayFeeRate;
  if (categoryEl.value === 'custom') {
    ebayFeeRate = (parseFloat(document.getElementById('customFee').value) || 0) / 100;
  } else {
    ebayFeeRate = parseFloat(categoryEl.value);
  }

  const paymentEl = document.getElementById('paymentFee');
  let paymentFeeRate;
  if (paymentEl.value === 'custom') {
    paymentFeeRate = 0.03;
  } else {
    paymentFeeRate = parseFloat(paymentEl.value);
  }

  // Calculate fees
  const ebayFee = salePrice * ebayFeeRate;
  const paymentFee = salePrice * paymentFeeRate;
  const taxAmount = itemCost * (taxRate / 100);

  // Net profit calculation
  const totalCosts = ebayFee + paymentFee + shippingCost + itemCost + taxAmount;
  const netProfit = salePrice - totalCosts;

  // ROI and margin
  const totalInvested = itemCost + shippingCost + taxAmount;
  const roi = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;
  const margin = salePrice > 0 ? (netProfit / salePrice) * 100 : 0;

  // Display results
  const resultsEl = document.getElementById('results');
  resultsEl.style.display = 'block';

  document.getElementById('res-salePrice').textContent = formatCurrency(salePrice);
  document.getElementById('res-ebayFee').textContent = '-' + formatCurrency(ebayFee);
  document.getElementById('res-paymentFee').textContent = '-' + formatCurrency(paymentFee);
  document.getElementById('res-shipping').textContent = '-' + formatCurrency(shippingCost);
  document.getElementById('res-itemCost').textContent = '-' + formatCurrency(itemCost);

  const netProfitEl = document.getElementById('res-netProfit');
  netProfitEl.textContent = (netProfit >= 0 ? '+' : '-') + formatCurrency(netProfit);
  netProfitEl.className = 'value ' + (netProfit >= 0 ? 'positive' : 'negative');

  const roiEl = document.getElementById('res-roi');
  roiEl.textContent = (roi >= 0 ? '+' : '') + formatPercent(roi);
  roiEl.className = 'value ' + (roi >= 0 ? 'positive' : 'negative');

  const marginEl = document.getElementById('res-margin');
  marginEl.textContent = formatPercent(margin);
  marginEl.className = 'value ' + (margin >= 0 ? 'positive' : 'negative');

  // Save last values
  chrome.storage.local.set({
    lastSalePrice: salePrice,
    lastItemCost: itemCost,
    lastShipping: shippingCost
  });
}

function clearForm() {
  document.getElementById('salePrice').value = '';
  document.getElementById('itemCost').value = '';
  document.getElementById('shippingCost').value = '';
  document.getElementById('taxRate').value = '';
  document.getElementById('results').style.display = 'none';
}

function loadSavedValues() {
  chrome.storage.local.get(['lastSalePrice', 'lastItemCost', 'lastShipping'], (data) => {
    if (data.lastSalePrice) document.getElementById('salePrice').value = data.lastSalePrice;
    if (data.lastItemCost) document.getElementById('itemCost').value = data.lastItemCost;
    if (data.lastShipping) document.getElementById('shippingCost').value = data.lastShipping;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSavedValues();

  document.getElementById('calculateBtn').addEventListener('click', calculate);
  document.getElementById('clearBtn').addEventListener('click', clearForm);

  // Allow Enter key to trigger calculation
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') calculate();
    });
  });

  // Show/hide custom fee input
  document.getElementById('ebayCategory').addEventListener('change', (e) => {
    const customGroup = document.getElementById('customFeeGroup');
    customGroup.style.display = e.target.value === 'custom' ? 'block' : 'none';
  });

  // Auto-recalculate on input change if results are visible
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
      if (document.getElementById('results').style.display !== 'none') {
        calculate();
      }
    });
  });
});
