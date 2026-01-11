/**
 * Revenue Share Visualizer Embed - Cloudflare Function
 * Returns a self-contained HTML page with the revshare visualization
 * For embedding in iframes on agent attraction pages
 */

export async function onRequest(context) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Revenue Share Visualizer</title>
  <style>
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
    .visualizer {
      width: 100%;
      background: rgba(10,10,10,0.95);
      border: 1px solid rgba(255,215,0,0.2);
      border-radius: 16px;
      padding: 1.5rem;
    }
    .title {
      font-size: clamp(1.25rem, 4vw, 1.75rem);
      font-weight: 600;
      color: #bfbdb0;
      text-align: center;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 0.875rem;
      color: #9a9890;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .tab {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      background: rgba(255,255,255,0.05);
      color: #e5e4dd;
      transition: all 0.2s;
    }
    .tab.active {
      background: linear-gradient(to right, #ffd700, #ffed4a);
      color: #000;
      box-shadow: 0 0 12px rgba(255,215,0,0.4);
    }
    .tab:hover:not(.active) {
      background: rgba(255,255,255,0.1);
    }
    .scenario-desc {
      text-align: center;
      color: #9a9890;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    .toggle-row {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      font-size: 0.8125rem;
      color: #9a9890;
    }
    .toggle {
      width: 48px;
      height: 24px;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      background: rgba(255,255,255,0.2);
      position: relative;
      transition: background 0.2s;
    }
    .toggle.active {
      background: #ffd700;
    }
    .toggle-knob {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: left 0.2s;
    }
    .toggle.active .toggle-knob {
      left: 26px;
    }
    .chart {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: clamp(0.5rem, 2vw, 1.5rem);
      height: 200px;
      margin-bottom: 1.5rem;
    }
    .bar-group {
      text-align: center;
    }
    .bar-value {
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .bar {
      width: clamp(30px, 8vw, 50px);
      border-radius: 6px 6px 0 0;
      transition: height 0.3s ease;
    }
    .bar.locked {
      opacity: 0.3;
    }
    .bar-label {
      font-size: 0.6875rem;
      color: #9a9890;
      margin-top: 4px;
    }
    .total-box {
      text-align: center;
      padding: 1rem;
      background: rgba(255,215,0,0.1);
      border: 1px solid rgba(255,215,0,0.3);
      border-radius: 12px;
      margin-bottom: 1rem;
    }
    .total-label {
      font-size: 0.875rem;
      color: #9a9890;
      margin-bottom: 0.25rem;
    }
    .total-value {
      font-size: clamp(1.5rem, 5vw, 2.25rem);
      font-weight: 700;
      color: #ffd700;
      text-shadow: 0 0 20px rgba(255,215,0,0.4);
    }
    .total-note {
      font-size: 0.75rem;
      color: #6a6860;
      margin-top: 0.25rem;
    }
    .disclaimer {
      font-size: 0.6875rem;
      color: #6a6860;
      text-align: center;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="visualizer">
      <h2 class="title">eXp Revenue Share Potential</h2>
      <p class="subtitle">7-tier revenue share that compounds into passive income</p>

      <div class="tabs" id="tabs"></div>
      <p class="scenario-desc" id="scenarioDesc"></p>

      <div class="toggle-row">
        <span>100% Cap</span>
        <button class="toggle" id="toggle">
          <div class="toggle-knob"></div>
        </button>
        <span>30% Cap (Realistic)</span>
      </div>

      <div class="chart" id="chart"></div>

      <div class="total-box">
        <div class="total-label">Annual Revenue Share Potential</div>
        <div class="total-value" id="totalValue">$0</div>
        <div class="total-note">Includes ~30% adjustment bonus on T1-T3</div>
      </div>

      <p class="disclaimer">
        This calculator is for illustrative purposes only. Actual results vary based on agent production and capping rates.
      </p>
    </div>
  </div>

  <script>
    const TIER_CONFIG = {
      1: { rate: 0.035, cap: 1400, minFLQAs: 0 },
      2: { rate: 0.04, cap: 1600, minFLQAs: 0 },
      3: { rate: 0.025, cap: 1000, minFLQAs: 0 },
      4: { rate: 0.015, cap: 600, minFLQAs: 5 },
      5: { rate: 0.01, cap: 400, minFLQAs: 10 },
      6: { rate: 0.025, cap: 1000, minFLQAs: 15 },
      7: { rate: 0.05, cap: 2000, minFLQAs: 30 },
    };

    const TIER_COLORS = [
      '#ffd700', '#ff9500', '#ff6b6b', '#c084fc', '#60a5fa', '#34d399', '#f472b6'
    ];

    const scenarios = [
      { name: 'Starter', desc: '11 agents', tierCounts: [6, 3, 1, 1, 0, 0, 0], avgGCI: 80000 },
      { name: 'Growing', desc: '53 agents', tierCounts: [12, 18, 14, 6, 3, 0, 0], avgGCI: 90000 },
      { name: 'Established', desc: '300 agents', tierCounts: [28, 45, 72, 85, 48, 22, 0], avgGCI: 100000 },
      { name: 'Momentum', desc: '2,235 agents', tierCounts: [75, 140, 260, 380, 480, 520, 380], avgGCI: 100000 },
      { name: 'Empire', desc: '16,150 agents', tierCounts: [150, 320, 680, 1400, 2600, 4200, 6800], avgGCI: 100000 },
    ];

    let selectedScenario = 0;
    let isRealistic = false;

    function calcTierEarnings(tier, count, avgGCI, fla) {
      const cfg = TIER_CONFIG[tier];
      const locked = fla < cfg.minFLQAs;
      if (locked || count === 0) return { earnings: 0, locked: true };
      const perAgent = Math.min(avgGCI * cfg.rate, cfg.cap);
      return { earnings: perAgent * count, locked: false };
    }

    function calcTotal(tierCounts, avgGCI, multiplier) {
      const fla = tierCounts[0] || 0;
      const tiers = tierCounts.map((count, i) => {
        const result = calcTierEarnings(i + 1, count, avgGCI, fla);
        return { ...result, agents: count, earnings: result.earnings * multiplier };
      });
      const subtotal = tiers.reduce((sum, t) => sum + t.earnings, 0);
      const t123 = tiers.slice(0, 3).reduce((sum, t) => sum + t.earnings, 0);
      const bonus = t123 * 0.30;
      return { tiers, total: subtotal + bonus };
    }

    function formatCurrency(num) {
      if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
      if (num >= 1000) return '$' + (num / 1000).toFixed(0) + 'k';
      return '$' + num.toFixed(0);
    }

    function render() {
      const scenario = scenarios[selectedScenario];
      const multiplier = isRealistic ? 0.30 : 1.0;
      const { tiers, total } = calcTotal(scenario.tierCounts, scenario.avgGCI, multiplier);
      const maxEarnings = Math.max(...tiers.map(t => t.earnings), 1);

      // Tabs
      document.getElementById('tabs').innerHTML = scenarios.map((s, i) =>
        '<button class="tab' + (i === selectedScenario ? ' active' : '') + '" data-idx="' + i + '">' + s.name + '</button>'
      ).join('');

      // Description
      document.getElementById('scenarioDesc').textContent = scenario.desc;

      // Toggle
      const toggle = document.getElementById('toggle');
      toggle.className = 'toggle' + (isRealistic ? ' active' : '');

      // Chart
      document.getElementById('chart').innerHTML = tiers.map((tier, i) => {
        const height = Math.max((tier.earnings / maxEarnings) * 160, 20);
        const color = TIER_COLORS[i];
        return '<div class="bar-group">' +
          '<div class="bar-value" style="color:' + color + '">' + formatCurrency(tier.earnings) + '</div>' +
          '<div class="bar' + (tier.locked ? ' locked' : '') + '" style="height:' + height + 'px;background:linear-gradient(to top,' + color + ',' + color + '88);box-shadow:' + (tier.locked ? 'none' : '0 0 10px ' + color + '66') + '"></div>' +
          '<div class="bar-label">T' + (i + 1) + '</div>' +
        '</div>';
      }).join('');

      // Total
      document.getElementById('totalValue').textContent = formatCurrency(total);
    }

    // Event listeners
    document.getElementById('tabs').addEventListener('click', e => {
      if (e.target.classList.contains('tab')) {
        selectedScenario = parseInt(e.target.dataset.idx);
        render();
      }
    });

    document.getElementById('toggle').addEventListener('click', () => {
      isRealistic = !isRealistic;
      render();
    });

    // Initial render
    render();
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
