const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Trade Validation and Data Isolation Logic', () => {
  // Test simulated controller validation
  function validateTradeInput({ symbol, buyPrice, sellPrice, quantity, type }) {
    if (!symbol || buyPrice === undefined || sellPrice === undefined || quantity === undefined) {
      return { valid: false, error: 'Symbol, entry price, exit price, and quantity are required!' };
    }
    const numBuy = Number(buyPrice);
    const numSell = Number(sellPrice);
    const numQty = Number(quantity);

    if (isNaN(numBuy) || numBuy < 0) return { valid: false, error: 'Entry price must be a valid non-negative number!' };
    if (isNaN(numSell) || numSell < 0) return { valid: false, error: 'Exit price must be a valid non-negative number!' };
    if (isNaN(numQty) || numQty <= 0) return { valid: false, error: 'Quantity must be a positive number!' };

    return { valid: true };
  }

  test('Validates required fields', () => {
    assert.equal(validateTradeInput({}).valid, false);
    assert.equal(validateTradeInput({ symbol: 'RELIANCE' }).valid, false);
    assert.equal(validateTradeInput({ symbol: 'RELIANCE', buyPrice: 100, sellPrice: 110, quantity: 5 }).valid, true);
  });

  test('Rejects negative or invalid numbers', () => {
    assert.equal(validateTradeInput({ symbol: 'TCS', buyPrice: -10, sellPrice: 100, quantity: 1 }).valid, false);
    assert.equal(validateTradeInput({ symbol: 'TCS', buyPrice: 100, sellPrice: -5, quantity: 1 }).valid, false);
    assert.equal(validateTradeInput({ symbol: 'TCS', buyPrice: 100, sellPrice: 110, quantity: 0 }).valid, false);
    assert.equal(validateTradeInput({ symbol: 'TCS', buyPrice: 100, sellPrice: 110, quantity: -2 }).valid, false);
    assert.equal(validateTradeInput({ symbol: 'TCS', buyPrice: 'abc', sellPrice: 110, quantity: 1 }).valid, false);
  });

  test('Prevents IDOR: simulates user data isolation query filter', () => {
    const userA = 'user_aaa';
    const userB = 'user_bbb';

    const tradesDb = [
      { _id: 'trade_1', userId: userA, symbol: 'INFY', pnl: 500 },
      { _id: 'trade_2', userId: userB, symbol: 'RELIANCE', pnl: 1200 },
    ];

    // Safe deletion: requires both trade ID and matching user ID
    function deleteTrade(tradeId, requestingUserId) {
      const idx = tradesDb.findIndex(t => t._id === tradeId && t.userId === requestingUserId);
      if (idx === -1) return { success: false, status: 404, message: 'Trade not found or access denied!' };
      tradesDb.splice(idx, 1);
      return { success: true };
    }

    // User B attempts to delete User A's trade
    const maliciousAttempt = deleteTrade('trade_1', userB);
    assert.equal(maliciousAttempt.success, false);
    assert.equal(maliciousAttempt.status, 404);

    // Trade 1 still exists
    assert.ok(tradesDb.some(t => t._id === 'trade_1'));

    // Legitimate owner User A deletes their trade
    const ownerAttempt = deleteTrade('trade_1', userA);
    assert.equal(ownerAttempt.success, true);
    assert.ok(!tradesDb.some(t => t._id === 'trade_1'));
  });
});

