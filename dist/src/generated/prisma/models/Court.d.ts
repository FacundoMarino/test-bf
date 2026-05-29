import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CourtModel = runtime.Types.Result.DefaultSelection<Prisma.$CourtPayload>;
export type AggregateCourt = {
    _count: CourtCountAggregateOutputType | null;
    _min: CourtMinAggregateOutputType | null;
    _max: CourtMaxAggregateOutputType | null;
};
export type CourtMinAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: string | null;
    surface: string | null;
    lighting: boolean | null;
    listed: boolean | null;
    clubId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtMaxAggregateOutputType = {
    id: string | null;
    name: string | null;
    type: string | null;
    surface: string | null;
    lighting: boolean | null;
    listed: boolean | null;
    clubId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CourtCountAggregateOutputType = {
    id: number;
    name: number;
    type: number;
    surface: number;
    lighting: number;
    listed: number;
    clubId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CourtMinAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    surface?: true;
    lighting?: true;
    listed?: true;
    clubId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtMaxAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    surface?: true;
    lighting?: true;
    listed?: true;
    clubId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CourtCountAggregateInputType = {
    id?: true;
    name?: true;
    type?: true;
    surface?: true;
    lighting?: true;
    listed?: true;
    clubId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CourtAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtWhereInput;
    orderBy?: Prisma.CourtOrderByWithRelationInput | Prisma.CourtOrderByWithRelationInput[];
    cursor?: Prisma.CourtWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourtCountAggregateInputType;
    _min?: CourtMinAggregateInputType;
    _max?: CourtMaxAggregateInputType;
};
export type GetCourtAggregateType<T extends CourtAggregateArgs> = {
    [P in keyof T & keyof AggregateCourt]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourt[P]> : Prisma.GetScalarType<T[P], AggregateCourt[P]>;
};
export type CourtGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtWhereInput;
    orderBy?: Prisma.CourtOrderByWithAggregationInput | Prisma.CourtOrderByWithAggregationInput[];
    by: Prisma.CourtScalarFieldEnum[] | Prisma.CourtScalarFieldEnum;
    having?: Prisma.CourtScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourtCountAggregateInputType | true;
    _min?: CourtMinAggregateInputType;
    _max?: CourtMaxAggregateInputType;
};
export type CourtGroupByOutputType = {
    id: string;
    name: string;
    type: string;
    surface: string;
    lighting: boolean;
    listed: boolean;
    clubId: string;
    createdAt: Date;
    updatedAt: Date;
    _count: CourtCountAggregateOutputType | null;
    _min: CourtMinAggregateOutputType | null;
    _max: CourtMaxAggregateOutputType | null;
};
type GetCourtGroupByPayload<T extends CourtGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourtGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourtGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourtGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourtGroupByOutputType[P]>;
}>>;
export type CourtWhereInput = {
    AND?: Prisma.CourtWhereInput | Prisma.CourtWhereInput[];
    OR?: Prisma.CourtWhereInput[];
    NOT?: Prisma.CourtWhereInput | Prisma.CourtWhereInput[];
    id?: Prisma.UuidFilter<"Court"> | string;
    name?: Prisma.StringFilter<"Court"> | string;
    type?: Prisma.StringFilter<"Court"> | string;
    surface?: Prisma.StringFilter<"Court"> | string;
    lighting?: Prisma.BoolFilter<"Court"> | boolean;
    listed?: Prisma.BoolFilter<"Court"> | boolean;
    clubId?: Prisma.UuidFilter<"Court"> | string;
    createdAt?: Prisma.DateTimeFilter<"Court"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Court"> | Date | string;
    club?: Prisma.XOR<Prisma.ClubScalarRelationFilter, Prisma.ClubWhereInput>;
    schedules?: Prisma.CourtScheduleListRelationFilter;
    exceptions?: Prisma.CourtScheduleExceptionListRelationFilter;
    customSlots?: Prisma.CourtCustomSlotListRelationFilter;
    bookings?: Prisma.CourtBookingListRelationFilter;
};
export type CourtOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    lighting?: Prisma.SortOrder;
    listed?: Prisma.SortOrder;
    clubId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    club?: Prisma.ClubOrderByWithRelationInput;
    schedules?: Prisma.CourtScheduleOrderByRelationAggregateInput;
    exceptions?: Prisma.CourtScheduleExceptionOrderByRelationAggregateInput;
    customSlots?: Prisma.CourtCustomSlotOrderByRelationAggregateInput;
    bookings?: Prisma.CourtBookingOrderByRelationAggregateInput;
};
export type CourtWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CourtWhereInput | Prisma.CourtWhereInput[];
    OR?: Prisma.CourtWhereInput[];
    NOT?: Prisma.CourtWhereInput | Prisma.CourtWhereInput[];
    name?: Prisma.StringFilter<"Court"> | string;
    type?: Prisma.StringFilter<"Court"> | string;
    surface?: Prisma.StringFilter<"Court"> | string;
    lighting?: Prisma.BoolFilter<"Court"> | boolean;
    listed?: Prisma.BoolFilter<"Court"> | boolean;
    clubId?: Prisma.UuidFilter<"Court"> | string;
    createdAt?: Prisma.DateTimeFilter<"Court"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Court"> | Date | string;
    club?: Prisma.XOR<Prisma.ClubScalarRelationFilter, Prisma.ClubWhereInput>;
    schedules?: Prisma.CourtScheduleListRelationFilter;
    exceptions?: Prisma.CourtScheduleExceptionListRelationFilter;
    customSlots?: Prisma.CourtCustomSlotListRelationFilter;
    bookings?: Prisma.CourtBookingListRelationFilter;
}, "id">;
export type CourtOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    lighting?: Prisma.SortOrder;
    listed?: Prisma.SortOrder;
    clubId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CourtCountOrderByAggregateInput;
    _max?: Prisma.CourtMaxOrderByAggregateInput;
    _min?: Prisma.CourtMinOrderByAggregateInput;
};
export type CourtScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourtScalarWhereWithAggregatesInput | Prisma.CourtScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourtScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourtScalarWhereWithAggregatesInput | Prisma.CourtScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Court"> | string;
    name?: Prisma.StringWithAggregatesFilter<"Court"> | string;
    type?: Prisma.StringWithAggregatesFilter<"Court"> | string;
    surface?: Prisma.StringWithAggregatesFilter<"Court"> | string;
    lighting?: Prisma.BoolWithAggregatesFilter<"Court"> | boolean;
    listed?: Prisma.BoolWithAggregatesFilter<"Court"> | boolean;
    clubId?: Prisma.UuidWithAggregatesFilter<"Court"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Court"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Court"> | Date | string;
};
export type CourtCreateInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    club: Prisma.ClubCreateNestedOneWithoutCourtsInput;
    schedules?: Prisma.CourtScheduleCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingCreateNestedManyWithoutCourtInput;
};
export type CourtUncheckedCreateInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    clubId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    schedules?: Prisma.CourtScheduleUncheckedCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingUncheckedCreateNestedManyWithoutCourtInput;
};
export type CourtUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    club?: Prisma.ClubUpdateOneRequiredWithoutCourtsNestedInput;
    schedules?: Prisma.CourtScheduleUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUpdateManyWithoutCourtNestedInput;
};
export type CourtUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    clubId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    schedules?: Prisma.CourtScheduleUncheckedUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUncheckedUpdateManyWithoutCourtNestedInput;
};
export type CourtCreateManyInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    clubId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    clubId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtListRelationFilter = {
    every?: Prisma.CourtWhereInput;
    some?: Prisma.CourtWhereInput;
    none?: Prisma.CourtWhereInput;
};
export type CourtOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourtCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    lighting?: Prisma.SortOrder;
    listed?: Prisma.SortOrder;
    clubId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    lighting?: Prisma.SortOrder;
    listed?: Prisma.SortOrder;
    clubId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    surface?: Prisma.SortOrder;
    lighting?: Prisma.SortOrder;
    listed?: Prisma.SortOrder;
    clubId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CourtScalarRelationFilter = {
    is?: Prisma.CourtWhereInput;
    isNot?: Prisma.CourtWhereInput;
};
export type CourtCreateNestedManyWithoutClubInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutClubInput, Prisma.CourtUncheckedCreateWithoutClubInput> | Prisma.CourtCreateWithoutClubInput[] | Prisma.CourtUncheckedCreateWithoutClubInput[];
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutClubInput | Prisma.CourtCreateOrConnectWithoutClubInput[];
    createMany?: Prisma.CourtCreateManyClubInputEnvelope;
    connect?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
};
export type CourtUncheckedCreateNestedManyWithoutClubInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutClubInput, Prisma.CourtUncheckedCreateWithoutClubInput> | Prisma.CourtCreateWithoutClubInput[] | Prisma.CourtUncheckedCreateWithoutClubInput[];
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutClubInput | Prisma.CourtCreateOrConnectWithoutClubInput[];
    createMany?: Prisma.CourtCreateManyClubInputEnvelope;
    connect?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
};
export type CourtUpdateManyWithoutClubNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutClubInput, Prisma.CourtUncheckedCreateWithoutClubInput> | Prisma.CourtCreateWithoutClubInput[] | Prisma.CourtUncheckedCreateWithoutClubInput[];
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutClubInput | Prisma.CourtCreateOrConnectWithoutClubInput[];
    upsert?: Prisma.CourtUpsertWithWhereUniqueWithoutClubInput | Prisma.CourtUpsertWithWhereUniqueWithoutClubInput[];
    createMany?: Prisma.CourtCreateManyClubInputEnvelope;
    set?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    disconnect?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    delete?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    connect?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    update?: Prisma.CourtUpdateWithWhereUniqueWithoutClubInput | Prisma.CourtUpdateWithWhereUniqueWithoutClubInput[];
    updateMany?: Prisma.CourtUpdateManyWithWhereWithoutClubInput | Prisma.CourtUpdateManyWithWhereWithoutClubInput[];
    deleteMany?: Prisma.CourtScalarWhereInput | Prisma.CourtScalarWhereInput[];
};
export type CourtUncheckedUpdateManyWithoutClubNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutClubInput, Prisma.CourtUncheckedCreateWithoutClubInput> | Prisma.CourtCreateWithoutClubInput[] | Prisma.CourtUncheckedCreateWithoutClubInput[];
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutClubInput | Prisma.CourtCreateOrConnectWithoutClubInput[];
    upsert?: Prisma.CourtUpsertWithWhereUniqueWithoutClubInput | Prisma.CourtUpsertWithWhereUniqueWithoutClubInput[];
    createMany?: Prisma.CourtCreateManyClubInputEnvelope;
    set?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    disconnect?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    delete?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    connect?: Prisma.CourtWhereUniqueInput | Prisma.CourtWhereUniqueInput[];
    update?: Prisma.CourtUpdateWithWhereUniqueWithoutClubInput | Prisma.CourtUpdateWithWhereUniqueWithoutClubInput[];
    updateMany?: Prisma.CourtUpdateManyWithWhereWithoutClubInput | Prisma.CourtUpdateManyWithWhereWithoutClubInput[];
    deleteMany?: Prisma.CourtScalarWhereInput | Prisma.CourtScalarWhereInput[];
};
export type CourtCreateNestedOneWithoutCustomSlotsInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutCustomSlotsInput, Prisma.CourtUncheckedCreateWithoutCustomSlotsInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutCustomSlotsInput;
    connect?: Prisma.CourtWhereUniqueInput;
};
export type CourtUpdateOneRequiredWithoutCustomSlotsNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutCustomSlotsInput, Prisma.CourtUncheckedCreateWithoutCustomSlotsInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutCustomSlotsInput;
    upsert?: Prisma.CourtUpsertWithoutCustomSlotsInput;
    connect?: Prisma.CourtWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourtUpdateToOneWithWhereWithoutCustomSlotsInput, Prisma.CourtUpdateWithoutCustomSlotsInput>, Prisma.CourtUncheckedUpdateWithoutCustomSlotsInput>;
};
export type CourtCreateNestedOneWithoutExceptionsInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutExceptionsInput, Prisma.CourtUncheckedCreateWithoutExceptionsInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutExceptionsInput;
    connect?: Prisma.CourtWhereUniqueInput;
};
export type CourtUpdateOneRequiredWithoutExceptionsNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutExceptionsInput, Prisma.CourtUncheckedCreateWithoutExceptionsInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutExceptionsInput;
    upsert?: Prisma.CourtUpsertWithoutExceptionsInput;
    connect?: Prisma.CourtWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourtUpdateToOneWithWhereWithoutExceptionsInput, Prisma.CourtUpdateWithoutExceptionsInput>, Prisma.CourtUncheckedUpdateWithoutExceptionsInput>;
};
export type CourtCreateNestedOneWithoutSchedulesInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutSchedulesInput, Prisma.CourtUncheckedCreateWithoutSchedulesInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutSchedulesInput;
    connect?: Prisma.CourtWhereUniqueInput;
};
export type CourtUpdateOneRequiredWithoutSchedulesNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutSchedulesInput, Prisma.CourtUncheckedCreateWithoutSchedulesInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutSchedulesInput;
    upsert?: Prisma.CourtUpsertWithoutSchedulesInput;
    connect?: Prisma.CourtWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourtUpdateToOneWithWhereWithoutSchedulesInput, Prisma.CourtUpdateWithoutSchedulesInput>, Prisma.CourtUncheckedUpdateWithoutSchedulesInput>;
};
export type CourtCreateNestedOneWithoutBookingsInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutBookingsInput, Prisma.CourtUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutBookingsInput;
    connect?: Prisma.CourtWhereUniqueInput;
};
export type CourtUpdateOneRequiredWithoutBookingsNestedInput = {
    create?: Prisma.XOR<Prisma.CourtCreateWithoutBookingsInput, Prisma.CourtUncheckedCreateWithoutBookingsInput>;
    connectOrCreate?: Prisma.CourtCreateOrConnectWithoutBookingsInput;
    upsert?: Prisma.CourtUpsertWithoutBookingsInput;
    connect?: Prisma.CourtWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourtUpdateToOneWithWhereWithoutBookingsInput, Prisma.CourtUpdateWithoutBookingsInput>, Prisma.CourtUncheckedUpdateWithoutBookingsInput>;
};
export type CourtCreateWithoutClubInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    schedules?: Prisma.CourtScheduleCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingCreateNestedManyWithoutCourtInput;
};
export type CourtUncheckedCreateWithoutClubInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    schedules?: Prisma.CourtScheduleUncheckedCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingUncheckedCreateNestedManyWithoutCourtInput;
};
export type CourtCreateOrConnectWithoutClubInput = {
    where: Prisma.CourtWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCreateWithoutClubInput, Prisma.CourtUncheckedCreateWithoutClubInput>;
};
export type CourtCreateManyClubInputEnvelope = {
    data: Prisma.CourtCreateManyClubInput | Prisma.CourtCreateManyClubInput[];
    skipDuplicates?: boolean;
};
export type CourtUpsertWithWhereUniqueWithoutClubInput = {
    where: Prisma.CourtWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtUpdateWithoutClubInput, Prisma.CourtUncheckedUpdateWithoutClubInput>;
    create: Prisma.XOR<Prisma.CourtCreateWithoutClubInput, Prisma.CourtUncheckedCreateWithoutClubInput>;
};
export type CourtUpdateWithWhereUniqueWithoutClubInput = {
    where: Prisma.CourtWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtUpdateWithoutClubInput, Prisma.CourtUncheckedUpdateWithoutClubInput>;
};
export type CourtUpdateManyWithWhereWithoutClubInput = {
    where: Prisma.CourtScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtUpdateManyMutationInput, Prisma.CourtUncheckedUpdateManyWithoutClubInput>;
};
export type CourtScalarWhereInput = {
    AND?: Prisma.CourtScalarWhereInput | Prisma.CourtScalarWhereInput[];
    OR?: Prisma.CourtScalarWhereInput[];
    NOT?: Prisma.CourtScalarWhereInput | Prisma.CourtScalarWhereInput[];
    id?: Prisma.UuidFilter<"Court"> | string;
    name?: Prisma.StringFilter<"Court"> | string;
    type?: Prisma.StringFilter<"Court"> | string;
    surface?: Prisma.StringFilter<"Court"> | string;
    lighting?: Prisma.BoolFilter<"Court"> | boolean;
    listed?: Prisma.BoolFilter<"Court"> | boolean;
    clubId?: Prisma.UuidFilter<"Court"> | string;
    createdAt?: Prisma.DateTimeFilter<"Court"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Court"> | Date | string;
};
export type CourtCreateWithoutCustomSlotsInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    club: Prisma.ClubCreateNestedOneWithoutCourtsInput;
    schedules?: Prisma.CourtScheduleCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingCreateNestedManyWithoutCourtInput;
};
export type CourtUncheckedCreateWithoutCustomSlotsInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    clubId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    schedules?: Prisma.CourtScheduleUncheckedCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingUncheckedCreateNestedManyWithoutCourtInput;
};
export type CourtCreateOrConnectWithoutCustomSlotsInput = {
    where: Prisma.CourtWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCreateWithoutCustomSlotsInput, Prisma.CourtUncheckedCreateWithoutCustomSlotsInput>;
};
export type CourtUpsertWithoutCustomSlotsInput = {
    update: Prisma.XOR<Prisma.CourtUpdateWithoutCustomSlotsInput, Prisma.CourtUncheckedUpdateWithoutCustomSlotsInput>;
    create: Prisma.XOR<Prisma.CourtCreateWithoutCustomSlotsInput, Prisma.CourtUncheckedCreateWithoutCustomSlotsInput>;
    where?: Prisma.CourtWhereInput;
};
export type CourtUpdateToOneWithWhereWithoutCustomSlotsInput = {
    where?: Prisma.CourtWhereInput;
    data: Prisma.XOR<Prisma.CourtUpdateWithoutCustomSlotsInput, Prisma.CourtUncheckedUpdateWithoutCustomSlotsInput>;
};
export type CourtUpdateWithoutCustomSlotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    club?: Prisma.ClubUpdateOneRequiredWithoutCourtsNestedInput;
    schedules?: Prisma.CourtScheduleUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUpdateManyWithoutCourtNestedInput;
};
export type CourtUncheckedUpdateWithoutCustomSlotsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    clubId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    schedules?: Prisma.CourtScheduleUncheckedUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUncheckedUpdateManyWithoutCourtNestedInput;
};
export type CourtCreateWithoutExceptionsInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    club: Prisma.ClubCreateNestedOneWithoutCourtsInput;
    schedules?: Prisma.CourtScheduleCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingCreateNestedManyWithoutCourtInput;
};
export type CourtUncheckedCreateWithoutExceptionsInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    clubId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    schedules?: Prisma.CourtScheduleUncheckedCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingUncheckedCreateNestedManyWithoutCourtInput;
};
export type CourtCreateOrConnectWithoutExceptionsInput = {
    where: Prisma.CourtWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCreateWithoutExceptionsInput, Prisma.CourtUncheckedCreateWithoutExceptionsInput>;
};
export type CourtUpsertWithoutExceptionsInput = {
    update: Prisma.XOR<Prisma.CourtUpdateWithoutExceptionsInput, Prisma.CourtUncheckedUpdateWithoutExceptionsInput>;
    create: Prisma.XOR<Prisma.CourtCreateWithoutExceptionsInput, Prisma.CourtUncheckedCreateWithoutExceptionsInput>;
    where?: Prisma.CourtWhereInput;
};
export type CourtUpdateToOneWithWhereWithoutExceptionsInput = {
    where?: Prisma.CourtWhereInput;
    data: Prisma.XOR<Prisma.CourtUpdateWithoutExceptionsInput, Prisma.CourtUncheckedUpdateWithoutExceptionsInput>;
};
export type CourtUpdateWithoutExceptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    club?: Prisma.ClubUpdateOneRequiredWithoutCourtsNestedInput;
    schedules?: Prisma.CourtScheduleUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUpdateManyWithoutCourtNestedInput;
};
export type CourtUncheckedUpdateWithoutExceptionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    clubId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    schedules?: Prisma.CourtScheduleUncheckedUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUncheckedUpdateManyWithoutCourtNestedInput;
};
export type CourtCreateWithoutSchedulesInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    club: Prisma.ClubCreateNestedOneWithoutCourtsInput;
    exceptions?: Prisma.CourtScheduleExceptionCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingCreateNestedManyWithoutCourtInput;
};
export type CourtUncheckedCreateWithoutSchedulesInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    clubId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedCreateNestedManyWithoutCourtInput;
    bookings?: Prisma.CourtBookingUncheckedCreateNestedManyWithoutCourtInput;
};
export type CourtCreateOrConnectWithoutSchedulesInput = {
    where: Prisma.CourtWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCreateWithoutSchedulesInput, Prisma.CourtUncheckedCreateWithoutSchedulesInput>;
};
export type CourtUpsertWithoutSchedulesInput = {
    update: Prisma.XOR<Prisma.CourtUpdateWithoutSchedulesInput, Prisma.CourtUncheckedUpdateWithoutSchedulesInput>;
    create: Prisma.XOR<Prisma.CourtCreateWithoutSchedulesInput, Prisma.CourtUncheckedCreateWithoutSchedulesInput>;
    where?: Prisma.CourtWhereInput;
};
export type CourtUpdateToOneWithWhereWithoutSchedulesInput = {
    where?: Prisma.CourtWhereInput;
    data: Prisma.XOR<Prisma.CourtUpdateWithoutSchedulesInput, Prisma.CourtUncheckedUpdateWithoutSchedulesInput>;
};
export type CourtUpdateWithoutSchedulesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    club?: Prisma.ClubUpdateOneRequiredWithoutCourtsNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUpdateManyWithoutCourtNestedInput;
};
export type CourtUncheckedUpdateWithoutSchedulesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    clubId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUncheckedUpdateManyWithoutCourtNestedInput;
};
export type CourtCreateWithoutBookingsInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    club: Prisma.ClubCreateNestedOneWithoutCourtsInput;
    schedules?: Prisma.CourtScheduleCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotCreateNestedManyWithoutCourtInput;
};
export type CourtUncheckedCreateWithoutBookingsInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    clubId: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    schedules?: Prisma.CourtScheduleUncheckedCreateNestedManyWithoutCourtInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedCreateNestedManyWithoutCourtInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedCreateNestedManyWithoutCourtInput;
};
export type CourtCreateOrConnectWithoutBookingsInput = {
    where: Prisma.CourtWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCreateWithoutBookingsInput, Prisma.CourtUncheckedCreateWithoutBookingsInput>;
};
export type CourtUpsertWithoutBookingsInput = {
    update: Prisma.XOR<Prisma.CourtUpdateWithoutBookingsInput, Prisma.CourtUncheckedUpdateWithoutBookingsInput>;
    create: Prisma.XOR<Prisma.CourtCreateWithoutBookingsInput, Prisma.CourtUncheckedCreateWithoutBookingsInput>;
    where?: Prisma.CourtWhereInput;
};
export type CourtUpdateToOneWithWhereWithoutBookingsInput = {
    where?: Prisma.CourtWhereInput;
    data: Prisma.XOR<Prisma.CourtUpdateWithoutBookingsInput, Prisma.CourtUncheckedUpdateWithoutBookingsInput>;
};
export type CourtUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    club?: Prisma.ClubUpdateOneRequiredWithoutCourtsNestedInput;
    schedules?: Prisma.CourtScheduleUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUpdateManyWithoutCourtNestedInput;
};
export type CourtUncheckedUpdateWithoutBookingsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    clubId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    schedules?: Prisma.CourtScheduleUncheckedUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedUpdateManyWithoutCourtNestedInput;
};
export type CourtCreateManyClubInput = {
    id?: string;
    name: string;
    type: string;
    surface: string;
    lighting?: boolean;
    listed?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CourtUpdateWithoutClubInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    schedules?: Prisma.CourtScheduleUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUpdateManyWithoutCourtNestedInput;
};
export type CourtUncheckedUpdateWithoutClubInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    schedules?: Prisma.CourtScheduleUncheckedUpdateManyWithoutCourtNestedInput;
    exceptions?: Prisma.CourtScheduleExceptionUncheckedUpdateManyWithoutCourtNestedInput;
    customSlots?: Prisma.CourtCustomSlotUncheckedUpdateManyWithoutCourtNestedInput;
    bookings?: Prisma.CourtBookingUncheckedUpdateManyWithoutCourtNestedInput;
};
export type CourtUncheckedUpdateManyWithoutClubInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    type?: Prisma.StringFieldUpdateOperationsInput | string;
    surface?: Prisma.StringFieldUpdateOperationsInput | string;
    lighting?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    listed?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtCountOutputType = {
    schedules: number;
    exceptions: number;
    customSlots: number;
    bookings: number;
};
export type CourtCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    schedules?: boolean | CourtCountOutputTypeCountSchedulesArgs;
    exceptions?: boolean | CourtCountOutputTypeCountExceptionsArgs;
    customSlots?: boolean | CourtCountOutputTypeCountCustomSlotsArgs;
    bookings?: boolean | CourtCountOutputTypeCountBookingsArgs;
};
export type CourtCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtCountOutputTypeSelect<ExtArgs> | null;
};
export type CourtCountOutputTypeCountSchedulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleWhereInput;
};
export type CourtCountOutputTypeCountExceptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtScheduleExceptionWhereInput;
};
export type CourtCountOutputTypeCountCustomSlotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtCustomSlotWhereInput;
};
export type CourtCountOutputTypeCountBookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtBookingWhereInput;
};
export type CourtSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    type?: boolean;
    surface?: boolean;
    lighting?: boolean;
    listed?: boolean;
    clubId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    club?: boolean | Prisma.ClubDefaultArgs<ExtArgs>;
    schedules?: boolean | Prisma.Court$schedulesArgs<ExtArgs>;
    exceptions?: boolean | Prisma.Court$exceptionsArgs<ExtArgs>;
    customSlots?: boolean | Prisma.Court$customSlotsArgs<ExtArgs>;
    bookings?: boolean | Prisma.Court$bookingsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourtCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["court"]>;
