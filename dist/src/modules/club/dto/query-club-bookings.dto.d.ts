export declare class QueryClubBookingsDto {
    search?: string;
    status?: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';
    from?: string;
    to?: string;
    page?: number;
    limit?: number;
}
