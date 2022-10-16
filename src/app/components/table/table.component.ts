import {
  Component,
  ViewChild,
  OnChanges,
  AfterViewInit,
  AfterContentInit,
  Input,
  ContentChildren,
  QueryList,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import {
  MatColumnDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T>
  implements OnChanges, AfterViewInit, AfterContentInit
{
  @Input()
  dataSource!: MatTableDataSource<T>;

  @Input()
  displayedColumns: string[] = [];

  @ViewChild(MatTable, { static: true })
  table!: MatTable<T>;

  @ContentChildren(MatColumnDef)
  columns!: QueryList<MatColumnDef>;

  constructor(@Optional() private sort: MatSort) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataSource'].currentValue != null) {
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource != null) {
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterContentInit(): void {
    this.columns.forEach((columnDef) => this.table.addColumnDef(columnDef));
  }

  private sortingDataAccessor(row: T, matColumnDefId: string): string {
    const getProperty = (item: any, [first, ...rest]: string[]): string =>
      rest.length ? getProperty(item[first], rest) : item[first];
    return getProperty(row, matColumnDefId.split('.'));
  }
}
