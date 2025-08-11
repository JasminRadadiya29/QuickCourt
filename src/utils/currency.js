// Currency utility functions for INR formatting (no currency conversion)
export const formatINR = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  return formatter?.format(amount);
};

export const formatINRWithDecimals = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0.00';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return formatter?.format(amount);
};

export const formatINRForChart = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  if (amount >= 10000000) { // 1 Crore
    return `₹${Math.round(amount / 10000000)}Cr`;
  } else if (amount >= 100000) { // 1 Lakh
    return `₹${Math.round(amount / 100000)}L`;
  } else if (amount >= 1000) { // 1 Thousand
    return `₹${Math.round(amount / 1000)}k`;
  }
  return `₹${Math.round(amount)}`;
};