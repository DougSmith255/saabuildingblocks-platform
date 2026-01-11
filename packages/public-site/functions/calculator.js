/**
 * Commission Calculator Embed - Cloudflare Function
 * Returns a self-contained HTML page with just the calculator component
 * For embedding in iframes on agent attraction pages
 */

export async function onRequest(context) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Commission Calculator</title>
  <style>
    :root {
      --font-taskor: system-ui, sans-serif;
      --font-amulya: system-ui, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background: transparent;
      color: #e5e4dd;
      font-family: system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
    .container {
      padding: 0;
    }
    .calculator {
      width: 100%;
      background: rgba(10,10,10,0.95);
      border: 1px solid rgba(255,215,0,0.3);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffd700;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 0.875rem;
      color: #9a9890;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .input-group {
      margin-bottom: 1.5rem;
    }
    .input-label {
      display: block;
      font-size: 0.875rem;
      color: #9a9890;
      margin-bottom: 0.5rem;
    }
    .input-row {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .slider {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      height: 8px;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      outline: none;
    }
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: #ffd700;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 0 10px rgba(255,215,0,0.5);
    }
    .slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: #ffd700;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      box-shadow: 0 0 10px rgba(255,215,0,0.5);
    }
    .value-display {
      min-width: 60px;
      text-align: right;
      font-size: 1.25rem;
      font-weight: 600;
      color: #ffd700;
    }
    .text-input {
      width: 120px;
      padding: 0.5rem 0.75rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 8px;
      color: #e5e4dd;
      font-size: 1rem;
      text-align: right;
    }
    .text-input:focus {
      outline: none;
      border-color: #ffd700;
    }
    .results {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .result-box {
      text-align: center;
      padding: 1rem;
      background: rgba(255,255,255,0.02);
      border-radius: 12px;
    }
    .result-label {
      font-size: 0.75rem;
      color: #6a6860;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }
    .result-value {
      font-size: 1.5rem;
      font-weight: 700;
    }
    .result-value.gross { color: #e5e4dd; }
    .result-value.net { color: #00ff88; }
    .result-value.fees { color: #ffd700; }
    .donut-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1.5rem;
    }
    .donut {
      position: relative;
      width: 200px;
      height: 200px;
    }
    .donut svg {
      transform: rotate(-90deg);
    }
    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
    .keep-rate {
      font-size: 2rem;
      font-weight: 700;
      color: #00ff88;
    }
    .keep-label {
      font-size: 0.75rem;
      color: #9a9890;
    }
    .legend {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: #9a9890;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="calculator">
      <h2 class="title">eXp Commission Calculator</h2>
      <p class="subtitle">See how much you keep at eXp Realty</p>

      <div class="input-group">
        <label class="input-label">Annual Transactions</label>
        <div class="input-row">
          <input type="range" class="slider" id="transactions" min="1" max="100" value="12">
          <span class="value-display" id="txDisplay">12</span>
        </div>
      </div>

      <div class="input-group">
        <label class="input-label">Average Commission per Deal</label>
        <div class="input-row">
          <span style="color: #9a9890;">$</span>
          <input type="text" class="text-input" id="commission" value="10,000">
        </div>
      </div>

      <div class="results">
        <div class="result-box">
          <div class="result-label">Gross</div>
          <div class="result-value gross" id="grossDisplay">$120,000</div>
        </div>
        <div class="result-box">
          <div class="result-label">You Keep</div>
          <div class="result-value net" id="netDisplay">$102,350</div>
        </div>
        <div class="result-box">
          <div class="result-label">Fees</div>
          <div class="result-value fees" id="feesDisplay">$17,650</div>
        </div>
      </div>

      <div class="donut-container">
        <div class="donut">
          <svg width="200" height="200" viewBox="0 0 200 200" id="donutChart">
            <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="30"/>
          </svg>
          <div class="donut-center">
            <div class="keep-rate" id="keepRate">85.3%</div>
            <div class="keep-label">You Keep</div>
          </div>
        </div>
      </div>

      <div class="legend" id="legend"></div>
    </div>
  </div>

  <script>
    const txSlider = document.getElementById('transactions');
    const txDisplay = document.getElementById('txDisplay');
    const commissionInput = document.getElementById('commission');
    const grossDisplay = document.getElementById('grossDisplay');
    const netDisplay = document.getElementById('netDisplay');
    const feesDisplay = document.getElementById('feesDisplay');
    const keepRate = document.getElementById('keepRate');
    const donutChart = document.getElementById('donutChart');
    const legend = document.getElementById('legend');

    function parseNumber(str) {
      return parseFloat(str.replace(/[,$]/g, '')) || 0;
    }

    function formatCurrency(num) {
      return '$' + num.toLocaleString(undefined, { maximumFractionDigits: 0 });
    }

    function calculate() {
      const transactions = parseInt(txSlider.value);
      const avgCommission = parseNumber(commissionInput.value);
      const gross = transactions * avgCommission;

      // eXp fee structure
      const expSplit = Math.min(gross * 0.20, 16000); // 20% to eXp, capped at $16k
      const brokerReview = transactions * 25; // $25/deal
      const eoInsurance = Math.min(transactions * 60, 750); // $60/deal, capped at $750

      // Post-cap fees (after $16k cap)
      const capProgress = Math.min(gross * 0.20, 16000);
      const isCapped = capProgress >= 16000;
      const postCapDeals = isCapped ? Math.max(0, transactions - Math.ceil(16000 / (avgCommission * 0.20))) : 0;
      const postCapTier1 = postCapDeals * 250; // $250/deal after cap
      const postCapTier2 = Math.max(0, postCapDeals - 20) * 75; // $75/deal after 20 post-cap deals

      const totalFees = expSplit + brokerReview + eoInsurance + postCapTier1 + postCapTier2;
      const net = gross - totalFees;
      const keepPercent = gross > 0 ? (net / gross) * 100 : 0;

      // Update displays
      txDisplay.textContent = transactions;
      grossDisplay.textContent = formatCurrency(gross);
      netDisplay.textContent = formatCurrency(net);
      feesDisplay.textContent = formatCurrency(totalFees);
      keepRate.textContent = keepPercent.toFixed(1) + '%';

      // Update donut chart
      const fees = [
        { label: 'You Keep', value: net, color: '#00ff88' },
        { label: 'eXp Split', value: expSplit, color: '#ffd700' },
        { label: 'Broker Review', value: brokerReview, color: '#ff9500' },
        { label: 'E&O Insurance', value: eoInsurance, color: '#ff6b6b' },
      ];
      if (postCapTier1 > 0) fees.push({ label: 'Post-Cap Tier 1', value: postCapTier1, color: '#c084fc' });
      if (postCapTier2 > 0) fees.push({ label: 'Post-Cap Tier 2', value: postCapTier2, color: '#60a5fa' });

      // Draw donut
      const radius = 80;
      const circumference = 2 * Math.PI * radius;
      let currentOffset = 0;

      donutChart.innerHTML = '<circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="30"/>';

      fees.forEach(fee => {
        if (fee.value > 0 && gross > 0) {
          const percent = fee.value / gross;
          const dashLength = circumference * percent;
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('cx', '100');
          circle.setAttribute('cy', '100');
          circle.setAttribute('r', '80');
          circle.setAttribute('fill', 'none');
          circle.setAttribute('stroke', fee.color);
          circle.setAttribute('stroke-width', '30');
          circle.setAttribute('stroke-dasharray', dashLength + ' ' + (circumference - dashLength));
          circle.setAttribute('stroke-dashoffset', -currentOffset);
          donutChart.appendChild(circle);
          currentOffset += dashLength;
        }
      });

      // Update legend
      legend.innerHTML = fees.filter(f => f.value > 0).map(fee =>
        '<div class="legend-item"><div class="legend-dot" style="background:' + fee.color + '"></div>' + fee.label + ': ' + formatCurrency(fee.value) + '</div>'
      ).join('');
    }

    txSlider.addEventListener('input', calculate);
    commissionInput.addEventListener('input', function() {
      // Format as currency while typing
      const val = parseNumber(this.value);
      if (!isNaN(val) && val > 0) {
        calculate();
      }
    });
    commissionInput.addEventListener('blur', function() {
      const val = parseNumber(this.value);
      this.value = val.toLocaleString();
      calculate();
    });

    // Initial calculation
    calculate();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
