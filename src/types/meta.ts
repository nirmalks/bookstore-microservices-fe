export interface Meta {
  number: number;
  size: number;
  totalElements: number;
  last: boolean;
  totalPages: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
