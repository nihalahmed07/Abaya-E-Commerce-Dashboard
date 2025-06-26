import { Component, OnInit } from '@angular/core';
import { EarningsService } from 'src/app/services/earnings.service';
import {
  ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexStroke, ApexTitleSubtitle, ApexGrid
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
};

@Component({
  selector: 'app-earnings',
  templateUrl: './earnings.component.html',
  styleUrls: ['./earnings.component.scss']
})
export class EarningsComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>;
  topCountryList: { country: string; count: number }[] = [];
  thisMonthEarnings = 0;
  pastMonthEarnings = 0;
  yearEarnings = 0;

  constructor(private earningsService: EarningsService) {}

  ngOnInit(): void {
    this.loadChart();
    this.loadTopCountries();
    this.calculateEarnings();
  }

  loadChart(): void {
    this.earningsService.getDailyStats().subscribe(data => {
      const categories = data.intervals.map((item: any) => item.date_start);
      const earnings = data.intervals.map((item: any) => item.total_sales);

      this.chartOptions = {
        series: [{ name: "Earnings", data: earnings }],
        chart: { height: 350, type: "line" },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        title: { text: "Daily Earnings - Last 30 Days" },
        grid: {
          row: { colors: ["#f3f3f3", "transparent"], opacity: 0.5 }
        },
        xaxis: { categories: categories }
      };
    });
  }

  loadTopCountries(): void {
    const topCountries: { [key: string]: number } = {};
    this.earningsService.getOrders().subscribe(orders => {
      orders.forEach(order => {
        const country = order.billing.country;
        if (country) {
          topCountries[country] = (topCountries[country] || 0) + 1;
        }
      });
      this.topCountryList = Object.entries(topCountries)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    });
  }

  calculateEarnings(): void {
    this.earningsService.getOrders().subscribe(orders => {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      orders.forEach(order => {
        const orderDate = new Date(order.date_created);
        const total = parseFloat(order.total);

        if (orderDate >= startOfYear) {
          this.yearEarnings += total;
        }

        if (orderDate >= startOfMonth) {
          this.thisMonthEarnings += total;
        } else if (orderDate >= startOfLastMonth && orderDate < startOfMonth) {
          this.pastMonthEarnings += total;
        }
      });
    });
  }
}