export type CourtSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    type?: boolean;
    surface?: boolean;
    lighting?: boolean;
    listed?: boolean;
    clubId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    club?: boolean | Prisma.ClubDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["court"]>;
export type CourtSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    type?: boolean;
    surface?: boolean;
    lighting?: boolean;
    listed?: boolean;
    clubId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    club?: boolean | Prisma.ClubDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["court"]>;
export type CourtSelectScalar = {
    id?: boolean;
    name?: boolean;
    type?: boolean;
    surface?: boolean;
    lighting?: boolean;
    listed?: boolean;
    clubId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CourtOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "type" | "surface" | "lighting" | "listed" | "clubId" | "createdAt" | "updatedAt", ExtArgs["result"]["court"]>;
export type CourtInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    club?: boolean | Prisma.ClubDefaultArgs<ExtArgs>;
    schedules?: boolean | Prisma.Court$schedulesArgs<ExtArgs>;
    exceptions?: boolean | Prisma.Court$exceptionsArgs<ExtArgs>;
    customSlots?: boolean | Prisma.Court$customSlotsArgs<ExtArgs>;
    bookings?: boolean | Prisma.Court$bookingsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourtCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CourtIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    club?: boolean | Prisma.ClubDefaultArgs<ExtArgs>;
};
export type CourtIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    club?: boolean | Prisma.ClubDefaultArgs<ExtArgs>;
};
export type $CourtPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Court";
    objects: {
        club: Prisma.$ClubPayload<ExtArgs>;
        schedules: Prisma.$CourtSchedulePayload<ExtArgs>[];
        exceptions: Prisma.$CourtScheduleExceptionPayload<ExtArgs>[];
        customSlots: Prisma.$CourtCustomSlotPayload<ExtArgs>[];
        bookings: Prisma.$CourtBookingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        name: string;
        type: string;
        surface: string;
        lighting: boolean;
        listed: boolean;
        clubId: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["court"]>;
    composites: {};
};
export type CourtGetPayload<S extends boolean | null | undefined | CourtDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourtPayload, S>;
export type CourtCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourtFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourtCountAggregateInputType | true;
};
export interface CourtDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Court'];
        meta: {
            name: 'Court';
        };
    };
    findUnique<T extends CourtFindUniqueArgs>(args: Prisma.SelectSubset<T, CourtFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourtFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourtFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourtFindFirstArgs>(args?: Prisma.SelectSubset<T, CourtFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourtFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourtFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourtFindManyArgs>(args?: Prisma.SelectSubset<T, CourtFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourtCreateArgs>(args: Prisma.SelectSubset<T, CourtCreateArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourtCreateManyArgs>(args?: Prisma.SelectSubset<T, CourtCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourtCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourtCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourtDeleteArgs>(args: Prisma.SelectSubset<T, CourtDeleteArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourtUpdateArgs>(args: Prisma.SelectSubset<T, CourtUpdateArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourtDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourtDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourtUpdateManyArgs>(args: Prisma.SelectSubset<T, CourtUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourtUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourtUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourtUpsertArgs>(args: Prisma.SelectSubset<T, CourtUpsertArgs<ExtArgs>>): Prisma.Prisma__CourtClient<runtime.Types.Result.GetResult<Prisma.$CourtPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourtCountArgs>(args?: Prisma.Subset<T, CourtCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourtCountAggregateOutputType> : number>;
    aggregate<T extends CourtAggregateArgs>(args: Prisma.Subset<T, CourtAggregateArgs>): Prisma.PrismaPromise<GetCourtAggregateType<T>>;
    groupBy<T extends CourtGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourtGroupByArgs['orderBy'];
    } : {
        orderBy?: CourtGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourtGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourtGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourtFieldRefs;
}
export interface Prisma__CourtClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    club<T extends Prisma.ClubDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ClubDefaultArgs<ExtArgs>>): Prisma.Prisma__ClubClient<runtime.Types.Result.GetResult<Prisma.$ClubPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    schedules<T extends Prisma.Court$schedulesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Court$schedulesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtSchedulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    exceptions<T extends Prisma.Court$exceptionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Court$exceptionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtScheduleExceptionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    customSlots<T extends Prisma.Court$customSlotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Court$customSlotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtCustomSlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    bookings<T extends Prisma.Court$bookingsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Court$bookingsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtBookingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourtFieldRefs {
    readonly id: Prisma.FieldRef<"Court", 'String'>;
    readonly name: Prisma.FieldRef<"Court", 'String'>;
    readonly type: Prisma.FieldRef<"Court", 'String'>;
    readonly surface: Prisma.FieldRef<"Court", 'String'>;
    readonly lighting: Prisma.FieldRef<"Court", 'Boolean'>;
    readonly listed: Prisma.FieldRef<"Court", 'Boolean'>;
    readonly clubId: Prisma.FieldRef<"Court", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Court", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Court", 'DateTime'>;
}
export type CourtFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
    where: Prisma.CourtWhereUniqueInput;
};
export type CourtFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
    where: Prisma.CourtWhereUniqueInput;
};
export type CourtFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourtFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourtFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CourtCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtCreateInput, Prisma.CourtUncheckedCreateInput>;
};
export type CourtCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourtCreateManyInput | Prisma.CourtCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourtCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    data: Prisma.CourtCreateManyInput | Prisma.CourtCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourtIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourtUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtUpdateInput, Prisma.CourtUncheckedUpdateInput>;
    where: Prisma.CourtWhereUniqueInput;
};
export type CourtUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourtUpdateManyMutationInput, Prisma.CourtUncheckedUpdateManyInput>;
    where?: Prisma.CourtWhereInput;
    limit?: number;
};
export type CourtUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtUpdateManyMutationInput, Prisma.CourtUncheckedUpdateManyInput>;
    where?: Prisma.CourtWhereInput;
    limit?: number;
    include?: Prisma.CourtIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourtUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
    where: Prisma.CourtWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtCreateInput, Prisma.CourtUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourtUpdateInput, Prisma.CourtUncheckedUpdateInput>;
};
export type CourtDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
    where: Prisma.CourtWhereUniqueInput;
};
export type CourtDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtWhereInput;
    limit?: number;
};
export type Court$schedulesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Court$exceptionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Court$customSlotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type Court$bookingsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingInclude<ExtArgs> | null;
    where?: Prisma.CourtBookingWhereInput;
    orderBy?: Prisma.CourtBookingOrderByWithRelationInput | Prisma.CourtBookingOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtBookingScalarFieldEnum | Prisma.CourtBookingScalarFieldEnum[];
};
export type CourtDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtSelect<ExtArgs> | null;
    omit?: Prisma.CourtOmit<ExtArgs> | null;
    include?: Prisma.CourtInclude<ExtArgs> | null;
};
export {};
