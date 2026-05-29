import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CourtCustomSlotModel = runtime.Types.Result.DefaultSelection<Prisma.$CourtCustomSlotPayload>;
export type AggregateCourtCustomSlot = {
    _count: CourtCustomSlotCountAggregateOutputType | null;
    _avg: CourtCustomSlotAvgAggregateOutputType | null;
    _sum: CourtCustomSlotSumAggregateOutputType | null;
    _min: CourtCustomSlotMinAggregateOutputType | null;
    _max: CourtCustomSlotMaxAggregateOutputType | null;
};
export type CourtCustomSlotAvgAggregateOutputType = {
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    price: number | null;
};
export type CourtCustomSlotSumAggregateOutputType = {
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    price: number | null;
};
export type CourtCustomSlotMinAggregateOutputType = {
    id: string | null;
    courtId: string | null;
    date: Date | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    price: number | null;
    note: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtCustomSlotMaxAggregateOutputType = {
    id: string | null;
    courtId: string | null;
    date: Date | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    price: number | null;
    note: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtCustomSlotCountAggregateOutputType = {
    id: number;
    courtId: number;
    date: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price: number;
    note: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CourtCustomSlotAvgAggregateInputType = {
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    price?: true;
};
export type CourtCustomSlotSumAggregateInputType = {
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    price?: true;
};
export type CourtCustomSlotMinAggregateInputType = {
    id?: true;
    courtId?: true;
    date?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    price?: true;
    note?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtCustomSlotMaxAggregateInputType = {
    id?: true;
    courtId?: true;
    date?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    price?: true;
    note?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtCustomSlotCountAggregateInputType = {
    id?: true;
    courtId?: true;
    date?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    price?: true;
    note?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CourtCustomSlotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtCustomSlotWhereInput;
    orderBy?: Prisma.CourtCustomSlotOrderByWithRelationInput | Prisma.CourtCustomSlotOrderByWithRelationInput[];
    cursor?: Prisma.CourtCustomSlotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourtCustomSlotCountAggregateInputType;
    _avg?: CourtCustomSlotAvgAggregateInputType;
    _sum?: CourtCustomSlotSumAggregateInputType;
    _min?: CourtCustomSlotMinAggregateInputType;
    _max?: CourtCustomSlotMaxAggregateInputType;
};
export type GetCourtCustomSlotAggregateType<T extends CourtCustomSlotAggregateArgs> = {
    [P in keyof T & keyof AggregateCourtCustomSlot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourtCustomSlot[P]> : Prisma.GetScalarType<T[P], AggregateCourtCustomSlot[P]>;
};
export type CourtCustomSlotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtCustomSlotWhereInput;
    orderBy?: Prisma.CourtCustomSlotOrderByWithAggregationInput | Prisma.CourtCustomSlotOrderByWithAggregationInput[];
    by: Prisma.CourtCustomSlotScalarFieldEnum[] | Prisma.CourtCustomSlotScalarFieldEnum;
    having?: Prisma.CourtCustomSlotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourtCustomSlotCountAggregateInputType | true;
    _avg?: CourtCustomSlotAvgAggregateInputType;
    _sum?: CourtCustomSlotSumAggregateInputType;
    _min?: CourtCustomSlotMinAggregateInputType;
    _max?: CourtCustomSlotMaxAggregateInputType;
};
export type CourtCustomSlotGroupByOutputType = {
    id: string;
    courtId: string;
    date: Date;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price: number;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: CourtCustomSlotCountAggregateOutputType | null;
    _avg: CourtCustomSlotAvgAggregateOutputType | null;
    _sum: CourtCustomSlotSumAggregateOutputType | null;
    _min: CourtCustomSlotMinAggregateOutputType | null;
    _max: CourtCustomSlotMaxAggregateOutputType | null;
};
type GetCourtCustomSlotGroupByPayload<T extends CourtCustomSlotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourtCustomSlotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourtCustomSlotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourtCustomSlotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourtCustomSlotGroupByOutputType[P]>;
}>>;
export type CourtCustomSlotWhereInput = {
    AND?: Prisma.CourtCustomSlotWhereInput | Prisma.CourtCustomSlotWhereInput[];
    OR?: Prisma.CourtCustomSlotWhereInput[];
    NOT?: Prisma.CourtCustomSlotWhereInput | Prisma.CourtCustomSlotWhereInput[];
    id?: Prisma.UuidFilter<"CourtCustomSlot"> | string;
    courtId?: Prisma.UuidFilter<"CourtCustomSlot"> | string;
    date?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    startTimeMinutes?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    endTimeMinutes?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    price?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    note?: Prisma.StringNullableFilter<"CourtCustomSlot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    court?: Prisma.XOR<Prisma.CourtScalarRelationFilter, Prisma.CourtWhereInput>;
};
export type CourtCustomSlotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    court?: Prisma.CourtOrderByWithRelationInput;
};
export type CourtCustomSlotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CourtCustomSlotWhereInput | Prisma.CourtCustomSlotWhereInput[];
    OR?: Prisma.CourtCustomSlotWhereInput[];
    NOT?: Prisma.CourtCustomSlotWhereInput | Prisma.CourtCustomSlotWhereInput[];
    courtId?: Prisma.UuidFilter<"CourtCustomSlot"> | string;
    date?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    startTimeMinutes?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    endTimeMinutes?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    price?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    note?: Prisma.StringNullableFilter<"CourtCustomSlot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    court?: Prisma.XOR<Prisma.CourtScalarRelationFilter, Prisma.CourtWhereInput>;
}, "id">;
export type CourtCustomSlotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CourtCustomSlotCountOrderByAggregateInput;
    _avg?: Prisma.CourtCustomSlotAvgOrderByAggregateInput;
    _max?: Prisma.CourtCustomSlotMaxOrderByAggregateInput;
    _min?: Prisma.CourtCustomSlotMinOrderByAggregateInput;
    _sum?: Prisma.CourtCustomSlotSumOrderByAggregateInput;
};
export type CourtCustomSlotScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourtCustomSlotScalarWhereWithAggregatesInput | Prisma.CourtCustomSlotScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourtCustomSlotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourtCustomSlotScalarWhereWithAggregatesInput | Prisma.CourtCustomSlotScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"CourtCustomSlot"> | string;
    courtId?: Prisma.UuidWithAggregatesFilter<"CourtCustomSlot"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"CourtCustomSlot"> | Date | string;
    startTimeMinutes?: Prisma.IntWithAggregatesFilter<"CourtCustomSlot"> | number;
    endTimeMinutes?: Prisma.IntWithAggregatesFilter<"CourtCustomSlot"> | number;
    price?: Prisma.IntWithAggregatesFilter<"CourtCustomSlot"> | number;
    note?: Prisma.StringNullableWithAggregatesFilter<"CourtCustomSlot"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CourtCustomSlot"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"CourtCustomSlot"> | Date | string;
};
export type CourtCustomSlotCreateInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price?: number;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    court: Prisma.CourtCreateNestedOneWithoutCustomSlotsInput;
};
export type CourtCustomSlotUncheckedCreateInput = {
    id?: string;
    courtId: string;
    date: Date | string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price?: number;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtCustomSlotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    court?: Prisma.CourtUpdateOneRequiredWithoutCustomSlotsNestedInput;
};
export type CourtCustomSlotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courtId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtCustomSlotCreateManyInput = {
    id?: string;
    courtId: string;
    date: Date | string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price?: number;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtCustomSlotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtCustomSlotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courtId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtCustomSlotListRelationFilter = {
    every?: Prisma.CourtCustomSlotWhereInput;
    some?: Prisma.CourtCustomSlotWhereInput;
    none?: Prisma.CourtCustomSlotWhereInput;
};
export type CourtCustomSlotOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourtCustomSlotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtCustomSlotAvgOrderByAggregateInput = {
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type CourtCustomSlotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtCustomSlotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtCustomSlotSumOrderByAggregateInput = {
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
};
export type CourtCustomSlotCreateNestedManyWithoutCourtInput = {
    create?: Prisma.XOR<Prisma.CourtCustomSlotCreateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput> | Prisma.CourtCustomSlotCreateWithoutCourtInput[] | Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput | Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput[];
    createMany?: Prisma.CourtCustomSlotCreateManyCourtInputEnvelope;
    connect?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
};
export type CourtCustomSlotUncheckedCreateNestedManyWithoutCourtInput = {
    create?: Prisma.XOR<Prisma.CourtCustomSlotCreateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput> | Prisma.CourtCustomSlotCreateWithoutCourtInput[] | Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput | Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput[];
    createMany?: Prisma.CourtCustomSlotCreateManyCourtInputEnvelope;
    connect?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
};
export type CourtCustomSlotUpdateManyWithoutCourtNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCustomSlotCreateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput> | Prisma.CourtCustomSlotCreateWithoutCourtInput[] | Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput | Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput[];
    upsert?: Prisma.CourtCustomSlotUpsertWithWhereUniqueWithoutCourtInput | Prisma.CourtCustomSlotUpsertWithWhereUniqueWithoutCourtInput[];
    createMany?: Prisma.CourtCustomSlotCreateManyCourtInputEnvelope;
    set?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    disconnect?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    delete?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    connect?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    update?: Prisma.CourtCustomSlotUpdateWithWhereUniqueWithoutCourtInput | Prisma.CourtCustomSlotUpdateWithWhereUniqueWithoutCourtInput[];
    updateMany?: Prisma.CourtCustomSlotUpdateManyWithWhereWithoutCourtInput | Prisma.CourtCustomSlotUpdateManyWithWhereWithoutCourtInput[];
    deleteMany?: Prisma.CourtCustomSlotScalarWhereInput | Prisma.CourtCustomSlotScalarWhereInput[];
};
export type CourtCustomSlotUncheckedUpdateManyWithoutCourtNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCustomSlotCreateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput> | Prisma.CourtCustomSlotCreateWithoutCourtInput[] | Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput | Prisma.CourtCustomSlotCreateOrConnectWithoutCourtInput[];
    upsert?: Prisma.CourtCustomSlotUpsertWithWhereUniqueWithoutCourtInput | Prisma.CourtCustomSlotUpsertWithWhereUniqueWithoutCourtInput[];
    createMany?: Prisma.CourtCustomSlotCreateManyCourtInputEnvelope;
    set?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    disconnect?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    delete?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    connect?: Prisma.CourtCustomSlotWhereUniqueInput | Prisma.CourtCustomSlotWhereUniqueInput[];
    update?: Prisma.CourtCustomSlotUpdateWithWhereUniqueWithoutCourtInput | Prisma.CourtCustomSlotUpdateWithWhereUniqueWithoutCourtInput[];
    updateMany?: Prisma.CourtCustomSlotUpdateManyWithWhereWithoutCourtInput | Prisma.CourtCustomSlotUpdateManyWithWhereWithoutCourtInput[];
    deleteMany?: Prisma.CourtCustomSlotScalarWhereInput | Prisma.CourtCustomSlotScalarWhereInput[];
};
export type CourtCustomSlotCreateWithoutCourtInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price?: number;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtCustomSlotUncheckedCreateWithoutCourtInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price?: number;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtCustomSlotCreateOrConnectWithoutCourtInput = {
    where: Prisma.CourtCustomSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCustomSlotCreateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput>;
};
export type CourtCustomSlotCreateManyCourtInputEnvelope = {
    data: Prisma.CourtCustomSlotCreateManyCourtInput | Prisma.CourtCustomSlotCreateManyCourtInput[];
    skipDuplicates?: boolean;
};
export type CourtCustomSlotUpsertWithWhereUniqueWithoutCourtInput = {
    where: Prisma.CourtCustomSlotWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtCustomSlotUpdateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedUpdateWithoutCourtInput>;
    create: Prisma.XOR<Prisma.CourtCustomSlotCreateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedCreateWithoutCourtInput>;
};
export type CourtCustomSlotUpdateWithWhereUniqueWithoutCourtInput = {
    where: Prisma.CourtCustomSlotWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtCustomSlotUpdateWithoutCourtInput, Prisma.CourtCustomSlotUncheckedUpdateWithoutCourtInput>;
};
export type CourtCustomSlotUpdateManyWithWhereWithoutCourtInput = {
    where: Prisma.CourtCustomSlotScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtCustomSlotUpdateManyMutationInput, Prisma.CourtCustomSlotUncheckedUpdateManyWithoutCourtInput>;
};
export type CourtCustomSlotScalarWhereInput = {
    AND?: Prisma.CourtCustomSlotScalarWhereInput | Prisma.CourtCustomSlotScalarWhereInput[];
    OR?: Prisma.CourtCustomSlotScalarWhereInput[];
    NOT?: Prisma.CourtCustomSlotScalarWhereInput | Prisma.CourtCustomSlotScalarWhereInput[];
    id?: Prisma.UuidFilter<"CourtCustomSlot"> | string;
    courtId?: Prisma.UuidFilter<"CourtCustomSlot"> | string;
    date?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    startTimeMinutes?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    endTimeMinutes?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    price?: Prisma.IntFilter<"CourtCustomSlot"> | number;
    note?: Prisma.StringNullableFilter<"CourtCustomSlot"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtCustomSlot"> | Date | string;
};
export type CourtCustomSlotCreateManyCourtInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes: number;
    endTimeMinutes: number;
    price?: number;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtCustomSlotUpdateWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtCustomSlotUncheckedUpdateWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtCustomSlotUncheckedUpdateManyWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    price?: Prisma.IntFieldUpdateOperationsInput | number;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtCustomSlotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    price?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtCustomSlot"]>;
