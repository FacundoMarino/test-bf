import { DayPricingDto } from './day-pricing.dto';
export declare class CreateClubDto {
    name: string;
    courtCount: number;
    courtType: string;
    address: string;
    location?: string;
    email?: string;
    web?: string;
    avatarUrl?: string;
    pricing: DayPricingDto[];
}
