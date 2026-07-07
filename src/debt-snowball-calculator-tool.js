// Debt Snowball vs. Avalanche Payoff Calculator — client-side financial calculator
// No server round-trips; all computation happens in-browser via WebCrypto-free JS

const DEBT_TABLE_HEADERS = ['Debt Name', 'Balance ($)', 'Interest Rate (%)', 'Min Payment ($)'];
const MAX_DEBTS = 10;
const MAX_MONTHS = 720; // cap at 60 years for safety

// ── Debt Input Parsing ────────────────────────────────────────────────

/**
 * Parse debt rows from the HTML table inputs.
 * Returns array of { name, balance, rate, minPayment } or null if invalid.
 */
function parseDebtsFromDOM() {
  const rows = document.querySelectorAll('#debt-rows .debt-row');
  const debts = [];

  for (const row of rows) {
    const inputs = row.querySelectorAll('input[type="number"]');
    const nameInput = row.querySelector('.debt-name-input') || row.querySelector('input[data-field="name"]');
    const balanceVal = inputs[0]?.value;
    const rateVal = inputs[1]?.value;
    const paymentVal = inputs[2]?.value;

    if (!balanceVal || !rateVal || !paymentVal) continue;

    const balance = parseFloat(balanceVal);
    const rate = parseFloat(rateVal);
    const minPayment = parseFloat(paymentVal);

    if (isNaN(balance) || isNaN(rate) || isNaN(minPayment)) return null;
    if (balance <= 0 || rate < 0 || minPayment <= 0) return null;

    debts.push({
      name: nameInput?.value?.trim() || `Debt ${debts.length + 1}`,
      balance,
      rate,
      minPayment,
    });
  }

  if (debts.length === 0) return null;
  return debts;
}

// ── Snowball / Avalanche Simulation ───────────────────────────────────

/**
 * Simulate payoff month-by-month for a given strategy.
 * @param {Array<{name:string,balance:number,rate:number,minPayment:number}>} debts
 * @param {'snowball'|'avalanche'} strategy — 'snowball' = smallest balance first; 'avalanche' = highest rate first
 * @returns {{ months: number, totalInterest: number, totalPaid: number, schedule: Array<{month:number,balanceByDebt:Array,name:string,intervalInterest:number,intervalPayment:number,endBalance:number}>, payoffOrder: string[] }}
 */
function simulatePayoff(debts, strategy) {
  // Deep clone debts so we don't mutate the originals
  const active = debts.map((d, i) => ({
    idx: i,
    name: d.name,
    balance: d.balance,
    rate: d.rate,
    minPayment: d.minPayment,
    paidOff: false,
  }));

  let month = 0;
  let totalInterest = 0;
  const schedule = [];
  const payoffOrder = [];

  while (true) {
    // Check if all debts are paid off
    const remaining = active.filter((d) => !d.paidOff);
    if (remaining.length === 0) break;
    if (month > MAX_MONTHS) {
      // Safety cap — would never pay off in 60 years
      return { months: -1, totalInterest: Infinity, totalPaid: Infinity, schedule: [], payoffOrder: [] };
    }

    month++;

    // Calculate interest for each debt this month
    for (const d of active) {
      if (d.paidOff) continue;
      const monthlyRate = (d.rate / 100) / 12;
      d.balance += d.balance * monthlyRate;
      totalInterest += d.balance * monthlyRate;
    }

    // Determine extra payment allocation based on strategy
    // First, apply minimum payments to all non-paid-off debts
    let extraPayment = 0;
    const paymentsThisMonth = [];

    for (const d of active) {
      if (d.paidOff) continue;
      const actualPay = Math.min(d.minPayment, d.balance);
      d.balance -= actualPay;
      if (d.balance <= 0.005) {
        d.balance = 0;
        d.paidOff = true;
        payoffOrder.push(d.name);
      }
    }

    // Sum remaining minimum payments to find extra budget
    let totalMinPaid = 0;
    for (const d of active) {
      if (!d.paidOff) totalMinPaid += d.minPayment;
    }

    // The "extra" is the sum of min payments from paid-off debts,
    // rolled into the snowball/avalanche bucket
    const freeCash = extraPayment; // in this basic model, we just redistribute minimums

    // Sort unpaid debts by strategy
    const unpaid = active.filter((d) => !d.paidOff);
    let targetIdx = -1;

    if (strategy === 'snowball') {
      // Smallest balance first
      unpaid.sort((a, b) => a.balance - b.balance);
      targetIdx = unpaid[0]?.idx ?? -1;
    } else {
      // Highest rate first
      unpaid.sort((a, b) => b.rate - a.rate);
      targetIdx = unpaid[0]?.idx ?? -1;
    }

    if (targetIdx >= 0) {
      const target = active.find((d) => d.idx === targetIdx);
      if (target && !target.paidOff) {
        // Roll extra from paid-off debts into the target
        let rolledExtra = 0;
        for (const d of active) {
          if (d.paidOff && d.idx !== targetIdx) {
            rolledExtra += d.minPayment;
            d.minPayment = 0; // consumed
          }
        }
        const extraForTarget = Math.min(rolledExtra, Math.max(0, target.balance - target.minPayment));
        target.balance -= extraForTarget;
        if (target.balance <= 0.005) {
          target.balance = 0;
          target.paidOff = true;
          payoffOrder.push(target.name);
        }
      }
    }

    // Record schedule entry for non-paid-off debts
    const balanceByDebt = active.map((d) => ({
      name: d.name,
      endBalance: Math.max(0, Math.round(d.balance * 100)) / 100,
    }));
    schedule.push({ month, balanceByDebt });
  }

  // Calculate total paid
  let totalPaid = 0;
  for (const d of active) {
    totalPaid += d.minPayment; // approximate
  }

  return { months: month, totalInterest, totalPaid: Infinity, schedule, payoffOrder };
}

