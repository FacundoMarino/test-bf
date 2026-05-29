import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LooseMatchBoardMessageModel = runtime.Types.Result.DefaultSelection<Prisma.$LooseMatchBoardMessagePayload>;
export type AggregateLooseMatchBoardMessage = {
    _count: LooseMatchBoardMessageCountAggregateOutputType | null;
    _min: LooseMatchBoardMessageMinAggregateOutputType | null;
    _max: LooseMatchBoardMessageMaxAggregateOutputType | null;
};
export type LooseMatchBoardMessageMinAggregateOutputType = {
    id: string | null;
    looseMatchId: string | null;
    authorProfileId: string | null;
    body: string | null;
    createdAt: Date | null;
};
export type LooseMatchBoardMessageMaxAggregateOutputType = {
    id: string | null;
    looseMatchId: string | null;
    authorProfileId: string | null;
    body: string | null;
    createdAt: Date | null;
};
export type LooseMatchBoardMessageCountAggregateOutputType = {
    id: number;
    looseMatchId: number;
    authorProfileId: number;
    body: number;
    createdAt: number;
    _all: number;
};
export type LooseMatchBoardMessageMinAggregateInputType = {
    id?: true;
    looseMatchId?: true;
    authorProfileId?: true;
    body?: true;
    createdAt?: true;
};
export type LooseMatchBoardMessageMaxAggregateInputType = {
    id?: true;
    looseMatchId?: true;
    authorProfileId?: true;
    body?: true;
    createdAt?: true;
};
export type LooseMatchBoardMessageCountAggregateInputType = {
    id?: true;
    looseMatchId?: true;
    authorProfileId?: true;
    body?: true;
    createdAt?: true;
    _all?: true;
};
export type LooseMatchBoardMessageAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    orderBy?: Prisma.LooseMatchBoardMessageOrderByWithRelationInput | Prisma.LooseMatchBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LooseMatchBoardMessageCountAggregateInputType;
    _min?: LooseMatchBoardMessageMinAggregateInputType;
    _max?: LooseMatchBoardMessageMaxAggregateInputType;
};
export type GetLooseMatchBoardMessageAggregateType<T extends LooseMatchBoardMessageAggregateArgs> = {
    [P in keyof T & keyof AggregateLooseMatchBoardMessage]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLooseMatchBoardMessage[P]> : Prisma.GetScalarType<T[P], AggregateLooseMatchBoardMessage[P]>;
};
export type LooseMatchBoardMessageGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    orderBy?: Prisma.LooseMatchBoardMessageOrderByWithAggregationInput | Prisma.LooseMatchBoardMessageOrderByWithAggregationInput[];
    by: Prisma.LooseMatchBoardMessageScalarFieldEnum[] | Prisma.LooseMatchBoardMessageScalarFieldEnum;
    having?: Prisma.LooseMatchBoardMessageScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LooseMatchBoardMessageCountAggregateInputType | true;
    _min?: LooseMatchBoardMessageMinAggregateInputType;
    _max?: LooseMatchBoardMessageMaxAggregateInputType;
};
export type LooseMatchBoardMessageGroupByOutputType = {
    id: string;
    looseMatchId: string;
    authorProfileId: string;
    body: string;
    createdAt: Date;
    _count: LooseMatchBoardMessageCountAggregateOutputType | null;
    _min: LooseMatchBoardMessageMinAggregateOutputType | null;
    _max: LooseMatchBoardMessageMaxAggregateOutputType | null;
};
type GetLooseMatchBoardMessageGroupByPayload<T extends LooseMatchBoardMessageGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LooseMatchBoardMessageGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LooseMatchBoardMessageGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LooseMatchBoardMessageGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LooseMatchBoardMessageGroupByOutputType[P]>;
}>>;
export type LooseMatchBoardMessageWhereInput = {
    AND?: Prisma.LooseMatchBoardMessageWhereInput | Prisma.LooseMatchBoardMessageWhereInput[];
    OR?: Prisma.LooseMatchBoardMessageWhereInput[];
    NOT?: Prisma.LooseMatchBoardMessageWhereInput | Prisma.LooseMatchBoardMessageWhereInput[];
    id?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    looseMatchId?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    authorProfileId?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    body?: Prisma.StringFilter<"LooseMatchBoardMessage"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatchBoardMessage"> | Date | string;
    looseMatch?: Prisma.XOR<Prisma.LooseMatchScalarRelationFilter, Prisma.LooseMatchWhereInput>;
    author?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
};
export type LooseMatchBoardMessageOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    looseMatch?: Prisma.LooseMatchOrderByWithRelationInput;
    author?: Prisma.ProfileOrderByWithRelationInput;
};
export type LooseMatchBoardMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.LooseMatchBoardMessageWhereInput | Prisma.LooseMatchBoardMessageWhereInput[];
    OR?: Prisma.LooseMatchBoardMessageWhereInput[];
    NOT?: Prisma.LooseMatchBoardMessageWhereInput | Prisma.LooseMatchBoardMessageWhereInput[];
    looseMatchId?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    authorProfileId?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    body?: Prisma.StringFilter<"LooseMatchBoardMessage"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatchBoardMessage"> | Date | string;
    looseMatch?: Prisma.XOR<Prisma.LooseMatchScalarRelationFilter, Prisma.LooseMatchWhereInput>;
    author?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
}, "id">;
export type LooseMatchBoardMessageOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.LooseMatchBoardMessageCountOrderByAggregateInput;
    _max?: Prisma.LooseMatchBoardMessageMaxOrderByAggregateInput;
    _min?: Prisma.LooseMatchBoardMessageMinOrderByAggregateInput;
};
export type LooseMatchBoardMessageScalarWhereWithAggregatesInput = {
    AND?: Prisma.LooseMatchBoardMessageScalarWhereWithAggregatesInput | Prisma.LooseMatchBoardMessageScalarWhereWithAggregatesInput[];
    OR?: Prisma.LooseMatchBoardMessageScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LooseMatchBoardMessageScalarWhereWithAggregatesInput | Prisma.LooseMatchBoardMessageScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"LooseMatchBoardMessage"> | string;
    looseMatchId?: Prisma.UuidWithAggregatesFilter<"LooseMatchBoardMessage"> | string;
    authorProfileId?: Prisma.UuidWithAggregatesFilter<"LooseMatchBoardMessage"> | string;
    body?: Prisma.StringWithAggregatesFilter<"LooseMatchBoardMessage"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LooseMatchBoardMessage"> | Date | string;
};
export type LooseMatchBoardMessageCreateInput = {
    id?: string;
    body: string;
    createdAt?: Date | string;
    looseMatch: Prisma.LooseMatchCreateNestedOneWithoutBoardMessagesInput;
    author: Prisma.ProfileCreateNestedOneWithoutLooseMatchBoardMessagesInput;
};
export type LooseMatchBoardMessageUncheckedCreateInput = {
    id?: string;
    looseMatchId: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type LooseMatchBoardMessageUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    looseMatch?: Prisma.LooseMatchUpdateOneRequiredWithoutBoardMessagesNestedInput;
    author?: Prisma.ProfileUpdateOneRequiredWithoutLooseMatchBoardMessagesNestedInput;
};
export type LooseMatchBoardMessageUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchBoardMessageCreateManyInput = {
    id?: string;
    looseMatchId: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type LooseMatchBoardMessageUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchBoardMessageUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchBoardMessageListRelationFilter = {
    every?: Prisma.LooseMatchBoardMessageWhereInput;
    some?: Prisma.LooseMatchBoardMessageWhereInput;
    none?: Prisma.LooseMatchBoardMessageWhereInput;
};
export type LooseMatchBoardMessageOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LooseMatchBoardMessageCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LooseMatchBoardMessageMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LooseMatchBoardMessageMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    authorProfileId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LooseMatchBoardMessageCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyAuthorInputEnvelope;
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
};
export type LooseMatchBoardMessageUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyAuthorInputEnvelope;
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
};
export type LooseMatchBoardMessageUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutAuthorInput | Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyAuthorInputEnvelope;
    set?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    delete?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    update?: Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutAuthorInput | Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutAuthorInput | Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.LooseMatchBoardMessageScalarWhereInput | Prisma.LooseMatchBoardMessageScalarWhereInput[];
};
export type LooseMatchBoardMessageUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput> | Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput[];
    upsert?: Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutAuthorInput | Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutAuthorInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyAuthorInputEnvelope;
    set?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    delete?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    update?: Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutAuthorInput | Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutAuthorInput[];
    updateMany?: Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutAuthorInput | Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutAuthorInput[];
    deleteMany?: Prisma.LooseMatchBoardMessageScalarWhereInput | Prisma.LooseMatchBoardMessageScalarWhereInput[];
};
export type LooseMatchBoardMessageCreateNestedManyWithoutLooseMatchInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyLooseMatchInputEnvelope;
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
};
export type LooseMatchBoardMessageUncheckedCreateNestedManyWithoutLooseMatchInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyLooseMatchInputEnvelope;
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
};
export type LooseMatchBoardMessageUpdateManyWithoutLooseMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput[];
    upsert?: Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyLooseMatchInputEnvelope;
    set?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    delete?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    update?: Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutLooseMatchInput[];
    updateMany?: Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutLooseMatchInput[];
    deleteMany?: Prisma.LooseMatchBoardMessageScalarWhereInput | Prisma.LooseMatchBoardMessageScalarWhereInput[];
};
export type LooseMatchBoardMessageUncheckedUpdateManyWithoutLooseMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput[] | Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput[];
    upsert?: Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageUpsertWithWhereUniqueWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchBoardMessageCreateManyLooseMatchInputEnvelope;
    set?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    delete?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    connect?: Prisma.LooseMatchBoardMessageWhereUniqueInput | Prisma.LooseMatchBoardMessageWhereUniqueInput[];
    update?: Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageUpdateWithWhereUniqueWithoutLooseMatchInput[];
    updateMany?: Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutLooseMatchInput | Prisma.LooseMatchBoardMessageUpdateManyWithWhereWithoutLooseMatchInput[];
    deleteMany?: Prisma.LooseMatchBoardMessageScalarWhereInput | Prisma.LooseMatchBoardMessageScalarWhereInput[];
};
export type LooseMatchBoardMessageCreateWithoutAuthorInput = {
    id?: string;
    body: string;
    createdAt?: Date | string;
    looseMatch: Prisma.LooseMatchCreateNestedOneWithoutBoardMessagesInput;
};
export type LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput = {
    id?: string;
    looseMatchId: string;
    body: string;
    createdAt?: Date | string;
};
export type LooseMatchBoardMessageCreateOrConnectWithoutAuthorInput = {
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput>;
};
export type LooseMatchBoardMessageCreateManyAuthorInputEnvelope = {
    data: Prisma.LooseMatchBoardMessageCreateManyAuthorInput | Prisma.LooseMatchBoardMessageCreateManyAuthorInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchBoardMessageUpsertWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedUpdateWithoutAuthorInput>;
    create: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutAuthorInput>;
};
export type LooseMatchBoardMessageUpdateWithWhereUniqueWithoutAuthorInput = {
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateWithoutAuthorInput, Prisma.LooseMatchBoardMessageUncheckedUpdateWithoutAuthorInput>;
};
export type LooseMatchBoardMessageUpdateManyWithWhereWithoutAuthorInput = {
    where: Prisma.LooseMatchBoardMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateManyMutationInput, Prisma.LooseMatchBoardMessageUncheckedUpdateManyWithoutAuthorInput>;
};
export type LooseMatchBoardMessageScalarWhereInput = {
    AND?: Prisma.LooseMatchBoardMessageScalarWhereInput | Prisma.LooseMatchBoardMessageScalarWhereInput[];
    OR?: Prisma.LooseMatchBoardMessageScalarWhereInput[];
    NOT?: Prisma.LooseMatchBoardMessageScalarWhereInput | Prisma.LooseMatchBoardMessageScalarWhereInput[];
    id?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    looseMatchId?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    authorProfileId?: Prisma.UuidFilter<"LooseMatchBoardMessage"> | string;
    body?: Prisma.StringFilter<"LooseMatchBoardMessage"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatchBoardMessage"> | Date | string;
};
export type LooseMatchBoardMessageCreateWithoutLooseMatchInput = {
    id?: string;
    body: string;
    createdAt?: Date | string;
    author: Prisma.ProfileCreateNestedOneWithoutLooseMatchBoardMessagesInput;
};
export type LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput = {
    id?: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type LooseMatchBoardMessageCreateOrConnectWithoutLooseMatchInput = {
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput>;
};
export type LooseMatchBoardMessageCreateManyLooseMatchInputEnvelope = {
    data: Prisma.LooseMatchBoardMessageCreateManyLooseMatchInput | Prisma.LooseMatchBoardMessageCreateManyLooseMatchInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchBoardMessageUpsertWithWhereUniqueWithoutLooseMatchInput = {
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    update: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedUpdateWithoutLooseMatchInput>;
    create: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedCreateWithoutLooseMatchInput>;
};
export type LooseMatchBoardMessageUpdateWithWhereUniqueWithoutLooseMatchInput = {
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateWithoutLooseMatchInput, Prisma.LooseMatchBoardMessageUncheckedUpdateWithoutLooseMatchInput>;
};
export type LooseMatchBoardMessageUpdateManyWithWhereWithoutLooseMatchInput = {
    where: Prisma.LooseMatchBoardMessageScalarWhereInput;
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateManyMutationInput, Prisma.LooseMatchBoardMessageUncheckedUpdateManyWithoutLooseMatchInput>;
};
export type LooseMatchBoardMessageCreateManyAuthorInput = {
    id?: string;
    looseMatchId: string;
    body: string;
    createdAt?: Date | string;
};
export type LooseMatchBoardMessageUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    looseMatch?: Prisma.LooseMatchUpdateOneRequiredWithoutBoardMessagesNestedInput;
};
export type LooseMatchBoardMessageUncheckedUpdateWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchBoardMessageUncheckedUpdateManyWithoutAuthorInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchBoardMessageCreateManyLooseMatchInput = {
    id?: string;
    authorProfileId: string;
    body: string;
    createdAt?: Date | string;
};
export type LooseMatchBoardMessageUpdateWithoutLooseMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    author?: Prisma.ProfileUpdateOneRequiredWithoutLooseMatchBoardMessagesNestedInput;
};
export type LooseMatchBoardMessageUncheckedUpdateWithoutLooseMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchBoardMessageUncheckedUpdateManyWithoutLooseMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    authorProfileId?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchBoardMessageSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    looseMatchId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatchBoardMessage"]>;
export type LooseMatchBoardMessageSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    looseMatchId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatchBoardMessage"]>;
export type LooseMatchBoardMessageSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    looseMatchId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatchBoardMessage"]>;
export type LooseMatchBoardMessageSelectScalar = {
    id?: boolean;
    looseMatchId?: boolean;
    authorProfileId?: boolean;
    body?: boolean;
    createdAt?: boolean;
};
export type LooseMatchBoardMessageOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "looseMatchId" | "authorProfileId" | "body" | "createdAt", ExtArgs["result"]["looseMatchBoardMessage"]>;
export type LooseMatchBoardMessageInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type LooseMatchBoardMessageIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type LooseMatchBoardMessageIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    author?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $LooseMatchBoardMessagePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LooseMatchBoardMessage";
    objects: {
        looseMatch: Prisma.$LooseMatchPayload<ExtArgs>;
        author: Prisma.$ProfilePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        looseMatchId: string;
        authorProfileId: string;
        body: string;
        createdAt: Date;
    }, ExtArgs["result"]["looseMatchBoardMessage"]>;
    composites: {};
};
export type LooseMatchBoardMessageGetPayload<S extends boolean | null | undefined | LooseMatchBoardMessageDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload, S>;
export type LooseMatchBoardMessageCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LooseMatchBoardMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LooseMatchBoardMessageCountAggregateInputType | true;
};
export interface LooseMatchBoardMessageDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LooseMatchBoardMessage'];
        meta: {
            name: 'LooseMatchBoardMessage';
        };
    };
    findUnique<T extends LooseMatchBoardMessageFindUniqueArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LooseMatchBoardMessageFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LooseMatchBoardMessageFindFirstArgs>(args?: Prisma.SelectSubset<T, LooseMatchBoardMessageFindFirstArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LooseMatchBoardMessageFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LooseMatchBoardMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LooseMatchBoardMessageFindManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchBoardMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LooseMatchBoardMessageCreateArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageCreateArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LooseMatchBoardMessageCreateManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchBoardMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LooseMatchBoardMessageCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LooseMatchBoardMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LooseMatchBoardMessageDeleteArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageDeleteArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LooseMatchBoardMessageUpdateArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageUpdateArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LooseMatchBoardMessageDeleteManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchBoardMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LooseMatchBoardMessageUpdateManyArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LooseMatchBoardMessageUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LooseMatchBoardMessageUpsertArgs>(args: Prisma.SelectSubset<T, LooseMatchBoardMessageUpsertArgs<ExtArgs>>): Prisma.Prisma__LooseMatchBoardMessageClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LooseMatchBoardMessageCountArgs>(args?: Prisma.Subset<T, LooseMatchBoardMessageCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LooseMatchBoardMessageCountAggregateOutputType> : number>;
    aggregate<T extends LooseMatchBoardMessageAggregateArgs>(args: Prisma.Subset<T, LooseMatchBoardMessageAggregateArgs>): Prisma.PrismaPromise<GetLooseMatchBoardMessageAggregateType<T>>;
    groupBy<T extends LooseMatchBoardMessageGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LooseMatchBoardMessageGroupByArgs['orderBy'];
    } : {
        orderBy?: LooseMatchBoardMessageGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LooseMatchBoardMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLooseMatchBoardMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LooseMatchBoardMessageFieldRefs;
}
export interface Prisma__LooseMatchBoardMessageClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    looseMatch<T extends Prisma.LooseMatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LooseMatchDefaultArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    author<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LooseMatchBoardMessageFieldRefs {
    readonly id: Prisma.FieldRef<"LooseMatchBoardMessage", 'String'>;
    readonly looseMatchId: Prisma.FieldRef<"LooseMatchBoardMessage", 'String'>;
    readonly authorProfileId: Prisma.FieldRef<"LooseMatchBoardMessage", 'String'>;
    readonly body: Prisma.FieldRef<"LooseMatchBoardMessage", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LooseMatchBoardMessage", 'DateTime'>;
}
export type LooseMatchBoardMessageFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
};
export type LooseMatchBoardMessageFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
};
export type LooseMatchBoardMessageFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    orderBy?: Prisma.LooseMatchBoardMessageOrderByWithRelationInput | Prisma.LooseMatchBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchBoardMessageScalarFieldEnum | Prisma.LooseMatchBoardMessageScalarFieldEnum[];
};
export type LooseMatchBoardMessageFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    orderBy?: Prisma.LooseMatchBoardMessageOrderByWithRelationInput | Prisma.LooseMatchBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchBoardMessageScalarFieldEnum | Prisma.LooseMatchBoardMessageScalarFieldEnum[];
};
export type LooseMatchBoardMessageFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    orderBy?: Prisma.LooseMatchBoardMessageOrderByWithRelationInput | Prisma.LooseMatchBoardMessageOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchBoardMessageScalarFieldEnum | Prisma.LooseMatchBoardMessageScalarFieldEnum[];
};
export type LooseMatchBoardMessageCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateInput, Prisma.LooseMatchBoardMessageUncheckedCreateInput>;
};
export type LooseMatchBoardMessageCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LooseMatchBoardMessageCreateManyInput | Prisma.LooseMatchBoardMessageCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchBoardMessageCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    data: Prisma.LooseMatchBoardMessageCreateManyInput | Prisma.LooseMatchBoardMessageCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LooseMatchBoardMessageIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LooseMatchBoardMessageUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateInput, Prisma.LooseMatchBoardMessageUncheckedUpdateInput>;
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
};
export type LooseMatchBoardMessageUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateManyMutationInput, Prisma.LooseMatchBoardMessageUncheckedUpdateManyInput>;
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    limit?: number;
};
export type LooseMatchBoardMessageUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateManyMutationInput, Prisma.LooseMatchBoardMessageUncheckedUpdateManyInput>;
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    limit?: number;
    include?: Prisma.LooseMatchBoardMessageIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LooseMatchBoardMessageUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchBoardMessageCreateInput, Prisma.LooseMatchBoardMessageUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LooseMatchBoardMessageUpdateInput, Prisma.LooseMatchBoardMessageUncheckedUpdateInput>;
};
export type LooseMatchBoardMessageDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
    where: Prisma.LooseMatchBoardMessageWhereUniqueInput;
};
export type LooseMatchBoardMessageDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchBoardMessageWhereInput;
    limit?: number;
};
export type LooseMatchBoardMessageDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchBoardMessageSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchBoardMessageOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchBoardMessageInclude<ExtArgs> | null;
};
export {};
