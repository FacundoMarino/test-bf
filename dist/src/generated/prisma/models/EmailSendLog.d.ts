import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EmailSendLogModel = runtime.Types.Result.DefaultSelection<Prisma.$EmailSendLogPayload>;
export type AggregateEmailSendLog = {
    _count: EmailSendLogCountAggregateOutputType | null;
    _min: EmailSendLogMinAggregateOutputType | null;
    _max: EmailSendLogMaxAggregateOutputType | null;
};
export type EmailSendLogMinAggregateOutputType = {
    id: string | null;
    status: $Enums.EmailSendStatus | null;
    eventType: string | null;
    fromEmail: string | null;
    toEmail: string | null;
    subject: string | null;
    bodyText: string | null;
    bodyHtml: string | null;
    errorDetail: string | null;
    sentAt: Date | null;
};
export type EmailSendLogMaxAggregateOutputType = {
    id: string | null;
    status: $Enums.EmailSendStatus | null;
    eventType: string | null;
    fromEmail: string | null;
    toEmail: string | null;
    subject: string | null;
    bodyText: string | null;
    bodyHtml: string | null;
    errorDetail: string | null;
    sentAt: Date | null;
};
export type EmailSendLogCountAggregateOutputType = {
    id: number;
    status: number;
    eventType: number;
    fromEmail: number;
    toEmail: number;
    subject: number;
    bodyText: number;
    bodyHtml: number;
    errorDetail: number;
    sentAt: number;
    _all: number;
};
export type EmailSendLogMinAggregateInputType = {
    id?: true;
    status?: true;
    eventType?: true;
    fromEmail?: true;
    toEmail?: true;
    subject?: true;
    bodyText?: true;
    bodyHtml?: true;
    errorDetail?: true;
    sentAt?: true;
};
export type EmailSendLogMaxAggregateInputType = {
    id?: true;
    status?: true;
    eventType?: true;
    fromEmail?: true;
    toEmail?: true;
    subject?: true;
    bodyText?: true;
    bodyHtml?: true;
    errorDetail?: true;
    sentAt?: true;
};
export type EmailSendLogCountAggregateInputType = {
    id?: true;
    status?: true;
    eventType?: true;
    fromEmail?: true;
    toEmail?: true;
    subject?: true;
    bodyText?: true;
    bodyHtml?: true;
    errorDetail?: true;
    sentAt?: true;
    _all?: true;
};
export type EmailSendLogAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailSendLogWhereInput;
    orderBy?: Prisma.EmailSendLogOrderByWithRelationInput | Prisma.EmailSendLogOrderByWithRelationInput[];
    cursor?: Prisma.EmailSendLogWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EmailSendLogCountAggregateInputType;
    _min?: EmailSendLogMinAggregateInputType;
    _max?: EmailSendLogMaxAggregateInputType;
};
export type GetEmailSendLogAggregateType<T extends EmailSendLogAggregateArgs> = {
    [P in keyof T & keyof AggregateEmailSendLog]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEmailSendLog[P]> : Prisma.GetScalarType<T[P], AggregateEmailSendLog[P]>;
};
export type EmailSendLogGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailSendLogWhereInput;
    orderBy?: Prisma.EmailSendLogOrderByWithAggregationInput | Prisma.EmailSendLogOrderByWithAggregationInput[];
    by: Prisma.EmailSendLogScalarFieldEnum[] | Prisma.EmailSendLogScalarFieldEnum;
    having?: Prisma.EmailSendLogScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EmailSendLogCountAggregateInputType | true;
    _min?: EmailSendLogMinAggregateInputType;
    _max?: EmailSendLogMaxAggregateInputType;
};
export type EmailSendLogGroupByOutputType = {
    id: string;
    status: $Enums.EmailSendStatus;
    eventType: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    bodyText: string;
    bodyHtml: string | null;
    errorDetail: string | null;
    sentAt: Date;
    _count: EmailSendLogCountAggregateOutputType | null;
    _min: EmailSendLogMinAggregateOutputType | null;
    _max: EmailSendLogMaxAggregateOutputType | null;
};
type GetEmailSendLogGroupByPayload<T extends EmailSendLogGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EmailSendLogGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EmailSendLogGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EmailSendLogGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EmailSendLogGroupByOutputType[P]>;
}>>;
export type EmailSendLogWhereInput = {
    AND?: Prisma.EmailSendLogWhereInput | Prisma.EmailSendLogWhereInput[];
    OR?: Prisma.EmailSendLogWhereInput[];
    NOT?: Prisma.EmailSendLogWhereInput | Prisma.EmailSendLogWhereInput[];
    id?: Prisma.UuidFilter<"EmailSendLog"> | string;
    status?: Prisma.EnumEmailSendStatusFilter<"EmailSendLog"> | $Enums.EmailSendStatus;
    eventType?: Prisma.StringFilter<"EmailSendLog"> | string;
    fromEmail?: Prisma.StringFilter<"EmailSendLog"> | string;
    toEmail?: Prisma.StringFilter<"EmailSendLog"> | string;
    subject?: Prisma.StringFilter<"EmailSendLog"> | string;
    bodyText?: Prisma.StringFilter<"EmailSendLog"> | string;
    bodyHtml?: Prisma.StringNullableFilter<"EmailSendLog"> | string | null;
    errorDetail?: Prisma.StringNullableFilter<"EmailSendLog"> | string | null;
    sentAt?: Prisma.DateTimeFilter<"EmailSendLog"> | Date | string;
};
export type EmailSendLogOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    fromEmail?: Prisma.SortOrder;
    toEmail?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    bodyText?: Prisma.SortOrder;
    bodyHtml?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorDetail?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type EmailSendLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.EmailSendLogWhereInput | Prisma.EmailSendLogWhereInput[];
    OR?: Prisma.EmailSendLogWhereInput[];
    NOT?: Prisma.EmailSendLogWhereInput | Prisma.EmailSendLogWhereInput[];
    status?: Prisma.EnumEmailSendStatusFilter<"EmailSendLog"> | $Enums.EmailSendStatus;
    eventType?: Prisma.StringFilter<"EmailSendLog"> | string;
    fromEmail?: Prisma.StringFilter<"EmailSendLog"> | string;
    toEmail?: Prisma.StringFilter<"EmailSendLog"> | string;
    subject?: Prisma.StringFilter<"EmailSendLog"> | string;
    bodyText?: Prisma.StringFilter<"EmailSendLog"> | string;
    bodyHtml?: Prisma.StringNullableFilter<"EmailSendLog"> | string | null;
    errorDetail?: Prisma.StringNullableFilter<"EmailSendLog"> | string | null;
    sentAt?: Prisma.DateTimeFilter<"EmailSendLog"> | Date | string;
}, "id">;
export type EmailSendLogOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    fromEmail?: Prisma.SortOrder;
    toEmail?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    bodyText?: Prisma.SortOrder;
    bodyHtml?: Prisma.SortOrderInput | Prisma.SortOrder;
    errorDetail?: Prisma.SortOrderInput | Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
    _count?: Prisma.EmailSendLogCountOrderByAggregateInput;
    _max?: Prisma.EmailSendLogMaxOrderByAggregateInput;
    _min?: Prisma.EmailSendLogMinOrderByAggregateInput;
};
export type EmailSendLogScalarWhereWithAggregatesInput = {
    AND?: Prisma.EmailSendLogScalarWhereWithAggregatesInput | Prisma.EmailSendLogScalarWhereWithAggregatesInput[];
    OR?: Prisma.EmailSendLogScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EmailSendLogScalarWhereWithAggregatesInput | Prisma.EmailSendLogScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"EmailSendLog"> | string;
    status?: Prisma.EnumEmailSendStatusWithAggregatesFilter<"EmailSendLog"> | $Enums.EmailSendStatus;
    eventType?: Prisma.StringWithAggregatesFilter<"EmailSendLog"> | string;
    fromEmail?: Prisma.StringWithAggregatesFilter<"EmailSendLog"> | string;
    toEmail?: Prisma.StringWithAggregatesFilter<"EmailSendLog"> | string;
    subject?: Prisma.StringWithAggregatesFilter<"EmailSendLog"> | string;
    bodyText?: Prisma.StringWithAggregatesFilter<"EmailSendLog"> | string;
    bodyHtml?: Prisma.StringNullableWithAggregatesFilter<"EmailSendLog"> | string | null;
    errorDetail?: Prisma.StringNullableWithAggregatesFilter<"EmailSendLog"> | string | null;
    sentAt?: Prisma.DateTimeWithAggregatesFilter<"EmailSendLog"> | Date | string;
};
export type EmailSendLogCreateInput = {
    id?: string;
    status?: $Enums.EmailSendStatus;
    eventType: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string | null;
    errorDetail?: string | null;
    sentAt?: Date | string;
};
export type EmailSendLogUncheckedCreateInput = {
    id?: string;
    status?: $Enums.EmailSendStatus;
    eventType: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string | null;
    errorDetail?: string | null;
    sentAt?: Date | string;
};
export type EmailSendLogUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumEmailSendStatusFieldUpdateOperationsInput | $Enums.EmailSendStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    toEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyText?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyHtml?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    errorDetail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailSendLogUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumEmailSendStatusFieldUpdateOperationsInput | $Enums.EmailSendStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    toEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyText?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyHtml?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    errorDetail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailSendLogCreateManyInput = {
    id?: string;
    status?: $Enums.EmailSendStatus;
    eventType: string;
    fromEmail: string;
    toEmail: string;
    subject: string;
    bodyText: string;
    bodyHtml?: string | null;
    errorDetail?: string | null;
    sentAt?: Date | string;
};
export type EmailSendLogUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumEmailSendStatusFieldUpdateOperationsInput | $Enums.EmailSendStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    toEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyText?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyHtml?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    errorDetail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailSendLogUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumEmailSendStatusFieldUpdateOperationsInput | $Enums.EmailSendStatus;
    eventType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    toEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    subject?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyText?: Prisma.StringFieldUpdateOperationsInput | string;
    bodyHtml?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    errorDetail?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sentAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EmailSendLogCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    fromEmail?: Prisma.SortOrder;
    toEmail?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    bodyText?: Prisma.SortOrder;
    bodyHtml?: Prisma.SortOrder;
    errorDetail?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type EmailSendLogMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    fromEmail?: Prisma.SortOrder;
    toEmail?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    bodyText?: Prisma.SortOrder;
    bodyHtml?: Prisma.SortOrder;
    errorDetail?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type EmailSendLogMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    eventType?: Prisma.SortOrder;
    fromEmail?: Prisma.SortOrder;
    toEmail?: Prisma.SortOrder;
    subject?: Prisma.SortOrder;
    bodyText?: Prisma.SortOrder;
    bodyHtml?: Prisma.SortOrder;
    errorDetail?: Prisma.SortOrder;
    sentAt?: Prisma.SortOrder;
};
export type EnumEmailSendStatusFieldUpdateOperationsInput = {
    set?: $Enums.EmailSendStatus;
};
export type EmailSendLogSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    status?: boolean;
    eventType?: boolean;
    fromEmail?: boolean;
    toEmail?: boolean;
    subject?: boolean;
    bodyText?: boolean;
    bodyHtml?: boolean;
    errorDetail?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["emailSendLog"]>;
