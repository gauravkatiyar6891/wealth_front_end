// import { isPlatformBrowser } from '@angular/common';
// import { Platform } from '@angular/cdk/platform';
// import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
// import * as jspdf from "jspdf";

// @Injectable()

// export class GoalReport {
//     xSpace: number;
//     ySpace: number;
//     nextLine: number = 12;
//     primaryColor: string = '#0d5f7c';
//     secondaryColor: string = '#006666';
//     goalTableSpaces: number[] = [170, 60, 60, 100, 100];
//     doc = new jspdf('p', 'px', 'a3');
//     constructor(@Inject(PLATFORM_ID) private platform: Platform) { }

//     createPdf(reportData: ReportData) {
//         if (!isPlatformBrowser(this.platform)) return;
//         this.xSpace = 12;
//         this.ySpace = 25;
//         this.doc = new jspdf('p', 'px', 'a3');

//         this.doc.setFontSize(14);
//         this.doc.setDrawColor(this.secondaryColor);
//         this.doc.setLineWidth(10);
//         this.doc.rect(0, 0, this.doc.internal.pageSize.getWidth(), this.doc.internal.pageSize.getHeight());

//         this.doc.setLineWidth(5);
//         this.doc.setDrawColor(this.primaryColor);
//         this.doc.rect(7, 7, this.doc.internal.pageSize.getWidth() - 14, this.doc.internal.pageSize.getHeight() - 14);

//         this.doc.setFontType('bold');
//         this.doc.setFontSize(12);
//         this.doc.text(`Dear ${reportData.userName}`, this.xSpace, this.ySpace);
//         this.ySpace += this.nextLine + 3;

//         this.doc.setFontType("normal");
//         this.doc.setFontSize(10);
//         this.doc.text("Greetings from", this.xSpace, this.ySpace);
//         this.boldText(52, "Go4Wealth");
//         this.doc.text("and thank you for considering us for your financial goal planning and investment.", this.xSpace + 93, this.ySpace);

//         this.ySpace += this.nextLine;
//         this.doc.text("We understand that financial plan gives a direction to our investment efforts, and once done properly it helps us keep a track of its attainment", this.xSpace, this.ySpace);

//         this.ySpace += this.nextLine;
//         this.doc.text("We share this thought and hence use", this.xSpace, this.ySpace);
//         this.boldText(126, "unbiased and algorithm based model");
//         this.doc.text("to help you plan goals and to suggest you better performing Mutual Funds", this.xSpace + 261, this.ySpace);

//         this.drawSeperatorLine();

//         this.doc.text("Please note based on your response to the risk profile assessment and your age, our algorithm has found your profile to be ", this.xSpace, this.ySpace);
//         this.boldText(410, `${reportData.riskProfile}`);

//         this.ySpace += this.nextLine;
//         this.doc.text("And our algorithm based selection of funds suggests following funds for you, with ideal allocation as mentioned below:", this.xSpace, this.ySpace);

//         this.drawSeperatorLine();

//         this.doc.text("Further, based on your customization, following is the details of financial goals set by you", this.xSpace, this.ySpace);
//         this.drawTableHeader(this.goalTableSpaces, ['GoalName', 'Years to Goal', 'Current Cost', 'Future Cost / Corpus', 'SIP | Monthly Investment', 'Lumpsum | One Time Investment']);
//         let estimates = this.fillGoalDataToTable(reportData.goals);

//         this.drawSeperatorLine();

//         this.doc.text("Basis your Planning, you need to invest a total of following amount in different funds mentioned above to", this.xSpace, this.ySpace);
//         this.boldText(348, "reach your goals");
//         this.doc.text("in the time period selected", this.xSpace + 410, this.ySpace);
//         this.ySpace += this.nextLine;

//         this.boldText(0, "Monthly | SIP Investment");
//         this.boldText(200, `${estimates.monthlySip}`);
//         this.ySpace += this.nextLine;

//         this.boldText(0, "alternatively");
//         this.ySpace += this.nextLine;

//         this.boldText(0, "One Time | Lump Sump Investment");
//         this.boldText(200, `${estimates.lumpsum}`);

//         this.drawSeperatorLine();

//         this.doc.text("Happy Investing", this.xSpace, this.ySpace);
//         this.ySpace += this.nextLine;

