import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models.js";
import { type PrismaClient } from "./class.js";
export type * from '../models.js';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Profile: "Profile";
    readonly Club: "Club";
    readonly Court: "Court";
    readonly CourtCustomSlot: "CourtCustomSlot";
    readonly CourtScheduleException: "CourtScheduleException";
    readonly CourtSchedule: "CourtSchedule";
    readonly CourtBooking: "CourtBooking";
    readonly CourtBookingParticipant: "CourtBookingParticipant";
    readonly LooseMatch: "LooseMatch";
    readonly CourtBookingBoardMessage: "CourtBookingBoardMessage";
    readonly LooseMatchBoardMessage: "LooseMatchBoardMessage";
    readonly LooseMatchParticipant: "LooseMatchParticipant";
    readonly EmailSendLog: "EmailSendLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "profile" | "club" | "court" | "courtCustomSlot" | "courtScheduleException" | "courtSchedule" | "courtBooking" | "courtBookingParticipant" | "looseMatch" | "courtBookingBoardMessage" | "looseMatchBoardMessage" | "looseMatchParticipant" | "emailSendLog";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Profile: {
            payload: Prisma.$ProfilePayload<ExtArgs>;
            fields: Prisma.ProfileFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ProfileFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ProfileFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                findFirst: {
                    args: Prisma.ProfileFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ProfileFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                findMany: {
                    args: Prisma.ProfileFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>[];
                };
                create: {
                    args: Prisma.ProfileCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                createMany: {
                    args: Prisma.ProfileCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ProfileCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>[];
                };
                delete: {
                    args: Prisma.ProfileDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                update: {
                    args: Prisma.ProfileUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                deleteMany: {
                    args: Prisma.ProfileDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ProfileUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ProfileUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>[];
                };
                upsert: {
                    args: Prisma.ProfileUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ProfilePayload>;
                };
                aggregate: {
                    args: Prisma.ProfileAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateProfile>;
                };
                groupBy: {
                    args: Prisma.ProfileGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProfileGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ProfileCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ProfileCountAggregateOutputType> | number;
                };
            };
        };
        Club: {
            payload: Prisma.$ClubPayload<ExtArgs>;
            fields: Prisma.ClubFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ClubFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ClubFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>;
                };
                findFirst: {
                    args: Prisma.ClubFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ClubFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>;
                };
                findMany: {
                    args: Prisma.ClubFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>[];
                };
                create: {
                    args: Prisma.ClubCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>;
                };
                createMany: {
                    args: Prisma.ClubCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ClubCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>[];
                };
                delete: {
                    args: Prisma.ClubDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>;
                };
                update: {
                    args: Prisma.ClubUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>;
                };
                deleteMany: {
                    args: Prisma.ClubDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ClubUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ClubUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>[];
                };
                upsert: {
                    args: Prisma.ClubUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ClubPayload>;
                };
                aggregate: {
                    args: Prisma.ClubAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateClub>;
                };
                groupBy: {
                    args: Prisma.ClubGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClubGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ClubCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ClubCountAggregateOutputType> | number;
                };
            };
        };
        Court: {
            payload: Prisma.$CourtPayload<ExtArgs>;
            fields: Prisma.CourtFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourtFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourtFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>;
                };
                findFirst: {
                    args: Prisma.CourtFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourtFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>;
                };
                findMany: {
                    args: Prisma.CourtFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>[];
                };
                create: {
                    args: Prisma.CourtCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>;
                };
                createMany: {
                    args: Prisma.CourtCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourtCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>[];
                };
                delete: {
                    args: Prisma.CourtDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>;
                };
                update: {
                    args: Prisma.CourtUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>;
                };
                deleteMany: {
                    args: Prisma.CourtDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourtUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourtUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>[];
                };
                upsert: {
                    args: Prisma.CourtUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtPayload>;
                };
                aggregate: {
                    args: Prisma.CourtAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourt>;
                };
                groupBy: {
                    args: Prisma.CourtGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourtCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtCountAggregateOutputType> | number;
                };
            };
        };
        CourtCustomSlot: {
            payload: Prisma.$CourtCustomSlotPayload<ExtArgs>;
            fields: Prisma.CourtCustomSlotFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourtCustomSlotFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourtCustomSlotFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>;
                };
                findFirst: {
                    args: Prisma.CourtCustomSlotFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourtCustomSlotFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>;
                };
                findMany: {
                    args: Prisma.CourtCustomSlotFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>[];
                };
                create: {
                    args: Prisma.CourtCustomSlotCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>;
                };
                createMany: {
                    args: Prisma.CourtCustomSlotCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourtCustomSlotCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>[];
                };
                delete: {
                    args: Prisma.CourtCustomSlotDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>;
                };
                update: {
                    args: Prisma.CourtCustomSlotUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>;
                };
                deleteMany: {
                    args: Prisma.CourtCustomSlotDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourtCustomSlotUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourtCustomSlotUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>[];
                };
                upsert: {
                    args: Prisma.CourtCustomSlotUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtCustomSlotPayload>;
                };
                aggregate: {
                    args: Prisma.CourtCustomSlotAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourtCustomSlot>;
                };
                groupBy: {
                    args: Prisma.CourtCustomSlotGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtCustomSlotGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourtCustomSlotCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtCustomSlotCountAggregateOutputType> | number;
                };
            };
        };
        CourtScheduleException: {
            payload: Prisma.$CourtScheduleExceptionPayload<ExtArgs>;
            fields: Prisma.CourtScheduleExceptionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourtScheduleExceptionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourtScheduleExceptionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>;
                };
                findFirst: {
                    args: Prisma.CourtScheduleExceptionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourtScheduleExceptionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>;
                };
                findMany: {
                    args: Prisma.CourtScheduleExceptionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>[];
                };
                create: {
                    args: Prisma.CourtScheduleExceptionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>;
                };
                createMany: {
                    args: Prisma.CourtScheduleExceptionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourtScheduleExceptionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>[];
                };
                delete: {
                    args: Prisma.CourtScheduleExceptionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>;
                };
                update: {
                    args: Prisma.CourtScheduleExceptionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>;
                };
                deleteMany: {
                    args: Prisma.CourtScheduleExceptionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourtScheduleExceptionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourtScheduleExceptionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>[];
                };
                upsert: {
                    args: Prisma.CourtScheduleExceptionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtScheduleExceptionPayload>;
                };
                aggregate: {
                    args: Prisma.CourtScheduleExceptionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourtScheduleException>;
                };
                groupBy: {
                    args: Prisma.CourtScheduleExceptionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtScheduleExceptionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourtScheduleExceptionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtScheduleExceptionCountAggregateOutputType> | number;
                };
            };
        };
        CourtSchedule: {
            payload: Prisma.$CourtSchedulePayload<ExtArgs>;
            fields: Prisma.CourtScheduleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourtScheduleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourtScheduleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>;
                };
                findFirst: {
                    args: Prisma.CourtScheduleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourtScheduleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>;
                };
                findMany: {
                    args: Prisma.CourtScheduleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>[];
                };
                create: {
                    args: Prisma.CourtScheduleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>;
                };
                createMany: {
                    args: Prisma.CourtScheduleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourtScheduleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>[];
                };
                delete: {
                    args: Prisma.CourtScheduleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>;
                };
                update: {
                    args: Prisma.CourtScheduleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>;
                };
                deleteMany: {
                    args: Prisma.CourtScheduleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourtScheduleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourtScheduleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>[];
                };
                upsert: {
                    args: Prisma.CourtScheduleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtSchedulePayload>;
                };
                aggregate: {
                    args: Prisma.CourtScheduleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourtSchedule>;
                };
                groupBy: {
                    args: Prisma.CourtScheduleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtScheduleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourtScheduleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtScheduleCountAggregateOutputType> | number;
                };
            };
        };
        CourtBooking: {
            payload: Prisma.$CourtBookingPayload<ExtArgs>;
            fields: Prisma.CourtBookingFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourtBookingFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourtBookingFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>;
                };
                findFirst: {
                    args: Prisma.CourtBookingFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourtBookingFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>;
                };
                findMany: {
                    args: Prisma.CourtBookingFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>[];
                };
                create: {
                    args: Prisma.CourtBookingCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>;
                };
                createMany: {
                    args: Prisma.CourtBookingCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourtBookingCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>[];
                };
                delete: {
                    args: Prisma.CourtBookingDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>;
                };
                update: {
                    args: Prisma.CourtBookingUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>;
                };
                deleteMany: {
                    args: Prisma.CourtBookingDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourtBookingUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourtBookingUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>[];
                };
                upsert: {
                    args: Prisma.CourtBookingUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingPayload>;
                };
                aggregate: {
                    args: Prisma.CourtBookingAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourtBooking>;
                };
                groupBy: {
                    args: Prisma.CourtBookingGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtBookingGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourtBookingCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtBookingCountAggregateOutputType> | number;
                };
            };
        };
        CourtBookingParticipant: {
            payload: Prisma.$CourtBookingParticipantPayload<ExtArgs>;
            fields: Prisma.CourtBookingParticipantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourtBookingParticipantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourtBookingParticipantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>;
                };
                findFirst: {
                    args: Prisma.CourtBookingParticipantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourtBookingParticipantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>;
                };
                findMany: {
                    args: Prisma.CourtBookingParticipantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>[];
                };
                create: {
                    args: Prisma.CourtBookingParticipantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>;
                };
                createMany: {
                    args: Prisma.CourtBookingParticipantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourtBookingParticipantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>[];
                };
                delete: {
                    args: Prisma.CourtBookingParticipantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>;
                };
                update: {
                    args: Prisma.CourtBookingParticipantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>;
                };
                deleteMany: {
                    args: Prisma.CourtBookingParticipantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourtBookingParticipantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourtBookingParticipantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>[];
                };
                upsert: {
                    args: Prisma.CourtBookingParticipantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingParticipantPayload>;
                };
                aggregate: {
                    args: Prisma.CourtBookingParticipantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourtBookingParticipant>;
                };
                groupBy: {
                    args: Prisma.CourtBookingParticipantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtBookingParticipantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourtBookingParticipantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtBookingParticipantCountAggregateOutputType> | number;
                };
            };
        };
        LooseMatch: {
            payload: Prisma.$LooseMatchPayload<ExtArgs>;
            fields: Prisma.LooseMatchFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LooseMatchFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LooseMatchFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>;
                };
                findFirst: {
                    args: Prisma.LooseMatchFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LooseMatchFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>;
                };
                findMany: {
                    args: Prisma.LooseMatchFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>[];
                };
                create: {
                    args: Prisma.LooseMatchCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>;
                };
                createMany: {
                    args: Prisma.LooseMatchCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LooseMatchCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>[];
                };
                delete: {
                    args: Prisma.LooseMatchDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>;
                };
                update: {
                    args: Prisma.LooseMatchUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>;
                };
                deleteMany: {
                    args: Prisma.LooseMatchDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LooseMatchUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LooseMatchUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>[];
                };
                upsert: {
                    args: Prisma.LooseMatchUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchPayload>;
                };
                aggregate: {
                    args: Prisma.LooseMatchAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLooseMatch>;
                };
                groupBy: {
                    args: Prisma.LooseMatchGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LooseMatchGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LooseMatchCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LooseMatchCountAggregateOutputType> | number;
                };
            };
        };
        CourtBookingBoardMessage: {
            payload: Prisma.$CourtBookingBoardMessagePayload<ExtArgs>;
            fields: Prisma.CourtBookingBoardMessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourtBookingBoardMessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourtBookingBoardMessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>;
                };
                findFirst: {
                    args: Prisma.CourtBookingBoardMessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourtBookingBoardMessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>;
                };
                findMany: {
                    args: Prisma.CourtBookingBoardMessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>[];
                };
                create: {
                    args: Prisma.CourtBookingBoardMessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>;
                };
                createMany: {
                    args: Prisma.CourtBookingBoardMessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourtBookingBoardMessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>[];
                };
                delete: {
                    args: Prisma.CourtBookingBoardMessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>;
                };
                update: {
                    args: Prisma.CourtBookingBoardMessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>;
                };
                deleteMany: {
                    args: Prisma.CourtBookingBoardMessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourtBookingBoardMessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourtBookingBoardMessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>[];
                };
                upsert: {
                    args: Prisma.CourtBookingBoardMessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourtBookingBoardMessagePayload>;
                };
                aggregate: {
                    args: Prisma.CourtBookingBoardMessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourtBookingBoardMessage>;
                };
                groupBy: {
                    args: Prisma.CourtBookingBoardMessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtBookingBoardMessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourtBookingBoardMessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourtBookingBoardMessageCountAggregateOutputType> | number;
                };
            };
        };
        LooseMatchBoardMessage: {
            payload: Prisma.$LooseMatchBoardMessagePayload<ExtArgs>;
            fields: Prisma.LooseMatchBoardMessageFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LooseMatchBoardMessageFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LooseMatchBoardMessageFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>;
                };
                findFirst: {
                    args: Prisma.LooseMatchBoardMessageFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LooseMatchBoardMessageFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>;
                };
                findMany: {
                    args: Prisma.LooseMatchBoardMessageFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>[];
                };
                create: {
                    args: Prisma.LooseMatchBoardMessageCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>;
                };
                createMany: {
                    args: Prisma.LooseMatchBoardMessageCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LooseMatchBoardMessageCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>[];
                };
                delete: {
                    args: Prisma.LooseMatchBoardMessageDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>;
                };
                update: {
                    args: Prisma.LooseMatchBoardMessageUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>;
                };
                deleteMany: {
                    args: Prisma.LooseMatchBoardMessageDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LooseMatchBoardMessageUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LooseMatchBoardMessageUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>[];
                };
                upsert: {
                    args: Prisma.LooseMatchBoardMessageUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchBoardMessagePayload>;
                };
                aggregate: {
                    args: Prisma.LooseMatchBoardMessageAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLooseMatchBoardMessage>;
                };
                groupBy: {
                    args: Prisma.LooseMatchBoardMessageGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LooseMatchBoardMessageGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LooseMatchBoardMessageCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LooseMatchBoardMessageCountAggregateOutputType> | number;
                };
            };
        };
        LooseMatchParticipant: {
            payload: Prisma.$LooseMatchParticipantPayload<ExtArgs>;
            fields: Prisma.LooseMatchParticipantFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.LooseMatchParticipantFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.LooseMatchParticipantFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>;
                };
                findFirst: {
                    args: Prisma.LooseMatchParticipantFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.LooseMatchParticipantFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>;
                };
                findMany: {
                    args: Prisma.LooseMatchParticipantFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>[];
                };
                create: {
                    args: Prisma.LooseMatchParticipantCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>;
                };
                createMany: {
                    args: Prisma.LooseMatchParticipantCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.LooseMatchParticipantCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>[];
                };
                delete: {
                    args: Prisma.LooseMatchParticipantDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>;
                };
                update: {
                    args: Prisma.LooseMatchParticipantUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>;
                };
                deleteMany: {
                    args: Prisma.LooseMatchParticipantDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.LooseMatchParticipantUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.LooseMatchParticipantUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>[];
                };
                upsert: {
                    args: Prisma.LooseMatchParticipantUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$LooseMatchParticipantPayload>;
                };
                aggregate: {
                    args: Prisma.LooseMatchParticipantAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateLooseMatchParticipant>;
                };
                groupBy: {
                    args: Prisma.LooseMatchParticipantGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LooseMatchParticipantGroupByOutputType>[];
                };
                count: {
                    args: Prisma.LooseMatchParticipantCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.LooseMatchParticipantCountAggregateOutputType> | number;
                };
            };
        };
        EmailSendLog: {
            payload: Prisma.$EmailSendLogPayload<ExtArgs>;
            fields: Prisma.EmailSendLogFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.EmailSendLogFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.EmailSendLogFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>;
                };
                findFirst: {
                    args: Prisma.EmailSendLogFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.EmailSendLogFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>;
                };
                findMany: {
                    args: Prisma.EmailSendLogFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>[];
                };
                create: {
                    args: Prisma.EmailSendLogCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>;
                };
                createMany: {
                    args: Prisma.EmailSendLogCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.EmailSendLogCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>[];
                };
                delete: {
                    args: Prisma.EmailSendLogDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>;
                };
                update: {
                    args: Prisma.EmailSendLogUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>;
                };
                deleteMany: {
                    args: Prisma.EmailSendLogDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.EmailSendLogUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.EmailSendLogUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>[];
                };
                upsert: {
                    args: Prisma.EmailSendLogUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$EmailSendLogPayload>;
                };
                aggregate: {
                    args: Prisma.EmailSendLogAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateEmailSendLog>;
                };
                groupBy: {
                    args: Prisma.EmailSendLogGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailSendLogGroupByOutputType>[];
                };
                count: {
                    args: Prisma.EmailSendLogCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.EmailSendLogCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const ProfileScalarFieldEnum: {
    readonly id: "id";
    readonly fullName: "fullName";
    readonly avatarUrl: "avatarUrl";
    readonly description: "description";
    readonly location: "location";
    readonly phone: "phone";
    readonly email: "email";
    readonly amenities: "amenities";
    readonly level: "level";
    readonly preferredPosition: "preferredPosition";
    readonly courtType: "courtType";
    readonly availability: "availability";
    readonly isClub: "isClub";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ProfileScalarFieldEnum = (typeof ProfileScalarFieldEnum)[keyof typeof ProfileScalarFieldEnum];
export declare const ClubScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly courtCount: "courtCount";
    readonly courtType: "courtType";
    readonly address: "address";
    readonly location: "location";
    readonly email: "email";
    readonly web: "web";
    readonly avatarUrl: "avatarUrl";
    readonly pricing: "pricing";
    readonly approvalStatus: "approvalStatus";
    readonly createdBy: "createdBy";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ClubScalarFieldEnum = (typeof ClubScalarFieldEnum)[keyof typeof ClubScalarFieldEnum];
export declare const CourtScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly type: "type";
    readonly surface: "surface";
    readonly lighting: "lighting";
    readonly listed: "listed";
    readonly clubId: "clubId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtScalarFieldEnum = (typeof CourtScalarFieldEnum)[keyof typeof CourtScalarFieldEnum];
export declare const CourtCustomSlotScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly date: "date";
    readonly startTimeMinutes: "startTimeMinutes";
    readonly endTimeMinutes: "endTimeMinutes";
    readonly price: "price";
    readonly note: "note";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtCustomSlotScalarFieldEnum = (typeof CourtCustomSlotScalarFieldEnum)[keyof typeof CourtCustomSlotScalarFieldEnum];
export declare const CourtScheduleExceptionScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly date: "date";
    readonly startTimeMinutes: "startTimeMinutes";
    readonly endTimeMinutes: "endTimeMinutes";
    readonly isClosedAllDay: "isClosedAllDay";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtScheduleExceptionScalarFieldEnum = (typeof CourtScheduleExceptionScalarFieldEnum)[keyof typeof CourtScheduleExceptionScalarFieldEnum];
export declare const CourtScheduleScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly dayOfWeek: "dayOfWeek";
    readonly startTimeMinutes: "startTimeMinutes";
    readonly endTimeMinutes: "endTimeMinutes";
    readonly slotDurationMinutes: "slotDurationMinutes";
    readonly pricePerHour: "pricePerHour";
    readonly periodName: "periodName";
    readonly periodStart: "periodStart";
    readonly periodEnd: "periodEnd";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CourtScheduleScalarFieldEnum = (typeof CourtScheduleScalarFieldEnum)[keyof typeof CourtScheduleScalarFieldEnum];
export declare const CourtBookingScalarFieldEnum: {
    readonly id: "id";
    readonly courtId: "courtId";
    readonly userId: "userId";
    readonly start: "start";
    readonly end: "end";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly isMatch: "isMatch";
    readonly title: "title";
    readonly maxPlayers: "maxPlayers";
    readonly level: "level";
    readonly visibility: "visibility";
    readonly inviteCode: "inviteCode";
    readonly manualGuests: "manualGuests";
    readonly manualClubNotes: "manualClubNotes";
    readonly occupiesSlot: "occupiesSlot";
    readonly isFixedSeries: "isFixedSeries";
    readonly fixedSeriesId: "fixedSeriesId";
    readonly fixedSeriesOccurrenceIndex: "fixedSeriesOccurrenceIndex";
    readonly fixedSeriesRule: "fixedSeriesRule";
};
export type CourtBookingScalarFieldEnum = (typeof CourtBookingScalarFieldEnum)[keyof typeof CourtBookingScalarFieldEnum];
export declare const CourtBookingParticipantScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly profileId: "profileId";
    readonly createdAt: "createdAt";
};
export type CourtBookingParticipantScalarFieldEnum = (typeof CourtBookingParticipantScalarFieldEnum)[keyof typeof CourtBookingParticipantScalarFieldEnum];
export declare const LooseMatchScalarFieldEnum: {
    readonly id: "id";
    readonly profileId: "profileId";
    readonly title: "title";
    readonly startLabel: "startLabel";
    readonly level: "level";
    readonly courtType: "courtType";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
    readonly inviteCode: "inviteCode";
};
export type LooseMatchScalarFieldEnum = (typeof LooseMatchScalarFieldEnum)[keyof typeof LooseMatchScalarFieldEnum];
export declare const CourtBookingBoardMessageScalarFieldEnum: {
    readonly id: "id";
    readonly bookingId: "bookingId";
    readonly authorProfileId: "authorProfileId";
    readonly body: "body";
    readonly createdAt: "createdAt";
};
export type CourtBookingBoardMessageScalarFieldEnum = (typeof CourtBookingBoardMessageScalarFieldEnum)[keyof typeof CourtBookingBoardMessageScalarFieldEnum];
export declare const LooseMatchBoardMessageScalarFieldEnum: {
    readonly id: "id";
    readonly looseMatchId: "looseMatchId";
    readonly authorProfileId: "authorProfileId";
    readonly body: "body";
    readonly createdAt: "createdAt";
};
export type LooseMatchBoardMessageScalarFieldEnum = (typeof LooseMatchBoardMessageScalarFieldEnum)[keyof typeof LooseMatchBoardMessageScalarFieldEnum];
export declare const LooseMatchParticipantScalarFieldEnum: {
    readonly id: "id";
    readonly looseMatchId: "looseMatchId";
    readonly profileId: "profileId";
    readonly createdAt: "createdAt";
};
export type LooseMatchParticipantScalarFieldEnum = (typeof LooseMatchParticipantScalarFieldEnum)[keyof typeof LooseMatchParticipantScalarFieldEnum];
export declare const EmailSendLogScalarFieldEnum: {
    readonly id: "id";
    readonly status: "status";
    readonly eventType: "eventType";
    readonly fromEmail: "fromEmail";
    readonly toEmail: "toEmail";
    readonly subject: "subject";
    readonly bodyText: "bodyText";
    readonly bodyHtml: "bodyHtml";
    readonly errorDetail: "errorDetail";
    readonly sentAt: "sentAt";
};
export type EmailSendLogScalarFieldEnum = (typeof EmailSendLogScalarFieldEnum)[keyof typeof EmailSendLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: runtime.JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumClubApprovalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClubApprovalStatus'>;
export type ListEnumClubApprovalStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ClubApprovalStatus[]'>;
export type EnumCourtBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourtBookingStatus'>;
export type ListEnumCourtBookingStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CourtBookingStatus[]'>;
export type EnumEmailSendStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EmailSendStatus'>;
export type ListEnumEmailSendStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EmailSendStatus[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    profile?: Prisma.ProfileOmit;
    club?: Prisma.ClubOmit;
    court?: Prisma.CourtOmit;
    courtCustomSlot?: Prisma.CourtCustomSlotOmit;
    courtScheduleException?: Prisma.CourtScheduleExceptionOmit;
    courtSchedule?: Prisma.CourtScheduleOmit;
    courtBooking?: Prisma.CourtBookingOmit;
    courtBookingParticipant?: Prisma.CourtBookingParticipantOmit;
    looseMatch?: Prisma.LooseMatchOmit;
    courtBookingBoardMessage?: Prisma.CourtBookingBoardMessageOmit;
    looseMatchBoardMessage?: Prisma.LooseMatchBoardMessageOmit;
    looseMatchParticipant?: Prisma.LooseMatchParticipantOmit;
    emailSendLog?: Prisma.EmailSendLogOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
