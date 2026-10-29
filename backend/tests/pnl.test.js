const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Replicate pure calculation functions matching trade controller logic
const calculatePnL = (type, buyPrice, sellPrice, quantity) => {
  const isShort = String(type).toUpperCase() === 'SHORT';
  const diff = isShort ? (buyPrice - sellPrice) : (sellPrice - buyPrice);
  return Number((diff * quantity).toFixed(2));
};

const calculateRiskReward = (type, buyPrice, stopLoss, target) => {
  if (stopLoss == null || target == null || isNaN(stopLoss) || isNaN(target)) {
    return null;
  }

  const isShort = String(type).toUpperCase() === 'SHORT';
  let risk = 0;
  let reward = 0;

  if (isShort) {
    risk = stopLoss - buyPrice;
    reward = buyPrice - target;
  } else {
    risk = buyPrice - stopLoss;
    reward = target - buyPrice;
  }

  if (risk > 0 && reward > 0) {
    return Number((reward / risk).toFixed(2));
  }
  return null;
};

describe('P&L Calculation Suite', () => {
  test('Calculates profit for winning LONG trade', () => {
    // Buy at 100, sell at 120, qty 10 -> Profit: 200
    const pnl = calculatePnL('LONG', 100, 120, 10);
    assert.equal(pnl, 200);
  });

  test('Calculates loss for losing LONG trade', () => {
    // Buy at 100, sell at 90, qty 10 -> Loss: -100
    const pnl = calculatePnL('LONG', 100, 90, 10);
    assert.equal(pnl, -100);
  });

  test('Calculates profit for winning SHORT trade', () => {
    // Enter short at 2500, exit at 2400, qty 5 -> Profit: (2500 - 2400) * 5 = +500
    const pnl = calculatePnL('SHORT', 2500, 2400, 5);
    assert.equal(pnl, 500);
  });

  test('Calculates loss for losing SHORT trade', () => {
    // Enter short at 2500, exit at 2600, qty 5 -> Loss: (2500 - 2600) * 5 = -500
    const pnl = calculatePnL('SHORT', 2500, 2600, 5);
    assert.equal(pnl, -500);
  });

  test('Handles decimal share quantities and prices accurately', () => {
    const pnl = calculatePnL('LONG', 150.50, 155.75, 2.5);
    // (155.75 - 150.50) * 2.5 = 5.25 * 2.5 = 13.125 -> 13.13
    assert.equal(pnl, 13.13);
  });
});

describe('Risk-to-Reward Ratio Suite', () => {
  test('Calculates 1:2 R:R for LONG position', () => {
    // Entry: 100, Stop: 90 (Risk: 10), Target: 120 (Reward: 20) -> R:R = 2.0
    const rr = calculateRiskReward('LONG', 100, 90, 120);
    assert.equal(rr, 2.0);
  });

  test('Calculates 1:3 R:R for SHORT position', () => {
    // Entry: 300, Stop: 310 (Risk: 10), Target: 270 (Reward: 30) -> R:R = 3.0
    const rr = calculateRiskReward('SHORT', 300, 310, 270);
    assert.equal(rr, 3.0);
  });

  test('Returns null when stop loss or target is omitted', () => {
    assert.equal(calculateRiskReward('LONG', 100, null, 120), null);
    assert.equal(calculateRiskReward('LONG', 100, 90, null), null);
    assert.equal(calculateRiskReward('SHORT', 100, undefined, undefined), null);
  });

  test('Returns null for invalid risk (Stop on wrong side of entry)', () => {
    // Long trade where stopLoss is above entry price
    assert.equal(calculateRiskReward('LONG', 100, 110, 120), null);
    // Short trade where stopLoss is below entry price
    assert.equal(calculateRiskReward('SHORT', 100, 90, 80), null);
  });
});

