import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../../service/expense.service';
import { AuthService } from '../../../service/auth.service';
import { BillsEntity } from '../../../model/bills-entity';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css'
})
export class ExpenseComponent implements OnInit {
  protected userUid = "";
  protected token = "";
  protected limit = 10;

  isLoading = false;

  expenseList: BillsEntity[] | undefined = []
  constructor(
    private expenseService: ExpenseService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userUid = this.authService.getUser()?.uid + "";
    this.token = this.authService.getUser()?.stsTokenManager.accessToken + "";

    this.loadBills();
  }

  loadBills(): void {
    this.isLoading = true;

    this.expenseService.list(this.userUid, this.limit, this.token).subscribe(
      (data) => {
        this.expenseList = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading bills', error);
        this.isLoading = false;
      }
    );
  }

  formatDate(timestamp: number|string) {
    const date = new Date(timestamp);
    return date.toISOString().replace("T", " ").split(".")[0];
  }


}
