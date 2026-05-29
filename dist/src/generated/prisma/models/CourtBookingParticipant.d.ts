import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CourtBookingParticipantModel = runtime.Types.Result.DefaultSelection<Prisma.$CourtBookingParticipantPayload>;
export type AggregateCourtBookingParticipant = {
    _count: CourtBookingParticipantCountAggregateOutputType | null;
    _min: CourtBookingParticipantMinAggregateOutputType | null;
    _max: CourtBookingParticipantMaxAggregateOutputType | null;
};
export type CourtBookingParticipantMinAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    profileId: string | null;
    createdAt: Date | null;
};
export type CourtBookingParticipantMaxAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    profileId: string | null;
    createdAt: Date | null;
};
export type CourtBookingParticipantCountAggregateOutputType = {
    id: number;
    bookingId: number;
    profileId: number;
    createdAt: number;
    _all: number;
};
export type CourtBookingParticipantMinAggregateInputType = {
    id?: true;
    bookingId?: true;
    profileId?: true;
    createdAt?: true;
};
export type CourtBookingParticipantMaxAggregateInputType = {
    id?: true;
    bookingId?: true;
    profileId?: true;
    createdAt?: true;
};
export type CourtBookingParticipantCountAggregateInputType = {
    id?: true;
    bookingId?: true;
    profileId?: true;
    createdAt?: true;
    _all?: true;
};
export type CourtBookingParticipantAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtBookingParticipantWhereInput;
    orderBy?: Prisma.CourtBookingParticipantOrderByWithRelationInput | Prisma.CourtBookingParticipantOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourtBookingParticipantCountAggregateInputType;
    _min?: CourtBookingParticipantMinAggregateInputType;
    _max?: CourtBookingParticipantMaxAggregateInputType;
};
export type GetCourtBookingParticipantAggregateType<T extends CourtBookingParticipantAggregateArgs> = {
    [P in keyof T & keyof AggregateCourtBookingParticipant]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourtBookingParticipant[P]> : Prisma.GetScalarType<T[P], AggregateCourtBookingParticipant[P]>;
};
export type CourtBookingParticipantGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtBookingParticipantWhereInput;
    orderBy?: Prisma.CourtBookingParticipantOrderByWithAggregationInput | Prisma.CourtBookingParticipantOrderByWithAggregationInput[];
    by: Prisma.CourtBookingParticipantScalarFieldEnum[] | Prisma.CourtBookingParticipantScalarFieldEnum;
    having?: Prisma.CourtBookingParticipantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourtBookingParticipantCountAggregateInputType | true;
    _min?: CourtBookingParticipantMinAggregateInputType;
    _max?: CourtBookingParticipantMaxAggregateInputType;
};
export type CourtBookingParticipantGroupByOutputType = {
    id: string;
    bookingId: string;
    profileId: string;
    createdAt: Date;
    _count: CourtBookingParticipantCountAggregateOutputType | null;
    _min: CourtBookingParticipantMinAggregateOutputType | null;
    _max: CourtBookingParticipantMaxAggregateOutputType | null;
};
type GetCourtBookingParticipantGroupByPayload<T extends CourtBookingParticipantGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourtBookingParticipantGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourtBookingParticipantGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourtBookingParticipantGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourtBookingParticipantGroupByOutputType[P]>;
}>>;
export type CourtBookingParticipantWhereInput = {
    AND?: Prisma.CourtBookingParticipantWhereInput | Prisma.CourtBookingParticipantWhereInput[];
    OR?: Prisma.CourtBookingParticipantWhereInput[];
    NOT?: Prisma.CourtBookingParticipantWhereInput | Prisma.CourtBookingParticipantWhereInput[];
    id?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    bookingId?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    profileId?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    createdAt?: Prisma.DateTimeFilter<"CourtBookingParticipant"> | Date | string;
    booking?: Prisma.XOR<Prisma.CourtBookingScalarRelationFilter, Prisma.CourtBookingWhereInput>;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
};
export type CourtBookingParticipantOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    booking?: Prisma.CourtBookingOrderByWithRelationInput;
    profile?: Prisma.ProfileOrderByWithRelationInput;
};
export type CourtBookingParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    bookingId_profileId?: Prisma.CourtBookingParticipantBookingIdProfileIdCompoundUniqueInput;
    AND?: Prisma.CourtBookingParticipantWhereInput | Prisma.CourtBookingParticipantWhereInput[];
    OR?: Prisma.CourtBookingParticipantWhereInput[];
    NOT?: Prisma.CourtBookingParticipantWhereInput | Prisma.CourtBookingParticipantWhereInput[];
    bookingId?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    profileId?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    createdAt?: Prisma.DateTimeFilter<"CourtBookingParticipant"> | Date | string;
    booking?: Prisma.XOR<Prisma.CourtBookingScalarRelationFilter, Prisma.CourtBookingWhereInput>;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
}, "id" | "bookingId_profileId">;
export type CourtBookingParticipantOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CourtBookingParticipantCountOrderByAggregateInput;
    _max?: Prisma.CourtBookingParticipantMaxOrderByAggregateInput;
    _min?: Prisma.CourtBookingParticipantMinOrderByAggregateInput;
};
export type CourtBookingParticipantScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourtBookingParticipantScalarWhereWithAggregatesInput | Prisma.CourtBookingParticipantScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourtBookingParticipantScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourtBookingParticipantScalarWhereWithAggregatesInput | Prisma.CourtBookingParticipantScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"CourtBookingParticipant"> | string;
    bookingId?: Prisma.UuidWithAggregatesFilter<"CourtBookingParticipant"> | string;
    profileId?: Prisma.UuidWithAggregatesFilter<"CourtBookingParticipant"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CourtBookingParticipant"> | Date | string;
};
export type CourtBookingParticipantCreateInput = {
    id?: string;
    createdAt?: Date | string;
    booking: Prisma.CourtBookingCreateNestedOneWithoutParticipantsInput;
    profile: Prisma.ProfileCreateNestedOneWithoutBookingParticipantsInput;
};
export type CourtBookingParticipantUncheckedCreateInput = {
    id?: string;
    bookingId: string;
    profileId: string;
    createdAt?: Date | string;
};
export type CourtBookingParticipantUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.CourtBookingUpdateOneRequiredWithoutParticipantsNestedInput;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutBookingParticipantsNestedInput;
};
export type CourtBookingParticipantUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingParticipantCreateManyInput = {
    id?: string;
    bookingId: string;
    profileId: string;
    createdAt?: Date | string;
};
export type CourtBookingParticipantUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingParticipantUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingParticipantListRelationFilter = {
    every?: Prisma.CourtBookingParticipantWhereInput;
    some?: Prisma.CourtBookingParticipantWhereInput;
    none?: Prisma.CourtBookingParticipantWhereInput;
};
export type CourtBookingParticipantOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourtBookingParticipantBookingIdProfileIdCompoundUniqueInput = {
    bookingId: string;
    profileId: string;
};
export type CourtBookingParticipantCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourtBookingParticipantMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourtBookingParticipantMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourtBookingParticipantCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput> | Prisma.CourtBookingParticipantCreateWithoutProfileInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyProfileInputEnvelope;
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
};
export type CourtBookingParticipantUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput> | Prisma.CourtBookingParticipantCreateWithoutProfileInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyProfileInputEnvelope;
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
};
export type CourtBookingParticipantUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput> | Prisma.CourtBookingParticipantCreateWithoutProfileInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutProfileInput | Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyProfileInputEnvelope;
    set?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    delete?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    update?: Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutProfileInput | Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutProfileInput | Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.CourtBookingParticipantScalarWhereInput | Prisma.CourtBookingParticipantScalarWhereInput[];
};
export type CourtBookingParticipantUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput> | Prisma.CourtBookingParticipantCreateWithoutProfileInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutProfileInput | Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyProfileInputEnvelope;
    set?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    delete?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    update?: Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutProfileInput | Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutProfileInput | Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.CourtBookingParticipantScalarWhereInput | Prisma.CourtBookingParticipantScalarWhereInput[];
};
export type CourtBookingParticipantCreateNestedManyWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingParticipantCreateWithoutBookingInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyBookingInputEnvelope;
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
};
export type CourtBookingParticipantUncheckedCreateNestedManyWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingParticipantCreateWithoutBookingInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyBookingInputEnvelope;
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
};
export type CourtBookingParticipantUpdateManyWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingParticipantCreateWithoutBookingInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput[];
    upsert?: Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutBookingInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyBookingInputEnvelope;
    set?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    delete?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    update?: Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutBookingInput[];
    updateMany?: Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutBookingInput | Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutBookingInput[];
    deleteMany?: Prisma.CourtBookingParticipantScalarWhereInput | Prisma.CourtBookingParticipantScalarWhereInput[];
};
export type CourtBookingParticipantUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingParticipantCreateWithoutBookingInput[] | Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput | Prisma.CourtBookingParticipantCreateOrConnectWithoutBookingInput[];
    upsert?: Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingParticipantUpsertWithWhereUniqueWithoutBookingInput[];
    createMany?: Prisma.CourtBookingParticipantCreateManyBookingInputEnvelope;
    set?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    delete?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    connect?: Prisma.CourtBookingParticipantWhereUniqueInput | Prisma.CourtBookingParticipantWhereUniqueInput[];
    update?: Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingParticipantUpdateWithWhereUniqueWithoutBookingInput[];
    updateMany?: Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutBookingInput | Prisma.CourtBookingParticipantUpdateManyWithWhereWithoutBookingInput[];
    deleteMany?: Prisma.CourtBookingParticipantScalarWhereInput | Prisma.CourtBookingParticipantScalarWhereInput[];
};
export type CourtBookingParticipantCreateWithoutProfileInput = {
    id?: string;
    createdAt?: Date | string;
    booking: Prisma.CourtBookingCreateNestedOneWithoutParticipantsInput;
};
export type CourtBookingParticipantUncheckedCreateWithoutProfileInput = {
    id?: string;
    bookingId: string;
    createdAt?: Date | string;
};
export type CourtBookingParticipantCreateOrConnectWithoutProfileInput = {
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput>;
};
export type CourtBookingParticipantCreateManyProfileInputEnvelope = {
    data: Prisma.CourtBookingParticipantCreateManyProfileInput | Prisma.CourtBookingParticipantCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type CourtBookingParticipantUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtBookingParticipantUpdateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutProfileInput>;
};
export type CourtBookingParticipantUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtBookingParticipantUpdateWithoutProfileInput, Prisma.CourtBookingParticipantUncheckedUpdateWithoutProfileInput>;
};
export type CourtBookingParticipantUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.CourtBookingParticipantScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtBookingParticipantUpdateManyMutationInput, Prisma.CourtBookingParticipantUncheckedUpdateManyWithoutProfileInput>;
};
export type CourtBookingParticipantScalarWhereInput = {
    AND?: Prisma.CourtBookingParticipantScalarWhereInput | Prisma.CourtBookingParticipantScalarWhereInput[];
    OR?: Prisma.CourtBookingParticipantScalarWhereInput[];
    NOT?: Prisma.CourtBookingParticipantScalarWhereInput | Prisma.CourtBookingParticipantScalarWhereInput[];
    id?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    bookingId?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    profileId?: Prisma.UuidFilter<"CourtBookingParticipant"> | string;
    createdAt?: Prisma.DateTimeFilter<"CourtBookingParticipant"> | Date | string;
};
export type CourtBookingParticipantCreateWithoutBookingInput = {
    id?: string;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutBookingParticipantsInput;
};
export type CourtBookingParticipantUncheckedCreateWithoutBookingInput = {
    id?: string;
    profileId: string;
    createdAt?: Date | string;
};
export type CourtBookingParticipantCreateOrConnectWithoutBookingInput = {
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput>;
};
export type CourtBookingParticipantCreateManyBookingInputEnvelope = {
    data: Prisma.CourtBookingParticipantCreateManyBookingInput | Prisma.CourtBookingParticipantCreateManyBookingInput[];
    skipDuplicates?: boolean;
};
export type CourtBookingParticipantUpsertWithWhereUniqueWithoutBookingInput = {
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtBookingParticipantUpdateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedUpdateWithoutBookingInput>;
    create: Prisma.XOR<Prisma.CourtBookingParticipantCreateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedCreateWithoutBookingInput>;
};
export type CourtBookingParticipantUpdateWithWhereUniqueWithoutBookingInput = {
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtBookingParticipantUpdateWithoutBookingInput, Prisma.CourtBookingParticipantUncheckedUpdateWithoutBookingInput>;
};
export type CourtBookingParticipantUpdateManyWithWhereWithoutBookingInput = {
    where: Prisma.CourtBookingParticipantScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtBookingParticipantUpdateManyMutationInput, Prisma.CourtBookingParticipantUncheckedUpdateManyWithoutBookingInput>;
};
export type CourtBookingParticipantCreateManyProfileInput = {
    id?: string;
    bookingId: string;
    createdAt?: Date | string;
};
export type CourtBookingParticipantUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.CourtBookingUpdateOneRequiredWithoutParticipantsNestedInput;
};
export type CourtBookingParticipantUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingParticipantUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingParticipantCreateManyBookingInput = {
    id?: string;
    profileId: string;
    createdAt?: Date | string;
};
export type CourtBookingParticipantUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutBookingParticipantsNestedInput;
};
export type CourtBookingParticipantUncheckedUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingParticipantUncheckedUpdateManyWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingParticipantSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtBookingParticipant"]>;
export type CourtBookingParticipantSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtBookingParticipant"]>;
export type CourtBookingParticipantSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtBookingParticipant"]>;
export type CourtBookingParticipantSelectScalar = {
    id?: boolean;
    bookingId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
};
export type CourtBookingParticipantOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "bookingId" | "profileId" | "createdAt", ExtArgs["result"]["courtBookingParticipant"]>;
export type CourtBookingParticipantInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type CourtBookingParticipantIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type CourtBookingParticipantIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $CourtBookingParticipantPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourtBookingParticipant";
    objects: {
        booking: Prisma.$CourtBookingPayload<ExtArgs>;
        profile: Prisma.$ProfilePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        bookingId: string;
        profileId: string;
        createdAt: Date;
    }, ExtArgs["result"]["courtBookingParticipant"]>;
    composites: {};
};
export type CourtBookingParticipantGetPayload<S extends boolean | null | undefined | CourtBookingParticipantDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload, S>;
export type CourtBookingParticipantCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourtBookingParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourtBookingParticipantCountAggregateInputType | true;
};
export interface CourtBookingParticipantDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourtBookingParticipant'];
        meta: {
            name: 'CourtBookingParticipant';
        };
    };
    findUnique<T extends CourtBookingParticipantFindUniqueArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourtBookingParticipantFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourtBookingParticipantFindFirstArgs>(args?: Prisma.SelectSubset<T, CourtBookingParticipantFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourtBookingParticipantFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourtBookingParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourtBookingParticipantFindManyArgs>(args?: Prisma.SelectSubset<T, CourtBookingParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourtBookingParticipantCreateArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantCreateArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourtBookingParticipantCreateManyArgs>(args?: Prisma.SelectSubset<T, CourtBookingParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourtBookingParticipantCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourtBookingParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourtBookingParticipantDeleteArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantDeleteArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourtBookingParticipantUpdateArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantUpdateArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourtBookingParticipantDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourtBookingParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourtBookingParticipantUpdateManyArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourtBookingParticipantUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourtBookingParticipantUpsertArgs>(args: Prisma.SelectSubset<T, CourtBookingParticipantUpsertArgs<ExtArgs>>): Prisma.Prisma__CourtBookingParticipantClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourtBookingParticipantCountArgs>(args?: Prisma.Subset<T, CourtBookingParticipantCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourtBookingParticipantCountAggregateOutputType> : number>;
    aggregate<T extends CourtBookingParticipantAggregateArgs>(args: Prisma.Subset<T, CourtBookingParticipantAggregateArgs>): Prisma.PrismaPromise<GetCourtBookingParticipantAggregateType<T>>;
    groupBy<T extends CourtBookingParticipantGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourtBookingParticipantGroupByArgs['orderBy'];
    } : {
        orderBy?: CourtBookingParticipantGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourtBookingParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourtBookingParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourtBookingParticipantFieldRefs;
}
export interface Prisma__CourtBookingParticipantClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    booking<T extends Prisma.CourtBookingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourtBookingDefaultArgs<ExtArgs>>): Prisma.Prisma__CourtBookingClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    profile<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourtBookingParticipantFieldRefs {
    readonly id: Prisma.FieldRef<"CourtBookingParticipant", 'String'>;
    readonly bookingId: Prisma.FieldRef<"CourtBookingParticipant", 'String'>;
    readonly profileId: Prisma.FieldRef<"CourtBookingParticipant", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CourtBookingParticipant", 'DateTime'>;
}
export type CourtBookingParticipantFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
};
export type CourtBookingParticipantFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
};
export type CourtBookingParticipantFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    where?: Prisma.CourtBookingParticipantWhereInput;
    orderBy?: Prisma.CourtBookingParticipantOrderByWithRelationInput | Prisma.CourtBookingParticipantOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtBookingParticipantScalarFieldEnum | Prisma.CourtBookingParticipantScalarFieldEnum[];
};
export type CourtBookingParticipantFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    where?: Prisma.CourtBookingParticipantWhereInput;
    orderBy?: Prisma.CourtBookingParticipantOrderByWithRelationInput | Prisma.CourtBookingParticipantOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtBookingParticipantScalarFieldEnum | Prisma.CourtBookingParticipantScalarFieldEnum[];
};
export type CourtBookingParticipantFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    where?: Prisma.CourtBookingParticipantWhereInput;
    orderBy?: Prisma.CourtBookingParticipantOrderByWithRelationInput | Prisma.CourtBookingParticipantOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtBookingParticipantScalarFieldEnum | Prisma.CourtBookingParticipantScalarFieldEnum[];
};
export type CourtBookingParticipantCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtBookingParticipantCreateInput, Prisma.CourtBookingParticipantUncheckedCreateInput>;
};
export type CourtBookingParticipantCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourtBookingParticipantCreateManyInput | Prisma.CourtBookingParticipantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourtBookingParticipantCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    data: Prisma.CourtBookingParticipantCreateManyInput | Prisma.CourtBookingParticipantCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourtBookingParticipantIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourtBookingParticipantUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtBookingParticipantUpdateInput, Prisma.CourtBookingParticipantUncheckedUpdateInput>;
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
};
export type CourtBookingParticipantUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourtBookingParticipantUpdateManyMutationInput, Prisma.CourtBookingParticipantUncheckedUpdateManyInput>;
    where?: Prisma.CourtBookingParticipantWhereInput;
    limit?: number;
};
export type CourtBookingParticipantUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtBookingParticipantUpdateManyMutationInput, Prisma.CourtBookingParticipantUncheckedUpdateManyInput>;
    where?: Prisma.CourtBookingParticipantWhereInput;
    limit?: number;
    include?: Prisma.CourtBookingParticipantIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourtBookingParticipantUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtBookingParticipantCreateInput, Prisma.CourtBookingParticipantUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourtBookingParticipantUpdateInput, Prisma.CourtBookingParticipantUncheckedUpdateInput>;
};
export type CourtBookingParticipantDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
    where: Prisma.CourtBookingParticipantWhereUniqueInput;
};
export type CourtBookingParticipantDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtBookingParticipantWhereInput;
    limit?: number;
};
export type CourtBookingParticipantDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingParticipantSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingParticipantOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingParticipantInclude<ExtArgs> | null;
};
export {};
