import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type LooseMatchModel = runtime.Types.Result.DefaultSelection<Prisma.$LooseMatchPayload>;
export type AggregateLooseMatch = {
    _count: LooseMatchCountAggregateOutputType | null;
    _avg: LooseMatchAvgAggregateOutputType | null;
    _sum: LooseMatchSumAggregateOutputType | null;
    _min: LooseMatchMinAggregateOutputType | null;
    _max: LooseMatchMaxAggregateOutputType | null;
};
export type LooseMatchAvgAggregateOutputType = {
    level: number | null;
};
export type LooseMatchSumAggregateOutputType = {
    level: number | null;
};
export type LooseMatchMinAggregateOutputType = {
    id: string | null;
    profileId: string | null;
    title: string | null;
    startLabel: string | null;
    level: number | null;
    courtType: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    inviteCode: string | null;
};
export type LooseMatchMaxAggregateOutputType = {
    id: string | null;
    profileId: string | null;
    title: string | null;
    startLabel: string | null;
    level: number | null;
    courtType: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    inviteCode: string | null;
};
export type LooseMatchCountAggregateOutputType = {
    id: number;
    profileId: number;
    title: number;
    startLabel: number;
    level: number;
    courtType: number;
    createdAt: number;
    updatedAt: number;
    inviteCode: number;
    _all: number;
};
export type LooseMatchAvgAggregateInputType = {
    level?: true;
};
export type LooseMatchSumAggregateInputType = {
    level?: true;
};
export type LooseMatchMinAggregateInputType = {
    id?: true;
    profileId?: true;
    title?: true;
    startLabel?: true;
    level?: true;
    courtType?: true;
    createdAt?: true;
    updatedAt?: true;
    inviteCode?: true;
};
export type LooseMatchMaxAggregateInputType = {
    id?: true;
    profileId?: true;
    title?: true;
    startLabel?: true;
    level?: true;
    courtType?: true;
    createdAt?: true;
    updatedAt?: true;
    inviteCode?: true;
};
export type LooseMatchCountAggregateInputType = {
    id?: true;
    profileId?: true;
    title?: true;
    startLabel?: true;
    level?: true;
    courtType?: true;
    createdAt?: true;
    updatedAt?: true;
    inviteCode?: true;
    _all?: true;
};
export type LooseMatchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchWhereInput;
    orderBy?: Prisma.LooseMatchOrderByWithRelationInput | Prisma.LooseMatchOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | LooseMatchCountAggregateInputType;
    _avg?: LooseMatchAvgAggregateInputType;
    _sum?: LooseMatchSumAggregateInputType;
    _min?: LooseMatchMinAggregateInputType;
    _max?: LooseMatchMaxAggregateInputType;
};
export type GetLooseMatchAggregateType<T extends LooseMatchAggregateArgs> = {
    [P in keyof T & keyof AggregateLooseMatch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateLooseMatch[P]> : Prisma.GetScalarType<T[P], AggregateLooseMatch[P]>;
};
export type LooseMatchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchWhereInput;
    orderBy?: Prisma.LooseMatchOrderByWithAggregationInput | Prisma.LooseMatchOrderByWithAggregationInput[];
    by: Prisma.LooseMatchScalarFieldEnum[] | Prisma.LooseMatchScalarFieldEnum;
    having?: Prisma.LooseMatchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: LooseMatchCountAggregateInputType | true;
    _avg?: LooseMatchAvgAggregateInputType;
    _sum?: LooseMatchSumAggregateInputType;
    _min?: LooseMatchMinAggregateInputType;
    _max?: LooseMatchMaxAggregateInputType;
};
export type LooseMatchGroupByOutputType = {
    id: string;
    profileId: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt: Date;
    updatedAt: Date;
    inviteCode: string | null;
    _count: LooseMatchCountAggregateOutputType | null;
    _avg: LooseMatchAvgAggregateOutputType | null;
    _sum: LooseMatchSumAggregateOutputType | null;
    _min: LooseMatchMinAggregateOutputType | null;
    _max: LooseMatchMaxAggregateOutputType | null;
};
type GetLooseMatchGroupByPayload<T extends LooseMatchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<LooseMatchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof LooseMatchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], LooseMatchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], LooseMatchGroupByOutputType[P]>;
}>>;
export type LooseMatchWhereInput = {
    AND?: Prisma.LooseMatchWhereInput | Prisma.LooseMatchWhereInput[];
    OR?: Prisma.LooseMatchWhereInput[];
    NOT?: Prisma.LooseMatchWhereInput | Prisma.LooseMatchWhereInput[];
    id?: Prisma.UuidFilter<"LooseMatch"> | string;
    profileId?: Prisma.UuidFilter<"LooseMatch"> | string;
    title?: Prisma.StringFilter<"LooseMatch"> | string;
    startLabel?: Prisma.StringFilter<"LooseMatch"> | string;
    level?: Prisma.IntFilter<"LooseMatch"> | number;
    courtType?: Prisma.StringFilter<"LooseMatch"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LooseMatch"> | Date | string;
    inviteCode?: Prisma.StringNullableFilter<"LooseMatch"> | string | null;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    participants?: Prisma.LooseMatchParticipantListRelationFilter;
    boardMessages?: Prisma.LooseMatchBoardMessageListRelationFilter;
};
export type LooseMatchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    startLabel?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inviteCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    profile?: Prisma.ProfileOrderByWithRelationInput;
    participants?: Prisma.LooseMatchParticipantOrderByRelationAggregateInput;
    boardMessages?: Prisma.LooseMatchBoardMessageOrderByRelationAggregateInput;
};
export type LooseMatchWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    inviteCode?: string;
    AND?: Prisma.LooseMatchWhereInput | Prisma.LooseMatchWhereInput[];
    OR?: Prisma.LooseMatchWhereInput[];
    NOT?: Prisma.LooseMatchWhereInput | Prisma.LooseMatchWhereInput[];
    profileId?: Prisma.UuidFilter<"LooseMatch"> | string;
    title?: Prisma.StringFilter<"LooseMatch"> | string;
    startLabel?: Prisma.StringFilter<"LooseMatch"> | string;
    level?: Prisma.IntFilter<"LooseMatch"> | number;
    courtType?: Prisma.StringFilter<"LooseMatch"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LooseMatch"> | Date | string;
    profile?: Prisma.XOR<Prisma.ProfileScalarRelationFilter, Prisma.ProfileWhereInput>;
    participants?: Prisma.LooseMatchParticipantListRelationFilter;
    boardMessages?: Prisma.LooseMatchBoardMessageListRelationFilter;
}, "id" | "inviteCode">;
export type LooseMatchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    startLabel?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inviteCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.LooseMatchCountOrderByAggregateInput;
    _avg?: Prisma.LooseMatchAvgOrderByAggregateInput;
    _max?: Prisma.LooseMatchMaxOrderByAggregateInput;
    _min?: Prisma.LooseMatchMinOrderByAggregateInput;
    _sum?: Prisma.LooseMatchSumOrderByAggregateInput;
};
export type LooseMatchScalarWhereWithAggregatesInput = {
    AND?: Prisma.LooseMatchScalarWhereWithAggregatesInput | Prisma.LooseMatchScalarWhereWithAggregatesInput[];
    OR?: Prisma.LooseMatchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.LooseMatchScalarWhereWithAggregatesInput | Prisma.LooseMatchScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"LooseMatch"> | string;
    profileId?: Prisma.UuidWithAggregatesFilter<"LooseMatch"> | string;
    title?: Prisma.StringWithAggregatesFilter<"LooseMatch"> | string;
    startLabel?: Prisma.StringWithAggregatesFilter<"LooseMatch"> | string;
    level?: Prisma.IntWithAggregatesFilter<"LooseMatch"> | number;
    courtType?: Prisma.StringWithAggregatesFilter<"LooseMatch"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"LooseMatch"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"LooseMatch"> | Date | string;
    inviteCode?: Prisma.StringNullableWithAggregatesFilter<"LooseMatch"> | string | null;
};
export type LooseMatchCreateInput = {
    id?: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    profile: Prisma.ProfileCreateNestedOneWithoutLooseMatchesInput;
    participants?: Prisma.LooseMatchParticipantCreateNestedManyWithoutLooseMatchInput;
    boardMessages?: Prisma.LooseMatchBoardMessageCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchUncheckedCreateInput = {
    id?: string;
    profileId: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    participants?: Prisma.LooseMatchParticipantUncheckedCreateNestedManyWithoutLooseMatchInput;
    boardMessages?: Prisma.LooseMatchBoardMessageUncheckedCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutLooseMatchesNestedInput;
    participants?: Prisma.LooseMatchParticipantUpdateManyWithoutLooseMatchNestedInput;
    boardMessages?: Prisma.LooseMatchBoardMessageUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.LooseMatchParticipantUncheckedUpdateManyWithoutLooseMatchNestedInput;
    boardMessages?: Prisma.LooseMatchBoardMessageUncheckedUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchCreateManyInput = {
    id?: string;
    profileId: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
};
export type LooseMatchUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type LooseMatchUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type LooseMatchListRelationFilter = {
    every?: Prisma.LooseMatchWhereInput;
    some?: Prisma.LooseMatchWhereInput;
    none?: Prisma.LooseMatchWhereInput;
};
export type LooseMatchOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type LooseMatchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    startLabel?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inviteCode?: Prisma.SortOrder;
};
export type LooseMatchAvgOrderByAggregateInput = {
    level?: Prisma.SortOrder;
};
export type LooseMatchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    startLabel?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inviteCode?: Prisma.SortOrder;
};
export type LooseMatchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    profileId?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    startLabel?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    courtType?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    inviteCode?: Prisma.SortOrder;
};
export type LooseMatchSumOrderByAggregateInput = {
    level?: Prisma.SortOrder;
};
export type LooseMatchScalarRelationFilter = {
    is?: Prisma.LooseMatchWhereInput;
    isNot?: Prisma.LooseMatchWhereInput;
};
export type LooseMatchCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutProfileInput, Prisma.LooseMatchUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchCreateWithoutProfileInput[] | Prisma.LooseMatchUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutProfileInput | Prisma.LooseMatchCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.LooseMatchCreateManyProfileInputEnvelope;
    connect?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
};
export type LooseMatchUncheckedCreateNestedManyWithoutProfileInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutProfileInput, Prisma.LooseMatchUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchCreateWithoutProfileInput[] | Prisma.LooseMatchUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutProfileInput | Prisma.LooseMatchCreateOrConnectWithoutProfileInput[];
    createMany?: Prisma.LooseMatchCreateManyProfileInputEnvelope;
    connect?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
};
export type LooseMatchUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutProfileInput, Prisma.LooseMatchUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchCreateWithoutProfileInput[] | Prisma.LooseMatchUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutProfileInput | Prisma.LooseMatchCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.LooseMatchUpsertWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.LooseMatchCreateManyProfileInputEnvelope;
    set?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    delete?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    connect?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    update?: Prisma.LooseMatchUpdateWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.LooseMatchUpdateManyWithWhereWithoutProfileInput | Prisma.LooseMatchUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.LooseMatchScalarWhereInput | Prisma.LooseMatchScalarWhereInput[];
};
export type LooseMatchUncheckedUpdateManyWithoutProfileNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutProfileInput, Prisma.LooseMatchUncheckedCreateWithoutProfileInput> | Prisma.LooseMatchCreateWithoutProfileInput[] | Prisma.LooseMatchUncheckedCreateWithoutProfileInput[];
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutProfileInput | Prisma.LooseMatchCreateOrConnectWithoutProfileInput[];
    upsert?: Prisma.LooseMatchUpsertWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchUpsertWithWhereUniqueWithoutProfileInput[];
    createMany?: Prisma.LooseMatchCreateManyProfileInputEnvelope;
    set?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    disconnect?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    delete?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    connect?: Prisma.LooseMatchWhereUniqueInput | Prisma.LooseMatchWhereUniqueInput[];
    update?: Prisma.LooseMatchUpdateWithWhereUniqueWithoutProfileInput | Prisma.LooseMatchUpdateWithWhereUniqueWithoutProfileInput[];
    updateMany?: Prisma.LooseMatchUpdateManyWithWhereWithoutProfileInput | Prisma.LooseMatchUpdateManyWithWhereWithoutProfileInput[];
    deleteMany?: Prisma.LooseMatchScalarWhereInput | Prisma.LooseMatchScalarWhereInput[];
};
export type LooseMatchCreateNestedOneWithoutBoardMessagesInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutBoardMessagesInput, Prisma.LooseMatchUncheckedCreateWithoutBoardMessagesInput>;
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutBoardMessagesInput;
    connect?: Prisma.LooseMatchWhereUniqueInput;
};
export type LooseMatchUpdateOneRequiredWithoutBoardMessagesNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutBoardMessagesInput, Prisma.LooseMatchUncheckedCreateWithoutBoardMessagesInput>;
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutBoardMessagesInput;
    upsert?: Prisma.LooseMatchUpsertWithoutBoardMessagesInput;
    connect?: Prisma.LooseMatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LooseMatchUpdateToOneWithWhereWithoutBoardMessagesInput, Prisma.LooseMatchUpdateWithoutBoardMessagesInput>, Prisma.LooseMatchUncheckedUpdateWithoutBoardMessagesInput>;
};
export type LooseMatchCreateNestedOneWithoutParticipantsInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutParticipantsInput, Prisma.LooseMatchUncheckedCreateWithoutParticipantsInput>;
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutParticipantsInput;
    connect?: Prisma.LooseMatchWhereUniqueInput;
};
export type LooseMatchUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: Prisma.XOR<Prisma.LooseMatchCreateWithoutParticipantsInput, Prisma.LooseMatchUncheckedCreateWithoutParticipantsInput>;
    connectOrCreate?: Prisma.LooseMatchCreateOrConnectWithoutParticipantsInput;
    upsert?: Prisma.LooseMatchUpsertWithoutParticipantsInput;
    connect?: Prisma.LooseMatchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.LooseMatchUpdateToOneWithWhereWithoutParticipantsInput, Prisma.LooseMatchUpdateWithoutParticipantsInput>, Prisma.LooseMatchUncheckedUpdateWithoutParticipantsInput>;
};
export type LooseMatchCreateWithoutProfileInput = {
    id?: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    participants?: Prisma.LooseMatchParticipantCreateNestedManyWithoutLooseMatchInput;
    boardMessages?: Prisma.LooseMatchBoardMessageCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchUncheckedCreateWithoutProfileInput = {
    id?: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    participants?: Prisma.LooseMatchParticipantUncheckedCreateNestedManyWithoutLooseMatchInput;
    boardMessages?: Prisma.LooseMatchBoardMessageUncheckedCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchCreateOrConnectWithoutProfileInput = {
    where: Prisma.LooseMatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchCreateWithoutProfileInput, Prisma.LooseMatchUncheckedCreateWithoutProfileInput>;
};
export type LooseMatchCreateManyProfileInputEnvelope = {
    data: Prisma.LooseMatchCreateManyProfileInput | Prisma.LooseMatchCreateManyProfileInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchUpsertWithWhereUniqueWithoutProfileInput = {
    where: Prisma.LooseMatchWhereUniqueInput;
    update: Prisma.XOR<Prisma.LooseMatchUpdateWithoutProfileInput, Prisma.LooseMatchUncheckedUpdateWithoutProfileInput>;
    create: Prisma.XOR<Prisma.LooseMatchCreateWithoutProfileInput, Prisma.LooseMatchUncheckedCreateWithoutProfileInput>;
};
export type LooseMatchUpdateWithWhereUniqueWithoutProfileInput = {
    where: Prisma.LooseMatchWhereUniqueInput;
    data: Prisma.XOR<Prisma.LooseMatchUpdateWithoutProfileInput, Prisma.LooseMatchUncheckedUpdateWithoutProfileInput>;
};
export type LooseMatchUpdateManyWithWhereWithoutProfileInput = {
    where: Prisma.LooseMatchScalarWhereInput;
    data: Prisma.XOR<Prisma.LooseMatchUpdateManyMutationInput, Prisma.LooseMatchUncheckedUpdateManyWithoutProfileInput>;
};
export type LooseMatchScalarWhereInput = {
    AND?: Prisma.LooseMatchScalarWhereInput | Prisma.LooseMatchScalarWhereInput[];
    OR?: Prisma.LooseMatchScalarWhereInput[];
    NOT?: Prisma.LooseMatchScalarWhereInput | Prisma.LooseMatchScalarWhereInput[];
    id?: Prisma.UuidFilter<"LooseMatch"> | string;
    profileId?: Prisma.UuidFilter<"LooseMatch"> | string;
    title?: Prisma.StringFilter<"LooseMatch"> | string;
    startLabel?: Prisma.StringFilter<"LooseMatch"> | string;
    level?: Prisma.IntFilter<"LooseMatch"> | number;
    courtType?: Prisma.StringFilter<"LooseMatch"> | string;
    createdAt?: Prisma.DateTimeFilter<"LooseMatch"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"LooseMatch"> | Date | string;
    inviteCode?: Prisma.StringNullableFilter<"LooseMatch"> | string | null;
};
export type LooseMatchCreateWithoutBoardMessagesInput = {
    id?: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    profile: Prisma.ProfileCreateNestedOneWithoutLooseMatchesInput;
    participants?: Prisma.LooseMatchParticipantCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchUncheckedCreateWithoutBoardMessagesInput = {
    id?: string;
    profileId: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    participants?: Prisma.LooseMatchParticipantUncheckedCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchCreateOrConnectWithoutBoardMessagesInput = {
    where: Prisma.LooseMatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchCreateWithoutBoardMessagesInput, Prisma.LooseMatchUncheckedCreateWithoutBoardMessagesInput>;
};
export type LooseMatchUpsertWithoutBoardMessagesInput = {
    update: Prisma.XOR<Prisma.LooseMatchUpdateWithoutBoardMessagesInput, Prisma.LooseMatchUncheckedUpdateWithoutBoardMessagesInput>;
    create: Prisma.XOR<Prisma.LooseMatchCreateWithoutBoardMessagesInput, Prisma.LooseMatchUncheckedCreateWithoutBoardMessagesInput>;
    where?: Prisma.LooseMatchWhereInput;
};
export type LooseMatchUpdateToOneWithWhereWithoutBoardMessagesInput = {
    where?: Prisma.LooseMatchWhereInput;
    data: Prisma.XOR<Prisma.LooseMatchUpdateWithoutBoardMessagesInput, Prisma.LooseMatchUncheckedUpdateWithoutBoardMessagesInput>;
};
export type LooseMatchUpdateWithoutBoardMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutLooseMatchesNestedInput;
    participants?: Prisma.LooseMatchParticipantUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchUncheckedUpdateWithoutBoardMessagesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.LooseMatchParticipantUncheckedUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchCreateWithoutParticipantsInput = {
    id?: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    profile: Prisma.ProfileCreateNestedOneWithoutLooseMatchesInput;
    boardMessages?: Prisma.LooseMatchBoardMessageCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchUncheckedCreateWithoutParticipantsInput = {
    id?: string;
    profileId: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
    boardMessages?: Prisma.LooseMatchBoardMessageUncheckedCreateNestedManyWithoutLooseMatchInput;
};
export type LooseMatchCreateOrConnectWithoutParticipantsInput = {
    where: Prisma.LooseMatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchCreateWithoutParticipantsInput, Prisma.LooseMatchUncheckedCreateWithoutParticipantsInput>;
};
export type LooseMatchUpsertWithoutParticipantsInput = {
    update: Prisma.XOR<Prisma.LooseMatchUpdateWithoutParticipantsInput, Prisma.LooseMatchUncheckedUpdateWithoutParticipantsInput>;
    create: Prisma.XOR<Prisma.LooseMatchCreateWithoutParticipantsInput, Prisma.LooseMatchUncheckedCreateWithoutParticipantsInput>;
    where?: Prisma.LooseMatchWhereInput;
};
export type LooseMatchUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: Prisma.LooseMatchWhereInput;
    data: Prisma.XOR<Prisma.LooseMatchUpdateWithoutParticipantsInput, Prisma.LooseMatchUncheckedUpdateWithoutParticipantsInput>;
};
export type LooseMatchUpdateWithoutParticipantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    profile?: Prisma.ProfileUpdateOneRequiredWithoutLooseMatchesNestedInput;
    boardMessages?: Prisma.LooseMatchBoardMessageUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchUncheckedUpdateWithoutParticipantsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    profileId?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    boardMessages?: Prisma.LooseMatchBoardMessageUncheckedUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchCreateManyProfileInput = {
    id?: string;
    title: string;
    startLabel: string;
    level: number;
    courtType: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    inviteCode?: string | null;
};
export type LooseMatchUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.LooseMatchParticipantUpdateManyWithoutLooseMatchNestedInput;
    boardMessages?: Prisma.LooseMatchBoardMessageUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchUncheckedUpdateWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    participants?: Prisma.LooseMatchParticipantUncheckedUpdateManyWithoutLooseMatchNestedInput;
    boardMessages?: Prisma.LooseMatchBoardMessageUncheckedUpdateManyWithoutLooseMatchNestedInput;
};
export type LooseMatchUncheckedUpdateManyWithoutProfileInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    startLabel?: Prisma.StringFieldUpdateOperationsInput | string;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    courtType?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    inviteCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type LooseMatchCountOutputType = {
    participants: number;
    boardMessages: number;
};
export type LooseMatchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    participants?: boolean | LooseMatchCountOutputTypeCountParticipantsArgs;
    boardMessages?: boolean | LooseMatchCountOutputTypeCountBoardMessagesArgs;
};
export type LooseMatchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchCountOutputTypeSelect<ExtArgs> | null;
};
export type LooseMatchCountOutputTypeCountParticipantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchParticipantWhereInput;
};
export type LooseMatchCountOutputTypeCountBoardMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchBoardMessageWhereInput;
};
export type LooseMatchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    profileId?: boolean;
    title?: boolean;
    startLabel?: boolean;
    level?: boolean;
    courtType?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inviteCode?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    participants?: boolean | Prisma.LooseMatch$participantsArgs<ExtArgs>;
    boardMessages?: boolean | Prisma.LooseMatch$boardMessagesArgs<ExtArgs>;
    _count?: boolean | Prisma.LooseMatchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatch"]>;
