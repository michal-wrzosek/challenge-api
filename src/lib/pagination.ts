import { PaginateResult } from "mongoose";

export interface Pagination {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  prevPage: number | null;
  nextPage: number | null;
}

export const serializePagination = <T>(
  results: PaginateResult<T>
): Pagination => ({
  totalDocs: results.totalDocs as number,
  limit: results.limit,
  page: results.page,
  totalPages: results.totalPages as number,
  prevPage: results.prevPage as number | null,
  nextPage: results.nextPage as number | null,
});
