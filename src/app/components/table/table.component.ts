import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  Input,
  ContentChildren,
  QueryList,
  Optional,
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
  implements OnInit, AfterViewInit, AfterContentInit
{
  @Input()
  dataSource!: MatTableDataSource<T>;

  @Input()
  displayedColumns: string[] = ['position'];
  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;

  constructor(@Optional() private sort: MatSort) {}

  ngOnInit(): void {
    this.dataSource.sortingDataAccessor = this.sortingDataAccessor;
    this.dataSource.sort = this.sort;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngAfterContentInit() {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
  }

  private sortingDataAccessor(row: T, matColumnDefId: string): string {
    const getProperty = (item: any, [first, ...rest]: string[]): string =>
      rest.length ? getProperty(item[first], rest) : item[first];
    return getProperty(row, matColumnDefId.split('.'));
  }
}
