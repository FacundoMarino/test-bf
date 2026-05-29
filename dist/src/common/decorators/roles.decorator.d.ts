export declare const ROLES_KEY = "roles";
export type Role = string;
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
