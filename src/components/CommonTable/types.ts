export type TableColumn<T = any> = {
  field: string;
  title: string;
  render?: (row: T) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
};

export type DropdownOption = {
  label: string;
  value: any;
};

export type TableApiResponse<T = any> = {
  data: T[];
  total: number;
};

export type TableProps<T = any> = {
  columns: TableColumn<T>[];
  api: (params: { search?: string; page: number; pageSize: number; filter?: any }) => Promise<TableApiResponse<T>>;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  searchPlaceholder?: string;
  dropdownOptions?: DropdownOption[];
  dropdownRender?: (option: DropdownOption) => React.ReactNode;
  dropdownOnChange?: (value: any) => void;
  filterLabel?: string;
}; 