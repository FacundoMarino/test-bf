import { DayPricingDto } from './day-pricing.dto';
export declare class UpdateClubDto {
    name?: string;
    courtCount?: number;
    courtType?: string;
    address?: string;
    location?: string;
    email?: string;
    web?: string;
    pricing?: DayPricingDto[];
    avatarUrl?: string;
}
