export interface PaginationMeta {
  total: number;
  page: number;
  lastPage: number;
}

export class ModelResponse<T> {
  status: number;
  data: T;
  meta?: PaginationMeta; // <-- opcional para respuestas con paginación

  constructor(status: number, data: T, meta?: PaginationMeta) {
    this.status = status;
    this.data = data;
    if (meta) this.meta = meta;
  }
}