export type EmailSendLogSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    status?: boolean;
    eventType?: boolean;
    fromEmail?: boolean;
    toEmail?: boolean;
    subject?: boolean;
    bodyText?: boolean;
    bodyHtml?: boolean;
    errorDetail?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["emailSendLog"]>;
export type EmailSendLogSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    status?: boolean;
    eventType?: boolean;
    fromEmail?: boolean;
    toEmail?: boolean;
    subject?: boolean;
    bodyText?: boolean;
    bodyHtml?: boolean;
    errorDetail?: boolean;
    sentAt?: boolean;
}, ExtArgs["result"]["emailSendLog"]>;
export type EmailSendLogSelectScalar = {
    id?: boolean;
    status?: boolean;
    eventType?: boolean;
    fromEmail?: boolean;
    toEmail?: boolean;
    subject?: boolean;
    bodyText?: boolean;
    bodyHtml?: boolean;
    errorDetail?: boolean;
    sentAt?: boolean;
};
export type EmailSendLogOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "status" | "eventType" | "fromEmail" | "toEmail" | "subject" | "bodyText" | "bodyHtml" | "errorDetail" | "sentAt", ExtArgs["result"]["emailSendLog"]>;
export type $EmailSendLogPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EmailSendLog";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        status: $Enums.EmailSendStatus;
        eventType: string;
        fromEmail: string;
        toEmail: string;
        subject: string;
        bodyText: string;
        bodyHtml: string | null;
        errorDetail: string | null;
        sentAt: Date;
    }, ExtArgs["result"]["emailSendLog"]>;
    composites: {};
};
export type EmailSendLogGetPayload<S extends boolean | null | undefined | EmailSendLogDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload, S>;
export type EmailSendLogCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EmailSendLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EmailSendLogCountAggregateInputType | true;
};
export interface EmailSendLogDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EmailSendLog'];
        meta: {
            name: 'EmailSendLog';
        };
    };
    findUnique<T extends EmailSendLogFindUniqueArgs>(args: Prisma.SelectSubset<T, EmailSendLogFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EmailSendLogFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EmailSendLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EmailSendLogFindFirstArgs>(args?: Prisma.SelectSubset<T, EmailSendLogFindFirstArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EmailSendLogFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EmailSendLogFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EmailSendLogFindManyArgs>(args?: Prisma.SelectSubset<T, EmailSendLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EmailSendLogCreateArgs>(args: Prisma.SelectSubset<T, EmailSendLogCreateArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EmailSendLogCreateManyArgs>(args?: Prisma.SelectSubset<T, EmailSendLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EmailSendLogCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EmailSendLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EmailSendLogDeleteArgs>(args: Prisma.SelectSubset<T, EmailSendLogDeleteArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EmailSendLogUpdateArgs>(args: Prisma.SelectSubset<T, EmailSendLogUpdateArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EmailSendLogDeleteManyArgs>(args?: Prisma.SelectSubset<T, EmailSendLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EmailSendLogUpdateManyArgs>(args: Prisma.SelectSubset<T, EmailSendLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EmailSendLogUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EmailSendLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EmailSendLogUpsertArgs>(args: Prisma.SelectSubset<T, EmailSendLogUpsertArgs<ExtArgs>>): Prisma.Prisma__EmailSendLogClient<runtime.Types.Result.GetResult<Prisma.$EmailSendLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EmailSendLogCountArgs>(args?: Prisma.Subset<T, EmailSendLogCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EmailSendLogCountAggregateOutputType> : number>;
    aggregate<T extends EmailSendLogAggregateArgs>(args: Prisma.Subset<T, EmailSendLogAggregateArgs>): Prisma.PrismaPromise<GetEmailSendLogAggregateType<T>>;
    groupBy<T extends EmailSendLogGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EmailSendLogGroupByArgs['orderBy'];
    } : {
        orderBy?: EmailSendLogGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EmailSendLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEmailSendLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EmailSendLogFieldRefs;
}
export interface Prisma__EmailSendLogClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EmailSendLogFieldRefs {
    readonly id: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly status: Prisma.FieldRef<"EmailSendLog", 'EmailSendStatus'>;
    readonly eventType: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly fromEmail: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly toEmail: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly subject: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly bodyText: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly bodyHtml: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly errorDetail: Prisma.FieldRef<"EmailSendLog", 'String'>;
    readonly sentAt: Prisma.FieldRef<"EmailSendLog", 'DateTime'>;
}
export type EmailSendLogFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    where: Prisma.EmailSendLogWhereUniqueInput;
};
export type EmailSendLogFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    where: Prisma.EmailSendLogWhereUniqueInput;
};
export type EmailSendLogFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    where?: Prisma.EmailSendLogWhereInput;
    orderBy?: Prisma.EmailSendLogOrderByWithRelationInput | Prisma.EmailSendLogOrderByWithRelationInput[];
    cursor?: Prisma.EmailSendLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailSendLogScalarFieldEnum | Prisma.EmailSendLogScalarFieldEnum[];
};
export type EmailSendLogFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    where?: Prisma.EmailSendLogWhereInput;
    orderBy?: Prisma.EmailSendLogOrderByWithRelationInput | Prisma.EmailSendLogOrderByWithRelationInput[];
    cursor?: Prisma.EmailSendLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailSendLogScalarFieldEnum | Prisma.EmailSendLogScalarFieldEnum[];
};
export type EmailSendLogFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    where?: Prisma.EmailSendLogWhereInput;
    orderBy?: Prisma.EmailSendLogOrderByWithRelationInput | Prisma.EmailSendLogOrderByWithRelationInput[];
    cursor?: Prisma.EmailSendLogWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EmailSendLogScalarFieldEnum | Prisma.EmailSendLogScalarFieldEnum[];
};
export type EmailSendLogCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailSendLogCreateInput, Prisma.EmailSendLogUncheckedCreateInput>;
};
export type EmailSendLogCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EmailSendLogCreateManyInput | Prisma.EmailSendLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EmailSendLogCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    data: Prisma.EmailSendLogCreateManyInput | Prisma.EmailSendLogCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EmailSendLogUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailSendLogUpdateInput, Prisma.EmailSendLogUncheckedUpdateInput>;
    where: Prisma.EmailSendLogWhereUniqueInput;
};
export type EmailSendLogUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EmailSendLogUpdateManyMutationInput, Prisma.EmailSendLogUncheckedUpdateManyInput>;
    where?: Prisma.EmailSendLogWhereInput;
    limit?: number;
};
export type EmailSendLogUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EmailSendLogUpdateManyMutationInput, Prisma.EmailSendLogUncheckedUpdateManyInput>;
    where?: Prisma.EmailSendLogWhereInput;
    limit?: number;
};
export type EmailSendLogUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    where: Prisma.EmailSendLogWhereUniqueInput;
    create: Prisma.XOR<Prisma.EmailSendLogCreateInput, Prisma.EmailSendLogUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EmailSendLogUpdateInput, Prisma.EmailSendLogUncheckedUpdateInput>;
};
export type EmailSendLogDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
    where: Prisma.EmailSendLogWhereUniqueInput;
};
export type EmailSendLogDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EmailSendLogWhereInput;
    limit?: number;
};
export type EmailSendLogDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EmailSendLogSelect<ExtArgs> | null;
    omit?: Prisma.EmailSendLogOmit<ExtArgs> | null;
};
export {};
