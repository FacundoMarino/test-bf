import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CourtScheduleExceptionModel = runtime.Types.Result.DefaultSelection<Prisma.$CourtScheduleExceptionPayload>;
export type AggregateCourtScheduleException = {
    _count: CourtScheduleExceptionCountAggregateOutputType | null;
    _avg: CourtScheduleExceptionAvgAggregateOutputType | null;
    _sum: CourtScheduleExceptionSumAggregateOutputType | null;
    _min: CourtScheduleExceptionMinAggregateOutputType | null;
    _max: CourtScheduleExceptionMaxAggregateOutputType | null;
};
export type CourtScheduleExceptionAvgAggregateOutputType = {
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
};
export type CourtScheduleExceptionSumAggregateOutputType = {
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
};
export type CourtScheduleExceptionMinAggregateOutputType = {
    id: string | null;
    courtId: string | null;
    date: Date | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    isClosedAllDay: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtScheduleExceptionMaxAggregateOutputType = {
    id: string | null;
    courtId: string | null;
    date: Date | null;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    isClosedAllDay: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtScheduleExceptionCountAggregateOutputType = {
    id: number;
    courtId: number;
    date: number;
    startTimeMinutes: number;
    endTimeMinutes: number;
    isClosedAllDay: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CourtScheduleExceptionAvgAggregateInputType = {
    startTimeMinutes?: true;
    endTimeMinutes?: true;
};
export type CourtScheduleExceptionSumAggregateInputType = {
    startTimeMinutes?: true;
    endTimeMinutes?: true;
};
export type CourtScheduleExceptionMinAggregateInputType = {
    id?: true;
    courtId?: true;
    date?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    isClosedAllDay?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtScheduleExceptionMaxAggregateInputType = {
    id?: true;
    courtId?: true;
    date?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    isClosedAllDay?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtScheduleExceptionCountAggregateInputType = {
    id?: true;
    courtId?: true;
    date?: true;
    startTimeMinutes?: true;
    endTimeMinutes?: true;
    isClosedAllDay?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CourtScheduleExceptionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleExceptionWhereInput;
    orderBy?: Prisma.CourtScheduleExceptionOrderByWithRelationInput | Prisma.CourtScheduleExceptionOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleExceptionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourtScheduleExceptionCountAggregateInputType;
    _avg?: CourtScheduleExceptionAvgAggregateInputType;
    _sum?: CourtScheduleExceptionSumAggregateInputType;
    _min?: CourtScheduleExceptionMinAggregateInputType;
    _max?: CourtScheduleExceptionMaxAggregateInputType;
};
export type GetCourtScheduleExceptionAggregateType<T extends CourtScheduleExceptionAggregateArgs> = {
    [P in keyof T & keyof AggregateCourtScheduleException]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourtScheduleException[P]> : Prisma.GetScalarType<T[P], AggregateCourtScheduleException[P]>;
};
export type CourtScheduleExceptionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleExceptionWhereInput;
    orderBy?: Prisma.CourtScheduleExceptionOrderByWithAggregationInput | Prisma.CourtScheduleExceptionOrderByWithAggregationInput[];
    by: Prisma.CourtScheduleExceptionScalarFieldEnum[] | Prisma.CourtScheduleExceptionScalarFieldEnum;
    having?: Prisma.CourtScheduleExceptionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourtScheduleExceptionCountAggregateInputType | true;
    _avg?: CourtScheduleExceptionAvgAggregateInputType;
    _sum?: CourtScheduleExceptionSumAggregateInputType;
    _min?: CourtScheduleExceptionMinAggregateInputType;
    _max?: CourtScheduleExceptionMaxAggregateInputType;
};
export type CourtScheduleExceptionGroupByOutputType = {
    id: string;
    courtId: string;
    date: Date;
    startTimeMinutes: number | null;
    endTimeMinutes: number | null;
    isClosedAllDay: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: CourtScheduleExceptionCountAggregateOutputType | null;
    _avg: CourtScheduleExceptionAvgAggregateOutputType | null;
    _sum: CourtScheduleExceptionSumAggregateOutputType | null;
    _min: CourtScheduleExceptionMinAggregateOutputType | null;
    _max: CourtScheduleExceptionMaxAggregateOutputType | null;
};
type GetCourtScheduleExceptionGroupByPayload<T extends CourtScheduleExceptionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourtScheduleExceptionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourtScheduleExceptionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourtScheduleExceptionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourtScheduleExceptionGroupByOutputType[P]>;
}>>;
export type CourtScheduleExceptionWhereInput = {
    AND?: Prisma.CourtScheduleExceptionWhereInput | Prisma.CourtScheduleExceptionWhereInput[];
    OR?: Prisma.CourtScheduleExceptionWhereInput[];
    NOT?: Prisma.CourtScheduleExceptionWhereInput | Prisma.CourtScheduleExceptionWhereInput[];
    id?: Prisma.UuidFilter<"CourtScheduleException"> | string;
    courtId?: Prisma.UuidFilter<"CourtScheduleException"> | string;
    date?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    startTimeMinutes?: Prisma.IntNullableFilter<"CourtScheduleException"> | number | null;
    endTimeMinutes?: Prisma.IntNullableFilter<"CourtScheduleException"> | number | null;
    isClosedAllDay?: Prisma.BoolFilter<"CourtScheduleException"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    court?: Prisma.XOR<Prisma.CourtScalarRelationFilter, Prisma.CourtWhereInput>;
};
export type CourtScheduleExceptionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    isClosedAllDay?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    court?: Prisma.CourtOrderByWithRelationInput;
};
export type CourtScheduleExceptionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CourtScheduleExceptionWhereInput | Prisma.CourtScheduleExceptionWhereInput[];
    OR?: Prisma.CourtScheduleExceptionWhereInput[];
    NOT?: Prisma.CourtScheduleExceptionWhereInput | Prisma.CourtScheduleExceptionWhereInput[];
    courtId?: Prisma.UuidFilter<"CourtScheduleException"> | string;
    date?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    startTimeMinutes?: Prisma.IntNullableFilter<"CourtScheduleException"> | number | null;
    endTimeMinutes?: Prisma.IntNullableFilter<"CourtScheduleException"> | number | null;
    isClosedAllDay?: Prisma.BoolFilter<"CourtScheduleException"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    court?: Prisma.XOR<Prisma.CourtScalarRelationFilter, Prisma.CourtWhereInput>;
}, "id">;
export type CourtScheduleExceptionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrderInput | Prisma.SortOrder;
    isClosedAllDay?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CourtScheduleExceptionCountOrderByAggregateInput;
    _avg?: Prisma.CourtScheduleExceptionAvgOrderByAggregateInput;
    _max?: Prisma.CourtScheduleExceptionMaxOrderByAggregateInput;
    _min?: Prisma.CourtScheduleExceptionMinOrderByAggregateInput;
    _sum?: Prisma.CourtScheduleExceptionSumOrderByAggregateInput;
};
export type CourtScheduleExceptionScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourtScheduleExceptionScalarWhereWithAggregatesInput | Prisma.CourtScheduleExceptionScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourtScheduleExceptionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourtScheduleExceptionScalarWhereWithAggregatesInput | Prisma.CourtScheduleExceptionScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"CourtScheduleException"> | string;
    courtId?: Prisma.UuidWithAggregatesFilter<"CourtScheduleException"> | string;
    date?: Prisma.DateTimeWithAggregatesFilter<"CourtScheduleException"> | Date | string;
    startTimeMinutes?: Prisma.IntNullableWithAggregatesFilter<"CourtScheduleException"> | number | null;
    endTimeMinutes?: Prisma.IntNullableWithAggregatesFilter<"CourtScheduleException"> | number | null;
    isClosedAllDay?: Prisma.BoolWithAggregatesFilter<"CourtScheduleException"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CourtScheduleException"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"CourtScheduleException"> | Date | string;
};
export type CourtScheduleExceptionCreateInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes?: number | null;
    endTimeMinutes?: number | null;
    isClosedAllDay?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    court: Prisma.CourtCreateNestedOneWithoutExceptionsInput;
};
export type CourtScheduleExceptionUncheckedCreateInput = {
    id?: string;
    courtId: string;
    date: Date | string;
    startTimeMinutes?: number | null;
    endTimeMinutes?: number | null;
    isClosedAllDay?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleExceptionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    endTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isClosedAllDay?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    court?: Prisma.CourtUpdateOneRequiredWithoutExceptionsNestedInput;
};
export type CourtScheduleExceptionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courtId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    endTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isClosedAllDay?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleExceptionCreateManyInput = {
    id?: string;
    courtId: string;
    date: Date | string;
    startTimeMinutes?: number | null;
    endTimeMinutes?: number | null;
    isClosedAllDay?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleExceptionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    endTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isClosedAllDay?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleExceptionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    courtId?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    endTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isClosedAllDay?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleExceptionListRelationFilter = {
    every?: Prisma.CourtScheduleExceptionWhereInput;
    some?: Prisma.CourtScheduleExceptionWhereInput;
    none?: Prisma.CourtScheduleExceptionWhereInput;
};
export type CourtScheduleExceptionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourtScheduleExceptionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    isClosedAllDay?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtScheduleExceptionAvgOrderByAggregateInput = {
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
};
export type CourtScheduleExceptionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    isClosedAllDay?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtScheduleExceptionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    courtId?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
    isClosedAllDay?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtScheduleExceptionSumOrderByAggregateInput = {
    startTimeMinutes?: Prisma.SortOrder;
    endTimeMinutes?: Prisma.SortOrder;
};
export type CourtScheduleExceptionCreateNestedManyWithoutCourtInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleExceptionCreateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleExceptionCreateWithoutCourtInput[] | Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleExceptionCreateManyCourtInputEnvelope;
    connect?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
};
export type CourtScheduleExceptionUncheckedCreateNestedManyWithoutCourtInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleExceptionCreateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleExceptionCreateWithoutCourtInput[] | Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleExceptionCreateManyCourtInputEnvelope;
    connect?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
};
export type CourtScheduleExceptionUpdateManyWithoutCourtNestedInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleExceptionCreateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleExceptionCreateWithoutCourtInput[] | Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput[];
    upsert?: Prisma.CourtScheduleExceptionUpsertWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleExceptionUpsertWithWhereUniqueWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleExceptionCreateManyCourtInputEnvelope;
    set?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    disconnect?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    delete?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    connect?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    update?: Prisma.CourtScheduleExceptionUpdateWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleExceptionUpdateWithWhereUniqueWithoutCourtInput[];
    updateMany?: Prisma.CourtScheduleExceptionUpdateManyWithWhereWithoutCourtInput | Prisma.CourtScheduleExceptionUpdateManyWithWhereWithoutCourtInput[];
    deleteMany?: Prisma.CourtScheduleExceptionScalarWhereInput | Prisma.CourtScheduleExceptionScalarWhereInput[];
};
export type CourtScheduleExceptionUncheckedUpdateManyWithoutCourtNestedInput = {
    create?: Prisma.XOR<Prisma.CourtScheduleExceptionCreateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput> | Prisma.CourtScheduleExceptionCreateWithoutCourtInput[] | Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput[];
    connectOrCreate?: Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput | Prisma.CourtScheduleExceptionCreateOrConnectWithoutCourtInput[];
    upsert?: Prisma.CourtScheduleExceptionUpsertWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleExceptionUpsertWithWhereUniqueWithoutCourtInput[];
    createMany?: Prisma.CourtScheduleExceptionCreateManyCourtInputEnvelope;
    set?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    disconnect?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    delete?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    connect?: Prisma.CourtScheduleExceptionWhereUniqueInput | Prisma.CourtScheduleExceptionWhereUniqueInput[];
    update?: Prisma.CourtScheduleExceptionUpdateWithWhereUniqueWithoutCourtInput | Prisma.CourtScheduleExceptionUpdateWithWhereUniqueWithoutCourtInput[];
    updateMany?: Prisma.CourtScheduleExceptionUpdateManyWithWhereWithoutCourtInput | Prisma.CourtScheduleExceptionUpdateManyWithWhereWithoutCourtInput[];
    deleteMany?: Prisma.CourtScheduleExceptionScalarWhereInput | Prisma.CourtScheduleExceptionScalarWhereInput[];
};
export type CourtScheduleExceptionCreateWithoutCourtInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes?: number | null;
    endTimeMinutes?: number | null;
    isClosedAllDay?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleExceptionUncheckedCreateWithoutCourtInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes?: number | null;
    endTimeMinutes?: number | null;
    isClosedAllDay?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleExceptionCreateOrConnectWithoutCourtInput = {
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtScheduleExceptionCreateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput>;
};
export type CourtScheduleExceptionCreateManyCourtInputEnvelope = {
    data: Prisma.CourtScheduleExceptionCreateManyCourtInput | Prisma.CourtScheduleExceptionCreateManyCourtInput[];
    skipDuplicates?: boolean;
};
export type CourtScheduleExceptionUpsertWithWhereUniqueWithoutCourtInput = {
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtScheduleExceptionUpdateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedUpdateWithoutCourtInput>;
    create: Prisma.XOR<Prisma.CourtScheduleExceptionCreateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedCreateWithoutCourtInput>;
};
export type CourtScheduleExceptionUpdateWithWhereUniqueWithoutCourtInput = {
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtScheduleExceptionUpdateWithoutCourtInput, Prisma.CourtScheduleExceptionUncheckedUpdateWithoutCourtInput>;
};
export type CourtScheduleExceptionUpdateManyWithWhereWithoutCourtInput = {
    where: Prisma.CourtScheduleExceptionScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtScheduleExceptionUpdateManyMutationInput, Prisma.CourtScheduleExceptionUncheckedUpdateManyWithoutCourtInput>;
};
export type CourtScheduleExceptionScalarWhereInput = {
    AND?: Prisma.CourtScheduleExceptionScalarWhereInput | Prisma.CourtScheduleExceptionScalarWhereInput[];
    OR?: Prisma.CourtScheduleExceptionScalarWhereInput[];
    NOT?: Prisma.CourtScheduleExceptionScalarWhereInput | Prisma.CourtScheduleExceptionScalarWhereInput[];
    id?: Prisma.UuidFilter<"CourtScheduleException"> | string;
    courtId?: Prisma.UuidFilter<"CourtScheduleException"> | string;
    date?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    startTimeMinutes?: Prisma.IntNullableFilter<"CourtScheduleException"> | number | null;
    endTimeMinutes?: Prisma.IntNullableFilter<"CourtScheduleException"> | number | null;
    isClosedAllDay?: Prisma.BoolFilter<"CourtScheduleException"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"CourtScheduleException"> | Date | string;
};
export type CourtScheduleExceptionCreateManyCourtInput = {
    id?: string;
    date: Date | string;
    startTimeMinutes?: number | null;
    endTimeMinutes?: number | null;
    isClosedAllDay?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtScheduleExceptionUpdateWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    endTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isClosedAllDay?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleExceptionUncheckedUpdateWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    endTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isClosedAllDay?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleExceptionUncheckedUpdateManyWithoutCourtInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    endTimeMinutes?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    isClosedAllDay?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtScheduleExceptionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    isClosedAllDay?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtScheduleException"]>;
export type CourtScheduleExceptionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    isClosedAllDay?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtScheduleException"]>;
export type CourtScheduleExceptionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    isClosedAllDay?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtScheduleException"]>;
export type CourtScheduleExceptionSelectScalar = {
    id?: boolean;
    courtId?: boolean;
    date?: boolean;
    startTimeMinutes?: boolean;
    endTimeMinutes?: boolean;
    isClosedAllDay?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CourtScheduleExceptionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "courtId" | "date" | "startTimeMinutes" | "endTimeMinutes" | "isClosedAllDay" | "createdAt" | "updatedAt", ExtArgs["result"]["courtScheduleException"]>;
export type CourtScheduleExceptionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type CourtScheduleExceptionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type CourtScheduleExceptionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    court?: boolean | Prisma.CourtDefaultArgs<ExtArgs>;
};
export type $CourtScheduleExceptionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourtScheduleException";
    objects: {
        court: Prisma.$CourtPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        courtId: string;
        date: Date;
        startTimeMinutes: number | null;
        endTimeMinutes: number | null;
        isClosedAllDay: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["courtScheduleException"]>;
    composites: {};
};
export type CourtScheduleExceptionGetPayload<S extends boolean | null | undefined | CourtScheduleExceptionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload, S>;
export type CourtScheduleExceptionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourtScheduleExceptionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourtScheduleExceptionCountAggregateInputType | true;
};
export interface CourtScheduleExceptionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourtScheduleException'];
        meta: {
            name: 'CourtScheduleException';
        };
    };
    findUnique<T extends CourtScheduleExceptionFindUniqueArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourtScheduleExceptionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourtScheduleExceptionFindFirstArgs>(args?: Prisma.SelectSubset<T, CourtScheduleExceptionFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourtScheduleExceptionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourtScheduleExceptionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourtScheduleExceptionFindManyArgs>(args?: Prisma.SelectSubset<T, CourtScheduleExceptionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourtScheduleExceptionCreateArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionCreateArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourtScheduleExceptionCreateManyArgs>(args?: Prisma.SelectSubset<T, CourtScheduleExceptionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourtScheduleExceptionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourtScheduleExceptionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourtScheduleExceptionDeleteArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionDeleteArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourtScheduleExceptionUpdateArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionUpdateArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourtScheduleExceptionDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourtScheduleExceptionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourtScheduleExceptionUpdateManyArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourtScheduleExceptionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourtScheduleExceptionUpsertArgs>(args: Prisma.SelectSubset<T, CourtScheduleExceptionUpsertArgs<ExtArgs>>): Prisma.Prisma__CourtScheduleExceptionClient<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourtScheduleExceptionCountArgs>(args?: Prisma.Subset<T, CourtScheduleExceptionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourtScheduleExceptionCountAggregateOutputType> : number>;
    aggregate<T extends CourtScheduleExceptionAggregateArgs>(args: Prisma.Subset<T, CourtScheduleExceptionAggregateArgs>): Prisma.PrismaPromise<GetCourtScheduleExceptionAggregateType<T>>;
    groupBy<T extends CourtScheduleExceptionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourtScheduleExceptionGroupByArgs['orderBy'];
    } : {
        orderBy?: CourtScheduleExceptionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourtScheduleExceptionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourtScheduleExceptionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourtScheduleExceptionFieldRefs;
}
export interface Prisma__CourtScheduleExceptionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    court<T extends Prisma.CourtDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourtDefaultArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourtScheduleExceptionFieldRefs {
    readonly id: Prisma.FieldRef<"CourtScheduleException", 'String'>;
    readonly courtId: Prisma.FieldRef<"CourtScheduleException", 'String'>;
    readonly date: Prisma.FieldRef<"CourtScheduleException", 'DateTime'>;
    readonly startTimeMinutes: Prisma.FieldRef<"CourtScheduleException", 'Int'>;
    readonly endTimeMinutes: Prisma.FieldRef<"CourtScheduleException", 'Int'>;
    readonly isClosedAllDay: Prisma.FieldRef<"CourtScheduleException", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"CourtScheduleException", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"CourtScheduleException", 'DateTime'>;
}
export type CourtScheduleExceptionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
};
export type CourtScheduleExceptionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
};
export type CourtScheduleExceptionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    where?: Prisma.CourtScheduleExceptionWhereInput;
    orderBy?: Prisma.CourtScheduleExceptionOrderByWithRelationInput | Prisma.CourtScheduleExceptionOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleExceptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtScheduleExceptionScalarFieldEnum | Prisma.CourtScheduleExceptionScalarFieldEnum[];
};
export type CourtScheduleExceptionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    where?: Prisma.CourtScheduleExceptionWhereInput;
    orderBy?: Prisma.CourtScheduleExceptionOrderByWithRelationInput | Prisma.CourtScheduleExceptionOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleExceptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtScheduleExceptionScalarFieldEnum | Prisma.CourtScheduleExceptionScalarFieldEnum[];
};
export type CourtScheduleExceptionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    where?: Prisma.CourtScheduleExceptionWhereInput;
    orderBy?: Prisma.CourtScheduleExceptionOrderByWithRelationInput | Prisma.CourtScheduleExceptionOrderByWithRelationInput[];
    cursor?: Prisma.CourtScheduleExceptionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtScheduleExceptionScalarFieldEnum | Prisma.CourtScheduleExceptionScalarFieldEnum[];
};
export type CourtScheduleExceptionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtScheduleExceptionCreateInput, Prisma.CourtScheduleExceptionUncheckedCreateInput>;
};
export type CourtScheduleExceptionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourtScheduleExceptionCreateManyInput | Prisma.CourtScheduleExceptionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourtScheduleExceptionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    data: Prisma.CourtScheduleExceptionCreateManyInput | Prisma.CourtScheduleExceptionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourtScheduleExceptionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourtScheduleExceptionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtScheduleExceptionUpdateInput, Prisma.CourtScheduleExceptionUncheckedUpdateInput>;
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
};
export type CourtScheduleExceptionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourtScheduleExceptionUpdateManyMutationInput, Prisma.CourtScheduleExceptionUncheckedUpdateManyInput>;
    where?: Prisma.CourtScheduleExceptionWhereInput;
    limit?: number;
};
export type CourtScheduleExceptionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtScheduleExceptionUpdateManyMutationInput, Prisma.CourtScheduleExceptionUncheckedUpdateManyInput>;
    where?: Prisma.CourtScheduleExceptionWhereInput;
    limit?: number;
    include?: Prisma.CourtScheduleExceptionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourtScheduleExceptionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtScheduleExceptionCreateInput, Prisma.CourtScheduleExceptionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourtScheduleExceptionUpdateInput, Prisma.CourtScheduleExceptionUncheckedUpdateInput>;
};
export type CourtScheduleExceptionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
    where: Prisma.CourtScheduleExceptionWhereUniqueInput;
};
export type CourtScheduleExceptionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleExceptionWhereInput;
    limit?: number;
};
export type CourtScheduleExceptionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtScheduleExceptionSelect<ExtArgs> | null;
    omit?: Prisma.CourtScheduleExceptionOmit<ExtArgs> | null;
    include?: Prisma.CourtScheduleExceptionInclude<ExtArgs> | null;
};
export {};
