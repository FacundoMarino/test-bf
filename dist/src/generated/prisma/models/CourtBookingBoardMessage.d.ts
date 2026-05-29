import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CourtBookingBoardMessageModel = runtime.Types.Result.DefaultSelection<Prisma.$CourtBookingBoardMessagePayload>;
export type AggregateCourtBookingBoardMessage = {
    _count: CourtBookingBoardMessageCountAggregateOutputType | null;
    _min: CourtBookingBoardMessageMinAggregateOutputType | null;
    _max: CourtBookingBoardMessageMaxAggregateOutputType | null;
};
export type CourtBookingBoardMessageMinAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    authorProfileId: string | null;
    body: string | null;
    createdAt: Date | null;
};
export type CourtBookingBoardMessageMaxAggregateOutputType = {
    id: string | null;
    bookingId: string | null;
    authorProfileId: string | null;
    body: string | null;
    createdAt: Date | null;
};
export type CourtBookingBoardMessageCountAggregateOutputType = {
    id: number;
    bookingId: number;
    authorProfileId: number;
    body: number;
    createdAt: number;
    _all: number;
};
export type CourtBookingBoardMessageMinAggregateInputType = {
    id?: true;
    bookingId?: true;
    authorProfileId?: true;
    body?: true;
    createdAt?: true;
};
export type CourtBookingBoardMessageMaxAggregateInputType = {
    id?: true;
    bookingId?: true;
    authorProfileId?: true;
    body?: true;
    createdAt?: true;
};
export type CourtBookingBoardMessageCountAggregateInputType = {
    id?: true;
    bookingId?: true;
    authorProfileId?: true;
    body?: true;
    createdAt?: true;
    _all?: true;
};
export type CourtBookingBoardMessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    orderBy?: Prisma.CourtBookingBoardMessageOrderByWithRelationInput | Prisma.CourtBookingBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CourtBookingBoardMessageCountAggregateInputType;
    _min?: CourtBookingBoardMessageMinAggregateInputType;
    _max?: CourtBookingBoardMessageMaxAggregateInputType;
};
export type GetCourtBookingBoardMessageAggregateType<T extends CourtBookingBoardMessageAggregateArgs> = {
    [P in keyof T & keyof AggregateCourtBookingBoardMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourtBookingBoardMessage[P]> : Prisma.GetScalarType<T[P], AggregateCourtBookingBoardMessage[P]>;
};
export type CourtBookingBoardMessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    orderBy?: Prisma.CourtBookingBoardMessageOrderByWithAggregationInput | Prisma.CourtBookingBoardMessageOrderByWithAggregationInput[];
    by: Prisma.CourtBookingBoardMessageScalarFieldEnum[] | Prisma.CourtBookingBoardMessageScalarFieldEnum;
    having?: Prisma.CourtBookingBoardMessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourtBookingBoardMessageCountAggregateInputType | true;
    _min?: CourtBookingBoardMessageMinAggregateInputType;
    _max?: CourtBookingBoardMessageMaxAggregateInputType;
};
export type CourtBookingBoardMessageGroupByOutputType = {
    id: string;
    bookingId: string;
    authorProfileId: string;
    body: string;
    createdAt: Date;
    _count: CourtBookingBoardMessageCountAggregateOutputType | null;
    _min: CourtBookingBoardMessageMinAggregateOutputType | null;
    _max: CourtBookingBoardMessageMaxAggregateOutputType | null;
};
type GetCourtBookingBoardMessageGroupByPayload<T extends CourtBookingBoardMessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourtBookingBoardMessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourtBookingBoardMessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourtBookingBoardMessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourtBookingBoardMessageGroupByOutputType[P]>;
}>>;
export type CourtBookingBoardMessageWhereInput = {
    AND?: Prisma.CourtBookingBoardMessageWhereInput | Prisma.CourtBookingBoardMessageWhereInput[];
    OR?: Prisma.CourtBookingBoardMessageWhereInput[];
    NOT?: Prisma.CourtBookingBoardMessageWhereInput | Prisma.CourtBookingBoardMessageWhereInput[];
    id?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    bookingId?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    authorProfileId?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    body?: Prisma.StringFilter<"CourtBookingBoardMessage"> | string;
    createdAt?: Prisma.DateTimeFilter<"CourtBookingBoardMessage"> | Date | string;
    booking?: Prisma.XOR<Prisma.CourtBookingScalarRelationFilter, Prisma.CourtBookingWhereInput>;
    author?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
};
export type CourtBookingBoardMessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    booking?: Prisma.CourtBookingOrderByWithRelationInput;
    author?: Prisma.ProfileOrderByWithRelationInput;
};
export type CourtBookingBoardMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CourtBookingBoardMessageWhereInput | Prisma.CourtBookingBoardMessageWhereInput[];
    OR?: Prisma.CourtBookingBoardMessageWhereInput[];
    NOT?: Prisma.CourtBookingBoardMessageWhereInput | Prisma.CourtBookingBoardMessageWhereInput[];
    bookingId?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    authorProfileId?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    body?: Prisma.StringFilter<"CourtBookingBoardMessage"> | string;
    createdAt?: Prisma.DateTimeFilter<"CourtBookingBoardMessage"> | Date | string;
    booking?: Prisma.XOR<Prisma.CourtBookingScalarRelationFilter, Prisma.CourtBookingWhereInput>;
    author?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
}, "id">;
export type CourtBookingBoardMessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CourtBookingBoardMessageCountOrderByAggregateInput;
    _max?: Prisma.CourtBookingBoardMessageMaxOrderByAggregateInput;
    _min?: Prisma.CourtBookingBoardMessageMinOrderByAggregateInput;
};
export type CourtBookingBoardMessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourtBookingBoardMessageScalarWhereWithAggregatesInput | Prisma.CourtBookingBoardMessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourtBookingBoardMessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourtBookingBoardMessageScalarWhereWithAggregatesInput | Prisma.CourtBookingBoardMessageScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"CourtBookingBoardMessage"> | string;
    bookingId?: Prisma.UuidWithAggregatesFilter<"CourtBookingBoardMessage"> | string;
    authorProfileId?: Prisma.UuidWithAggregatesFilter<"CourtBookingBoardMessage"> | string;
    body?: Prisma.StringWithAggregatesFilter<"CourtBookingBoardMessage"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CourtBookingBoardMessage"> | Date | string;
};
export type CourtBookingBoardMessageCreateInput = {
    id?: string;
    body: string;
    createdAt?: Date | string;
    booking: Prisma.CourtBookingCreateNestedOneWithoutBoardMessagesInput;
    author: Prisma.ProfileCreateNestedOneWithoutBookingBoardMessagesInput;
};
export type CourtBookingBoardMessageUncheckedCreateInput = {
    id?: string;
    bookingId: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type CourtBookingBoardMessageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.CourtBookingUpdateOneRequiredWithoutBoardMessagesNestedInput;
    author?: Prisma.ProfileUpdateOneRequiredWithoutBookingBoardMessagesNestedInput;
};
export type CourtBookingBoardMessageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingBoardMessageCreateManyInput = {
    id?: string;
    bookingId: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type CourtBookingBoardMessageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingBoardMessageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingBoardMessageListRelationFilter = {
    every?: Prisma.CourtBookingBoardMessageWhereInput;
    some?: Prisma.CourtBookingBoardMessageWhereInput;
    none?: Prisma.CourtBookingBoardMessageWhereInput;
};
export type CourtBookingBoardMessageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourtBookingBoardMessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourtBookingBoardMessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourtBookingBoardMessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    bookingId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CourtBookingBoardMessageCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyAuthorInputEnvelope;
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
};
export type CourtBookingBoardMessageUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyAuthorInputEnvelope;
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
};
export type CourtBookingBoardMessageUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutAuthorInput | Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyAuthorInputEnvelope;
    set?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    delete?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    update?: Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutAuthorInput | Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutAuthorInput | Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.CourtBookingBoardMessageScalarWhereInput | Prisma.CourtBookingBoardMessageScalarWhereInput[];
};
export type CourtBookingBoardMessageUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutAuthorInput | Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyAuthorInputEnvelope;
    set?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    delete?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    update?: Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutAuthorInput | Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutAuthorInput | Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.CourtBookingBoardMessageScalarWhereInput | Prisma.CourtBookingBoardMessageScalarWhereInput[];
};
export type CourtBookingBoardMessageCreateNestedManyWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingBoardMessageCreateWithoutBookingInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyBookingInputEnvelope;
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
};
export type CourtBookingBoardMessageUncheckedCreateNestedManyWithoutBookingInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingBoardMessageCreateWithoutBookingInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyBookingInputEnvelope;
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
};
export type CourtBookingBoardMessageUpdateManyWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingBoardMessageCreateWithoutBookingInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput[];
    upsert?: Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutBookingInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyBookingInputEnvelope;
    set?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    delete?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    update?: Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutBookingInput[];
    updateMany?: Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutBookingInput | Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutBookingInput[];
    deleteMany?: Prisma.CourtBookingBoardMessageScalarWhereInput | Prisma.CourtBookingBoardMessageScalarWhereInput[];
};
export type CourtBookingBoardMessageUncheckedUpdateManyWithoutBookingNestedInput = {
    create?: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput> | Prisma.CourtBookingBoardMessageCreateWithoutBookingInput[] | Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput[];
    connectOrCreate?: Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput | Prisma.CourtBookingBoardMessageCreateOrConnectWithoutBookingInput[];
    upsert?: Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingBoardMessageUpsertWithWhereUniqueWithoutBookingInput[];
    createMany?: Prisma.CourtBookingBoardMessageCreateManyBookingInputEnvelope;
    set?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    delete?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    connect?: Prisma.CourtBookingBoardMessageWhereUniqueInput | Prisma.CourtBookingBoardMessageWhereUniqueInput[];
    update?: Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutBookingInput | Prisma.CourtBookingBoardMessageUpdateWithWhereUniqueWithoutBookingInput[];
    updateMany?: Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutBookingInput | Prisma.CourtBookingBoardMessageUpdateManyWithWhereWithoutBookingInput[];
    deleteMany?: Prisma.CourtBookingBoardMessageScalarWhereInput | Prisma.CourtBookingBoardMessageScalarWhereInput[];
};
export type CourtBookingBoardMessageCreateWithoutAuthorInput = {
    id?: string;
    body: string;
    createdAt?: Date | string;
    booking: Prisma.CourtBookingCreateNestedOneWithoutBoardMessagesInput;
};
export type CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput = {
    id?: string;
    bookingId: string;
    body: string;
    createdAt?: Date | string;
};
export type CourtBookingBoardMessageCreateOrConnectWithoutAuthorInput = {
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput>;
};
export type CourtBookingBoardMessageCreateManyAuthorInputEnvelope = {
    data: Prisma.CourtBookingBoardMessageCreateManyAuthorInput | Prisma.CourtBookingBoardMessageCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type CourtBookingBoardMessageUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutAuthorInput>;
};
export type CourtBookingBoardMessageUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateWithoutAuthorInput, Prisma.CourtBookingBoardMessageUncheckedUpdateWithoutAuthorInput>;
};
export type CourtBookingBoardMessageUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.CourtBookingBoardMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateManyMutationInput, Prisma.CourtBookingBoardMessageUncheckedUpdateManyWithoutAuthorInput>;
};
export type CourtBookingBoardMessageScalarWhereInput = {
    AND?: Prisma.CourtBookingBoardMessageScalarWhereInput | Prisma.CourtBookingBoardMessageScalarWhereInput[];
    OR?: Prisma.CourtBookingBoardMessageScalarWhereInput[];
    NOT?: Prisma.CourtBookingBoardMessageScalarWhereInput | Prisma.CourtBookingBoardMessageScalarWhereInput[];
    id?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    bookingId?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    authorProfileId?: Prisma.UuidFilter<"CourtBookingBoardMessage"> | string;
    body?: Prisma.StringFilter<"CourtBookingBoardMessage"> | string;
    createdAt?: Prisma.DateTimeFilter<"CourtBookingBoardMessage"> | Date | string;
};
export type CourtBookingBoardMessageCreateWithoutBookingInput = {
    id?: string;
    body: string;
    createdAt?: Date | string;
    author: Prisma.ProfileCreateNestedOneWithoutBookingBoardMessagesInput;
};
export type CourtBookingBoardMessageUncheckedCreateWithoutBookingInput = {
    id?: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type CourtBookingBoardMessageCreateOrConnectWithoutBookingInput = {
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput>;
};
export type CourtBookingBoardMessageCreateManyBookingInputEnvelope = {
    data: Prisma.CourtBookingBoardMessageCreateManyBookingInput | Prisma.CourtBookingBoardMessageCreateManyBookingInput[];
    skipDuplicates?: boolean;
};
export type CourtBookingBoardMessageUpsertWithWhereUniqueWithoutBookingInput = {
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedUpdateWithoutBookingInput>;
    create: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedCreateWithoutBookingInput>;
};
export type CourtBookingBoardMessageUpdateWithWhereUniqueWithoutBookingInput = {
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateWithoutBookingInput, Prisma.CourtBookingBoardMessageUncheckedUpdateWithoutBookingInput>;
};
export type CourtBookingBoardMessageUpdateManyWithWhereWithoutBookingInput = {
    where: Prisma.CourtBookingBoardMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateManyMutationInput, Prisma.CourtBookingBoardMessageUncheckedUpdateManyWithoutBookingInput>;
};
export type CourtBookingBoardMessageCreateManyAuthorInput = {
    id?: string;
    bookingId: string;
    body: string;
    createdAt?: Date | string;
};
export type CourtBookingBoardMessageUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    booking?: Prisma.CourtBookingUpdateOneRequiredWithoutBoardMessagesNestedInput;
};
export type CourtBookingBoardMessageUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingBoardMessageUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    bookingId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingBoardMessageCreateManyBookingInput = {
    id?: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type CourtBookingBoardMessageUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    author?: Prisma.ProfileUpdateOneRequiredWithoutBookingBoardMessagesNestedInput;
};
export type CourtBookingBoardMessageUncheckedUpdateWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingBoardMessageUncheckedUpdateManyWithoutBookingInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CourtBookingBoardMessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtBookingBoardMessage"]>;
export type CourtBookingBoardMessageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtBookingBoardMessage"]>;
export type CourtBookingBoardMessageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    bookingId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courtBookingBoardMessage"]>;
export type CourtBookingBoardMessageSelectScalar = {
    id?: boolean;
    bookingId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
};
export type CourtBookingBoardMessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "bookingId" | "authorProfileId" | "body" | "createdAt", ExtArgs["result"]["courtBookingBoardMessage"]>;
export type CourtBookingBoardMessageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type CourtBookingBoardMessageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type CourtBookingBoardMessageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    booking?: boolean | Prisma.CourtBookingDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $CourtBookingBoardMessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourtBookingBoardMessage";
    objects: {
        booking: Prisma.$CourtBookingPayload<ExtArgs>;
        author: Prisma.$ProfilePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        bookingId: string;
        authorProfileId: string;
        body: string;
        createdAt: Date;
    }, ExtArgs["result"]["courtBookingBoardMessage"]>;
    composites: {};
};
export type CourtBookingBoardMessageGetPayload<S extends boolean | null | undefined | CourtBookingBoardMessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload, S>;
export type CourtBookingBoardMessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourtBookingBoardMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourtBookingBoardMessageCountAggregateInputType | true;
};
export interface CourtBookingBoardMessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourtBookingBoardMessage'];
        meta: {
            name: 'CourtBookingBoardMessage';
        };
    };
    findUnique<T extends CourtBookingBoardMessageFindUniqueArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CourtBookingBoardMessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CourtBookingBoardMessageFindFirstArgs>(args?: Prisma.SelectSubset<T, CourtBookingBoardMessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CourtBookingBoardMessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourtBookingBoardMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CourtBookingBoardMessageFindManyArgs>(args?: Prisma.SelectSubset<T, CourtBookingBoardMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CourtBookingBoardMessageCreateArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageCreateArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CourtBookingBoardMessageCreateManyArgs>(args?: Prisma.SelectSubset<T, CourtBookingBoardMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CourtBookingBoardMessageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourtBookingBoardMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CourtBookingBoardMessageDeleteArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageDeleteArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CourtBookingBoardMessageUpdateArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageUpdateArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CourtBookingBoardMessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourtBookingBoardMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CourtBookingBoardMessageUpdateManyArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CourtBookingBoardMessageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CourtBookingBoardMessageUpsertArgs>(args: Prisma.SelectSubset<T, CourtBookingBoardMessageUpsertArgs<ExtArgs>>): Prisma.Prisma__CourtBookingBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingBoardMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CourtBookingBoardMessageCountArgs>(args?: Prisma.Subset<T, CourtBookingBoardMessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourtBookingBoardMessageCountAggregateOutputType> : number>;
    aggregate<T extends CourtBookingBoardMessageAggregateArgs>(args: Prisma.Subset<T, CourtBookingBoardMessageAggregateArgs>): Prisma.PrismaPromise<GetCourtBookingBoardMessageAggregateType<T>>;
    groupBy<T extends CourtBookingBoardMessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourtBookingBoardMessageGroupByArgs['orderBy'];
    } : {
        orderBy?: CourtBookingBoardMessageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourtBookingBoardMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourtBookingBoardMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CourtBookingBoardMessageFieldRefs;
}
export interface Prisma__CourtBookingBoardMessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    booking<T extends Prisma.CourtBookingDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourtBookingDefaultArgs<ExtArgs>>): Prisma.Prisma__CourtBookingClient<runtime.Types.Result.GetResult<Prisma.$CourtBookingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    author<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CourtBookingBoardMessageFieldRefs {
    readonly id: Prisma.FieldRef<"CourtBookingBoardMessage", 'String'>;
    readonly bookingId: Prisma.FieldRef<"CourtBookingBoardMessage", 'String'>;
    readonly authorProfileId: Prisma.FieldRef<"CourtBookingBoardMessage", 'String'>;
    readonly body: Prisma.FieldRef<"CourtBookingBoardMessage", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CourtBookingBoardMessage", 'DateTime'>;
}
export type CourtBookingBoardMessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
};
export type CourtBookingBoardMessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
};
export type CourtBookingBoardMessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    orderBy?: Prisma.CourtBookingBoardMessageOrderByWithRelationInput | Prisma.CourtBookingBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtBookingBoardMessageScalarFieldEnum | Prisma.CourtBookingBoardMessageScalarFieldEnum[];
};
export type CourtBookingBoardMessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    orderBy?: Prisma.CourtBookingBoardMessageOrderByWithRelationInput | Prisma.CourtBookingBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtBookingBoardMessageScalarFieldEnum | Prisma.CourtBookingBoardMessageScalarFieldEnum[];
};
export type CourtBookingBoardMessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    orderBy?: Prisma.CourtBookingBoardMessageOrderByWithRelationInput | Prisma.CourtBookingBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourtBookingBoardMessageScalarFieldEnum | Prisma.CourtBookingBoardMessageScalarFieldEnum[];
};
export type CourtBookingBoardMessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateInput, Prisma.CourtBookingBoardMessageUncheckedCreateInput>;
};
export type CourtBookingBoardMessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CourtBookingBoardMessageCreateManyInput | Prisma.CourtBookingBoardMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CourtBookingBoardMessageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    data: Prisma.CourtBookingBoardMessageCreateManyInput | Prisma.CourtBookingBoardMessageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CourtBookingBoardMessageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CourtBookingBoardMessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateInput, Prisma.CourtBookingBoardMessageUncheckedUpdateInput>;
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
};
export type CourtBookingBoardMessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateManyMutationInput, Prisma.CourtBookingBoardMessageUncheckedUpdateManyInput>;
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    limit?: number;
};
export type CourtBookingBoardMessageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateManyMutationInput, Prisma.CourtBookingBoardMessageUncheckedUpdateManyInput>;
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    limit?: number;
    include?: Prisma.CourtBookingBoardMessageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CourtBookingBoardMessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourtBookingBoardMessageCreateInput, Prisma.CourtBookingBoardMessageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CourtBookingBoardMessageUpdateInput, Prisma.CourtBookingBoardMessageUncheckedUpdateInput>;
};
export type CourtBookingBoardMessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
    where: Prisma.CourtBookingBoardMessageWhereUniqueInput;
};
export type CourtBookingBoardMessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourtBookingBoardMessageWhereInput;
    limit?: number;
};
export type CourtBookingBoardMessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CourtBookingBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.CourtBookingBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.CourtBookingBoardMessageInclude<ExtArgs> | null;
};
export {};