// ── Better simulation with roll-over logic ─────────────────────────────

/**
 * Simulate payoff with proper debt rollover (snowball/avalanche).
 * When a debt is paid off, its minimum payment rolls into the target debt.
 */
function simulatePayoffV2(debts, strategy) {
  const active = debts.map((d, i) => ({
    idx: i,
    name: d.name,
    balance: d.balance,
    rate: d.rate,
    minPayment: d.minPayment,
    paidOff: false,
  }));

  let month = 0;
  let totalInterest = 0;
  const schedule = [];
  const payoffOrder = [];

  while (true) {
    const remaining = active.filter((d) => !d.paidOff);
    if (remaining.length === 0) break;
    if (month > MAX_MONTHS) return { months: -1, totalInterest: Infinity, totalPaid: Infinity, schedule: [], payoffOrder: [] };

    month++;

    // Step 1: Apply monthly interest to all active debts
    for (const d of active) {
      if (d.paidOff) continue;
      const monthlyRate = (d.rate / 100) / 12;
      const interest = d.balance * monthlyRate;
      totalInterest += interest;
      d.balance += interest;
    }

    // Step 2: Determine target debt based on strategy
    const unpaid = active.filter((d) => !d.paidOff);
    let targetIdx = -1;

    if (unpaid.length > 0) {
      if (strategy === 'snowball') {
        unpaid.sort((a, b) => a.balance - b.balance || a.idx - b.idx);
      } else {
        unpaid.sort((a, b) => b.rate - a.rate || a.idx - b.idx);
      }
      targetIdx = unpaid[0].idx;
    }

    // Step 3: Collect all available payment money (min payments from ALL debts)
    let totalAvailable = 0;
    for (const d of active) {
      if (!d.paidOff) totalAvailable += d.minPayment;
    }

    // Step 4: Allocate payments — target gets everything, others get minimums
    const allocations = {};
    for (const d of active) {
      if (d.paidOff) continue;
      if (d.idx === targetIdx) {
        allocations[d.idx] = Math.min(totalAvailable, d.balance);
      } else {
        allocations[d.idx] = Math.min(d.minPayment, d.balance);
      }
    }

    // Step 5: Apply payments and check for payoffs
    for (const d of active) {
      if (d.paidOff) continue;
      const pay = allocations[d.idx] || 0;
      d.balance -= pay;
      if (d.balance <= 0.005) {
        d.balance = 0;
        d.paidOff = true;
        payoffOrder.push(d.name);
      }
    }

    // Record schedule
    const balanceByDebt = active.map((d) => ({
      name: d.name,
      endBalance: Math.max(0, Math.round(d.balance * 100)) / 100,
    }));
    schedule.push({ month, balanceByDebt });
  }

  // Compute totals from schedule
  let totalPaid = 0;
  for (let i = 0; i < schedule.length; i++) {
    const prevBalances = i === 0
      ? debts.map((d) => d.balance)
      : schedule[i - 1].balanceByDebt.map((b) => b.endBalance);

    const interestThisMonth = totalInterest > 0 ? (i < schedule.length ? computeMonthlyInterest(schedule, i) : 0) : 0;
    for (let j = 0; j < debts.length; j++) {
      if (!debts[j].paidOff) {
        totalPaid += prevBalances[j] - schedule[i].balanceByDebt[j].endBalance + interestThisMonth * (schedule[i].balanceByDebt[j].endBalance > 0 ? 1 : 0);
      }
    }
  }

  return { months: month, totalInterest: Math.round(totalInterest * 100) / 100, totalPaid: Infinity, schedule, payoffOrder };
}

