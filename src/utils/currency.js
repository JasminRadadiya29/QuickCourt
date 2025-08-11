// Currency utility functions for INR formatting
export const formatINR = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  
  // Convert USD to INR (approximate rate: 1 USD = 83 INR)
  const inrAmount = Math.round(amount * 83);
  
  // Format in Indian number system with commas
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter?.format(inrAmount);
};

// Format INR without conversion (when amount is already in INR)
export const formatINRDirect = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter?.format(amount);
};

// Format INR with decimal places
export const formatINRWithDecimals = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0.00';
  
  // Convert USD to INR (approximate rate: 1 USD = 83 INR)
  const inrAmount = amount * 83;
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter?.format(inrAmount);
};

// Format for charts (abbreviated format)
export const formatINRForChart = (amount) => {
  if (amount == null || isNaN(amount)) return '₹0';
  
  // Convert USD to INR
  const inrAmount = amount * 83;
  
  if (inrAmount >= 10000000) { // 1 Crore
    return `₹${Math.round(inrAmount / 10000000)}Cr`;
  } else if (inrAmount >= 100000) { // 1 Lakh
    return `₹${Math.round(inrAmount / 100000)}L`;
  } else if (inrAmount >= 1000) { // 1 Thousand
    return `₹${Math.round(inrAmount / 1000)}k`;
  }
  
  return `₹${Math.round(inrAmount)}`;
};