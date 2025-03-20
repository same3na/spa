export interface PagingResponse <T>{
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}