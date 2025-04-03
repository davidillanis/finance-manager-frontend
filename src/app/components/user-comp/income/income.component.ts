import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../service/auth.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from "../../../widgets/pie-chart/pie-chart.component";
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppUtils } from '../../../util/other/app-utils';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../../app.component';
import { AlertService } from '../../../service/alert.service';
import { ModalService } from '../../../service/modal.service';
import { IncomeService } from '../../../service/income.service';
import { IncomeEntity } from '../../../model/income-entity';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [NgxChartsModule, PieChartComponent, MatButtonModule, MatDialogModule],
  templateUrl: './income.component.html',
  styleUrl: './income.component.css'
})
export class IncomeComponent {

  protected userUid = "";
  protected token = "";
  protected limit = 100;
  isLoading = false;
  incomeList: IncomeEntity[] = [];
  categoryList: string[] = [];
  originList: string[] = [];
  customSingle: { name: string, value: number }[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private incomeService: IncomeService,
    private authService: AuthService,
    private alertService: AlertService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";

    this.incomeService.setValuesPerField(this.userUid, "category", this.token).subscribe(t => this.categoryList = t?t:[])
    this.incomeService.setValuesPerField(this.userUid, "origin", this.token).subscribe(t => this.originList = t?t:[])

    this.loadSaving();
  }

  loadSaving(usingCache: boolean = true): void {
    this.isLoading = true;

    this.incomeService.list(this.userUid, this.token, this.limit, usingCache).subscribe(
      (data) => {
        this.incomeList = data;
        this.updateCustomSingle();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading bills', error);
        this.isLoading = false;
      }
    );
  }

  formatDate(timestamp: number | string) {
    return AppUtils.formatDate(timestamp);
  }

  updateCustomSingle(): void {
    this.customSingle = [];
    this.incomeList.forEach(income => {
      const existingCategory = this.customSingle.find(item => item.name === income.category);
      if (existingCategory) {
        existingCategory.value += income.amount;
      } else {
        this.customSingle.push({ name: income.category, value: income.amount });
      }
    });
  }

  /*openDialog() {
    const items = ['payMethod', 'category', 'amount', 'description']; // Ejemplo de datos
    const dialogRef = this.dialog.open(FormComponent, {
      data: { items: items }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }*/

  add() {
    const dialogRef = this.dialog.open(ModalIncome, {
      data: {
        category: this.categoryList,
        origin: this.originList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let incomeEntity: IncomeEntity = {
          id: '',
          date: AppUtils.getCurrentDate(),
          description: result.description,
          amount: result.amount,
          category: result.category,
          origin: result.origin
        }

        AppComponent.viewSpinner = true;
        this.incomeService.create(this.userUid, this.token, incomeEntity).subscribe(t => {
          AppComponent.viewSpinner = false;
          if (t.isSuccess) {
            this.alertService.successful("add new expense");
            this.loadSaving(false);
          }
          else {
            this.alertService.warning("Error in saving data")
          }
        });
      }
    });
  }

  update(expenseId: string) {
    AppComponent.viewSpinner = true;
    this.incomeService.getById(this.userUid, expenseId, this.token).subscribe(expense => {
      AppComponent.viewSpinner = false;
      const dialogRef = this.dialog.open(ModalIncome, {
        data: {
          category: this.categoryList,
          origin: this.originList,
          income: expense
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          let incomeEntity: IncomeEntity = {
            id: '',
            date: AppUtils.getCurrentDate(),
            description: result.description,
            amount: result.amount,
            category: result.category,
            origin: result.origin
          }

          AppComponent.viewSpinner = true;
          this.incomeService.update(this.userUid, expenseId, this.token, incomeEntity).subscribe(t => {
            AppComponent.viewSpinner = false;
            if (t.isSuccess) {
              this.alertService.successful("update expense");
              this.loadSaving(false);
            }
            else {
              this.alertService.warning("Error in update data")
            }
          });
        }
      });
    })
  }

  delete(id: string) {
    AppComponent.viewSpinner = true;
    this.incomeService.delete(this.userUid, id, this.token).subscribe(t => {
      AppComponent.viewSpinner = false;
      if (t.isSuccess) {
        this.alertService.successful("add new expense");
        this.loadSaving(false);
      }
      else {
        this.alertService.warning("Error in saving data")
      }
    })
  }

  info(id: string) {
    AppComponent.viewSpinner = true;
    this.incomeService.getById(this.userUid, id, this.token).subscribe(t => {
      AppComponent.viewSpinner = false;
      this.modalService.VerModalIncomeInfo(t);
    });
  }

  onSelectionChanged(selection: { name: string, value: string }) {
    //console.log('Selected Name:', selection.name);
    //console.log('Selected Value:', selection.value);
    // Aquí puedes manejar la lógica que necesites con los datos seleccionados

    this.customSingle = [];
    this.incomeList.forEach(expense => {
      let selectValue: string;

      switch (selection.name) {
        case 'category':
          selectValue = expense.category;
          break;
        case 'origin':
          selectValue = expense.origin;
          break;
        case 'date':
          selectValue = this.formatDate(expense.date).slice(0,10);
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


@Component({
  selector: 'modal-income',
  templateUrl: './modal-income.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalIncome {

  categories: string[];
  origins: string[];
  income: IncomeEntity;
  selectedCategory: string = '';
  selectedOrigin: string = '';
  newCategory: string = '';
  newOrigin: string = '';
  isEditingCategory: boolean = false;
  isEditingOrigin: boolean = false;
  amount: number = 0;
  description: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: string[], origin: string[], income: IncomeEntity }
  ) {
    this.categories = data.category;
    this.origins = data.origin;
    this.income = data.income;
    if (this.income != undefined) {
      this.amount = this.income.amount;
      this.selectedCategory = this.income.category;
      this.selectedOrigin = this.income.origin;
      this.description = this.income.description;
    }
  }

  getCurrentDate() {
    return AppUtils.getCurrentDate();
  }

  onSelectionChange(event: any) {
    if (event.value === 'Agregar nueva opción...') {
      this.isEditingCategory = true;
      this.newCategory = '';
    } else {
      this.isEditingCategory = false;
    }
  }

  addNewOption() {
    this.selectedCategory = 'Agregar nueva opción...';
    this.isEditingCategory = true;
    this.newCategory = '';
  }

  saveOption() {
    if (this.newCategory.trim()) {
      this.categories.push(this.newCategory);
      this.selectedCategory = this.newCategory;
      this.isEditingCategory = false;
    }
  }

  onPayMethodSelectionChange(event: any) {
    if (event.value === 'Agregar nuevo método...') {
      this.isEditingOrigin = true;
      this.newOrigin = '';
    } else {
      this.isEditingOrigin = false;
    }
  }

  addNewPayMethod() {
    this.selectedOrigin = 'Agregar nuevo método...';
    this.isEditingOrigin = true;
    this.newOrigin = '';
  }

  savePayMethod() {
    if (this.newOrigin.trim()) {
      this.origins.push(this.newOrigin);
      this.selectedOrigin = this.newOrigin;
      this.isEditingOrigin = false;
    }
  }

  isDisabled() {
    return this.amount != 0 && (this.selectedCategory.trim() != "" && this.selectedCategory.trim() != "Agregar nueva opción...") && (this.selectedOrigin.trim() != "" && this.selectedOrigin.trim() != "Agregar nueva opción...");
  }


}
