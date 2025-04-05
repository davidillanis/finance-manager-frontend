import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { DebtsComponent } from '../user-comp/debts/debts.component';
import { IncomeComponent } from '../user-comp/income/income.component';
import { SavingComponent } from '../user-comp/saving/saving.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseComponent } from '../user-comp/expense/expense.component';
import { HomeComponent } from '../user-comp/home/home.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgTemplateOutlet, NgComponentOutlet],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  protected homeComponent=HomeComponent;
  protected expensesComponent = ExpenseComponent;
  protected debtsComponent = DebtsComponent;
  protected incomeComponent = IncomeComponent;
  protected savingComponent = SavingComponent;

  @ViewChild('homeTemplate', { static: true }) homeTemplate!: TemplateRef<any>;
  @ViewChild('expensesTemplate', { static: true }) expensesTemplate!: TemplateRef<any>;
  @ViewChild('debtsTemplate', { static: true }) debtsTemplate!: TemplateRef<any>;
  @ViewChild('incomeTemplate', { static: true }) incomeTemplate!: TemplateRef<any>;
  @ViewChild('savingTemplate', { static: true }) savingTemplate!: TemplateRef<any>;

  protected selectedTemplate!: TemplateRef<any>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router:Router
  ){}

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe(fragment=>{
      switch (fragment) {
        case 'home':
          this.selectedTemplate = this.homeTemplate;
          break;
        case 'expenses':
          this.selectedTemplate = this.expensesTemplate;
          break;
        case 'saving':
          this.selectedTemplate = this.savingTemplate;
          break;
        case 'income':
          this.selectedTemplate = this.incomeTemplate;
          break;
        case 'debts':
          this.selectedTemplate = this.debtsTemplate;
          break
        default:
          this.selectedTemplate = this.homeTemplate;
          break;
      }
    });
  }

  route(fragment:string){
    this.router.navigate(["/user"], {fragment: fragment});
  }
}
