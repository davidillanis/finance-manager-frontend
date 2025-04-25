import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { ExpenseService } from '../../../service/expense.service';
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
import { DebtsEntity } from '../../../model/debts-entity';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoanService } from '../../../service/loan.service';
import { InputImageComponent } from "../../../widgets/input-image/input-image.component";
import { FileService } from '../../../service/file.service';

@Component({
  selector: 'app-debts',
  standalone: true,
  imports: [NgxChartsModule, PieChartComponent, MatButtonModule, MatDialogModule],
  templateUrl: './debts.component.html',
  styleUrl: './debts.component.css'
})
export class DebtsComponent {
  protected userUid = "";
  protected token = "";
  protected limit = 100;
  isLoading = false;
  debtsList: DebtsEntity[] = [];
  creditorList: string[] = [];
  customSingle: { name: string, value: number }[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private alertService: AlertService,
    private modalService: ModalService,
    private fileService:FileService
  ) { }

  ngOnInit(): void {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";

    this.loanService.setValuesPerField(this.userUid, "creditor", this.token).subscribe(t => this.creditorList = t?t:[])
    this.loadDebts();
  }

  loadDebts(usingCache: boolean = true): void {

    this.isLoading = true;

    this.loanService.list(this.userUid, this.token, this.limit, usingCache).subscribe(
      (data) => {
        this.debtsList = data;
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
    this.debtsList.forEach(expense => {
      const existingCategory = this.customSingle.find(item => item.name === expense.creditor);
      if (existingCategory) {
        existingCategory.value += expense.amount;
      } else {
        this.customSingle.push({ name: expense.creditor, value: expense.amount });
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
    const dialogRef = this.dialog.open(ModalWidgets, { data: { category: this.creditorList } });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        AppComponent.setViewSpinner(true);
        this.fileService.uploadFile2(result.file).url$.subscribe(url=>{
          let debtsEntity: DebtsEntity = {
            id: '',
            date: '',
            description: result.description,
            amount: result.amount,
            creditor: result.creditor,
            dateMaturity: AppUtils.formatDate(result.dateMaturity).slice(0, 10),
            imageUrl: url
          }

          this.loanService.create(this.userUid, this.token, debtsEntity).subscribe(t => {
            if (t.isSuccess) {
            AppComponent.setViewSpinner(false);

              this.alertService.successful("add new expense");
              this.loadDebts(false);
            }
            else {
              this.alertService.warning("Error in saving data")
            }
          });
        })
      }
    });
  }

  update(expenseId: string) {
    AppComponent.setViewSpinner(true);

    this.loanService.getById(this.userUid, expenseId, this.token).subscribe(debts => {
      AppComponent.setViewSpinner(false);

      const dialogRef = this.dialog.open(ModalWidgets, {
        data: {
          category: this.creditorList,
          bills: debts
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          AppComponent.setViewSpinner(true);

          const updateDebtsEntity = (imageUrl: string) => {
            const debtsEntity: DebtsEntity = {
              id: '',
              date: '',
              description: result.description,
              amount: result.amount,
              creditor: result.creditor,
              dateMaturity: AppUtils.formatDate(result.dateMaturity).slice(0, 10),
              imageUrl: imageUrl
            };

            this.loanService.update(this.userUid, expenseId, this.token, debtsEntity).subscribe(response => {
              AppComponent.setViewSpinner(false);

              if (response.isSuccess) {
                this.alertService.successful("Expense updated successfully");
                this.loadDebts(false);
              } else {
                this.alertService.warning("Error updating expense");
              }

            });
          };

          if (result.file) {
            this.fileService.uploadFile2(result.file).url$.subscribe(updateDebtsEntity);

          } else {
            updateDebtsEntity(debts.imageUrl);
          }
        }
      });
    });


  }

  delete(id: string) {
    AppComponent.setViewSpinner(true);
    this.loanService.delete(this.userUid, id, this.token).subscribe(t => {
      AppComponent.setViewSpinner(false);
      if (t.isSuccess) {
        this.alertService.successful("add new expense");
        this.loadDebts(false);
      }
      else {
        this.alertService.warning("Error in saving data")
      }
    })
  }

  info(id: string) {
    AppComponent.setViewSpinner(true);
    this.loanService.getById(this.userUid, id, this.token).subscribe(t => {
      AppComponent.setViewSpinner(false);
      this.modalService.VerModalDebtsInfo(t);
    });
  }

  onSelectionChanged(selection: { name: string, value: string }) {
    //console.log('Selected Name:', selection.name);
    //console.log('Selected Value:', selection.value);
    // Aquí puedes manejar la lógica que necesites con los datos seleccionados

    this.customSingle = [];
    this.debtsList.forEach(debts => {
      let selectValue: string;

      switch (selection.name) {
        case 'creditor':
          selectValue = debts.creditor;
          break;
        case 'date':
          selectValue = AppUtils.formatDate(debts.date).slice(0,10);
          break;
        case 'dateMaturity':
          selectValue = AppUtils.formatDate(debts.dateMaturity).slice(0,10);
          break;
        default:
          selectValue = debts.creditor;
          break;
      }

      const existingCategory = this.customSingle.find(item => item.name === selectValue);
      if (existingCategory) {
        existingCategory.value += debts.amount;
      } else {
        this.customSingle.push({ name: selectValue, value: debts.amount });
      }
    });
  }

}


@Component({
  selector: 'modal-debs',
  templateUrl: './modal-debts.html',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatDatepickerModule,
    InputImageComponent
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalWidgets {

  creditors: string[];
  debts: DebtsEntity;
  selectedCreditor: string = '';
  newCreditor: string = '';
  isEditingCreditor: boolean = false;
  amount: number = 0;
  description: string = '';
  urlImage:string='';
  dateMaturity: string = '';
  file:File|undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { category: string[], payMethod: string[], bills: DebtsEntity }
  ) {
    this.creditors = data.category;
    this.debts = data.bills;
    if (this.debts != undefined) {
      this.amount = this.debts.amount;
      this.selectedCreditor = this.debts.creditor;
      this.description = this.debts.description;
      this.dateMaturity=AppUtils.formatDate(this.debts.dateMaturity).slice(0,10);
      this.urlImage=this.debts.imageUrl;
    }

  }

  getCurrentDate() {
    return AppUtils.getCurrentDate();
  }

  onSelectionChange(event: any) {
    if (event.value === 'Agregar nueva opción...') {
      this.isEditingCreditor = true;
      this.newCreditor = '';
    } else {
      this.isEditingCreditor = false;
    }
  }

  addNewOption() {
    this.selectedCreditor = 'Agregar nueva opción...';
    this.isEditingCreditor = true;
    this.newCreditor = '';
  }

  saveOption() {
    if (this.newCreditor.trim()) {
      this.creditors.push(this.newCreditor);
      this.selectedCreditor = this.newCreditor;
      this.isEditingCreditor = false;
    }
  }

  isDisabled() {
    return this.amount != 0 && (this.selectedCreditor.trim() != "" && this.selectedCreditor.trim() != "Agregar nueva opción...");
  }

  onPhotoChange(file: File) {
    this.file=file;

  }

}
