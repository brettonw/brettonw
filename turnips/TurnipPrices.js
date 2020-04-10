let randomInt = function (min, max) {
    // inclusive
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
};

let randomFloat = function (min, max) {
    // exclusive
    return min + (Math.random() * (max - min));
};

let nextPattern = function (pattern) {
    // select the next pattern
    let chance = randomInt (0, 99);
    switch (pattern) {
        case 0: return (chance < 20) ? 0 : (chance < 50) ? 1 : (chance < 65) ? 2 : 3;
        case 1: return (chance < 50) ? 0 : (chance < 55) ? 1 : (chance < 75) ? 2 : 3;
        case 2: return (chance < 25) ? 0 : (chance < 70) ? 1 : (chance < 75) ? 2 : 3;
        case 3: return (chance < 45) ? 0 : (chance < 70) ? 1 : (chance < 85) ? 2 : 3;
    }
    return 2;
};

let turnipPrices = function (pattern) {
    /*
    if (checkGlobalFlag("FirstKabuBuy")) {
      if (!checkGlobalFlag("FirstKabuPattern")) {
        setGlobalFlag("FirstKabuPattern", true);
        pattern = 3;
      }
    }
    */

    let basePrice = randomInt(90, 110);
    let prices = [basePrice, basePrice, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let work = 2;
    switch (pattern)
    {
        case 0: {
            // PATTERN 0: high, decreasing, high, decreasing, high
            let decPhaseLen1 = (randomInt (0, 1) == 1) ? 3 : 2;
            let decPhaseLen2 = 5 - decPhaseLen1;

            hiPhaseLen1 = randomInt(0, 6);
            hiPhaseLen2and3 = 7 - hiPhaseLen1;
            hiPhaseLen3 = randomInt(0, hiPhaseLen2and3 - 1);

            // high phase 1
            for (let i = 0; i < hiPhaseLen1; i++) {
                prices[work++] = Math.ceil(randomFloat(0.9, 1.4) * basePrice);
            }

            // decreasing phase 1
            let rate = randomFloat(0.8, 0.6);
            for (let i = 0; i < decPhaseLen1; i++) {
                prices[work++] = Math.ceil(rate * basePrice);
                rate -= 0.04;
                rate -= randomFloat(0, 0.06);
            }

            // high phase 2
            for (let i = 0; i < (hiPhaseLen2and3 - hiPhaseLen3); i++) {
                prices[work++] = Math.ceil(randomFloat(0.9, 1.4) * basePrice);
            }

            // decreasing phase 2
            rate = randomFloat(0.8, 0.6);
            for (let i = 0; i < decPhaseLen2; i++) {
                prices[work++] = Math.ceil(rate * basePrice);
                rate -= 0.04;
                rate -= randomFloat(0, 0.06);
            }

            // high phase 3
            for (let i = 0; i < hiPhaseLen3; i++) {
                prices[work++] = Math.ceil(randomFloat(0.9, 1.4) * basePrice);
            }
        }
        break;

        case 1: {
            // PATTERN 1: decreasing middle, high spike, random low
            let peakStart = randomInt(3, 9);
            let rate = randomFloat(0.9, 0.85);
            for (; work < peakStart; work++) {
                prices[work] = Math.ceil(rate * basePrice);
                rate -= 0.03;
                rate -= randomFloat(0, 0.02);
            }
            prices[work++] = Math.ceil(randomFloat(0.9, 1.4) * basePrice);
            prices[work++] = Math.ceil(randomFloat(1.4, 2.0) * basePrice);
            prices[work++] = Math.ceil(randomFloat(2.0, 6.0) * basePrice);
            prices[work++] = Math.ceil(randomFloat(1.4, 2.0) * basePrice);
            prices[work++] = Math.ceil(randomFloat(0.9, 1.4) * basePrice);
            for (; work < 14; work++) {
                prices[work] = Math.ceil(randomFloat(0.4, 0.9) * basePrice);
            }
        }
        break;

        case 2: {
            // PATTERN 2: consistently decreasing
            let rate = 0.9 - randomFloat(0, 0.05);
            for (; work < 14; work++) {
                prices[work] = Math.ceil(rate * basePrice);
                rate -= 0.03;
                rate -= randomFloat(0, 0.02);
            }
        }
        break;

        case 3: {
            // PATTERN 3: decreasing, spike, decreasing
            let peakStart = randomInt(2, 9);

            // decreasing phase before the peak
            let rate = randomFloat(0.9, 0.4);
            for (; work < peakStart; work++) {
                prices[work] = Math.ceil(rate * basePrice);
                rate -= 0.03;
                rate -= randomFloat(0, 0.02);
            }

            prices[work++] = Math.ceil(randomFloat(0.9, 1.4) * basePrice);
            prices[work++] = Math.ceil(randomFloat(0.9, 1.4) * basePrice);
            rate = randomFloat(1.4, 2.0);
            prices[work++] = Math.ceil(randomFloat(1.4, rate) * basePrice) - 1;
            prices[work++] = Math.ceil(rate * basePrice);
            prices[work++] = Math.ceil(randomFloat(1.4, rate) * basePrice) - 1;

            // decreasing phase after the peak
            if (work < 14) {
                rate = randomFloat(0.9, 0.4);
                for (; work < 14; work++) {
                    prices[work] = Math.ceil(rate * basePrice);
                    rate -= 0.03;
                    rate -= randomFloat(0, 0.02);
                }
            }
        }
        break;
    }

    return prices;
};

