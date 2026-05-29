import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ClubModel = runtime.Types.Result.DefaultSelection<Prisma.$ClubPayload>;
export type AggregateClub = {
    _count: ClubCountAggregateOutputType | null;
    _avg: ClubAvgAggregateOutputType | null;
    _sum: ClubSumAggregateOutputType | null;
    _min: ClubMinAggregateOutputType | null;
    _max: ClubMaxAggregateOutputType | null;
};
export type ClubAvgAggregateOutputType = {
    courtCount: number | null;
};
export type ClubSumAggregateOutputType = {
    courtCount: number | null;
};
export type ClubMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    courtCount: number | null;
    courtType: string | null;
    address: string | null;
    location: string | null;
    email: string | null;
    web: string | null;
    avatarUrl: string | null;
    approvalStatus: $Enums.ClubApprovalStatus | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ClubMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    courtCount: number | null;
    courtType: string | null;
    address: string | null;
    location: string | null;
    email: string | null;
    web: string | null;
    avatarUrl: string | null;
    approvalStatus: $Enums.ClubApprovalStatus | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ClubCountAggregateOutputType = {
    id: number;
    name: number;
    courtCount: number;
    courtType: number;
    address: number;
    location: number;
    email: number;
    web: number;
    avatarUrl: number;
    pricing: number;
    approvalStatus: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ClubAvgAggregateInputType = {
    courtCount?: true;
};
export type ClubSumAggregateInputType = {
    courtCount?: true;
};
export type ClubMinAggregateInputType = {
    id?: true;
    name?: true;
    courtCount?: true;
    courtType?: true;
    address?: true;
    location?: true;
    email?: true;
    web?: true;
    avatarUrl?: true;
    approvalStatus?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ClubMaxAggregateInputType = {
    id?: true;
    name?: true;
    courtCount?: true;
    courtType?: true;
    address?: true;
    location?: true;
    email?: true;
    web?: true;
    avatarUrl?: true;
    approvalStatus?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ClubCountAggregateInputType = {
    id?: true;
    name?: true;
    courtCount?: true;
    courtType?: true;
    address?: true;
    location?: true;
    email?: true;
    web?: true;
    avatarUrl?: true;
    pricing?: true;
    approvalStatus?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ClubAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClubWhereInput;
    orderBy?: Prisma.ClubOrderByWithRelationInput | Prisma.ClubOrderByWithRelationInput[];
    cursor?: Prisma.ClubWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ClubCountAggregateInputType;
    _avg?: ClubAvgAggregateInputType;
    _sum?: ClubSumAggregateInputType;
    _min?: ClubMinAggregateInputType;
    _max?: ClubMaxAggregateInputType;
};
export type GetClubAggregateType<T extends ClubAggregateArgs> = {
    [P in keyof T & keyof AggregateClub]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClub[P]> : Prisma.GetScalarType<T[P], AggregateClub[P]>;
};
export type ClubGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClubWhereInput;
    orderBy?: Prisma.ClubOrderByWithAggregationInput | Prisma.ClubOrderByWithAggregationInput[];
    by: Prisma.ClubScalarFieldEnum[] | Prisma.ClubScalarFieldEnum;
    having?: Prisma.ClubScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClubCountAggregateInputType | true;
    _avg?: ClubAvgAggregateInputType;
    _sum?: ClubSumAggregateInputType;
    _min?: ClubMinAggregateInputType;
    _max?: ClubMaxAggregateInputType;
};
export type ClubGroupByOutputType = {
    id: string;
    name: string;
    courtCount: number;
    courtType: string;
    address: string;
    location: string | null;
    email: string | null;
    web: string | null;
    avatarUrl: string | null;
    pricing: runtime.JsonValue;
    approvalStatus: $Enums.ClubApprovalStatus;
    createdBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: ClubCountAggregateOutputType | null;
    _avg: ClubAvgAggregateOutputType | null;
    _sum: ClubSumAggregateOutputType | null;
    _min: ClubMinAggregateOutputType | null;
    _max: ClubMaxAggregateOutputType | null;
};
type GetClubGroupByPayload<T extends ClubGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClubGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClubGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClubGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClubGroupByOutputType[P]>;
}>>;
export type ClubWhereInput = {
    AND?: Prisma.ClubWhereInput | Prisma.ClubWhereInput[];
    OR?: Prisma.ClubWhereInput[];
    NOT?: Prisma.ClubWhereInput | Prisma.ClubWhereInput[];
    id?: Prisma.UuidFilter<"Club"> | string;
    name?: Prisma.StringFilter<"Club"> | string;
    courtCount?: Prisma.IntFilter<"Club"> | number;
    courtType?: Prisma.StringFilter<"Club"> | string;
    address?: Prisma.StringFilter<"Club"> | string;
    location?: Prisma.StringNullableFilter<"Club"> | string | null;
    email?: Prisma.StringNullableFilter<"Club"> | string | null;
    web?: Prisma.StringNullableFilter<"Club"> | string | null;
    avatarUrl?: Prisma.StringNullableFilter<"Club"> | string | null;
    pricing?: Prisma.JsonFilter<"Club">;
    approvalStatus?: Prisma.EnumClubApprovalStatusFilter<"Club"> | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.UuidNullableFilter<"Club"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Club"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Club"> | Date | string;
    courts?: Prisma.CourtListRelationFilter;
};
export type ClubOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    courtCount?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    web?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    pricing?: Prisma.SortOrder;
    approvalStatus?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    courts?: Prisma.CourtOrderByRelationAggregateInput;
};
export type ClubWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ClubWhereInput | Prisma.ClubWhereInput[];
    OR?: Prisma.ClubWhereInput[];
    NOT?: Prisma.ClubWhereInput | Prisma.ClubWhereInput[];
    name?: Prisma.StringFilter<"Club"> | string;
    courtCount?: Prisma.IntFilter<"Club"> | number;
    courtType?: Prisma.StringFilter<"Club"> | string;
    address?: Prisma.StringFilter<"Club"> | string;
    location?: Prisma.StringNullableFilter<"Club"> | string | null;
    email?: Prisma.StringNullableFilter<"Club"> | string | null;
    web?: Prisma.StringNullableFilter<"Club"> | string | null;
    avatarUrl?: Prisma.StringNullableFilter<"Club"> | string | null;
    pricing?: Prisma.JsonFilter<"Club">;
    approvalStatus?: Prisma.EnumClubApprovalStatusFilter<"Club"> | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.UuidNullableFilter<"Club"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Club"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Club"> | Date | string;
    courts?: Prisma.CourtListRelationFilter;
}, "id">;
export type ClubOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    courtCount?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    web?: Prisma.SortOrderInput | Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrderInput | Prisma.SortOrder;
    pricing?: Prisma.SortOrder;
    approvalStatus?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ClubCountOrderByAggregateInput;
    _avg?: Prisma.ClubAvgOrderByAggregateInput;
    _max?: Prisma.ClubMaxOrderByAggregateInput;
    _min?: Prisma.ClubMinOrderByAggregateInput;
    _sum?: Prisma.ClubSumOrderByAggregateInput;
};
export type ClubScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClubScalarWhereWithAggregatesInput | Prisma.ClubScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClubScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClubScalarWhereWithAggregatesInput | Prisma.ClubScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Club"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Club"> | string;
    courtCount?: Prisma.IntWithAggregatesFilter<"Club"> | number;
    courtType?: Prisma.StringWithAggregatesFilter<"Club"> | string;
    address?: Prisma.StringWithAggregatesFilter<"Club"> | string;
    location?: Prisma.StringNullableWithAggregatesFilter<"Club"> | string | null;
    email?: Prisma.StringNullableWithAggregatesFilter<"Club"> | string | null;
    web?: Prisma.StringNullableWithAggregatesFilter<"Club"> | string | null;
    avatarUrl?: Prisma.StringNullableWithAggregatesFilter<"Club"> | string | null;
    pricing?: Prisma.JsonWithAggregatesFilter<"Club">;
    approvalStatus?: Prisma.EnumClubApprovalStatusWithAggregatesFilter<"Club"> | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.UuidNullableWithAggregatesFilter<"Club"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Club"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Club"> | Date | string;
};
export type ClubCreateInput = {
    id?: string;
    name: string;
    courtCount?: number;
    courtType: string;
    address: string;
    location?: string | null;
    email?: string | null;
    web?: string | null;
    avatarUrl?: string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: $Enums.ClubApprovalStatus;
    createdBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    courts?: Prisma.CourtCreateNestedManyWithoutClubInput;
};
export type ClubUncheckedCreateInput = {
    id?: string;
    name: string;
    courtCount?: number;
    courtType: string;
    address: string;
    location?: string | null;
    email?: string | null;
    web?: string | null;
    avatarUrl?: string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: $Enums.ClubApprovalStatus;
    createdBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    courts?: Prisma.CourtUncheckedCreateNestedManyWithoutClubInput;
};
export type ClubUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    courtCount?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    web?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: Prisma.EnumClubApprovalStatusFieldUpdateOperationsInput | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    courts?: Prisma.CourtUpdateManyWithoutClubNestedInput;
};
export type ClubUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    courtCount?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    web?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: Prisma.EnumClubApprovalStatusFieldUpdateOperationsInput | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    courts?: Prisma.CourtUncheckedUpdateManyWithoutClubNestedInput;
};
export type ClubCreateManyInput = {
    id?: string;
    name: string;
    courtCount?: number;
    courtType: string;
    address: string;
    location?: string | null;
    email?: string | null;
    web?: string | null;
    avatarUrl?: string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: $Enums.ClubApprovalStatus;
    createdBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ClubUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    courtCount?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    web?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: Prisma.EnumClubApprovalStatusFieldUpdateOperationsInput | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClubUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    courtCount?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    web?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: Prisma.EnumClubApprovalStatusFieldUpdateOperationsInput | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClubCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    courtCount?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    web?: Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrder;
    pricing?: Prisma.SortOrder;
    approvalStatus?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ClubAvgOrderByAggregateInput = {
    courtCount?: Prisma.SortOrder;
};
export type ClubMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    courtCount?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    web?: Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrder;
    approvalStatus?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ClubMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    courtCount?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    web?: Prisma.SortOrder;
    avatarUrl?: Prisma.SortOrder;
    approvalStatus?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ClubSumOrderByAggregateInput = {
    courtCount?: Prisma.SortOrder;
};
export type ClubScalarRelationFilter = {
    is?: Prisma.ClubWhereInput;
    isNot?: Prisma.ClubWhereInput;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type EnumClubApprovalStatusFieldUpdateOperationsInput = {
    set?: $Enums.ClubApprovalStatus;
};
export type ClubCreateNestedOneWithoutCourtsInput = {
    create?: Prisma.XOR<Prisma.ClubCreateWithoutCourtsInput, Prisma.ClubUncheckedCreateWithoutCourtsInput>;
    connectOrCreate?: Prisma.ClubCreateOrConnectWithoutCourtsInput;
    connect?: Prisma.ClubWhereUniqueInput;
};
export type ClubUpdateOneRequiredWithoutCourtsNestedInput = {
    create?: Prisma.XOR<Prisma.ClubCreateWithoutCourtsInput, Prisma.ClubUncheckedCreateWithoutCourtsInput>;
    connectOrCreate?: Prisma.ClubCreateOrConnectWithoutCourtsInput;
    upsert?: Prisma.ClubUpsertWithoutCourtsInput;
    connect?: Prisma.ClubWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ClubUpdateToOneWithWhereWithoutCourtsInput, Prisma.ClubUpdateWithoutCourtsInput>, Prisma.ClubUncheckedUpdateWithoutCourtsInput>;
};
export type ClubCreateWithoutCourtsInput = {
    id?: string;
    name: string;
    courtCount?: number;
    courtType: string;
    address: string;
    location?: string | null;
    email?: string | null;
    web?: string | null;
    avatarUrl?: string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: $Enums.ClubApprovalStatus;
    createdBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ClubUncheckedCreateWithoutCourtsInput = {
    id?: string;
    name: string;
    courtCount?: number;
    courtType: string;
    address: string;
    location?: string | null;
    email?: string | null;
    web?: string | null;
    avatarUrl?: string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: $Enums.ClubApprovalStatus;
    createdBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ClubCreateOrConnectWithoutCourtsInput = {
    where: Prisma.ClubWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClubCreateWithoutCourtsInput, Prisma.ClubUncheckedCreateWithoutCourtsInput>;
};
export type ClubUpsertWithoutCourtsInput = {
    update: Prisma.XOR<Prisma.ClubUpdateWithoutCourtsInput, Prisma.ClubUncheckedUpdateWithoutCourtsInput>;
    create: Prisma.XOR<Prisma.ClubCreateWithoutCourtsInput, Prisma.ClubUncheckedCreateWithoutCourtsInput>;
    where?: Prisma.ClubWhereInput;
};
export type ClubUpdateToOneWithWhereWithoutCourtsInput = {
    where?: Prisma.ClubWhereInput;
    data: Prisma.XOR<Prisma.ClubUpdateWithoutCourtsInput, Prisma.ClubUncheckedUpdateWithoutCourtsInput>;
};
export type ClubUpdateWithoutCourtsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    courtCount?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    web?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: Prisma.EnumClubApprovalStatusFieldUpdateOperationsInput | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClubUncheckedUpdateWithoutCourtsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    courtCount?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.StringFieldUpdateOperationsInput | string;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    web?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    avatarUrl?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricing?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    approvalStatus?: Prisma.EnumClubApprovalStatusFieldUpdateOperationsInput | $Enums.ClubApprovalStatus;
    createdBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ClubCountOutputType = {
    courts: number;
};
export type ClubCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courts?: boolean | ClubCountOutputTypeCountCourtsArgs;
};
export type ClubCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubCountOutputTypeSelect<ExtArgs> | null;
};
export type ClubCountOutputTypeCountCourtsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtWhereInput;
};
export type ClubSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    courtCount?: boolean;
    courtType?: boolean;
    address?: boolean;
    location?: boolean;
    email?: boolean;
    web?: boolean;
    avatarUrl?: boolean;
    pricing?: boolean;
    approvalStatus?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    courts?: boolean | Prisma.Club$courtsArgs<ExtArgs>;
    _count?: boolean | Prisma.ClubCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["club"]>;
export type ClubSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    courtCount?: boolean;
    courtType?: boolean;
    address?: boolean;
    location?: boolean;
    email?: boolean;
    web?: boolean;
    avatarUrl?: boolean;
    pricing?: boolean;
    approvalStatus?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["club"]>;
export type ClubSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    courtCount?: boolean;
    courtType?: boolean;
    address?: boolean;
    location?: boolean;
    email?: boolean;
    web?: boolean;
    avatarUrl?: boolean;
    pricing?: boolean;
    approvalStatus?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["club"]>;
export type ClubSelectScalar = {
    id?: boolean;
    name?: boolean;
    courtCount?: boolean;
    courtType?: boolean;
    address?: boolean;
    location?: boolean;
    email?: boolean;
    web?: boolean;
    avatarUrl?: boolean;
    pricing?: boolean;
    approvalStatus?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ClubOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "courtCount" | "courtType" | "address" | "location" | "email" | "web" | "avatarUrl" | "pricing" | "approvalStatus" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["club"]>;
export type ClubInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courts?: boolean | Prisma.Club$courtsArgs<ExtArgs>;
    _count?: boolean | Prisma.ClubCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ClubIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type ClubIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $ClubPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Club";
    objects: {
        courts: Prisma.$CourtPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        courtCount: number;
        courtType: string;
        address: string;
        location: string | null;
        email: string | null;
        web: string | null;
        avatarUrl: string | null;
        pricing: runtime.JsonValue;
        approvalStatus: $Enums.ClubApprovalStatus;
        createdBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["club"]>;
    composites: {};
};
export type ClubGetPayload<S extends boolean | null | undefined | ClubDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClubPayload, S>;
export type ClubCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClubFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClubCountAggregateInputType | true;
};
export interface ClubDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Club'];
        meta: {
            name: 'Club';
        };
    };
    findUnique<T extends ClubFindUniqueArgs>(args: Prisma.SelectSubset<T, ClubFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ClubFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClubFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ClubFindFirstArgs>(args?: Prisma.SelectSubset<T, ClubFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ClubFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClubFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ClubFindManyArgs>(args?: Prisma.SelectSubset<T, ClubFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ClubCreateArgs>(args: Prisma.SelectSubset<T, ClubCreateArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ClubCreateManyArgs>(args?: Prisma.SelectSubset<T, ClubCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ClubCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ClubCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ClubDeleteArgs>(args: Prisma.SelectSubset<T, ClubDeleteArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ClubUpdateArgs>(args: Prisma.SelectSubset<T, ClubUpdateArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ClubDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClubDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ClubUpdateManyArgs>(args: Prisma.SelectSubset<T, ClubUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ClubUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ClubUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ClubUpsertArgs>(args: Prisma.SelectSubset<T, ClubUpsertArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ClubCountArgs>(args?: Prisma.Subset<T, ClubCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClubCountAggregateOutputType> : number>;
    aggregate<T extends ClubAggregateArgs>(args: Prisma.Subset<T, ClubAggregateArgs>): Prisma.PrismaPromise<GetClubAggregateType<T>>;
    groupBy<T extends ClubGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClubGroupByArgs['orderBy'];
    } : {
        orderBy?: ClubGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClubGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClubGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ClubFieldRefs;
}
export interface Prisma__ClubClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    courts<T extends Prisma.Club$courtsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Club$courtsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ClubFieldRefs {
    readonly id: Prisma.FieldRef<"Club", 'String'>;
    readonly name: Prisma.FieldRef<"Club", 'String'>;
    readonly courtCount: Prisma.FieldRef<"Club", 'Int'>;
    readonly courtType: Prisma.FieldRef<"Club", 'String'>;
    readonly address: Prisma.FieldRef<"Club", 'String'>;
    readonly location: Prisma.FieldRef<"Club", 'String'>;
    readonly email: Prisma.FieldRef<"Club", 'String'>;
    readonly web: Prisma.FieldRef<"Club", 'String'>;
    readonly avatarUrl: Prisma.FieldRef<"Club", 'String'>;
    readonly pricing: Prisma.FieldRef<"Club", 'Json'>;
    readonly approvalStatus: Prisma.FieldRef<"Club", 'ClubApprovalStatus'>;
    readonly createdBy: Prisma.FieldRef<"Club", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Club", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Club", 'DateTime'>;
}
export type ClubFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    where: Prisma.ClubWhereUniqueInput;
};
export type ClubFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    where: Prisma.ClubWhereUniqueInput;
};
export type ClubFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    where?: Prisma.ClubWhereInput;
    orderBy?: Prisma.ClubOrderByWithRelationInput | Prisma.ClubOrderByWithRelationInput[];
    cursor?: Prisma.ClubWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClubScalarFieldEnum | Prisma.ClubScalarFieldEnum[];
};
export type ClubFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    where?: Prisma.ClubWhereInput;
    orderBy?: Prisma.ClubOrderByWithRelationInput | Prisma.ClubOrderByWithRelationInput[];
    cursor?: Prisma.ClubWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClubScalarFieldEnum | Prisma.ClubScalarFieldEnum[];
};
export type ClubFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    where?: Prisma.ClubWhereInput;
    orderBy?: Prisma.ClubOrderByWithRelationInput | Prisma.ClubOrderByWithRelationInput[];
    cursor?: Prisma.ClubWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClubScalarFieldEnum | Prisma.ClubScalarFieldEnum[];
};
export type ClubCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClubCreateInput, Prisma.ClubUncheckedCreateInput>;
};
export type ClubCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ClubCreateManyInput | Prisma.ClubCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClubCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    data: Prisma.ClubCreateManyInput | Prisma.ClubCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClubUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClubUpdateInput, Prisma.ClubUncheckedUpdateInput>;
    where: Prisma.ClubWhereUniqueInput;
};
export type ClubUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ClubUpdateManyMutationInput, Prisma.ClubUncheckedUpdateManyInput>;
    where?: Prisma.ClubWhereInput;
    limit?: number;
};
export type ClubUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClubUpdateManyMutationInput, Prisma.ClubUncheckedUpdateManyInput>;
    where?: Prisma.ClubWhereInput;
    limit?: number;
};
export type ClubUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    where: Prisma.ClubWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClubCreateInput, Prisma.ClubUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ClubUpdateInput, Prisma.ClubUncheckedUpdateInput>;
};
export type ClubDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
    where: Prisma.ClubWhereUniqueInput;
};
export type ClubDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClubWhereInput;
    limit?: number;
};
export type Club$courtsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
    where?: Prisma.CourtWhereInput;
    orderBy?: Prisma.CourtOrderByWithRelationInput | Prisma.CourtOrderByWithRelationInput[];
    cursor?: Prisma.CourtWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtScalarFieldEnum | Prisma.CourtScalarFieldEnum[];
};
export type ClubDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClubSelect<ExtArgs> | null;
    omit?: Prisma.ClubOmit<ExtArgs> | null;
    include?: Prisma.ClubInclude<ExtArgs> | null;
};
export {};
