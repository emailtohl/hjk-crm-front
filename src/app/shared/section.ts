/**
 * 分页对象
 */
export class Section<T> {
    public content: Array<T>;
    public totalElements: number;
    public pageSize: number;
    public totalPages: number;
    public pageNumber: number;
    public offset: number;
}
