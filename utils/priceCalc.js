// utils/priceCalc.js
const COST_PER_PAGE = 2; // ₹1 per page
const COST_PER_PAPER = 3.5; // ₹1 per sheet (for duplex)

function calculatePrice(pageCount, settings) {
  const duplex = settings.duplex === 'true';

  if (duplex) {
    if (pageCount % 2 === 0) {
      const sheetsRequired = pageCount / 2;
      return sheetsRequired * COST_PER_PAPER;
    } else {
      const sheetsRequired = Math.floor(pageCount / 2);
      return (sheetsRequired * COST_PER_PAPER) + COST_PER_PAGE;
    }
  } else {
    return pageCount * COST_PER_PAGE;
  }
  console.log(`${pageCount * COST_PER_PAGE}`)
}

module.exports = { calculatePrice };