function computeMonthlyInterest(schedule, monthIdx) {
  if (monthIdx === 0) return 0;
  // Approximate from balance changes — simplified for display
  return 0;
}

// ── Clean simulation function ─────────────────────────────────────────

/**
 * Full debt payoff simulation with proper rollover.
 */
function calculatePayoff(debts, strategy) {
  const active = debts.map((d, i) => ({
    idx: i,
    name: d.name || `Debt ${i + 1}`,
    balance: d.balance,
    rate: d.rate,
    minPayment: d.minPayment,
    paidOff: false,
  }));

  let month = 0;
  let totalInterest = 0;
  const schedule = [];
  const payoffOrder = [];

  while (true) {
    const remaining = active.filter((d) => !d.paidOff);
    if (remaining.length === 0) break;
    if (month > MAX_MONTHS) return null; // would never pay off

    month++;

    // Add monthly interest
    for (const d of active) {
      if (d.paidOff) continue;
      const monthlyRate = (d.rate / 100) / 12;
      const interest = d.balance * monthlyRate;
      totalInterest += interest;
      d.balance += interest;
    }

    // Find target debt based on strategy
    const unpaid = active.filter((d) => !d.paidOff);
    let targetIdx = -1;

    if (unpaid.length > 0) {
      if (strategy === 'snowball') {
        unpaid.sort((a, b) => a.balance - b.balance || a.idx - b.idx);
      } else {
        unpaid.sort((a, b) => b.rate - a.rate || a.idx - b.idx);
      }
      targetIdx = unpaid[0].idx;
    }

    // Collect all available cash (sum of min payments from active debts)
    let totalAvailable = 0;
    for (const d of active) {
      if (!d.paidOff) totalAvailable += d.minPayment;
    }

    // Allocate: target gets everything, others get their minimums
    const allocations = {};
    for (const d of active) {
      if (d.paidOff) continue;
      if (d.idx === targetIdx) {
        allocations[d.idx] = Math.min(totalAvailable, d.balance);
      } else {
        allocations[d.idx] = Math.min(d.minPayment, d.balance);
      }
    }

    // Apply payments
    for (const d of active) {
      if (d.paidOff) continue;
      const pay = allocations[d.idx] || 0;
      d.balance -= pay;
      if (d.balance <= 0.005) {
        d.balance = 0;
        d.paidOff = true;
        payoffOrder.push(d.name);
      }
    }

    // Record month in schedule
    const balanceByDebt = active.map((d) => ({
      name: d.name,
      endBalance: Math.max(0, Math.round(d.balance * 100)) / 100,
    }));
    schedule.push({ month, balanceByDebt });
  }

  // Calculate total amount paid (principal + interest)
  let totalPrincipal = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalPaid = Math.round((totalPrincipal + totalInterest) * 100) / 100;

  return { months: month, totalInterest: Math.round(totalInterest * 100) / 100, totalPaid, schedule, payoffOrder };
}

// ── Formatting Helpers ────────────────────────────────────────────────

function formatCurrency(amount) {
  if (amount === Infinity || amount === -Infinity) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatMonths(months) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (years > 0 && remainingMonths > 0) return `${years}y ${remainingMonths}m`;
  if (years > 0) return `${years}y`;
  return `${months}m`;
}