export type CourtCustomSlotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    price?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtCustomSlot"]>;
export type CourtCustomSlotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    price?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtCustomSlot"]>;
export type CourtCustomSlotSelectScalar = {
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    price?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CourtCustomSlotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "courtId" | "date" | "startTimeMinutes" | "endTimeMinutes" | "price" | "note" | "createdAt" | "updatedAt", ExtArgs["result"]["courtCustomSlot"]>;
export type CourtCustomSlotInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type CourtCustomSlotIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type CourtCustomSlotIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type $CourtCustomSlotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourtCustomSlot";
    objects: {
        court: Prisma.$CourtPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        courtId: string;
        date: Date;
        startTimeMinutes: number;
        endTimeMinutes: number;
        price: number;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["courtCustomSlot"]>;
    composites: {};
};
export type CourtCustomSlotGetPayload<S extends boolean | null | undefined | CourtCustomSlotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload, S>;
export type CourtCustomSlotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourtCustomSlotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourtCustomSlotCountAggregateInputType | true;
};
export interface CourtCustomSlotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourtCustomSlot'];
        meta: {
            name: 'CourtCustomSlot';
        };
    };
    findUnique<T extends CourtCustomSlotFindUniqueArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourtCustomSlotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourtCustomSlotFindFirstArgs>(args?: Prisma.SelectSubset<T, CourtCustomSlotFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourtCustomSlotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourtCustomSlotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourtCustomSlotFindManyArgs>(args?: Prisma.SelectSubset<T, CourtCustomSlotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourtCustomSlotCreateArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotCreateArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourtCustomSlotCreateManyArgs>(args?: Prisma.SelectSubset<T, CourtCustomSlotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourtCustomSlotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourtCustomSlotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourtCustomSlotDeleteArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotDeleteArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourtCustomSlotUpdateArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotUpdateArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourtCustomSlotDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourtCustomSlotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourtCustomSlotUpdateManyArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourtCustomSlotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourtCustomSlotUpsertArgs>(args: Prisma.SelectSubset<T, CourtCustomSlotUpsertArgs<ExtArgs>>): Prisma.Prisma__CourtCustomSlotClient<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourtCustomSlotCountArgs>(args?: Prisma.Subset<T, CourtCustomSlotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourtCustomSlotCountAggregateOutputType> : number>;
    aggregate<T extends CourtCustomSlotAggregateArgs>(args: Prisma.Subset<T, CourtCustomSlotAggregateArgs>): Prisma.PrismaPromise<GetCourtCustomSlotAggregateType<T>>;
    groupBy<T extends CourtCustomSlotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourtCustomSlotGroupByArgs['orderBy'];
    } : {
        orderBy?: CourtCustomSlotGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourtCustomSlotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourtCustomSlotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourtCustomSlotFieldRefs;
}
export interface Prisma__CourtCustomSlotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    court<T extends Prisma.CourtDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourtDefaultArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourtCustomSlotFieldRefs {
    readonly id: Prisma.FieldRef<"CourtCustomSlot", 'String'>;
    readonly courtId: Prisma.FieldRef<"CourtCustomSlot", 'String'>;
    readonly date: Prisma.FieldRef<"CourtCustomSlot", 'DateTime'>;
    readonly startTimeMinutes: Prisma.FieldRef<"CourtCustomSlot", 'Int'>;
    readonly endTimeMinutes: Prisma.FieldRef<"CourtCustomSlot", 'Int'>;
    readonly price: Prisma.FieldRef<"CourtCustomSlot", 'Int'>;
    readonly note: Prisma.FieldRef<"CourtCustomSlot", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CourtCustomSlot", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"CourtCustomSlot", 'DateTime'>;
}
export type CourtCustomSlotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    where: Prisma.CourtCustomSlotWhereUniqueInput;
};
export type CourtCustomSlotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    where: Prisma.CourtCustomSlotWhereUniqueInput;
};
export type CourtCustomSlotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    where?: Prisma.CourtCustomSlotWhereInput;
    orderBy?: Prisma.CourtCustomSlotOrderByWithRelationInput | Prisma.CourtCustomSlotOrderByWithRelationInput[];
    cursor?: Prisma.CourtCustomSlotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtCustomSlotScalarFieldEnum | Prisma.CourtCustomSlotScalarFieldEnum[];
};
export type CourtCustomSlotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    where?: Prisma.CourtCustomSlotWhereInput;
    orderBy?: Prisma.CourtCustomSlotOrderByWithRelationInput | Prisma.CourtCustomSlotOrderByWithRelationInput[];
    cursor?: Prisma.CourtCustomSlotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtCustomSlotScalarFieldEnum | Prisma.CourtCustomSlotScalarFieldEnum[];
};
export type CourtCustomSlotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    where?: Prisma.CourtCustomSlotWhereInput;
    orderBy?: Prisma.CourtCustomSlotOrderByWithRelationInput | Prisma.CourtCustomSlotOrderByWithRelationInput[];
    cursor?: Prisma.CourtCustomSlotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtCustomSlotScalarFieldEnum | Prisma.CourtCustomSlotScalarFieldEnum[];
};
export type CourtCustomSlotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtCustomSlotCreateInput, Prisma.CourtCustomSlotUncheckedCreateInput>;
};
export type CourtCustomSlotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourtCustomSlotCreateManyInput | Prisma.CourtCustomSlotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourtCustomSlotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    data: Prisma.CourtCustomSlotCreateManyInput | Prisma.CourtCustomSlotCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourtCustomSlotIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourtCustomSlotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtCustomSlotUpdateInput, Prisma.CourtCustomSlotUncheckedUpdateInput>;
    where: Prisma.CourtCustomSlotWhereUniqueInput;
};
export type CourtCustomSlotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourtCustomSlotUpdateManyMutationInput, Prisma.CourtCustomSlotUncheckedUpdateManyInput>;
    where?: Prisma.CourtCustomSlotWhereInput;
    limit?: number;
};
export type CourtCustomSlotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtCustomSlotUpdateManyMutationInput, Prisma.CourtCustomSlotUncheckedUpdateManyInput>;
    where?: Prisma.CourtCustomSlotWhereInput;
    limit?: number;
    include?: Prisma.CourtCustomSlotIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourtCustomSlotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    where: Prisma.CourtCustomSlotWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCustomSlotCreateInput, Prisma.CourtCustomSlotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourtCustomSlotUpdateInput, Prisma.CourtCustomSlotUncheckedUpdateInput>;
};
export type CourtCustomSlotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
    where: Prisma.CourtCustomSlotWhereUniqueInput;
};
export type CourtCustomSlotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtCustomSlotWhereInput;
    limit?: number;
};
export type CourtCustomSlotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCustomSlotSelect<ExtArgs> | null;
    omit?: Prisma.CourtCustomSlotOmit<ExtArgs> | null;
    include?: Prisma.CourtCustomSlotInclude<ExtArgs> | null;
};
export {};
