export var ModelPortfolioData: ModelPortfolio[] = [
    {
        name: 'Long Term Wealth Creation',
        description: 'Wealth creation over a long period of time | Inflation beating return',
        goals: 'Retirement Planning, Kids Education, Kids Marriage, Wealth Creation',
        features: 'No lock-in | 14-16% return | Diversified | 5+ Years horizon',
        keyword: 'Long-Term-Wealth-Creation',
        minSipAmount: 3000,
        minLumpSumAmount: 20000
    },
    {
        name: 'Tax Saver | ELSS',
        description: 'Better Tax Saving Instruments | 80C Deductions',
        goals: 'Save upto 46,800 u/s 80C of Income Tax Act',
        features: '3 Year lock-in | 14-16% return | Diversified',
        keyword: 'Tax-Saver-ELSS',
        minSipAmount: 1000,
        minLumpSumAmount: 1000
    },
    {
        name: 'Short Term Funds',
        description: 'Better than FD return',
        goals: 'Luxury items purchase, Car, Vacation Planning, Down payment',
        features: 'No lock-in | 7-10% return | Medium Term Debt funds',
        keyword: 'Short-Term-Funds',
        minSipAmount: 1600,
        minLumpSumAmount: 10100
    },
    {
        name: 'Funds For Emergency',
        description: 'Alternative for saving account | Better for exigency planning',
        goals: 'Unforeseen expenses',
        features: 'No lock-in | 6-7% return | Short Term Debt funds',
        keyword: 'Funds-For-Emergency',
        minSipAmount: 1000,
        minLumpSumAmount: 500
    },
];

export interface ModelPortfolio {
    name: string,
    goals: string,
    keyword: string,
    features: string,
    description: string,
    minSipAmount: number,
    minLumpSumAmount: number
}