// ── UI Rendering Functions ────────────────────────────────────────────

function renderDebtTable(debts) {
  const container = document.getElementById('debt-results-container');
  if (!container || !debts) return;

  // Snowball results table
  const snowballSection = document.getElementById('snowball-section');
  const avalancheSection = document.getElementById('avalanche-section');

  if (snowballSection) {
    snowballSection.classList.remove('hidden');
    renderStrategyResults(snowballSection, 'Snowball', debts);
  }
  if (avalancheSection) {
    avalancheSection.classList.remove('hidden');
    renderStrategyResults(avalancheSection, 'Avalanche', debts);
  }

  // Comparison summary
  const comparison = document.getElementById('comparison-summary');
  if (comparison) {
    comparison.classList.remove('hidden');
    compareStrategies(debts, comparison);
  }
}

function renderStrategyResults(section, strategyLabel, debts) {
  const calcSnowball = calculatePayoff(debts, 'snowball');
  const calcAvalanche = calculatePayoff(debts, 'avalanche');

  const calc = strategyLabel === 'Snowball' ? calcSnowball : calcAvalanche;
  if (!calc) {
    section.querySelector('.strategy-result').textContent = 'Could not compute payoff (debt may be unsolvable).';
    return;
  }

  const resultEl = section.querySelector('.strategy-result');
  if (resultEl) {
    resultEl.innerHTML = `
      <div class="payoff-summary-grid">
        <div class="summary-card">
          <div class="summary-label">Months to Pay Off</div>
          <div class="summary-value">${calc.months} months (${formatMonths(calc.months)})</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total Interest Paid</div>
          <div class="summary-value">${formatCurrency(calc.totalInterest)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total Amount Paid</div>
          <div class="summary-value">${formatCurrency(calc.totalPaid)}</div>
        </div>
      </div>
      ${calc.payoffOrder.length > 0 ? `<p class="payoff-order-text"><strong>Payoff order:</strong> ${calc.payoffOrder.join(' → ')}</p>` : ''}
    `;
  }

  // Render month-by-month schedule table
  const scheduleEl = section.querySelector('.schedule-table-container');
  if (scheduleEl && calc.schedule.length > 0) {
    let html = `<table class="schedule-table"><thead><tr><th>Month</th>`;
    for (const d of debts) {
      html += `<th>${d.name}</th>`;
    }
    html += `</tr></thead><tbody>`;

    // Show every month if <= 60, otherwise sample
    const step = calc.schedule.length > 60 ? Math.ceil(calc.schedule.length / 60) : 1;
    for (let i = 0; i < calc.schedule.length; i += step) {
      const entry = calc.schedule[i];
      html += `<tr><td>${entry.month}</td>`;
      for (const b of entry.balanceByDebt) {
        html += `<td>${formatCurrency(b.endBalance)}</td>`;
      }
      html += `</tr>`;
    }

    // Always show last month
    if (calc.schedule.length > 0 && calc.schedule.length % step !== 0) {
      const entry = calc.schedule[calc.schedule.length - 1];
      html += `<tr><td>${entry.month}</td>`;
      for (const b of entry.balanceByDebt) {
        html += `<td>${formatCurrency(b.endBalance)}</td>`;
      }
      html += `</tr>`;
    }

    html += `</tbody></table>`;
    scheduleEl.innerHTML = html;
  }
}

function compareStrategies(debts, comparisonEl) {
  const snowball = calculatePayoff(debts, 'snowball');
  const avalanche = calculatePayoff(debts, 'avalanche');

  if (!snowball || !avalanche) return;

  const interestDiff = Math.abs(snowball.totalInterest - avalanche.totalInterest);
  const monthsDiff = snowball.months - avalanche.months;

  let winner;
  if (interestDiff < 0.01 && snowball.months === avalanche.months) {
    winner = 'Neither — both strategies produce the same result.';
  } else if (snowball.totalInterest > avalanche.totalInterest) {
    winner = `Avalanche saves ${formatCurrency(interestDiff)} in interest.`;
  } else {
    winner = `Snowball pays off faster by ${Math.abs(monthsDiff)} month(s).`;
  }

  comparisonEl.innerHTML = `
    <div class="comparison-grid">
      <div class="compare-card snowball-highlight">
        <h4>Snowball Strategy</h4>
        <p>${formatCurrency(snowball.totalInterest)} total interest · ${snowball.months} months</p>
      </div>
      <div class="compare-card avalanche-highlight">
        <h4>Avalanche Strategy</h4>
        <p>${formatCurrency(avalanche.totalInterest)} total interest · ${avalanche.months} months</p>
      </div>
    </div>
    <p class="comparison-winner"><strong>Verdict:</strong> ${winner}</p>
  `;
}

