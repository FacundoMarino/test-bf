import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LooseMatchParticipantModel = runtime.Types.Result.DefaultSelection<Prisma.$LooseMatchParticipantPayload>;
export type AggregateLooseMatchParticipant = {
    _count: LooseMatchParticipantCountAggregateOutputType | null;
    _min: LooseMatchParticipantMinAggregateOutputType | null;
    _max: LooseMatchParticipantMaxAggregateOutputType | null;
};
export type LooseMatchParticipantMinAggregateOutputType = {
    id: string | null;
    looseMatchId: string | null;
    profileId: string | null;
    createdAt: Date | null;
};
export type LooseMatchParticipantMaxAggregateOutputType = {
    id: string | null;
    looseMatchId: string | null;
    profileId: string | null;
    createdAt: Date | null;
};
export type LooseMatchParticipantCountAggregateOutputType = {
    id: number;
    looseMatchId: number;
    profileId: number;
    createdAt: number;
    _all: number;
};
export type LooseMatchParticipantMinAggregateInputType = {
    id?: true;
    looseMatchId?: true;
    profileId?: true;
    createdAt?: true;
};
export type LooseMatchParticipantMaxAggregateInputType = {
    id?: true;
    looseMatchId?: true;
    profileId?: true;
    createdAt?: true;
};
export type LooseMatchParticipantCountAggregateInputType = {
    id?: true;
    looseMatchId?: true;
    profileId?: true;
    createdAt?: true;
    _all?: true;
};
export type LooseMatchParticipantAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchParticipantWhereInput;
    orderBy?: Prisma.LooseMatchParticipantOrderByWithRelationInput | Prisma.LooseMatchParticipantOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LooseMatchParticipantCountAggregateInputType;
    _min?: LooseMatchParticipantMinAggregateInputType;
    _max?: LooseMatchParticipantMaxAggregateInputType;
};
export type GetLooseMatchParticipantAggregateType<T extends LooseMatchParticipantAggregateArgs> = {
    [P in keyof T & keyof AggregateLooseMatchParticipant]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLooseMatchParticipant[P]> : Prisma.GetScalarType<T[P], AggregateLooseMatchParticipant[P]>;
};
export type LooseMatchParticipantGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchParticipantWhereInput;
    orderBy?: Prisma.LooseMatchParticipantOrderByWithAggregationInput | Prisma.LooseMatchParticipantOrderByWithAggregationInput[];
    by: Prisma.LooseMatchParticipantScalarFieldEnum[] | Prisma.LooseMatchParticipantScalarFieldEnum;
    having?: Prisma.LooseMatchParticipantScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LooseMatchParticipantCountAggregateInputType | true;
    _min?: LooseMatchParticipantMinAggregateInputType;
    _max?: LooseMatchParticipantMaxAggregateInputType;
};
export type LooseMatchParticipantGroupByOutputType = {
    id: string;
    looseMatchId: string;
    profileId: string;
    createdAt: Date;
    _count: LooseMatchParticipantCountAggregateOutputType | null;
    _min: LooseMatchParticipantMinAggregateOutputType | null;
    _max: LooseMatchParticipantMaxAggregateOutputType | null;
};
type GetLooseMatchParticipantGroupByPayload<T extends LooseMatchParticipantGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LooseMatchParticipantGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LooseMatchParticipantGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LooseMatchParticipantGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LooseMatchParticipantGroupByOutputType[P]>;
}>>;
export type LooseMatchParticipantWhereInput = {
    AND?: Prisma.LooseMatchParticipantWhereInput | Prisma.LooseMatchParticipantWhereInput[];
    OR?: Prisma.LooseMatchParticipantWhereInput[];
    NOT?: Prisma.LooseMatchParticipantWhereInput | Prisma.LooseMatchParticipantWhereInput[];
    id?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    looseMatchId?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    profileId?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatchParticipant"> | Date | string;
    looseMatch?: Prisma.XOR<Prisma.LooseMatchScalarRelationFilter, Prisma.LooseMatchWhereInput>;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
};
export type LooseMatchParticipantOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    looseMatch?: Prisma.LooseMatchOrderByWithRelationInput;
    profile?: Prisma.ProfileOrderByWithRelationInput;
};
export type LooseMatchParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    looseMatchId_profileId?: Prisma.LooseMatchParticipantLooseMatchIdProfileIdCompoundUniqueInput;
    AND?: Prisma.LooseMatchParticipantWhereInput | Prisma.LooseMatchParticipantWhereInput[];
    OR?: Prisma.LooseMatchParticipantWhereInput[];
    NOT?: Prisma.LooseMatchParticipantWhereInput | Prisma.LooseMatchParticipantWhereInput[];
    looseMatchId?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    profileId?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatchParticipant"> | Date | string;
    looseMatch?: Prisma.XOR<Prisma.LooseMatchScalarRelationFilter, Prisma.LooseMatchWhereInput>;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
}, "id" | "looseMatchId_profileId">;
export type LooseMatchParticipantOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.LooseMatchParticipantCountOrderByAggregateInput;
    _max?: Prisma.LooseMatchParticipantMaxOrderByAggregateInput;
    _min?: Prisma.LooseMatchParticipantMinOrderByAggregateInput;
};
export type LooseMatchParticipantScalarWhereWithAggregatesInput = {
    AND?: Prisma.LooseMatchParticipantScalarWhereWithAggregatesInput | Prisma.LooseMatchParticipantScalarWhereWithAggregatesInput[];
    OR?: Prisma.LooseMatchParticipantScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LooseMatchParticipantScalarWhereWithAggregatesInput | Prisma.LooseMatchParticipantScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"LooseMatchParticipant"> | string;
    looseMatchId?: Prisma.UuidWithAggregatesFilter<"LooseMatchParticipant"> | string;
    profileId?: Prisma.UuidWithAggregatesFilter<"LooseMatchParticipant"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LooseMatchParticipant"> | Date | string;
};
export type LooseMatchParticipantCreateInput = {
    id?: string;
    createdAt?: Date | string;
    looseMatch: Prisma.LooseMatchCreateNestedOneWithoutParticipantsInput;
    profile: Prisma.ProfileCreateNestedOneWithoutLooseMatchParticipantsInput;
};
export type LooseMatchParticipantUncheckedCreateInput = {
    id?: string;
    looseMatchId: string;
    profileId: string;
    createdAt?: Date | string;
};
export type LooseMatchParticipantUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    looseMatch?: Prisma.LooseMatchUpdateOneRequiredWithoutParticipantsNestedInput;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutLooseMatchParticipantsNestedInput;
};
export type LooseMatchParticipantUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchParticipantCreateManyInput = {
    id?: string;
    looseMatchId: string;
    profileId: string;
    createdAt?: Date | string;
};
export type LooseMatchParticipantUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchParticipantUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchParticipantListRelationFilter = {
    every?: Prisma.LooseMatchParticipantWhereInput;
    some?: Prisma.LooseMatchParticipantWhereInput;
    none?: Prisma.LooseMatchParticipantWhereInput;
};
export type LooseMatchParticipantOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LooseMatchParticipantLooseMatchIdProfileIdCompoundUniqueInput = {
    looseMatchId: string;
    profileId: string;
};
export type LooseMatchParticipantCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LooseMatchParticipantMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LooseMatchParticipantMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    looseMatchId?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type LooseMatchParticipantCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchParticipantCreateWithoutProfileInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyProfileInputEnvelope;
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
};
export type LooseMatchParticipantUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchParticipantCreateWithoutProfileInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyProfileInputEnvelope;
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
};
export type LooseMatchParticipantUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchParticipantCreateWithoutProfileInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyProfileInputEnvelope;
    set?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    delete?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    update?: Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutProfileInput | Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.LooseMatchParticipantScalarWhereInput | Prisma.LooseMatchParticipantScalarWhereInput[];
};
export type LooseMatchParticipantUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchParticipantCreateWithoutProfileInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyProfileInputEnvelope;
    set?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    delete?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    update?: Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutProfileInput | Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.LooseMatchParticipantScalarWhereInput | Prisma.LooseMatchParticipantScalarWhereInput[];
};
export type LooseMatchParticipantCreateNestedManyWithoutLooseMatchInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyLooseMatchInputEnvelope;
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
};
export type LooseMatchParticipantUncheckedCreateNestedManyWithoutLooseMatchInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyLooseMatchInputEnvelope;
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
};
export type LooseMatchParticipantUpdateManyWithoutLooseMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput[];
    upsert?: Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyLooseMatchInputEnvelope;
    set?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    delete?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    update?: Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutLooseMatchInput[];
    updateMany?: Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutLooseMatchInput | Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutLooseMatchInput[];
    deleteMany?: Prisma.LooseMatchParticipantScalarWhereInput | Prisma.LooseMatchParticipantScalarWhereInput[];
};
export type LooseMatchParticipantUncheckedUpdateManyWithoutLooseMatchNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput> | Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput[] | Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput[];
    connectOrCreate?: Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput | Prisma.LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput[];
    upsert?: Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchParticipantUpsertWithWhereUniqueWithoutLooseMatchInput[];
    createMany?: Prisma.LooseMatchParticipantCreateManyLooseMatchInputEnvelope;
    set?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    delete?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    connect?: Prisma.LooseMatchParticipantWhereUniqueInput | Prisma.LooseMatchParticipantWhereUniqueInput[];
    update?: Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutLooseMatchInput | Prisma.LooseMatchParticipantUpdateWithWhereUniqueWithoutLooseMatchInput[];
    updateMany?: Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutLooseMatchInput | Prisma.LooseMatchParticipantUpdateManyWithWhereWithoutLooseMatchInput[];
    deleteMany?: Prisma.LooseMatchParticipantScalarWhereInput | Prisma.LooseMatchParticipantScalarWhereInput[];
};
export type LooseMatchParticipantCreateWithoutProfileInput = {
    id?: string;
    createdAt?: Date | string;
    looseMatch: Prisma.LooseMatchCreateNestedOneWithoutParticipantsInput;
};
export type LooseMatchParticipantUncheckedCreateWithoutProfileInput = {
    id?: string;
    looseMatchId: string;
    createdAt?: Date | string;
};
export type LooseMatchParticipantCreateOrConnectWithoutProfileInput = {
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput>;
};
export type LooseMatchParticipantCreateManyProfileInputEnvelope = {
    data: Prisma.LooseMatchParticipantCreateManyProfileInput | Prisma.LooseMatchParticipantCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchParticipantUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
    update: Prisma.XOR<Prisma.LooseMatchParticipantUpdateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutProfileInput>;
};
export type LooseMatchParticipantUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
    data: Prisma.XOR<Prisma.LooseMatchParticipantUpdateWithoutProfileInput, Prisma.LooseMatchParticipantUncheckedUpdateWithoutProfileInput>;
};
export type LooseMatchParticipantUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.LooseMatchParticipantScalarWhereInput;
    data: Prisma.XOR<Prisma.LooseMatchParticipantUpdateManyMutationInput, Prisma.LooseMatchParticipantUncheckedUpdateManyWithoutProfileInput>;
};
export type LooseMatchParticipantScalarWhereInput = {
    AND?: Prisma.LooseMatchParticipantScalarWhereInput | Prisma.LooseMatchParticipantScalarWhereInput[];
    OR?: Prisma.LooseMatchParticipantScalarWhereInput[];
    NOT?: Prisma.LooseMatchParticipantScalarWhereInput | Prisma.LooseMatchParticipantScalarWhereInput[];
    id?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    looseMatchId?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    profileId?: Prisma.UuidFilter<"LooseMatchParticipant"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatchParticipant"> | Date | string;
};
export type LooseMatchParticipantCreateWithoutLooseMatchInput = {
    id?: string;
    createdAt?: Date | string;
    profile: Prisma.ProfileCreateNestedOneWithoutLooseMatchParticipantsInput;
};
export type LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput = {
    id?: string;
    profileId: string;
    createdAt?: Date | string;
};
export type LooseMatchParticipantCreateOrConnectWithoutLooseMatchInput = {
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput>;
};
export type LooseMatchParticipantCreateManyLooseMatchInputEnvelope = {
    data: Prisma.LooseMatchParticipantCreateManyLooseMatchInput | Prisma.LooseMatchParticipantCreateManyLooseMatchInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchParticipantUpsertWithWhereUniqueWithoutLooseMatchInput = {
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
    update: Prisma.XOR<Prisma.LooseMatchParticipantUpdateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedUpdateWithoutLooseMatchInput>;
    create: Prisma.XOR<Prisma.LooseMatchParticipantCreateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedCreateWithoutLooseMatchInput>;
};
export type LooseMatchParticipantUpdateWithWhereUniqueWithoutLooseMatchInput = {
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
    data: Prisma.XOR<Prisma.LooseMatchParticipantUpdateWithoutLooseMatchInput, Prisma.LooseMatchParticipantUncheckedUpdateWithoutLooseMatchInput>;
};
export type LooseMatchParticipantUpdateManyWithWhereWithoutLooseMatchInput = {
    where: Prisma.LooseMatchParticipantScalarWhereInput;
    data: Prisma.XOR<Prisma.LooseMatchParticipantUpdateManyMutationInput, Prisma.LooseMatchParticipantUncheckedUpdateManyWithoutLooseMatchInput>;
};
export type LooseMatchParticipantCreateManyProfileInput = {
    id?: string;
    looseMatchId: string;
    createdAt?: Date | string;
};
export type LooseMatchParticipantUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    looseMatch?: Prisma.LooseMatchUpdateOneRequiredWithoutParticipantsNestedInput;
};
export type LooseMatchParticipantUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchParticipantUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    looseMatchId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchParticipantCreateManyLooseMatchInput = {
    id?: string;
    profileId: string;
    createdAt?: Date | string;
};
export type LooseMatchParticipantUpdateWithoutLooseMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutLooseMatchParticipantsNestedInput;
};
export type LooseMatchParticipantUncheckedUpdateWithoutLooseMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchParticipantUncheckedUpdateManyWithoutLooseMatchInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type LooseMatchParticipantSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    looseMatchId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatchParticipant"]>;
export type LooseMatchParticipantSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    looseMatchId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatchParticipant"]>;
export type LooseMatchParticipantSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    looseMatchId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatchParticipant"]>;
export type LooseMatchParticipantSelectScalar = {
    id?: boolean;
    looseMatchId?: boolean;
    profileId?: boolean;
    createdAt?: boolean;
};
export type LooseMatchParticipantOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "looseMatchId" | "profileId" | "createdAt", ExtArgs["result"]["looseMatchParticipant"]>;
export type LooseMatchParticipantInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type LooseMatchParticipantIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type LooseMatchParticipantIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    looseMatch?: boolean | Prisma.LooseMatchDefaultArgs<ExtArgs>;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $LooseMatchParticipantPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LooseMatchParticipant";
    objects: {
        looseMatch: Prisma.$LooseMatchPayload<ExtArgs>;
        profile: Prisma.$ProfilePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        looseMatchId: string;
        profileId: string;
        createdAt: Date;
    }, ExtArgs["result"]["looseMatchParticipant"]>;
    composites: {};
};
export type LooseMatchParticipantGetPayload<S extends boolean | null | undefined | LooseMatchParticipantDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload, S>;
export type LooseMatchParticipantCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LooseMatchParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LooseMatchParticipantCountAggregateInputType | true;
};
export interface LooseMatchParticipantDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LooseMatchParticipant'];
        meta: {
            name: 'LooseMatchParticipant';
        };
    };
    findUnique<T extends LooseMatchParticipantFindUniqueArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LooseMatchParticipantFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LooseMatchParticipantFindFirstArgs>(args?: Prisma.SelectSubset<T, LooseMatchParticipantFindFirstArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LooseMatchParticipantFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LooseMatchParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LooseMatchParticipantFindManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LooseMatchParticipantCreateArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantCreateArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LooseMatchParticipantCreateManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LooseMatchParticipantCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LooseMatchParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LooseMatchParticipantDeleteArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantDeleteArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LooseMatchParticipantUpdateArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantUpdateArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LooseMatchParticipantDeleteManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LooseMatchParticipantUpdateManyArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LooseMatchParticipantUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LooseMatchParticipantUpsertArgs>(args: Prisma.SelectSubset<T, LooseMatchParticipantUpsertArgs<ExtArgs>>): Prisma.Prisma__LooseMatchParticipantClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LooseMatchParticipantCountArgs>(args?: Prisma.Subset<T, LooseMatchParticipantCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LooseMatchParticipantCountAggregateOutputType> : number>;
    aggregate<T extends LooseMatchParticipantAggregateArgs>(args: Prisma.Subset<T, LooseMatchParticipantAggregateArgs>): Prisma.PrismaPromise<GetLooseMatchParticipantAggregateType<T>>;
    groupBy<T extends LooseMatchParticipantGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LooseMatchParticipantGroupByArgs['orderBy'];
    } : {
        orderBy?: LooseMatchParticipantGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LooseMatchParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLooseMatchParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LooseMatchParticipantFieldRefs;
}
export interface Prisma__LooseMatchParticipantClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    looseMatch<T extends Prisma.LooseMatchDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LooseMatchDefaultArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    profile<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LooseMatchParticipantFieldRefs {
    readonly id: Prisma.FieldRef<"LooseMatchParticipant", 'String'>;
    readonly looseMatchId: Prisma.FieldRef<"LooseMatchParticipant", 'String'>;
    readonly profileId: Prisma.FieldRef<"LooseMatchParticipant", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LooseMatchParticipant", 'DateTime'>;
}
export type LooseMatchParticipantFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
};
export type LooseMatchParticipantFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
};
export type LooseMatchParticipantFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchParticipantWhereInput;
    orderBy?: Prisma.LooseMatchParticipantOrderByWithRelationInput | Prisma.LooseMatchParticipantOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchParticipantScalarFieldEnum | Prisma.LooseMatchParticipantScalarFieldEnum[];
};
export type LooseMatchParticipantFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchParticipantWhereInput;
    orderBy?: Prisma.LooseMatchParticipantOrderByWithRelationInput | Prisma.LooseMatchParticipantOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchParticipantScalarFieldEnum | Prisma.LooseMatchParticipantScalarFieldEnum[];
};
export type LooseMatchParticipantFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchParticipantWhereInput;
    orderBy?: Prisma.LooseMatchParticipantOrderByWithRelationInput | Prisma.LooseMatchParticipantOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchParticipantWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchParticipantScalarFieldEnum | Prisma.LooseMatchParticipantScalarFieldEnum[];
};
export type LooseMatchParticipantCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchParticipantCreateInput, Prisma.LooseMatchParticipantUncheckedCreateInput>;
};
export type LooseMatchParticipantCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LooseMatchParticipantCreateManyInput | Prisma.LooseMatchParticipantCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchParticipantCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    data: Prisma.LooseMatchParticipantCreateManyInput | Prisma.LooseMatchParticipantCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LooseMatchParticipantIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LooseMatchParticipantUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchParticipantUpdateInput, Prisma.LooseMatchParticipantUncheckedUpdateInput>;
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
};
export type LooseMatchParticipantUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LooseMatchParticipantUpdateManyMutationInput, Prisma.LooseMatchParticipantUncheckedUpdateManyInput>;
    where?: Prisma.LooseMatchParticipantWhereInput;
    limit?: number;
};
export type LooseMatchParticipantUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchParticipantUpdateManyMutationInput, Prisma.LooseMatchParticipantUncheckedUpdateManyInput>;
    where?: Prisma.LooseMatchParticipantWhereInput;
    limit?: number;
    include?: Prisma.LooseMatchParticipantIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LooseMatchParticipantUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchParticipantCreateInput, Prisma.LooseMatchParticipantUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LooseMatchParticipantUpdateInput, Prisma.LooseMatchParticipantUncheckedUpdateInput>;
};
export type LooseMatchParticipantDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
    where: Prisma.LooseMatchParticipantWhereUniqueInput;
};
export type LooseMatchParticipantDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchParticipantWhereInput;
    limit?: number;
};
export type LooseMatchParticipantDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchParticipantSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchParticipantOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchParticipantInclude<ExtArgs> | null;
};
export {};
