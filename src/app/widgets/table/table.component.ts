// table.component.ts
import { Component, Input, OnInit, AfterViewInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-table',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent<T extends { [key: string]: any }> implements OnInit, AfterViewInit {
  @Input() tableData$!: Observable<T[]>;
  @Input() displayedColumns: string[] = [];
  @Input() columnHeaders: { [key: string]: string } = {};
  @Input() showActions = new Observable<boolean>();
  @Input() pageSizeOptions = [5, 10, 20];
  @Input() isLoading = false;

  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() info = new EventEmitter<T>();
  @Output() add = new EventEmitter<T>();
  @Output() accept = new EventEmitter<T>();
  @Output() reject = new EventEmitter<T>();
  @Output() tableUpdate = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<Sort>();
  @Output() pageChange = new EventEmitter<PageEvent>();

  dataSource = new MatTableDataSource<T>();
  actualDisplayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.actualDisplayedColumns = this.showActions
      ? [...this.displayedColumns, 'actions']
      : this.displayedColumns;

    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {
    this.isLoading = true;
    this.tableData$
      .pipe(
        catchError(() => of([])),
        finalize(() => this.isLoading = false)
      )
      .subscribe(data => {
        this.dataSource.data = data;
        // Si los datos cambian y estamos en una página que ya no existe, volver a la primera
        if (this.paginator && this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddRow() {
    const newRow: T = {} as T; // Crear un nuevo objeto vacío
    this.add.emit(newRow);
  }

  onEditRow(row: T) {
    console.log('Edit row clicked', row);

    this.edit.emit(row);
  }

  onDeleteRow(row: T) {
    this.delete.emit(row);
  }

  onInfoRow(row: T) {
    this.info.emit(row);
  }

  onAcceptRow(row: T) {
    this.accept.emit(row);
  }

  onTableUpdate(row: T) {
    console.log("TABLE UPDATE", row);

    this.tableUpdate.emit(row);
  }

  onRejectRow(row: T) {
    this.reject.emit(row);
  }

  onSortChange(sortState: Sort) {
    this.sortChange.emit(sortState);
  }

  onPageChange(pageEvent: PageEvent) {
    this.pageChange.emit(pageEvent);
  }
}
