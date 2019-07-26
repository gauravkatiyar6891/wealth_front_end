import { Finance } from "financejs";
import { Injectable } from "@angular/core";
import { GlobalUtility } from './../../shared/global-utility';

@Injectable()

export class GraphHelper {

    currentMF: number = 0;
    currentPF: number = 0;
    currentFD: number = 0;
    currentSavings: number = 0;

    readonly NUMBER_OF_YEARS = 25;

    readonly SAVINGS_ACCOUNT_ROI = 3.5;
    readonly FIXED_DEPOSIT_ROI = 6.5;
    readonly PF_ROI = 8.5;
    readonly MF_ROI = 14.0;

    readonly SAVINGS_COLOR = "#0d5f7c";
    readonly FD_COLOR = "#ffab00";
    readonly MF_COLOR = "#24ace3";
    readonly PF_COLOR = "#119911";
    // readonly PF_COLOR = "#0d5f7c";

    currentYears: number = this.NUMBER_OF_YEARS;

    constructor(private globalUtility: GlobalUtility) { }

    getSavingsAccountSaving(amount: number): number[] {
        let arr: number[] = [];
        for (let i = 0; i <= this.NUMBER_OF_YEARS; i++) arr.push(Math.round(this.getFutureValue(amount, i, this.SAVINGS_ACCOUNT_ROI)));
        return arr;
    }

    getFDSaving(amount: number): number[] {
        let arr: number[] = [];
        for (let i = 0; i <= this.NUMBER_OF_YEARS; i++) arr.push(Math.round(this.getFutureValue(amount, i, this.FIXED_DEPOSIT_ROI)));
        return arr;
    }

    getPFSaving(amount: number): number[] {
        let arr: number[] = [];
        for (let i = 0; i <= this.NUMBER_OF_YEARS; i++) arr.push(Math.round(this.getFutureValue(amount, i, this.PF_ROI)));
        return arr;
    }

    getMFSaving(amount: number): number[] {
        let arr: number[] = [];
        for (let i = 0; i <= this.NUMBER_OF_YEARS; i++) arr.push(Math.round(this.getFutureValue(amount, i, this.MF_ROI)));
        return arr;
    }

    getColorPattern(): any[] {
        return [this.SAVINGS_COLOR, this.FD_COLOR, this.PF_COLOR, this.MF_COLOR].reverse();
    }

    getData(amount: number) {
        [this.currentMF, this.currentFD, this.currentPF, this.currentSavings, this.currentYears] = [this.get20YearFV(3, amount), this.get20YearFV(1, amount), this.get20YearFV(2, amount), this.get20YearFV(0, amount), this.NUMBER_OF_YEARS];
        return [
            ["Mutual Funds", ...this.getMFSaving(amount)],
            ["Provident Fund(PF)", ...this.getPFSaving(amount)],
            ["Fixed Deposit", ...this.getFDSaving(amount)],
            ["Savings", ...this.getSavingsAccountSaving(amount)],
        ]
    }

    getGraphConfig() {
        return {
            bindto: '#chart',
            data: {
                columns: this.getData(10000),
                type: "area-spline",
                onover: (value) => this.setValueFromGraph(value),
            },
            color: {
                pattern: this.getColorPattern()
            },
            tooltip: {
                // show: false,
                format: {
                    title: (value) => value + ' Years',
                    value: (value) => '&#8377; ' + this.globalUtility.currencyInInr(value),
                }
            },
            axis: {
                x: {
                    type: 'category',
                    // show: false,
                    label: {
                        text: 'Years',
                        position: 'outer-center'
                    },
                    tick: {
                        count: 1,
                        format: (value) => ''
                    },
                    padding: {
                        left: -1
                    }
                },
                y: {
                    label: {
                        text: 'Amount',
                        position: 'outer-middle'
                    },
                    tick: {
                        count: 5,
                        format: (value) => ''
                    }
                },
            },
            legend: {
                show: false
            }
        }
    }

    private getFutureValue(cost: number, duration: number, roi: number): number {
        duration = duration * 12;
        let rate = roi / (100 * 12);
        return (cost * (Math.pow(1 + rate, duration) - 1)) / rate;
    }
    // private getFutureValue(cost: number, duration: number, roi: number): number {
    //     duration = duration * 12;
    //     roi = roi / 12;
    //     return (new Finance()).FV(roi, cost, duration);
    // }

    get20YearFV(type: number, amount: number) {
        switch (type) {
            case 0: return this.getFutureValue(amount, this.NUMBER_OF_YEARS, this.SAVINGS_ACCOUNT_ROI);
                break;
            case 1: return this.getFutureValue(amount, this.NUMBER_OF_YEARS, this.FIXED_DEPOSIT_ROI);
                break;
            case 2: return this.getFutureValue(amount, this.NUMBER_OF_YEARS, this.PF_ROI);
                break;
            case 3: return this.getFutureValue(amount, this.NUMBER_OF_YEARS, this.MF_ROI);
                break;
        }
    }

    setValueFromGraph(data) {
        switch (data.id) {
            case 'Mutual Funds': this.currentMF = data.value;
                break;
            case 'Provident Fund(PF)': this.currentPF = data.value;
                break;
            case 'Fixed Deposit': this.currentFD = data.value;
                break;
            case 'Savings': this.currentSavings = data.value;
                break;
        }
        this.currentYears = data.x;
    }
}
