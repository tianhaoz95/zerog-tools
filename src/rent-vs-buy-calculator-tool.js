// Rent vs. Buy Home Calculator — client-side financial comparison tool
// No server round-trips; all computation happens in-browser

const RENT_BUY_CONFIG = {
  MAX_HOLDING_YEARS: 40,
  DEFAULT_HOMEPAGE_PRICE: 350000,
  DEFAULT_DOWN_PAYMENT_PCT: 20,
  DEFAULT_MORTGAGE_RATE: 6.5,
  DEFAULT_LOAN_TERM_YEARS: 30,
  DEFAULT_CLOSING_COSTS_PCT: 3,
  DEFAULT_APPRECIATION: 3,
  DEFAULT_PROPERTY_TAX_PCT: 1.2,
  DEFAULT_INSURANCE_ANNUAL: 1500,
  DEFAULT_MONTHLY_RENT: 2000,
  DEFAULT_RENT_ESCALATION: 2,
};

// Mortgage payment calculation (P&I) using standard formula
function calculateMonthlyMortgage(principal, annualRate, termYears) {
  if (annualRate === 0) return principal / (termYears * 12);
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}

// Simulate rent scenario month-by-month
function simulateRent(monthlyRent, annualEscalation, holdingYears) {
  const schedule = [];
  let totalCost = 0;
  let currentRent = monthlyRent;

  for (let year = 0; year <= holdingYears; year++) {
    if (year > 0 && annualEscalation > 0) {
      currentRent *= (1 + annualEscalation / 100);
    }
    const yearlyCost = currentRent * 12;
    totalCost += yearlyCost;

    schedule.push({
      year,
      monthlyRent: Math.round(currentRent),
      yearlyRentCost: Math.round(yearlyCost),
      cumulativeCost: Math.round(totalCost),
    });
  }

  return { totalCost: Math.round(totalCost), schedule };
}

// Simulate buy scenario month-by-month with mortgage, appreciation, costs
function simulateBuy(homePrice, downPaymentPct, annualMortgageRate, loanTermYears,
                    closingCostsPct, appreciationRate, propertyTaxPct, insuranceAnnual, holdingYears) {
  const principal = homePrice * (1 - downPaymentPct / 100);
  const downPaymentAmount = homePrice * downPaymentPct / 100;
  const closingCosts = homePrice * closingCostsPct / 100;
  const totalDownPayment = downPaymentAmount + closingCosts;

  const monthlyPI = calculateMonthlyMortgage(principal, annualMortgageRate, loanTermYears);
  const monthlyPropertyTax = homePrice * (propertyTaxPct / 100) / 12;
  const monthlyInsurance = insuranceAnnual / 12;
  const totalMonthlyHousingCost = monthlyPI + monthlyPropertyTax + monthlyInsurance;

  let currentHomeValue = homePrice;
  let remainingBalance = principal;
  let totalInterestPaid = 0;
  let totalCost = totalDownPayment; // upfront costs count as "spent" initially

  const schedule = [];

  for (let year = 0; year <= holdingYears; year++) {
    if (year > 0 && appreciationRate > 0) {
      currentHomeValue *= (1 + appreciationRate / 100);
    }

    // Calculate interest paid this year and remaining balance
    let yearlyInterest = 0;
    const monthsInYear = Math.min(12, Math.max(0, (loanTermYears * 12) - ((year - 1) * 12)));

    for (let m = 0; m < monthsInYear && remainingBalance > 0; m++) {
      const interestThisMonth = remainingBalance * (annualMortgageRate / 100 / 12);
      yearlyInterest += interestThisMonth;
      totalInterestPaid += interestThisMonth;
      remainingBalance -= (monthlyPI - interestThisMonth);
      if (remainingBalance < 0) remainingBalance = 0;
    }

    // Property tax and insurance for this year
    const yearlyPropertyTax = currentHomeValue * (propertyTaxPct / 100);
    const yearlyInsurance = insuranceAnnual;

    totalCost += yearlyInterest + yearlyPropertyTax + yearlyInsurance;

    const equity = Math.max(0, currentHomeValue - remainingBalance);
    const netPosition = equity - totalCost; // positive means buying is ahead

    schedule.push({
      year,
      homeValue: Math.round(currentHomeValue),
      remainingBalance: Math.round(remainingBalance),
      equity: Math.round(equity),
      yearlyInterest: Math.round(yearlyInterest),
      yearlyPropertyTax: Math.round(yearlyPropertyTax),
      cumulativeCost: Math.round(totalCost),
    });

    if (remainingBalance <= 0 && year >= loanTermYears) break;
  }

  return { totalCost: Math.round(totalCost), equityAtEnd: Math.round(schedule[schedule.length - 1]?.equity || 0), schedule };
}

