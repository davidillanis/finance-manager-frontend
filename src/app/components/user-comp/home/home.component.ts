import { Component, OnInit } from '@angular/core';
import { IncomeEntity } from '../../../model/income-entity';
import { BillsEntity } from '../../../model/bills-entity';
import { DebtsEntity } from '../../../model/debts-entity';
import { SavingsEntity } from '../../../model/savings-entity';
import { AuthService } from '../../../service/auth.service';
import { PrincipalService } from '../../../service/principal.service';
import { PieChartComponent } from "../../../widgets/pie-chart/pie-chart.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PieChartComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  protected userUid = "";
  protected token = "";
  protected limit = 100;

  incomesList:IncomeEntity[]=[];
  expenseList:BillsEntity[]=[];
  debtsList:DebtsEntity[]=[];
  savingList:SavingsEntity[]=[];
  customSingle: { name: string, value: number }[] = [];

  constructor(
    private authService:AuthService,
    private principalService:PrincipalService
  ){}
  ngOnInit(): void {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";
    this.principalService.accumulatedOfAll(this.userUid, this.token).subscribe(t=>this.customSingle=t);

  }


  onSelectionChanged(selection: { name: string, value: string }) {
    //console.log('Selected Name:', selection.name);
    //console.log('Selected Value:', selection.value);
    // Aquí puedes manejar la lógica que necesites con los datos seleccionados

    this.customSingle = [];
    this.expenseList.forEach(expense => {
      let selectValue: string;

      switch (selection.name) {
        case 'category':
          selectValue = expense.category;
          break;
        case 'payMethod':
          selectValue = expense.payMethod;
          break;
        default:
          selectValue = expense.category;
          break;
      }

      const existingCategory = this.customSingle.find(item => item.name === selectValue);
      if (existingCategory) {
        existingCategory.value += expense.amount;
      } else {
        this.customSingle.push({ name: selectValue, value: expense.amount });
      }
    });
  }

}