export type LooseMatchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    profileId?: boolean;
    title?: boolean;
    startLabel?: boolean;
    level?: boolean;
    courtType?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inviteCode?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatch"]>;
export type LooseMatchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    profileId?: boolean;
    title?: boolean;
    startLabel?: boolean;
    level?: boolean;
    courtType?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inviteCode?: boolean;
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["looseMatch"]>;
export type LooseMatchSelectScalar = {
    id?: boolean;
    profileId?: boolean;
    title?: boolean;
    startLabel?: boolean;
    level?: boolean;
    courtType?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    inviteCode?: boolean;
};
export type LooseMatchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "profileId" | "title" | "startLabel" | "level" | "courtType" | "createdAt" | "updatedAt" | "inviteCode", ExtArgs["result"]["looseMatch"]>;
export type LooseMatchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
    participants?: boolean | Prisma.LooseMatch$participantsArgs<ExtArgs>;
    boardMessages?: boolean | Prisma.LooseMatch$boardMessagesArgs<ExtArgs>;
    _count?: boolean | Prisma.LooseMatchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type LooseMatchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type LooseMatchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    profile?: boolean | Prisma.ProfileDefaultArgs<ExtArgs>;
};
export type $LooseMatchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "LooseMatch";
    objects: {
        profile: Prisma.$ProfilePayload<ExtArgs>;
        participants: Prisma.$LooseMatchParticipantPayload<ExtArgs>[];
        boardMessages: Prisma.$LooseMatchBoardMessagePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        profileId: string;
        title: string;
        startLabel: string;
        level: number;
        courtType: string;
        createdAt: Date;
        updatedAt: Date;
        inviteCode: string | null;
    }, ExtArgs["result"]["looseMatch"]>;
    composites: {};
};
export type LooseMatchGetPayload<S extends boolean | null | undefined | LooseMatchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload, S>;
export type LooseMatchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<LooseMatchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: LooseMatchCountAggregateInputType | true;
};
export interface LooseMatchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['LooseMatch'];
        meta: {
            name: 'LooseMatch';
        };
    };
    findUnique<T extends LooseMatchFindUniqueArgs>(args: Prisma.SelectSubset<T, LooseMatchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends LooseMatchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, LooseMatchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends LooseMatchFindFirstArgs>(args?: Prisma.SelectSubset<T, LooseMatchFindFirstArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends LooseMatchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, LooseMatchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends LooseMatchFindManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends LooseMatchCreateArgs>(args: Prisma.SelectSubset<T, LooseMatchCreateArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends LooseMatchCreateManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends LooseMatchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, LooseMatchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends LooseMatchDeleteArgs>(args: Prisma.SelectSubset<T, LooseMatchDeleteArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends LooseMatchUpdateArgs>(args: Prisma.SelectSubset<T, LooseMatchUpdateArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends LooseMatchDeleteManyArgs>(args?: Prisma.SelectSubset<T, LooseMatchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends LooseMatchUpdateManyArgs>(args: Prisma.SelectSubset<T, LooseMatchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends LooseMatchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, LooseMatchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends LooseMatchUpsertArgs>(args: Prisma.SelectSubset<T, LooseMatchUpsertArgs<ExtArgs>>): Prisma.Prisma__LooseMatchClient<runtime.Types.Result.GetResult<Prisma.$LooseMatchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends LooseMatchCountArgs>(args?: Prisma.Subset<T, LooseMatchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], LooseMatchCountAggregateOutputType> : number>;
    aggregate<T extends LooseMatchAggregateArgs>(args: Prisma.Subset<T, LooseMatchAggregateArgs>): Prisma.PrismaPromise<GetLooseMatchAggregateType<T>>;
    groupBy<T extends LooseMatchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: LooseMatchGroupByArgs['orderBy'];
    } : {
        orderBy?: LooseMatchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, LooseMatchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLooseMatchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: LooseMatchFieldRefs;
}
export interface Prisma__LooseMatchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    profile<T extends Prisma.ProfileDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ProfileDefaultArgs<ExtArgs>>): Prisma.Prisma__ProfileClient<runtime.Types.Result.GetResult<Prisma.$ProfilePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    participants<T extends Prisma.LooseMatch$participantsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LooseMatch$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    boardMessages<T extends Prisma.LooseMatch$boardMessagesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.LooseMatch$boardMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$LooseMatchBoardMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface LooseMatchFieldRefs {
    readonly id: Prisma.FieldRef<"LooseMatch", 'String'>;
    readonly profileId: Prisma.FieldRef<"LooseMatch", 'String'>;
    readonly title: Prisma.FieldRef<"LooseMatch", 'String'>;
    readonly startLabel: Prisma.FieldRef<"LooseMatch", 'String'>;
    readonly level: Prisma.FieldRef<"LooseMatch", 'Int'>;
    readonly courtType: Prisma.FieldRef<"LooseMatch", 'String'>;
    readonly createdAt: Prisma.FieldRef<"LooseMatch", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"LooseMatch", 'DateTime'>;
    readonly inviteCode: Prisma.FieldRef<"LooseMatch", 'String'>;
}
export type LooseMatchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    where: Prisma.LooseMatchWhereUniqueInput;
};
export type LooseMatchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    where: Prisma.LooseMatchWhereUniqueInput;
};
export type LooseMatchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchWhereInput;
    orderBy?: Prisma.LooseMatchOrderByWithRelationInput | Prisma.LooseMatchOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchScalarFieldEnum | Prisma.LooseMatchScalarFieldEnum[];
};
export type LooseMatchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchWhereInput;
    orderBy?: Prisma.LooseMatchOrderByWithRelationInput | Prisma.LooseMatchOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchScalarFieldEnum | Prisma.LooseMatchScalarFieldEnum[];
};
export type LooseMatchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    where?: Prisma.LooseMatchWhereInput;
    orderBy?: Prisma.LooseMatchOrderByWithRelationInput | Prisma.LooseMatchOrderByWithRelationInput[];
    cursor?: Prisma.LooseMatchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.LooseMatchScalarFieldEnum | Prisma.LooseMatchScalarFieldEnum[];
};
export type LooseMatchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchCreateInput, Prisma.LooseMatchUncheckedCreateInput>;
};
export type LooseMatchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.LooseMatchCreateManyInput | Prisma.LooseMatchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type LooseMatchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    data: Prisma.LooseMatchCreateManyInput | Prisma.LooseMatchCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.LooseMatchIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type LooseMatchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchUpdateInput, Prisma.LooseMatchUncheckedUpdateInput>;
    where: Prisma.LooseMatchWhereUniqueInput;
};
export type LooseMatchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.LooseMatchUpdateManyMutationInput, Prisma.LooseMatchUncheckedUpdateManyInput>;
    where?: Prisma.LooseMatchWhereInput;
    limit?: number;
};
export type LooseMatchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.LooseMatchUpdateManyMutationInput, Prisma.LooseMatchUncheckedUpdateManyInput>;
    where?: Prisma.LooseMatchWhereInput;
    limit?: number;
    include?: Prisma.LooseMatchIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type LooseMatchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    where: Prisma.LooseMatchWhereUniqueInput;
    create: Prisma.XOR<Prisma.LooseMatchCreateInput, Prisma.LooseMatchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.LooseMatchUpdateInput, Prisma.LooseMatchUncheckedUpdateInput>;
};
export type LooseMatchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
    where: Prisma.LooseMatchWhereUniqueInput;
};
export type LooseMatchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.LooseMatchWhereInput;
    limit?: number;
};
export type LooseMatch$participantsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LooseMatch$boardMessagesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type LooseMatchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.LooseMatchSelect<ExtArgs> | null;
    omit?: Prisma.LooseMatchOmit<ExtArgs> | null;
    include?: Prisma.LooseMatchInclude<ExtArgs> | null;
};
export {};
