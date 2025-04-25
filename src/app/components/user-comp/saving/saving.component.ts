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
import { SavingService } from '../../../service/saving.service';
import { SavingsEntity } from '../../../model/savings-entity';

@Component({
  selector: 'app-saving',
  standalone: true,
  imports: [NgxChartsModule, PieChartComponent, MatButtonModule, MatDialogModule],
  templateUrl: './saving.component.html',
  styleUrls: ['./saving.component.css']
})
export class SavingComponent implements OnInit {

  protected userUid = "";
  protected token = "";
  protected limit = 100;
  isLoading = false;
  savingList: SavingsEntity[] = [];
  accountPlatformList: string[] = [];
  customSingle: { name: string, value: number }[] = [];
  readonly dialog = inject(MatDialog);

  constructor(
    private savingService: SavingService,
    private authService: AuthService,
    private alertService: AlertService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";

    this.savingService.setValuesPerField(this.userUid, "accountPlatform", this.token).subscribe(t => this.accountPlatformList = t ? t : []);

    this.loadSavings();
  }

  loadSavings(usingCache: boolean = true): void {
    this.isLoading = true;

    this.savingService.list(this.userUid, this.token, this.limit, usingCache).subscribe(
      (data) => {
        this.savingList = data;
        this.updateCustomSingle();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading savings', error);
        this.isLoading = false;
      }
    );
  }

  formatDate(timestamp: number | string) {
    return AppUtils.formatDate(timestamp);
  }

  updateCustomSingle(): void {
    this.customSingle = [];
    this.savingList.forEach(saving => {
      const existingPlatform = this.customSingle.find(item => item.name === saving.accountPlatform);
      if (existingPlatform) {
        existingPlatform.value += saving.amount;
      } else {
        this.customSingle.push({ name: saving.accountPlatform, value: saving.amount });
      }
    });
  }

  add() {
    const dialogRef = this.dialog.open(ModalSaving, {
      data: {
        accountPlatform: this.accountPlatformList,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let savingEntity: SavingsEntity = {
          id: '',
          date: AppUtils.getCurrentDate(),
          description: result.description,
          amount: result.amount,
          accountPlatform: result.accountPlatform
        }

        AppComponent.setViewSpinner(true);
        this.savingService.create(this.userUid, this.token, savingEntity).subscribe(t => {
          AppComponent.setViewSpinner(false);
          if (t.isSuccess) {
            this.alertService.successful("add new saving");
            this.loadSavings(false);
          }
          else {
            this.alertService.warning("Error in saving data")
          }
        });
      }
    });
  }

  update(savingId: string) {
    AppComponent.setViewSpinner(true);
    this.savingService.getById(this.userUid, savingId, this.token).subscribe(saving => {
      AppComponent.setViewSpinner(false);
      const dialogRef = this.dialog.open(ModalSaving, {
        data: {
          accountPlatform: this.accountPlatformList,
          saving: saving
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != undefined) {
          let savingEntity: SavingsEntity = {
            id: '',
            date: AppUtils.getCurrentDate(),
            description: result.description,
            amount: result.amount,
            accountPlatform: result.accountPlatform
          }

          AppComponent.setViewSpinner(true);
          this.savingService.update(this.userUid, savingId, this.token, savingEntity).subscribe(t => {
            AppComponent.setViewSpinner(false);
            if (t.isSuccess) {
              this.alertService.successful("update saving");
              this.loadSavings(false);
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
    this.savingService.delete(this.userUid, id, this.token).subscribe(t => {
      AppComponent.setViewSpinner(false);
      if (t.isSuccess) {
        this.alertService.successful("delete saving");
        this.loadSavings(false);
      }
      else {
        this.alertService.warning("Error in deleting data")
      }
    })
  }

  info(id: string) {
    AppComponent.setViewSpinner(true);
    this.savingService.getById(this.userUid, id, this.token).subscribe(t => {
      AppComponent.setViewSpinner(false);
      this.modalService.VerModalSavingInfo(t);
    });
  }

  onSelectionChanged(selection: { name: string, value: string }) {
    this.customSingle = [];
    this.savingList.forEach(saving => {
      let selectValue: string;

      switch (selection.name) {
        case 'accountPlatform':
          selectValue = saving.accountPlatform;
          break;
        case 'date':
          selectValue = this.formatDate(saving.date).slice(0, 10);
          break;
        default:
          selectValue = saving.accountPlatform;
          break;
      }

      const existingPlatform = this.customSingle.find(item => item.name === selectValue);
      if (existingPlatform) {
        existingPlatform.value += saving.amount;
      } else {
        this.customSingle.push({ name: selectValue, value: saving.amount });
      }
    });
  }
}


@Component({
  selector: 'modal-saving',
  templateUrl: './modal-saving.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSaving {

  accountPlatformList: string[];
  saving: SavingsEntity;
  selectedAccountPlatform: string = '';
  newAccountPlatform: string = '';
  isEditingAccountPlatform: boolean = false;
  amount: number = 0;
  description: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { accountPlatform: string[], saving: SavingsEntity }
  ) {
    this.accountPlatformList = data.accountPlatform;
    this.saving = data.saving;
    if (this.saving != undefined) {
      this.amount = this.saving.amount;
      this.selectedAccountPlatform = this.saving.accountPlatform;
      this.description = this.saving.description;
    }
  }

  getCurrentDate() {
    return AppUtils.getCurrentDate();
  }

  onSelectionChange(event: any) {
    if (event.value === 'Agregar nueva opción...') {
      this.isEditingAccountPlatform = true;
      this.newAccountPlatform = '';
    } else {
      this.isEditingAccountPlatform = false;
    }
  }

  addNewOption() {
    this.selectedAccountPlatform = 'Agregar nueva opción...';
    this.isEditingAccountPlatform = true;
    this.newAccountPlatform = '';
  }

  saveOption() {
    if (this.newAccountPlatform.trim()) {
      this.accountPlatformList.push(this.newAccountPlatform);
      this.selectedAccountPlatform = this.newAccountPlatform;
      this.isEditingAccountPlatform = false;
    }
  }

  isDisabled() {
    return this.amount != 0 && (this.selectedAccountPlatform.trim() != "" && this.selectedAccountPlatform.trim() != "Agregar nueva opción...");
  }
}
