import { Chart } from "billboard.js";
import { Platform } from "@angular/cdk/platform";
import { Component, OnInit } from '@angular/core';
import { GraphHelper } from "../home/graph-helper";

declare var bb: any;

@Component({
  selector: 'g4w-comparison-graph',
  templateUrl: './comparison-graph.component.html',
  styleUrls: ['./comparison-graph.component.scss'],
  providers: [GraphHelper]
})

export class ComparisonGraphComponent implements OnInit {

  chart: Chart;

  constructor(
    private platform: Platform,
    public graphHelper: GraphHelper,
  ) {

  }

  ngOnInit() {
    if (this.platform.isBrowser) this.chart = bb.generate(this.graphHelper.getGraphConfig());
  }

  amountChange(event) {
    this.chart.load({
      columns: this.graphHelper.getData(event.value)
    });
  }

}
