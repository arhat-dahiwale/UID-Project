// backend/paymentsStore.js
// Simple in-memory payment store (shared across modules)
const paymentsStore = {}; // { paymentId: { consumerId, planType, status } }

module.exports = { paymentsStore };
