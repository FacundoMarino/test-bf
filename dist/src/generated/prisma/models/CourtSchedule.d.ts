import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CourtScheduleModel = runtime.Types.Result.DefaultSelection<Prisma.$CourtSchedulePayload>;
export type AggregateCourtSchedule = {
    _count: CourtScheduleCountAggregateOutputType | null;
    _avg: CourtScheduleAvgAggregateOutputType | null;
    _sum: CourtScheduleSumAggregateOutputType | null;
    _min: CourtScheduleMinAggregateOutputType | null;
    _max: CourtScheduleMaxAggregateOutputType | null;
};
export type CourtScheduleAvgAggregateOutputType = {
    dayOfWeek: number | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    slotDurationMinutes: number | null;
    pricePerHour: number | null;
};
export type CourtScheduleSumAggregateOutputType = {
    dayOfWeek: number | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    slotDurationMinutes: number | null;
    pricePerHour: number | null;
};
export type CourtScheduleMinAggregateOutputType = {
    id: string | null;
    courtId: string | null;
    dayOfWeek: number | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    slotDurationMinutes: number | null;
    pricePerHour: number | null;
    periodName: string | null;
    periodStart: Date | null;
    periodEnd: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtScheduleMaxAggregateOutputType = {
    id: string | null;
    courtId: string | null;
    dayOfWeek: number | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    slotDurationMinutes: number | null;
    pricePerHour: number | null;
    periodName: string | null;
    periodStart: Date | null;
    periodEnd: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtScheduleCountAggregateOutputType = {
    id: number;
    courtId: number;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour: number;
    periodName: number;
    periodStart: number;
    periodEnd: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CourtScheduleAvgAggregateInputType = {
    dayOfWeek?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    slotDurationMinutes?: true;
    pricePerHour?: true;
};
export type CourtScheduleSumAggregateInputType = {
    dayOfWeek?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    slotDurationMinutes?: true;
    pricePerHour?: true;
};
export type CourtScheduleMinAggregateInputType = {
    id?: true;
    courtId?: true;
    dayOfWeek?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    slotDurationMinutes?: true;
    pricePerHour?: true;
    periodName?: true;
    periodStart?: true;
    periodEnd?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtScheduleMaxAggregateInputType = {
    id?: true;
    courtId?: true;
    dayOfWeek?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    slotDurationMinutes?: true;
    pricePerHour?: true;
    periodName?: true;
    periodStart?: true;
    periodEnd?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtScheduleCountAggregateInputType = {
    id?: true;
    courtId?: true;
    dayOfWeek?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    slotDurationMinutes?: true;
    pricePerHour?: true;
    periodName?: true;
    periodStart?: true;
    periodEnd?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CourtScheduleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleWhereInput;
    orderBy?: Prisma.CourtScheduleOrderByWithRelationInput | Prisma.CourtScheduleOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourtScheduleCountAggregateInputType;
    _avg?: CourtScheduleAvgAggregateInputType;
    _sum?: CourtScheduleSumAggregateInputType;
    _min?: CourtScheduleMinAggregateInputType;
    _max?: CourtScheduleMaxAggregateInputType;
};
export type GetCourtScheduleAggregateType<T extends CourtScheduleAggregateArgs> = {
    [P in keyof T & keyof AggregateCourtSchedule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourtSchedule[P]> : Prisma.GetScalarType<T[P], AggregateCourtSchedule[P]>;
};
export type CourtScheduleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleWhereInput;
    orderBy?: Prisma.CourtScheduleOrderByWithAggregationInput | Prisma.CourtScheduleOrderByWithAggregationInput[];
    by: Prisma.CourtScheduleScalarFieldEnum[] | Prisma.CourtScheduleScalarFieldEnum;
    having?: Prisma.CourtScheduleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourtScheduleCountAggregateInputType | true;
    _avg?: CourtScheduleAvgAggregateInputType;
    _sum?: CourtScheduleSumAggregateInputType;
    _min?: CourtScheduleMinAggregateInputType;
    _max?: CourtScheduleMaxAggregateInputType;
};
export type CourtScheduleGroupByOutputType = {
    id: string;
    courtId: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour: number;
    periodName: string | null;
    periodStart: Date | null;
    periodEnd: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: CourtScheduleCountAggregateOutputType | null;
    _avg: CourtScheduleAvgAggregateOutputType | null;
    _sum: CourtScheduleSumAggregateOutputType | null;
    _min: CourtScheduleMinAggregateOutputType | null;
    _max: CourtScheduleMaxAggregateOutputType | null;
};
type GetCourtScheduleGroupByPayload<T extends CourtScheduleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourtScheduleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourtScheduleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourtScheduleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourtScheduleGroupByOutputType[P]>;
}>>;
export type CourtScheduleWhereInput = {
    AND?: Prisma.CourtScheduleWhereInput | Prisma.CourtScheduleWhereInput[];
    OR?: Prisma.CourtScheduleWhereInput[];
    NOT?: Prisma.CourtScheduleWhereInput | Prisma.CourtScheduleWhereInput[];
    id?: Prisma.UuidFilter<"CourtSchedule"> | string;
    courtId?: Prisma.UuidFilter<"CourtSchedule"> | string;
    dayOfWeek?: Prisma.IntFilter<"CourtSchedule"> | number;
    startTimeMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    endTimeMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    slotDurationMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    pricePerHour?: Prisma.IntFilter<"CourtSchedule"> | number;
    periodName?: Prisma.StringNullableFilter<"CourtSchedule"> | string | null;
    periodStart?: Prisma.DateTimeNullableFilter<"CourtSchedule"> | Date | string | null;
    periodEnd?: Prisma.DateTimeNullableFilter<"CourtSchedule"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourtSchedule"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtSchedule"> | Date | string;
    court?: Prisma.XOR<Prisma.CourtScalarRelationFilter, Prisma.CourtWhereInput>;
};
export type CourtScheduleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    dayOfWeek?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    slotDurationMinutes?: Prisma.SortOrder;
    pricePerHour?: Prisma.SortOrder;
    periodName?: Prisma.SortOrderInput | Prisma.SortOrder;
    periodStart?: Prisma.SortOrderInput | Prisma.SortOrder;
    periodEnd?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    court?: Prisma.CourtOrderByWithRelationInput;
};
export type CourtScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CourtScheduleWhereInput | Prisma.CourtScheduleWhereInput[];
    OR?: Prisma.CourtScheduleWhereInput[];
    NOT?: Prisma.CourtScheduleWhereInput | Prisma.CourtScheduleWhereInput[];
    courtId?: Prisma.UuidFilter<"CourtSchedule"> | string;
    dayOfWeek?: Prisma.IntFilter<"CourtSchedule"> | number;
    startTimeMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    endTimeMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    slotDurationMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    pricePerHour?: Prisma.IntFilter<"CourtSchedule"> | number;
    periodName?: Prisma.StringNullableFilter<"CourtSchedule"> | string | null;
    periodStart?: Prisma.DateTimeNullableFilter<"CourtSchedule"> | Date | string | null;
    periodEnd?: Prisma.DateTimeNullableFilter<"CourtSchedule"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourtSchedule"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtSchedule"> | Date | string;
    court?: Prisma.XOR<Prisma.CourtScalarRelationFilter, Prisma.CourtWhereInput>;
}, "id">;
export type CourtScheduleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    dayOfWeek?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    slotDurationMinutes?: Prisma.SortOrder;
    pricePerHour?: Prisma.SortOrder;
    periodName?: Prisma.SortOrderInput | Prisma.SortOrder;
    periodStart?: Prisma.SortOrderInput | Prisma.SortOrder;
    periodEnd?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CourtScheduleCountOrderByAggregateInput;
    _avg?: Prisma.CourtScheduleAvgOrderByAggregateInput;
    _max?: Prisma.CourtScheduleMaxOrderByAggregateInput;
    _min?: Prisma.CourtScheduleMinOrderByAggregateInput;
    _sum?: Prisma.CourtScheduleSumOrderByAggregateInput;
};
export type CourtScheduleScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourtScheduleScalarWhereWithAggregatesInput | Prisma.CourtScheduleScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourtScheduleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourtScheduleScalarWhereWithAggregatesInput | Prisma.CourtScheduleScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"CourtSchedule"> | string;
    courtId?: Prisma.UuidWithAggregatesFilter<"CourtSchedule"> | string;
    dayOfWeek?: Prisma.IntWithAggregatesFilter<"CourtSchedule"> | number;
    startTimeMinutes?: Prisma.IntWithAggregatesFilter<"CourtSchedule"> | number;
    endTimeMinutes?: Prisma.IntWithAggregatesFilter<"CourtSchedule"> | number;
    slotDurationMinutes?: Prisma.IntWithAggregatesFilter<"CourtSchedule"> | number;
    pricePerHour?: Prisma.IntWithAggregatesFilter<"CourtSchedule"> | number;
    periodName?: Prisma.StringNullableWithAggregatesFilter<"CourtSchedule"> | string | null;
    periodStart?: Prisma.DateTimeNullableWithAggregatesFilter<"CourtSchedule"> | Date | string | null;
    periodEnd?: Prisma.DateTimeNullableWithAggregatesFilter<"CourtSchedule"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CourtSchedule"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"CourtSchedule"> | Date | string;
};
export type CourtScheduleCreateInput = {
    id?: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number;
    periodName?: string | null;
    periodStart?: Date | string | null;
    periodEnd?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    court: Prisma.CourtCreateNestedOneWithoutSchedulesInput;
};
export type CourtScheduleUncheckedCreateInput = {
    id?: string;
    courtId: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number;
    periodName?: string | null;
    periodStart?: Date | string | null;
    periodEnd?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dayOfWeek?: Prisma.IntFieldUpdateOperationsInput | number;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slotDurationMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    pricePerHour?: Prisma.IntFieldUpdateOperationsInput | number;
    periodName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    periodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    periodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    court?: Prisma.CourtUpdateOneRequiredWithoutSchedulesNestedInput;
};
export type CourtScheduleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courtId?: Prisma.StringFieldUpdateOperationsInput | string;
    dayOfWeek?: Prisma.IntFieldUpdateOperationsInput | number;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slotDurationMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    pricePerHour?: Prisma.IntFieldUpdateOperationsInput | number;
    periodName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    periodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    periodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleCreateManyInput = {
    id?: string;
    courtId: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number;
    periodName?: string | null;
    periodStart?: Date | string | null;
    periodEnd?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dayOfWeek?: Prisma.IntFieldUpdateOperationsInput | number;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slotDurationMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    pricePerHour?: Prisma.IntFieldUpdateOperationsInput | number;
    periodName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    periodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    periodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courtId?: Prisma.StringFieldUpdateOperationsInput | string;
    dayOfWeek?: Prisma.IntFieldUpdateOperationsInput | number;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slotDurationMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    pricePerHour?: Prisma.IntFieldUpdateOperationsInput | number;
    periodName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    periodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    periodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleListRelationFilter = {
    every?: Prisma.CourtScheduleWhereInput;
    some?: Prisma.CourtScheduleWhereInput;
    none?: Prisma.CourtScheduleWhereInput;
};
export type CourtScheduleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourtScheduleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    dayOfWeek?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    slotDurationMinutes?: Prisma.SortOrder;
    pricePerHour?: Prisma.SortOrder;
    periodName?: Prisma.SortOrder;
    periodStart?: Prisma.SortOrder;
    periodEnd?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtScheduleAvgOrderByAggregateInput = {
    dayOfWeek?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    slotDurationMinutes?: Prisma.SortOrder;
    pricePerHour?: Prisma.SortOrder;
};
export type CourtScheduleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    dayOfWeek?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    slotDurationMinutes?: Prisma.SortOrder;
    pricePerHour?: Prisma.SortOrder;
    periodName?: Prisma.SortOrder;
    periodStart?: Prisma.SortOrder;
    periodEnd?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtScheduleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    dayOfWeek?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    slotDurationMinutes?: Prisma.SortOrder;
    pricePerHour?: Prisma.SortOrder;
    periodName?: Prisma.SortOrder;
    periodStart?: Prisma.SortOrder;
    periodEnd?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtScheduleSumOrderByAggregateInput = {
    dayOfWeek?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    slotDurationMinutes?: Prisma.SortOrder;
    pricePerHour?: Prisma.SortOrder;
};
export type CourtScheduleCreateNestedManyWithoutCourtInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleCreateWithoutCourtInput, Prisma.CourtScheduleUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleCreateWithoutCourtInput[] | Prisma.CourtScheduleUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleCreateOrConnectWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleCreateManyCourtInputEnvelope;
    connect?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
};
export type CourtScheduleUncheckedCreateNestedManyWithoutCourtInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleCreateWithoutCourtInput, Prisma.CourtScheduleUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleCreateWithoutCourtInput[] | Prisma.CourtScheduleUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleCreateOrConnectWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleCreateManyCourtInputEnvelope;
    connect?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
};
export type CourtScheduleUpdateManyWithoutCourtNestedInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleCreateWithoutCourtInput, Prisma.CourtScheduleUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleCreateWithoutCourtInput[] | Prisma.CourtScheduleUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleCreateOrConnectWithoutCourtInput[];
    upsert?: Prisma.CourtScheduleUpsertWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleUpsertWithWhereUniqueWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleCreateManyCourtInputEnvelope;
    set?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    disconnect?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    delete?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    connect?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    update?: Prisma.CourtScheduleUpdateWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleUpdateWithWhereUniqueWithoutCourtInput[];
    updateMany?: Prisma.CourtScheduleUpdateManyWithWhereWithoutCourtInput | Prisma.CourtScheduleUpdateManyWithWhereWithoutCourtInput[];
    deleteMany?: Prisma.CourtScheduleScalarWhereInput | Prisma.CourtScheduleScalarWhereInput[];
};
export type CourtScheduleUncheckedUpdateManyWithoutCourtNestedInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleCreateWithoutCourtInput, Prisma.CourtScheduleUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleCreateWithoutCourtInput[] | Prisma.CourtScheduleUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleCreateOrConnectWithoutCourtInput[];
    upsert?: Prisma.CourtScheduleUpsertWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleUpsertWithWhereUniqueWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleCreateManyCourtInputEnvelope;
    set?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    disconnect?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    delete?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    connect?: Prisma.CourtScheduleWhereUniqueInput | Prisma.CourtScheduleWhereUniqueInput[];
    update?: Prisma.CourtScheduleUpdateWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleUpdateWithWhereUniqueWithoutCourtInput[];
    updateMany?: Prisma.CourtScheduleUpdateManyWithWhereWithoutCourtInput | Prisma.CourtScheduleUpdateManyWithWhereWithoutCourtInput[];
    deleteMany?: Prisma.CourtScheduleScalarWhereInput | Prisma.CourtScheduleScalarWhereInput[];
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type CourtScheduleCreateWithoutCourtInput = {
    id?: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number;
    periodName?: string | null;
    periodStart?: Date | string | null;
    periodEnd?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleUncheckedCreateWithoutCourtInput = {
    id?: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number;
    periodName?: string | null;
    periodStart?: Date | string | null;
    periodEnd?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleCreateOrConnectWithoutCourtInput = {
    where: Prisma.CourtScheduleWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtScheduleCreateWithoutCourtInput, Prisma.CourtScheduleUncheckedCreateWithoutCourtInput>;
};
export type CourtScheduleCreateManyCourtInputEnvelope = {
    data: Prisma.CourtScheduleCreateManyCourtInput | Prisma.CourtScheduleCreateManyCourtInput[];
    skipDuplicates?: boolean;
};
export type CourtScheduleUpsertWithWhereUniqueWithoutCourtInput = {
    where: Prisma.CourtScheduleWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtScheduleUpdateWithoutCourtInput, Prisma.CourtScheduleUncheckedUpdateWithoutCourtInput>;
    create: Prisma.XOR<Prisma.CourtScheduleCreateWithoutCourtInput, Prisma.CourtScheduleUncheckedCreateWithoutCourtInput>;
};
export type CourtScheduleUpdateWithWhereUniqueWithoutCourtInput = {
    where: Prisma.CourtScheduleWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtScheduleUpdateWithoutCourtInput, Prisma.CourtScheduleUncheckedUpdateWithoutCourtInput>;
};
export type CourtScheduleUpdateManyWithWhereWithoutCourtInput = {
    where: Prisma.CourtScheduleScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtScheduleUpdateManyMutationInput, Prisma.CourtScheduleUncheckedUpdateManyWithoutCourtInput>;
};
export type CourtScheduleScalarWhereInput = {
    AND?: Prisma.CourtScheduleScalarWhereInput | Prisma.CourtScheduleScalarWhereInput[];
    OR?: Prisma.CourtScheduleScalarWhereInput[];
    NOT?: Prisma.CourtScheduleScalarWhereInput | Prisma.CourtScheduleScalarWhereInput[];
    id?: Prisma.UuidFilter<"CourtSchedule"> | string;
    courtId?: Prisma.UuidFilter<"CourtSchedule"> | string;
    dayOfWeek?: Prisma.IntFilter<"CourtSchedule"> | number;
    startTimeMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    endTimeMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    slotDurationMinutes?: Prisma.IntFilter<"CourtSchedule"> | number;
    pricePerHour?: Prisma.IntFilter<"CourtSchedule"> | number;
    periodName?: Prisma.StringNullableFilter<"CourtSchedule"> | string | null;
    periodStart?: Prisma.DateTimeNullableFilter<"CourtSchedule"> | Date | string | null;
    periodEnd?: Prisma.DateTimeNullableFilter<"CourtSchedule"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"CourtSchedule"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtSchedule"> | Date | string;
};
export type CourtScheduleCreateManyCourtInput = {
    id?: string;
    dayOfWeek: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    slotDurationMinutes: number;
    pricePerHour?: number;
    periodName?: string | null;
    periodStart?: Date | string | null;
    periodEnd?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleUpdateWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dayOfWeek?: Prisma.IntFieldUpdateOperationsInput | number;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slotDurationMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    pricePerHour?: Prisma.IntFieldUpdateOperationsInput | number;
    periodName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    periodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    periodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleUncheckedUpdateWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dayOfWeek?: Prisma.IntFieldUpdateOperationsInput | number;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slotDurationMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    pricePerHour?: Prisma.IntFieldUpdateOperationsInput | number;
    periodName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    periodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    periodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleUncheckedUpdateManyWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    dayOfWeek?: Prisma.IntFieldUpdateOperationsInput | number;
    startTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    endTimeMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    slotDurationMinutes?: Prisma.IntFieldUpdateOperationsInput | number;
    pricePerHour?: Prisma.IntFieldUpdateOperationsInput | number;
    periodName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    periodStart?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    periodEnd?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    dayOfWeek?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    slotDurationMinutes?: boolean;
    pricePerHour?: boolean;
    periodName?: boolean;
    periodStart?: boolean;
    periodEnd?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtSchedule"]>;
export type CourtScheduleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    dayOfWeek?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    slotDurationMinutes?: boolean;
    pricePerHour?: boolean;
    periodName?: boolean;
    periodStart?: boolean;
    periodEnd?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtSchedule"]>;
export type CourtScheduleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    dayOfWeek?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    slotDurationMinutes?: boolean;
    pricePerHour?: boolean;
    periodName?: boolean;
    periodStart?: boolean;
    periodEnd?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtSchedule"]>;
export type CourtScheduleSelectScalar = {
    id?: boolean;
    courtId?: boolean;
    dayOfWeek?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    slotDurationMinutes?: boolean;
    pricePerHour?: boolean;
    periodName?: boolean;
    periodStart?: boolean;
    periodEnd?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CourtScheduleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "courtId" | "dayOfWeek" | "startTimeMinutes" | "endTimeMinutes" | "slotDurationMinutes" | "pricePerHour" | "periodName" | "periodStart" | "periodEnd" | "createdAt" | "updatedAt", ExtArgs["result"]["courtSchedule"]>;
export type CourtScheduleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type CourtScheduleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type CourtScheduleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type $CourtSchedulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourtSchedule";
    objects: {
        court: Prisma.$CourtPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        courtId: string;
        dayOfWeek: number;
        startTimeMinutes: number;
        endTimeMinutes: number;
        slotDurationMinutes: number;
        pricePerHour: number;
        periodName: string | null;
        periodStart: Date | null;
        periodEnd: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["courtSchedule"]>;
    composites: {};
};
export type CourtScheduleGetPayload<S extends boolean | null | undefined | CourtScheduleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload, S>;
export type CourtScheduleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourtScheduleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourtScheduleCountAggregateInputType | true;
};
export interface CourtScheduleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourtSchedule'];
        meta: {
            name: 'CourtSchedule';
        };
    };
    findUnique<T extends CourtScheduleFindUniqueArgs>(args: Prisma.SelectSubset<T, CourtScheduleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourtScheduleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourtScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourtScheduleFindFirstArgs>(args?: Prisma.SelectSubset<T, CourtScheduleFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourtScheduleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourtScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourtScheduleFindManyArgs>(args?: Prisma.SelectSubset<T, CourtScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourtScheduleCreateArgs>(args: Prisma.SelectSubset<T, CourtScheduleCreateArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourtScheduleCreateManyArgs>(args?: Prisma.SelectSubset<T, CourtScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourtScheduleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourtScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourtScheduleDeleteArgs>(args: Prisma.SelectSubset<T, CourtScheduleDeleteArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourtScheduleUpdateArgs>(args: Prisma.SelectSubset<T, CourtScheduleUpdateArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourtScheduleDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourtScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourtScheduleUpdateManyArgs>(args: Prisma.SelectSubset<T, CourtScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourtScheduleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourtScheduleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourtScheduleUpsertArgs>(args: Prisma.SelectSubset<T, CourtScheduleUpsertArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleClient<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourtScheduleCountArgs>(args?: Prisma.Subset<T, CourtScheduleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourtScheduleCountAggregateOutputType> : number>;
    aggregate<T extends CourtScheduleAggregateArgs>(args: Prisma.Subset<T, CourtScheduleAggregateArgs>): Prisma.PrismaPromise<GetCourtScheduleAggregateType<T>>;
    groupBy<T extends CourtScheduleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourtScheduleGroupByArgs['orderBy'];
    } : {
        orderBy?: CourtScheduleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourtScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourtScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourtScheduleFieldRefs;
}
export interface Prisma__CourtScheduleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    court<T extends Prisma.CourtDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourtDefaultArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourtScheduleFieldRefs {
    readonly id: Prisma.FieldRef<"CourtSchedule", 'String'>;
    readonly courtId: Prisma.FieldRef<"CourtSchedule", 'String'>;
    readonly dayOfWeek: Prisma.FieldRef<"CourtSchedule", 'Int'>;
    readonly startTimeMinutes: Prisma.FieldRef<"CourtSchedule", 'Int'>;
    readonly endTimeMinutes: Prisma.FieldRef<"CourtSchedule", 'Int'>;
    readonly slotDurationMinutes: Prisma.FieldRef<"CourtSchedule", 'Int'>;
    readonly pricePerHour: Prisma.FieldRef<"CourtSchedule", 'Int'>;
    readonly periodName: Prisma.FieldRef<"CourtSchedule", 'String'>;
    readonly periodStart: Prisma.FieldRef<"CourtSchedule", 'DateTime'>;
    readonly periodEnd: Prisma.FieldRef<"CourtSchedule", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"CourtSchedule", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"CourtSchedule", 'DateTime'>;
}
export type CourtScheduleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleWhereUniqueInput;
};
export type CourtScheduleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleWhereUniqueInput;
};
export type CourtScheduleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    where?: Prisma.CourtScheduleWhereInput;
    orderBy?: Prisma.CourtScheduleOrderByWithRelationInput | Prisma.CourtScheduleOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtScheduleScalarFieldEnum | Prisma.CourtScheduleScalarFieldEnum[];
};
export type CourtScheduleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    where?: Prisma.CourtScheduleWhereInput;
    orderBy?: Prisma.CourtScheduleOrderByWithRelationInput | Prisma.CourtScheduleOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtScheduleScalarFieldEnum | Prisma.CourtScheduleScalarFieldEnum[];
};
export type CourtScheduleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    where?: Prisma.CourtScheduleWhereInput;
    orderBy?: Prisma.CourtScheduleOrderByWithRelationInput | Prisma.CourtScheduleOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtScheduleScalarFieldEnum | Prisma.CourtScheduleScalarFieldEnum[];
};
export type CourtScheduleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtScheduleCreateInput, Prisma.CourtScheduleUncheckedCreateInput>;
};
export type CourtScheduleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourtScheduleCreateManyInput | Prisma.CourtScheduleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourtScheduleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    data: Prisma.CourtScheduleCreateManyInput | Prisma.CourtScheduleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourtScheduleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourtScheduleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtScheduleUpdateInput, Prisma.CourtScheduleUncheckedUpdateInput>;
    where: Prisma.CourtScheduleWhereUniqueInput;
};
export type CourtScheduleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourtScheduleUpdateManyMutationInput, Prisma.CourtScheduleUncheckedUpdateManyInput>;
    where?: Prisma.CourtScheduleWhereInput;
    limit?: number;
};
export type CourtScheduleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtScheduleUpdateManyMutationInput, Prisma.CourtScheduleUncheckedUpdateManyInput>;
    where?: Prisma.CourtScheduleWhereInput;
    limit?: number;
    include?: Prisma.CourtScheduleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourtScheduleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtScheduleCreateInput, Prisma.CourtScheduleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourtScheduleUpdateInput, Prisma.CourtScheduleUncheckedUpdateInput>;
};
export type CourtScheduleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleWhereUniqueInput;
};
export type CourtScheduleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleWhereInput;
    limit?: number;
};
export type CourtScheduleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleInclude<ExtArgs> | null;
};
export {};
