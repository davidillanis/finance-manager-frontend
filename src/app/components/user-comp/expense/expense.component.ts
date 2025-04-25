import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { ExpenseService } from '../../../service/expense.service';
import { AuthService } from '../../../service/auth.service';
import { BillsEntity } from '../../../model/bills-entity';
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

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [NgxChartsModule, PieChartComponent, MatButtonModule, MatDialogModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {
  protected userUid = "";
  protected token = "";
  protected limit = 100;
  isLoading = false;
  expenseList: BillsEntity[] = [];
  categoryList: string[] = [];
  payMethodList: string[] = [];
  customSingle: { name: string, value: number }[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService,
    private alertService: AlertService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";

    this.expenseService.setValuesPerField(this.userUid, "category", this.token).subscribe(t => this.categoryList = t?t:[])
    this.expenseService.setValuesPerField(this.userUid, "payMethod", this.token).subscribe(t => this.payMethodList = t?t:[])

    this.loadBills();
  }

  loadBills(usingCache: boolean = true): void {
    this.isLoading = true;

    this.expenseService.list(this.userUid, this.token, this.limit, usingCache).subscribe(
      (data) => {
        this.expenseList = data;
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
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").split(".")[0];
  }

  updateCustomSingle(): void {
    this.customSingle = [];
    this.expenseList.forEach(expense => {
      const existingCategory = this.customSingle.find(item => item.name === expense.payMethod);
      if (existingCategory) {
        existingCategory.value += expense.amount;
      } else {
        this.customSingle.push({ name: expense.payMethod, value: expense.amount });
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
    const dialogRef = this.dialog.open(ModalWidgets, {
      data: {
        category: this.categoryList,
        payMethod: this.payMethodList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let billsEntity: BillsEntity = {
          id: '',
          date: AppUtils.getCurrentDate(),
          description: result.description,
          amount: result.amount,
          category: result.category,
          payMethod: result.payMethod
        }

        AppComponent.setViewSpinner(true);
        this.expenseService.create(this.userUid, this.token, billsEntity).subscribe(t => {
          AppComponent.setViewSpinner(false);
          if (t.isSuccess) {
            this.alertService.successful("add new expense");
            this.loadBills(false);
          }
          else {
            this.alertService.warning("Error in saving data")
          }
        });
      }
    });
  }

  update(expenseId: string) {
    AppComponent.setViewSpinner(true);
    this.expenseService.getById(this.userUid, expenseId, this.token).subscribe(expense => {
      AppComponent.setViewSpinner(false);
      const dialogRef = this.dialog.open(ModalWidgets, {
        data: {
          category: this.categoryList,
          payMethod: this.payMethodList,
          bills: expense
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          let billsEntity: BillsEntity = {
            id: '',
            date: AppUtils.getCurrentDate(),
            description: result.description,
            amount: result.amount,
            category: result.category,
            payMethod: result.payMethod
          }

          AppComponent.setViewSpinner(true);
          this.expenseService.update(this.userUid, expenseId, this.token, billsEntity).subscribe(t => {
            AppComponent.setViewSpinner(false);
            if (t.isSuccess) {
              this.alertService.successful("update expense");
              this.loadBills(false);
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
    AppComponent.setViewSpinner(true);
    this.expenseService.delete(this.userUid, id, this.token).subscribe(t => {
      AppComponent.setViewSpinner(false);
      if (t.isSuccess) {
        this.alertService.successful("add new expense");
        this.loadBills(false);
      }
      else {
        this.alertService.warning("Error in saving data")
      }
    })
  }

  info(id: string) {
    AppComponent.setViewSpinner(true);
    this.expenseService.getById(this.userUid, id, this.token).subscribe(t => {
      AppComponent.setViewSpinner(false);
      this.modalService.VerModalBillsInfo(t);
    });
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


@Component({
  selector: 'modal-widgets',
  templateUrl: './modal-widgets.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWidgets {

  options: string[];
  payMethods: string[];
  bills: BillsEntity;
  selectedOption: string = '';
  selectedPayMethod: string = '';
  newOption: string = '';
  newPayMethod: string = '';
  isEditing: boolean = false;
  isEditingPayMethod: boolean = false;
  amount: number = 0;
  description: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: string[], payMethod: string[], bills: BillsEntity }
  ) {
    this.options = data.category;
    this.payMethods = data.payMethod;
    this.bills = data.bills;
    if (this.bills != undefined) {
      this.amount = this.bills.amount;
      this.selectedOption = this.bills.category;
      this.selectedPayMethod = this.bills.payMethod;
      this.description = this.bills.description;
    }

  }

  getCurrentDate() {
    return AppUtils.getCurrentDate();
  }

  onSelectionChange(event: any) {
    if (event.value === 'Agregar nueva opción...') {
      this.isEditing = true;
      this.newOption = '';
    } else {
      this.isEditing = false;
    }
  }

  addNewOption() {
    this.selectedOption = 'Agregar nueva opción...';
    this.isEditing = true;
    this.newOption = '';
  }

  saveOption() {
    if (this.newOption.trim()) {
      this.options.push(this.newOption);
      this.selectedOption = this.newOption;
      this.isEditing = false;
    }
  }

  onPayMethodSelectionChange(event: any) {
    if (event.value === 'Agregar nuevo método...') {
      this.isEditingPayMethod = true;
      this.newPayMethod = '';
    } else {
      this.isEditingPayMethod = false;
    }
  }

  addNewPayMethod() {
    this.selectedPayMethod = 'Agregar nuevo método...';
    this.isEditingPayMethod = true;
    this.newPayMethod = '';
  }

  savePayMethod() {
    if (this.newPayMethod.trim()) {
      this.payMethods.push(this.newPayMethod);
      this.selectedPayMethod = this.newPayMethod;
      this.isEditingPayMethod = false;
    }
  }

  isDisabled() {
    return this.amount != 0 && (this.selectedOption.trim() != "" && this.selectedOption.trim() != "Agregar nueva opción...") && (this.selectedPayMethod.trim() != "" && this.selectedPayMethod.trim() != "Agregar nueva opción...");
  }


}