//         this.boldText(0, "Team Go4Wealth  |  Call : 8588-926-926  |  email : care@go4wealth.com");
//         this.ySpace += this.nextLine;

//         this.doc.text("Linkedin: https://www.linkedin.com/company/go4wealth | Twitter: https://twitter.com/go4wealthindia  |  Facebook: https://www.facebook.com/go4wealth ", this.xSpace, this.ySpace);
//         this.ySpace += this.nextLine;

//         this.boldText(0, "To change your risk profile and goals plan and accordingly see new recommendations, please visit our website - https://go4wealth.com");
//         this.ySpace += this.nextLine;

//         this.doc.text("Mutual Fund Investment is subject to market risk, read all scheme related documents carefully ", this.xSpace, this.ySpace);
//     }

//     fillGoalDataToTable(goals: Goal[]) {
//         let monthlySip: number = 0;
//         let lumpsum: number = 0;
//         goals.forEach(goal => {
//             let xSpace = this.xSpace;
//             this.doc.text(goal.name, xSpace, this.ySpace);
//             this.doc.text(goal.years + "", xSpace += this.goalTableSpaces[0], this.ySpace);
//             this.doc.text(this.currencyInr(goal.currentCost, 2), xSpace += this.goalTableSpaces[1], this.ySpace);
//             this.doc.text(this.currencyInr(goal.futureCost, 2), xSpace += this.goalTableSpaces[2], this.ySpace);
//             this.doc.text(this.currencyInr(goal.sip, 1), xSpace += this.goalTableSpaces[3], this.ySpace);
//             this.doc.text(this.currencyInr(goal.lumpsum, 2), xSpace += this.goalTableSpaces[4], this.ySpace);
//             monthlySip += goal.sip;
//             lumpsum += goal.lumpsum;
//             this.ySpace += this.nextLine;
//         });
//         return {
//             monthlySip: this.currencyInr(monthlySip, 1),
//             lumpsum: this.currencyInr(lumpsum, 2)
//         }
//     }

//     drawTableHeader(spaces: number[], headers: string[]) {
//         this.ySpace += 10;
//         this.doc.setDrawColor(this.secondaryColor);
//         this.doc.setTextColor(255, 255, 255);
//         this.doc.setLineWidth(12);
//         this.doc.line(9, this.ySpace, this.doc.internal.pageSize.getWidth() - 9, this.ySpace);
//         this.ySpace += 2;
//         let xSpace = this.xSpace;
//         headers.forEach((val, index) => {
//             this.doc.text(val, xSpace, this.ySpace);
//             xSpace += spaces[index];
//         });
//         this.ySpace += 15;
//         this.doc.setTextColor(0, 0, 0);
//     }

//     generateReport(reportData: ReportData) {
//         this.createPdf(reportData);
//         // window.open(this.doc.output("datauristring"), '_blank');
//         this.doc.save("Go4Wealth Goals Report.pdf");
//     }

//     boldText(xSpace: number, text: string, ySpace: number = this.ySpace) {
//         this.doc.setFontType("bold");
//         this.doc.text(text, this.xSpace + xSpace, ySpace);
//         this.doc.setFontType("normal");
//     }

//     drawSeperatorLine(ySpace: number = 6) {
//         this.ySpace += ySpace;
//         this.doc.setDrawColor(this.secondaryColor);
//         this.doc.setLineWidth(4);
//         this.doc.line(9, this.ySpace, this.doc.internal.pageSize.getWidth() - 9, this.ySpace);

//         this.ySpace += 3;
//         this.doc.setDrawColor(this.primaryColor);
//         this.doc.line(9, this.ySpace, this.doc.internal.pageSize.getWidth() - 9, this.ySpace);
//         this.ySpace += 12;
//     }

//     currencyInr(value: number, args: number): string {
//         let multiplier = Math.pow(10, args);
//         let num = (parseInt((value / multiplier).toString()) * multiplier).toString();
//         let lastThree = num.substring(num.length - 3);
//         let otherNumbers = num.substring(0, num.length - 3);
//         if (otherNumbers != '')
//             lastThree = ',' + lastThree;
//         return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
//     }
// }

// export interface Goal {
//     sip: number,
//     name: string,
//     years: number,
//     lumpsum: number,
//     futureCost: number,
//     currentCost: number
// }

// export interface ReportData {
//     userName: string,
//     riskProfile: string,
//     goals: Goal[]
// }