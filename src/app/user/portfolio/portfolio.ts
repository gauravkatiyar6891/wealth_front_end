import { Injectable } from "@angular/core";
import { PortfolioResp } from "./../../models/portfolio";
import { TransferInResp } from './../../models/Transfer-In';
import { GlobalUtility } from "./../../shared/global-utility";
import { Portfolio, FolioPortfolio, AddToFolioData } from './../../models/portfolio';

@Injectable()
export class PortfolioHelper {
    constructor(private globalUtility: GlobalUtility) { }

    getConvertedPortfolioData(portfolioResp: PortfolioResp[], transferInRecords: TransferInResp[]): Portfolio[] {
        let portfolio: Portfolio[] = this.groupPortfolioData(portfolioResp);
        portfolio = this.groupTransferInData(transferInRecords, portfolio);
        return portfolio;
    }

    getAddToFolioData(portfolio: Portfolio, folio: FolioPortfolio): AddToFolioData {
        let addToFolio: AddToFolioData = {
            folioNo: folio.folioNumber,
            availSipDates: portfolio.availableSipDate,
            isBillerEnable: portfolio.billerEnable,
            isNachEnable: portfolio.enachEnable,
            isISipAllowed: portfolio.isipAllowed,
            minLumpSumAmount: portfolio.minLumpsumAmount,
            minSipAmount: portfolio.minSipAmount,
            maxSipAmount: portfolio.maxSipAmount,
            maxLumpsumAmount: portfolio.maxLumpsumAmount,
            schemeCode: portfolio.schemeCode,
            minAdditionalAmount: portfolio.minAdditionalAmount,
            transferInId: portfolio.transferInId,
            isLumpsumAllowed: portfolio.isLumpsumAllowed,
            isSipAllowed: portfolio.isSipAllowed
        }
        return addToFolio;
    }

    private groupPortfolioData(portfolioResp: PortfolioResp[]): Portfolio[] {
        let portfolio: Portfolio[] = [];
        portfolioResp.forEach(pr => {
            let portfolioIndex = portfolio.findIndex(p => p.schemeCode == pr.schemeCode);
            if (portfolioIndex == -1) portfolio.push(this.getPortfolioElementByPortfolio(pr));
            else if (portfolio[portfolioIndex].folios.findIndex(f => f.folioNumber == pr.follioNo) == -1) portfolio[portfolioIndex].folios.push(this.getFolioElementByPortfolio(pr));
            else portfolio[portfolioIndex].folios[portfolio[portfolioIndex].folios.findIndex(f => f.folioNumber == pr.follioNo)] = this.addFolioDetailsToExistingFolioByPortfolio(pr, portfolio[portfolioIndex].folios[portfolio[portfolioIndex].folios.findIndex(f => f.folioNumber == pr.follioNo)]);
        });
        return portfolio;
    }

    private groupTransferInData(transferInRecords: TransferInResp[], exPortfolio: Portfolio[]): Portfolio[] {
        transferInRecords.forEach(ti => {
            let portfolioIndex = exPortfolio.findIndex(p => p.schemeCode == ti.schemeCode);
            if (portfolioIndex == -1) exPortfolio.push(this.getPortfolioElementByTransferIn(ti));
            else if (exPortfolio[portfolioIndex].folios.findIndex(f => f.folioNumber == ti.folioNo) == -1) exPortfolio[portfolioIndex].folios.push(this.getFolioElementByTransferIn(ti));
            else exPortfolio[portfolioIndex].folios[exPortfolio[portfolioIndex].folios.findIndex(f => f.folioNumber == ti.folioNo)] = this.addFolioDetailsToExistingFolioByTransferIn(ti, exPortfolio[portfolioIndex].folios[exPortfolio[portfolioIndex].folios.findIndex(f => f.folioNumber == ti.folioNo)]);
        });
        return exPortfolio;
    }

    private getPortfolioElementByPortfolio(portfolio: PortfolioResp): Portfolio {
        let p: Portfolio = {
            schemeCode: portfolio.schemeCode,
            amcCode: portfolio.amcCode,
            nav: portfolio.currentNav,
            schemeName: portfolio.schemeName,
            schemeType: portfolio.schemeType,
            currentAmount: 0,
            billerEnable: portfolio.billerEnable,
            enachEnable: portfolio.enachEnable,
            totalInvestment: 0,
            maxLumpsumAmount: portfolio.sipMaxInstallmentAmount,
            maxSipAmount: portfolio.sipMaxInstallmentAmount,
            minAdditionalAmount: portfolio.minAdditionalAmount,
            isLumpsumAllowed: portfolio.lumpsumAllowed,
            isSipAllowed: portfolio.sipAllowed,
            isipAllowed: portfolio.isipAllowed,
            minLumpsumAmount: portfolio.minLumpsumAmount,
            minSipAmount: portfolio.minSipAmount,
            availableSipDate: portfolio.availableSipDate,
            folios: [this.getFolioElementByPortfolio(portfolio)],
            transferInId: null,
        }
        return p;
    }

