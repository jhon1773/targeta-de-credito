class CardBenefitsService {
  constructor() {
    this.benefits = {
      Classic: {
        restrictions: [],
        benefits: [],
      },
      Gold: {
        restrictions: ["Minimum income of $500 USD monthly"],
        benefits: [
          {
            day: "Monday, Tuesday, Wednesday",
            discount: "15%",
            minPurchase: 100,
          },
        ],
      },
      Platinum: {
        restrictions: [
          "Minimum income of $1000 USD monthly",
          "VISE CLUB subscription required",
        ],
        benefits: [
          {
            day: "Monday, Tuesday, Wednesday",
            discount: "20%",
            minPurchase: 100,
          },
          {
            day: "Saturday",
            discount: "30%",
            minPurchase: 200,
          },
          {
            type: "International",
            discount: "5%",
          },
        ],
      },
      Black: {
        restrictions: [
          "Minimum income of $2000 USD monthly",
          "VISE CLUB subscription required",
          "Not available for residents of: China, Vietnam, India, Iran",
        ],
        benefits: [
          {
            day: "Monday, Tuesday, Wednesday",
            discount: "25%",
            minPurchase: 100,
          },
          {
            day: "Saturday",
            discount: "35%",
            minPurchase: 200,
          },
          {
            type: "International",
            discount: "5%",
          },
        ],
      },
      White: {
        restrictions: ["Same as Black"],
        benefits: [
          {
            day: "Monday to Friday",
            discount: "25%",
            minPurchase: 100,
          },
          {
            day: "Saturday, Sunday",
            discount: "35%",
            minPurchase: 200,
          },
          {
            type: "International",
            discount: "5%",
          },
        ],
      },
    };
  }

  calculateDiscount(
    cardType,
    purchaseAmount,
    purchaseDay,
    isInternational = false
  ) {
    const cardBenefits = this.benefits[cardType];
    let discount = 0;

    if (cardBenefits) {
      cardBenefits.benefits.forEach((benefit) => {
        if (
          benefit.day && 
          purchaseDay && 
          benefit.day.includes(purchaseDay) &&
          purchaseAmount > benefit.minPurchase
        ) {
          discount += this.extractDiscountValue(
            benefit.discount,
            purchaseAmount
          );
        }
      });

      if (isInternational) {
        const internationalBenefit = cardBenefits.benefits.find(
          (b) => b.type === "International"
        );
        if (internationalBenefit) {
          discount += this.extractDiscountValue(
            internationalBenefit.discount,
            purchaseAmount
          );
        }
      }
    }

    return discount;
  }

  extractDiscountValue(discount, amount) {
    const percentageMatch = discount.match(/(\d+)%/);
    if (percentageMatch) {
      const percentage = parseFloat(percentageMatch[1]) / 100;
      return amount * percentage;
    }
    return 0;
  }

  getRestrictions(cardType) {
    return this.benefits[cardType]?.restrictions || [];
  }
}

module.exports = new CardBenefitsService();
