import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [NgxChartsModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent {
  @Input() single: { name: string, value: number }[] = [];
  @Input() view: [number, number] = [700, 400];
  @Input() showLabels: boolean = false;
  @Input() gradient: boolean = true;
  @Input() doughnut: boolean = true;
  @Input() legend: boolean = true;
  @Input() animations: boolean = true;
  @Input() arcWidth: number = 0.3;
  @Input() names:string[] = [];
  @Input() values: string[] = [];
  @Output() selectionChanged = new EventEmitter<{ name: string, value: string }>();
  nameSelected = '';
  valueSelected='';

  onNameSelected(event: any) {
    this.nameSelected = event.value;
    this.emitSelectionChanged();
  }

  onValueSelected(event: any) {
    this.valueSelected = event.value;
    this.emitSelectionChanged();
  }

  emitSelectionChanged() {
    this.selectionChanged.emit({ name: this.nameSelected, value: this.valueSelected });
  }
}
