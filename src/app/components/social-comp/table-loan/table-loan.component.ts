import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Inject,
  ChangeDetectionStrategy,
  inject,
  Input,
  OnDestroy,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { Observable, of, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LoanGroupService } from '../../../service/loan-group.service';
import { AuthService } from '../../../service/auth.service';
import { AlertService } from '../../../service/alert.service';
import { FileService } from '../../../service/file.service';
import { ModalService } from '../../../service/modal.service';
import { DebtsEntity } from '../../../model/debts-entity';
import { AppUtils } from '../../../util/other/app-utils';
import { AppComponent } from '../../../app.component';
import { InputImageComponent } from '../../../widgets/input-image/input-image.component';

@Component({
  selector: 'app-table-loan',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './table-loan.component.html',
  styleUrl: './table-loan.component.css',
})
export class TableLoanComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() showActions = new Observable<boolean>();
  @Input() groupId = '';
  @Input() reloadTrigger = new Observable<void>();
  private reloadSubscription?: Subscription;

  tableData$!: Observable<DebtsEntity[]>;
  displayedColumns: string[] = [];
  columnHeaders: { [key: string]: string } = {};
  pageSizeOptions = [5, 50, 100];
  isLoading = false;
  token = '';
  userUid = '';
  creditorList: string[] = [];

  dataSource = new MatTableDataSource<any>();
  actualDisplayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialog = inject(MatDialog);
  constructor(
    private loanGroupService: LoanGroupService,
    private authService: AuthService,
    private alertService: AlertService,
    private fileService: FileService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + '';
    this.userUid = this.authService.getUser()?.uid + '';


    this.displayedColumns = ['dateMaturity', 'amount', 'creditor'];
    this.columnHeaders = {
      dateMaturity: 'dateMaturity',
      amount: 'amount',
      creditor: 'creditor',
    };

    this.actualDisplayedColumns = this.showActions
      ? ['counter', ...this.displayedColumns, 'imagen', 'actions']
      : this.displayedColumns;

    this.loadData();
    this.reloadSubscription = this.reloadTrigger.subscribe(() => {
      this.loadData();
    });
  }

  ngOnDestroy() {
    if (this.reloadSubscription) {
      this.reloadSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.loanGroupService.setValuesPerField(this.groupId, 'creditor', this.token).subscribe((t) => (this.creditorList = t ? t : []));
    this.tableData$ = this.loanGroupService.list(this.groupId,this.token,1000,false);

    this.isLoading = true;
    this.tableData$.subscribe(
      (data) => {
        data.map((t) =>(t.dateMaturity = AppUtils.formatDate(t.dateMaturity).slice(0, 10)));
        this.dataSource.data = data;
        if (this.paginator) {
          this.paginator.firstPage();
        }
      },() => {},() => (this.isLoading = false)
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddRow() {
    const dialogRef = this.dialog.open(ModalWidgets, {
      data: { category: this.creditorList },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        AppComponent.setViewSpinner(true);
        const createDebt = (imageUrl: string) => {
          const debtsEntity: DebtsEntity = {
            id: '',
            date: '',
            description: result.description,
            amount: result.amount,
            creditor: result.creditor,
            dateMaturity: AppUtils.formatDate(result.dateMaturity).slice(0, 10),
            imageUrl: imageUrl,
            interestRate: result.interestRate,
          };
          this.loanGroupService.create(this.groupId, this.token, debtsEntity).subscribe((t) => {
              AppComponent.setViewSpinner(false);
              if (t.isSuccess) {
                this.loadData();
                this.alertService.successful('Added new expense');
              } else {
                this.alertService.warning('Error saving data');
              }
            });
        };
        if (result.file) {
          this.fileService.uploadFile2(result.file).url$.subscribe((url) => createDebt(url));
        } else {
          createDebt('https://cdn.pixabay.com/photo/2012/04/24/17/56/credit-40671_640.png');
        }
      }
    });
  }

  onEditRow(row: DebtsEntity) {
    const dialogRef = this.dialog.open(ModalWidgets, {
      data: { category: this.creditorList, bills: row },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        AppComponent.setViewSpinner(true);
        const updateDebt = (imageUrl: string) => {
          const updatedDebt: DebtsEntity = {
            ...row, // Mantener los datos existentes
            description: result.description,
            amount: result.amount,
            creditor: result.creditor,
            dateMaturity: AppUtils.formatDate(result.dateMaturity).slice(0, 10),
            imageUrl: imageUrl,
            interestRate: result.interestRate,
          };
          this.loanGroupService
            .update(this.groupId, updatedDebt.id, this.token, updatedDebt)
            .subscribe((t) => {
              AppComponent.setViewSpinner(false);
              if (t.isSuccess) {
                this.loadData();
                this.alertService.successful('Updated expense successfully');
              } else {
                this.alertService.warning('Error updating data');
              }
            });
        };

        if (result.file) {
          this.fileService
            .uploadFile2(result.file)
            .url$.subscribe((url) => updateDebt(url));
        } else {
          updateDebt(
            row.imageUrl ||
              'https://cdn.pixabay.com/photo/2012/04/24/17/56/credit-40671_640.png'
          );
        }
      }
    });
  }

  onDeleteRow(row: any) {
    this.alertService
      .question('Are you sure you want to delete this debt?')
      .then((result) => {
        if (result.isConfirmed) {
          AppComponent.setViewSpinner(true);
          this.loanGroupService
            .delete(this.groupId, row.id, this.token)
            .subscribe((t) => {
              AppComponent.setViewSpinner(false);
              if (t.isSuccess) {
                this.loadData();
                this.alertService.successful('Deleted debt');
              } else {
                this.alertService.warning('Error deleting data');
              }
            });
        }
      });
  }

  onImageRow(url: string, date: string) {
    this.modalService.VerModalImagen(
      url,
      'Loan Image in ' + this.formatDate(date)
    );
  }

  onInfoRow(row: any) {
    AppComponent.setViewSpinner(true);
    this.loanGroupService
      .getById(this.groupId, row.id, this.token)
      .subscribe((t) => {
        AppComponent.setViewSpinner(false);
        this.modalService.VerModalDebtsInfo(t);
      });
  }

  formatDate(date: string) {
    return AppUtils.formatDate(date);
  }

  onSortChange(sortState: Sort) {
    console.log('Sort changed', sortState);
  }

  onPageChange(pageEvent: PageEvent) {
    console.log('Page changed', pageEvent);
  }
}

@Component({
  selector: 'modal-debs',
  templateUrl: './modal-loan.html',
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
    InputImageComponent,
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
  urlImage: string = '';
  dateMaturity: string = '';
  interestRate: number = 0;
  file: File | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { category: string[]; payMethod: string[]; bills: DebtsEntity }
  ) {
    this.creditors = data.category;
    this.debts = data.bills;
    if (this.debts != undefined) {
      this.amount = this.debts.amount;
      this.selectedCreditor = this.debts.creditor;
      this.description = this.debts.description;
      this.dateMaturity = AppUtils.formatDate(this.debts.dateMaturity).slice(
        0,
        10
      );
      this.urlImage = this.debts.imageUrl;

      this.interestRate = this.debts.interestRate;
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
    return (
      this.amount != 0 &&
      this.interestRate != 0 &&
      this.selectedCreditor.trim() != '' &&
      this.selectedCreditor.trim() != 'Agregar nueva opción...'
    );
  }

  onPhotoChange(file: File) {
    this.file = file;
  }
}