// Render results comparison
function renderResults(rentResult, buyResult, homePrice) {
  const container = document.getElementById('rent-buy-results');
  if (!container) return;

  const rentTotal = rentResult.totalCost;
  const buyTotal = buyResult.totalCost;
  const buyEquity = buyResult.equityAtEnd;
  const netRentCost = rentTotal; // renting has no equity
  const netBuyCost = buyTotal - buyEquity; // buy cost minus what you own

  const rentAdvantage = Math.max(0, netBuyCost - netRentCost);
  const buyAdvantage = Math.max(0, netRentCost - netBuyCost);

  container.innerHTML = `
    <div class="comparison-grid">
      <div class="scenario-card rent-scenario glass-card">
        <h3>🏠 Renting</h3>
        <div class="scenario-total">${formatCurrency(rentTotal)}</div>
        <div class="scenario-detail">Net cost after ${rentResult.schedule.length - 1} years: <strong>${formatCurrency(netRentCost)}</strong></div>
      </div>
      <div class="scenario-card buy-scenario glass-card">
        <h3>🏡 Buying</h3>
        <div class="scenario-total">${formatCurrency(buyTotal)}</div>
        <div class="scenario-detail">Net cost after ${buyResult.schedule.length - 1} years: <strong>${formatCurrency(netBuyCost)}</strong></div>
        <div class="scenario-equity">Home equity built: <strong>${formatCurrency(buyEquity)}</strong></div>
      </div>
    </div>

    <div class="verdict glass-card" style="margin-top: 1.5rem; padding: 1.2rem;">
      ${buyAdvantage > rentAdvantage
        ? `<h3>✅ Buying is the better financial choice</h3><p>You save approximately <strong>${formatCurrency(buyAdvantage)}</strong> by buying over renting for this period.</p>`
        : rentAdvantage > buyAdvantage
          ? `<h3>✅ Renting is the better financial choice</h3><p>You save approximately <strong>${formatCurrency(rentAdvantage)}</strong> by renting instead of buying for this period.</p>`
          : '<h3>⚖️ It\'s a close call!</h3><p>The costs are nearly identical. Consider non-financial factors like flexibility and maintenance responsibility.</p>'}
    </div>

    <div class="glass-card" style="margin-top: 1.5rem;">
      <h3>Year-by-Year Comparison</h3>
      <div class="table-scroll">
        <table id="rent-buy-schedule-table" class="data-table compact">
          <thead>
            <tr>
              <th>Year</th>
              <th>Rent Cumulative Cost</th>
              <th>Buy Cumulative Cost</th>
              <th>Home Value (Buy)</th>
              <th>Net Equity (Buy)</th>
            </tr>
          </thead>
          <tbody id="rent-buy-schedule-body"></tbody>
        </table>
      </div>
    </div>
  `;

  // Populate schedule table
  const tbody = document.getElementById('rent-buy-schedule-body');
  if (tbody) {
    const maxYears = Math.max(rentResult.schedule.length, buyResult.schedule.length);
    let html = '';
    for (let i = 0; i < maxYears; i++) {
      const rent = rentResult.schedule[i] || {};
      const buy = buyResult.schedule[i] || {};
      html += `<tr>
        <td>${i}</td>
        <td>${formatCurrency(rent.cumulativeCost || 0)}</td>
        <td>${formatCurrency(buy.cumulativeCost || 0)}</td>
        <td>${formatCurrency(buy.homeValue || 0)}</td>
        <td>${formatCurrency(buy.equity || 0)}</td>
      </tr>`;
    }
    tbody.innerHTML = html;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

// Initialize the rent vs buy calculator
function initRentBuyCalculator() {
  const form = document.getElementById('rent-buy-form');
  if (!form) return;

  // Load sample data button
  const btnSample = document.getElementById('btn-load-sample-rentbuy');
  if (btnSample) {
    btnSample.addEventListener('click', () => {
      fillForm({
        homePrice: RENT_BUY_CONFIG.DEFAULT_HOMEPAGE_PRICE,
        downPaymentPct: RENT_BUY_CONFIG.DEFAULT_DOWN_PAYMENT_PCT,
        mortgageRate: RENT_BUY_CONFIG.DEFAULT_MORTGAGE_RATE,
        loanTermYears: RENT_BUY_CONFIG.DEFAULT_LOAN_TERM_YEARS,
        closingCostsPct: RENT_BUY_CONFIG.DEFAULT_CLOSING_COSTS_PCT,
        appreciation: RENT_BUY_CONFIG.DEFAULT_APPRECIATION,
        propertyTaxPct: RENT_BUY_CONFIG.DEFAULT_PROPERTY_TAX_PCT,
        insuranceAnnual: RENT_BUY_CONFIG.DEFAULT_INSURANCE_ANNUAL,
        monthlyRent: RENT_BUY_CONFIG.DEFAULT_MONTHLY_RENT,
        rentEscalation: RENT_BUY_CONFIG.DEFAULT_RENT_ESCALATION,
        holdingYears: 10,
      });
    });
  }

  // Calculate button
  const btnCalc = document.getElementById('btn-calculate-rentbuy');
  if (btnCalc) {
    btnCalc.addEventListener('click', handleRentBuyCalculate);
  }

  // Populate form with default values on load
  fillForm({
    homePrice: RENT_BUY_CONFIG.DEFAULT_HOMEPAGE_PRICE,
    downPaymentPct: RENT_BUY_CONFIG.DEFAULT_DOWN_PAYMENT_PCT,
    mortgageRate: RENT_BUY_CONFIG.DEFAULT_MORTGAGE_RATE,
    loanTermYears: RENT_BUY_CONFIG.DEFAULT_LOAN_TERM_YEARS,
    closingCostsPct: RENT_BUY_CONFIG.DEFAULT_CLOSING_COSTS_PCT,
    appreciation: RENT_BUY_CONFIG.DEFAULT_APPRECIATION,
    propertyTaxPct: RENT_BUY_CONFIG.DEFAULT_PROPERTY_TAX_PCT,
    insuranceAnnual: RENT_BUY_CONFIG.DEFAULT_INSURANCE_ANNUAL,
    monthlyRent: RENT_BUY_CONFIG.DEFAULT_MONTHLY_RENT,
    rentEscalation: RENT_BUY_CONFIG.DEFAULT_RENT_ESCALATION,
    holdingYears: 10,
  });
}

function fillForm(values) {
  const fields = [
    'home-price', 'down-payment-pct', 'mortgage-rate', 'loan-term-years',
    'closing-costs-pct', 'appreciation-rate', 'property-tax-pct',
    'insurance-annual', 'monthly-rent', 'rent-escalation', 'holding-years'
  ];

  fields.forEach(field => {
    const el = document.getElementById(field);
    if (el && values[field]) {
      el.value = values[field];
    }
  });
}

function parseRentBuyForm() {
  const getVal = (id) => parseFloat(document.getElementById(id)?.value) || 0;

  return {
    homePrice: getVal('home-price'),
    downPaymentPct: getVal('down-payment-pct'),
    mortgageRate: getVal('mortgage-rate'),
    loanTermYears: Math.round(getVal('loan-term-years')),
    closingCostsPct: getVal('closing-costs-pct'),
    appreciationRate: getVal('appreciation-rate'),
    propertyTaxPct: getVal('property-tax-pct'),
    insuranceAnnual: getVal('insurance-annual'),
    monthlyRent: getVal('monthly-rent'),
    rentEscalation: getVal('rent-escalation'),
    holdingYears: Math.round(getVal('holding-years')),
  };
}

function handleRentBuyCalculate() {
  const params = parseRentBuyForm();

  if (params.homePrice <= 0 || params.monthlyRent <= 0) {
    showStatus('Please enter a home price and monthly rent.', 'error');
    return;
  }

  if (params.holdingYears < 1 || params.holdingYears > RENT_BUY_CONFIG.MAX_HOLDING_YEARS) {
    showStatus(`Holding period must be between 1 and ${RENT_BUY_CONFIG.MAX_HOLDING_YEARS} years.`, 'error');
    return;
  }

  try {
    const rentResult = simulateRent(params.monthlyRent, params.rentEscalation, params.holdingYears);
    const buyResult = simulateBuy(
      params.homePrice, params.downPaymentPct, params.mortgageRate, params.loanTermYears,
      params.closingCostsPct, params.appreciationRate, params.propertyTaxPct,
      params.insuranceAnnual, params.holdingYears
    );

    renderResults(rentResult, buyResult, params.homePrice);
    showStatus('Calculation complete!', 'success');
  } catch (err) {
    showStatus(`Error: ${err.message}`, 'error');
  }
}

function showStatus(message, type = 'info') {
  const statusEl = document.getElementById('rent-buy-status');
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.className = `glass-card rent-buy-banner ${type}`;
  statusEl.style.display = 'block';
}

// Export for use by main.js navigation handler
if (typeof window !== 'undefined') {
  window.initRentBuyCalculator = initRentBuyCalculator;
}
