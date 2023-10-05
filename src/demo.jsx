import * as React from 'react';
import { Glyphicon } from 'react-bootstrap';

import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import {
  SortingState, SelectionState, FilteringState, PagingState, GroupingState, RowDetailState,
  IntegratedFiltering, IntegratedGrouping, IntegratedPaging, IntegratedSorting, IntegratedSelection,
} from '@devexpress/dx-react-grid';
import {
  Grid, Table, TableBandHeader, TableHeaderRow,
  TableFilterRow, TableSelection, TableGroupRow, TableRowDetail,
  GroupingPanel, PagingPanel, DragDropProvider, TableColumnReordering, TableColumnResizing, Toolbar,
} from '@devexpress/dx-react-grid-bootstrap3';

import { generateRows, employeeValues, employeeTaskValues } from './demo-data/generator';


const columns = [
  { name: 'prefix', title: 'Title' },
  { name: 'firstName', title: 'First Name' },
  { name: 'lastName', title: 'Last Name' },
  { name: 'birthDate', title: 'Birth Date' },
  { name: 'position', title: 'Position' },
  { name: 'state', title: 'State' },
];
const detailColumns = [
  { name: 'avatar', title: 'Avatar', getCellValue: row => <img src={row.avatar} alt="Avatar" /> },
  { name: 'subject', title: 'Subject' },
  { name: 'startDate', title: 'Start Date' },
  { name: 'dueDate', title: 'Due Date' },
  { name: 'priority', title: 'Priority' },
  { name: 'status', title: 'Status' },
];
const tableDetailColumnExtensions = [
  { columnName: 'startDate', width: 115 },
  { columnName: 'dueDate', width: 115 },
  { columnName: 'priority', width: 100 },
  { columnName: 'status', width: 125 },
];
const columnBands = [
  {
            columnName: 'firstName' ,
            columnName: 'lastName' ,
            columnName: 'birthDate' ,
  },
  { 
    columnName: 'state',
    columnName: 'position',
  },
];

export const GRID_STATE_CHANGE_ACTION = 'GRID_STATE_CHANGE';

const GridDetailContainer = ({ row }) => (
  <div style={{ margin: 20 }}>
    <div>
      <h5>
        <strong>
          {row.firstName}
          {' '}
          {row.lastName}
          &apos;s Tasks:
        </strong>
      </h5>
    </div>
    <div>
      <Grid
        rows={row.tasks}
        columns={detailColumns}
      >
        <Table
          columnExtensions={tableDetailColumnExtensions}
        />
        <TableHeaderRow />
      </Grid>
    </div>
  </div>
);

const ReduxGridDetailContainer = connect(state => state)(GridDetailContainer);

const GridContainer = ({
  rows,
  sorting,
  onSortingChange,
  selection,
  onSelectionChange,
  expandedRowIds,
  onExpandedRowIdsChange,
  grouping,
  onGroupingChange,
  expandedGroups,
  onExpandedGroupsChange,
  filters,
  onFiltersChange,
  currentPage,
  onCurrentPageChange,
  pageSize,
  onPageSizeChange,
  pageSizes,
  columnOrder,
  onColumnOrderChange,
  columnWidths,
  onColumnWidthsChange,
}) => (
  <div>
    <Grid
      rows={rows}
      columns={columns}
    >
      <FilteringState
        filters={filters}
        onFiltersChange={onFiltersChange}
      />
      <SortingState
        sorting={sorting}
        onSortingChange={onSortingChange}
      />
      <GroupingState
        grouping={grouping}
        onGroupingChange={onGroupingChange}
        expandedGroups={expandedGroups}
        onExpandedGroupsChange={onExpandedGroupsChange}
      />
      <PagingState
        currentPage={currentPage}
        onCurrentPageChange={onCurrentPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
      />
      <RowDetailState
        expandedRowIds={expandedRowIds}
        onExpandedRowIdsChange={onExpandedRowIdsChange}
      />
      <SelectionState
        selection={selection}
        onSelectionChange={onSelectionChange}
      />

      <IntegratedFiltering />
      <IntegratedSorting />
      <IntegratedGrouping />
      <IntegratedPaging />
      <IntegratedSelection />

      <DragDropProvider />

      <Table />

      <TableColumnResizing
        columnWidths={columnWidths}
        onColumnWidthsChange={onColumnWidthsChange}
      />
      <TableHeaderRow showSortingControls />
      <TableColumnReordering
        order={columnOrder}
        onOrderChange={onColumnOrderChange}
      />

      <TableSelection showSelectAll />
      <TableFilterRow />
      <TableRowDetail
        contentComponent={ReduxGridDetailContainer}
      />
      <TableGroupRow />
      <Toolbar />
      <GroupingPanel showSortingControls />
      <PagingPanel
        pageSizes={pageSizes}
      />
      <TableBandHeader
        columnBands={columnBands}
      />
    </Grid>
  </div>
);

const gridInitialState = {
  rows: generateRows({
    columnValues: {
      ...employeeValues,
      tasks: ({ random }) => generateRows({
        columnValues: employeeTaskValues,
        length: Math.floor(random() * 1) + 1,
        random,
      }),
    },
    length: 40,
  }),
  sorting: [],
  grouping: [],
  expandedGroups: [],
  selection: [],
  expandedRowIds: [1],
  filters: [],
  currentPage: 0,
  pageSize: 10,
  pageSizes: [5, 10, 15],
  columnOrder: ['prefix', 'firstName', 'lastName', 'birthDate', 'position', 'state'],
  columnWidths: [
    { columnName: 'prefix', width: 70 },
    { columnName: 'firstName', width: 220 },
    { columnName: 'lastName', width: 220 },
    { columnName: 'position', width: 240 },
    { columnName: 'state', width: 220 },
    { columnName: 'birthDate', width: 220 },
  ],
};

const gridReducer = (state = gridInitialState, action) => {
  if (action.type === GRID_STATE_CHANGE_ACTION) {
    return {
      ...state,
      [action.partialStateName]: action.partialStateValue,
    };
  }
  return state;
};

export const createGridAction = (partialStateName, partialStateValue) => ({
  type: GRID_STATE_CHANGE_ACTION,
  partialStateName,
  partialStateValue,
});

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => ({
  onSortingChange: sorting => dispatch(createGridAction('sorting', sorting)),
  onSelectionChange: selection => dispatch(createGridAction('selection', selection)),
  onExpandedRowIdsChange: expandedRowIds => dispatch(createGridAction('expandedRowIds', expandedRowIds)),
  onGroupingChange: grouping => dispatch(createGridAction('grouping', grouping)),
  onExpandedGroupsChange: expandedGroups => dispatch(createGridAction('expandedGroups', expandedGroups)),
  onFiltersChange: filters => dispatch(createGridAction('filters', filters)),
  onCurrentPageChange: currentPage => dispatch(createGridAction('currentPage', currentPage)),
  onPageSizeChange: pageSize => dispatch(createGridAction('pageSize', pageSize)),
  onColumnOrderChange: order => dispatch(createGridAction('columnOrder', order)),
  onColumnWidthsChange: widths => dispatch(createGridAction('columnWidths', widths)),
});

const ReduxGridContainer = connect(mapStateToProps, mapDispatchToProps)(GridContainer);

const store = createStore(
  gridReducer,
  // Enabling Redux DevTools Extension (https://github.com/zalmoxisus/redux-devtools-extension)
  // eslint-disable-next-line no-underscore-dangle
  typeof window !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : undefined,
);

export default () => (
  <Provider store={store}>
    <ReduxGridContainer />
  </Provider>
);