    private getPortfolioElementByTransferIn(transferIn: TransferInResp): Portfolio {
        let p: Portfolio = {
            schemeCode: transferIn.schemeCode,
            amcCode: transferIn.amcCode,
            nav: transferIn.currentNav,
            schemeName: transferIn.schemeName,
            schemeType: transferIn.schemeType,
            currentAmount: 0,
            totalInvestment: 0,
            billerEnable: transferIn.billerEnable,
            minAdditionalAmount: transferIn.minAdditionalAmount,
            enachEnable: transferIn.enachEnable,
            isipAllowed: transferIn.isipAllowed,
            maxSipAmount: transferIn.maxSipAmount,
            maxLumpsumAmount: transferIn.maxLumpsumAmount,
            minLumpsumAmount: transferIn.minLumpsumAmount,
            minSipAmount: transferIn.minSipAmount,
            isLumpsumAllowed: transferIn.lumpsumAllowed,
            isSipAllowed: transferIn.sipAllowed,
            availableSipDate: transferIn.sipAllowedDate,
            folios: [this.getFolioElementByTransferIn(transferIn)],
            transferInId: transferIn.transferInId
        }
        return p;
    }

    private getFolioElementByPortfolio(portfolio: PortfolioResp): FolioPortfolio {
        return {
            folioNumber: portfolio.follioNo,
            allotedUnits: portfolio.allotedUnit,
            goalId: portfolio.goalId,
            goalName: portfolio.goalName,
            isRedeemptionAllowed: portfolio.isRedumptionAllowed == 'Yes',
            startedOn: portfolio.statedOn,
            status: portfolio.status,
            isTransferIn: false,
            availableAmount: portfolio.totalAmount,
            investedAmount: portfolio.investedAmount,
            currentAmount: this.globalUtility.roundOff(portfolio.currentNav * portfolio.allotedUnit),
            minimumRedeemptionAmount: portfolio.minimumRedumptionAmount,
            absoluteReturn: this.globalUtility.roundOff(((portfolio.currentNav * portfolio.allotedUnit) / portfolio.investedAmount - 1), true)
        };
    }

    private getFolioElementByTransferIn(transferIn: TransferInResp): FolioPortfolio {
        return {
            folioNumber: transferIn.folioNo,
            allotedUnits: this.globalUtility.roundOff(transferIn.allotedUnit, false, 4),
            goalId: transferIn.goalId,
            goalName: transferIn.goalName,
            isRedeemptionAllowed: transferIn.isRedemptionAllowed == 'Y',
            startedOn: transferIn.startedOn,
            isTransferIn: true,
            status: 'AD',
            availableAmount: this.globalUtility.roundOff(transferIn.availableUnit * transferIn.currentNav),
            investedAmount: transferIn.investedAmount,
            currentAmount: this.globalUtility.roundOff(transferIn.currentNav * transferIn.availableUnit),
            minimumRedeemptionAmount: transferIn.minimumRedemptionAmount,
            absoluteReturn: this.globalUtility.roundOff(((transferIn.currentNav * transferIn.availableUnit) / Number(transferIn.investedAmount) - 1), true)
        }
    }

    private addFolioDetailsToExistingFolioByPortfolio(portfolio: PortfolioResp, exFolio: FolioPortfolio): FolioPortfolio {
        if (portfolio.status == 'AP' || portfolio.status == 'AD') {
            exFolio.allotedUnits += this.globalUtility.roundOff(portfolio.allotedUnit, false, 4);
            exFolio.currentAmount += this.globalUtility.roundOff(portfolio.currentNav * portfolio.allotedUnit);
            exFolio.investedAmount += portfolio.investedAmount;
            exFolio.absoluteReturn = this.globalUtility.roundOff(((portfolio.currentNav * exFolio.allotedUnits) / exFolio.investedAmount - 1), true);
        }
        return exFolio;
    }

    private addFolioDetailsToExistingFolioByTransferIn(transferIn: TransferInResp, exFolio: FolioPortfolio): FolioPortfolio {
        exFolio.allotedUnits += transferIn.allotedUnit;
        exFolio.currentAmount += this.globalUtility.roundOff(transferIn.currentNav * transferIn.allotedUnit);
        exFolio.investedAmount += transferIn.investedAmount;
        exFolio.absoluteReturn = this.globalUtility.roundOff(((transferIn.currentNav * exFolio.allotedUnits) / exFolio.investedAmount - 1), true);
        return exFolio;
    }
}