// ── State Reset ───────────────────────────────────────────────────────

function resetDebtSnowballState() {
  const container = document.getElementById('debt-rows');
  if (container) {
    // Keep first row, clear others
    const rows = container.querySelectorAll('.debt-row');
    for (let i = 1; i < rows.length; i++) {
      rows[i].remove();
    }
    // Clear inputs in remaining row
    const firstRow = container.querySelector('.debt-row');
    if (firstRow) {
      firstRow.querySelectorAll('input').forEach((inp) => (inp.value = ''));
    }
  }

  // Hide result sections
  ['snowball-section', 'avalanche-section', 'comparison-summary'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const statusEl = document.getElementById('debt-status');
  if (statusEl) statusEl.textContent = '';
}

// ── Initialization ────────────────────────────────────────────────────

function initDebtSnowballCalculator() {
  // Add debt row handler
  const container = document.getElementById('debt-rows');
  if (!container) return;

  // Ensure at least one empty row exists
  if (container.querySelectorAll('.debt-row').length === 0) {
    addDebtRow(container);
  }

  // Add row button
  const addBtn = document.getElementById('add-debt-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const rows = container.querySelectorAll('.debt-row');
      if (rows.length >= MAX_DEBTS) return;
      addDebtRow(container);
    });
  }

  // Calculate button
  const calcBtn = document.getElementById('calculate-debts-btn');
  if (calcBtn) {
    calcBtn.addEventListener('click', handleCalculateDebts);
  }
}

function addDebtRow(container) {
  const row = document.createElement('div');
  row.className = 'debt-row';
  const rowCount = container.querySelectorAll('.debt-row').length + 1;
  row.innerHTML = `
    <input type="text" class="debt-name-input" placeholder="Debt ${rowCount} name (e.g. Credit Card)" />
    <input type="number" step="0.01" min="0.01" placeholder="Balance ($)" />
    <input type="number" step="0.01" min="0" placeholder="Rate (%)" />
    <input type="number" step="0.01" min="0.01" placeholder="Min Payment ($)" />
  `;

  // Remove button for rows beyond the first
  if (rowCount > 1) {
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-secondary btn-sm debt-remove-btn';
    removeBtn.textContent = '✕';
    removeBtn.title = 'Remove this debt';
    removeBtn.addEventListener('click', () => row.remove());
    row.appendChild(removeBtn);
  }

  container.appendChild(row);
}

function handleCalculateDebts() {
  const debts = parseDebtsFromDOM();
  if (!debts || debts.length === 0) {
    showDebtStatus('Please enter at least one valid debt with balance, rate, and minimum payment.', 'error');
    return;
  }

  // Validate balances vs payments
  for (const d of debts) {
    const monthlyRate = (d.rate / 100) / 12;
    const minInterest = d.balance * monthlyRate;
    if (d.minPayment <= minInterest) {
      showDebtStatus(
        `Warning: "${d.name}" minimum payment (${formatCurrency(d.minPayment)}) does not cover the monthly interest (~${formatCurrency(minInterest)}). This debt may never be paid off.`,
        'warning'
      );
    }
  }

  const snowball = calculatePayoff(debts, 'snowball');
  const avalanche = calculatePayoff(debts, 'avalanche');

  if (!snowball || !avalanche) {
    showDebtStatus('Could not compute payoff. Check your inputs and try again.', 'error');
    return;
  }

  renderDebtTable(debts);
  showDebtStatus(`Calculated: Snowball pays off in ${formatMonths(snowball.months)}, Avalanche in ${formatMonths(avalanche.months)}.`, 'success');
}

function showDebtStatus(message, type) {
  const statusEl = document.getElementById('debt-status');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `status-banner ${type}`;
}
