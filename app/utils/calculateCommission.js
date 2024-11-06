export default function calculateCommission(affiliateLevel, amount) {
    let commissionData = {
      percentage: 0,
      amount: 0,
    };
    switch (String(affiliateLevel)) {
      case '1':
        commissionData.percentage = 30;
        commissionData.amount =
          (parseInt(amount) * commissionData.percentage) / 100;
        break;
      case '2':
        commissionData.percentage = 30;
        commissionData.amount =
          (parseInt(amount) * commissionData.percentage) / 100;
        break;
      default:
        break;
    }
    return commissionData;
  }
  