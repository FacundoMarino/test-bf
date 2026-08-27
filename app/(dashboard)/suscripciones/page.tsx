import { fetchPlans, fetchSubscriptions } from "@/actions/admin";
import { PageTitle } from "@/components/layout/page-title";
import { Card } from "@/components/ui/card";
import { StatusChip } from "@/components/ui/status-chip";
import { formatDate, subscriptionLabel } from "@/lib/utils";

type Props = {
  searchParams: Promise<{ status?: "NONE" | "ACTIVE" | "PAUSED"; planId?: string }>;
};

function stripeStatusLabel(status: string | null): string {
  if (!status) return "—";
  return status.replaceAll("_", " ");
}

function stripeStatusTone(status: string | null) {
  if (status === "active" || status === "trialing") return "success" as const;
  if (status === "past_due" || status === "unpaid" || status === "paused") {
    return "warning" as const;
  }
  if (status === "canceled" || status === "incomplete_expired") return "danger" as const;
  return "neutral" as const;
}

export default async function SuscripcionesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [subsRes, plansRes] = await Promise.all([
    fetchSubscriptions({
      status: sp.status,
      planId: sp.planId,
    }),
    fetchPlans(),
  ]);

  const plans = plansRes.data ?? [];

  return (
    <>
      <PageTitle title="Suscripciones pagas" />
      <Card className="p-6">
        <div className="mb-5 flex flex-wrap gap-2">
          <a
            href="/suscripciones"
            className="rounded-xl border border-input px-3 py-1.5 text-sm font-medium"
          >
            Todas
          </a>
          <a
            href="/suscripciones?status=ACTIVE"
            className="rounded-xl border border-input px-3 py-1.5 text-sm font-medium"
          >
            Activas
          </a>
          <a
            href="/suscripciones?status=PAUSED"
            className="rounded-xl border border-input px-3 py-1.5 text-sm font-medium"
          >
            Suspendidas
          </a>
          <a
            href="/suscripciones?status=NONE"
            className="rounded-xl border border-input px-3 py-1.5 text-sm font-medium"
          >
            Inactivas
          </a>
          {plans.map((plan) => (
            <a
              key={plan.id}
              href={`/suscripciones?planId=${plan.id}`}
              className="rounded-xl border border-input px-3 py-1.5 text-sm font-medium"
            >
              {plan.name}
            </a>
          ))}
        </div>

        <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] border-b border-(--sidebar-border) px-4 pb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
          <div>Trabajador</div>
          <div>Plan</div>
          <div>Estado</div>
          <div>Stripe</div>
          <div>Renueva</div>
          <div>Precio</div>
        </div>

        {subsRes.error ? (
          <p className="py-8 text-center text-sm text-destructive">{subsRes.error.message}</p>
        ) : (subsRes.data ?? []).length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No hay suscripciones para estos filtros.
          </p>
        ) : (
          (subsRes.data ?? []).map((subscription) => (
            <div
              key={subscription.id}
              className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] items-center border-b border-background px-4 py-4 text-[13.5px]"
            >
              <div className="min-w-0">
                <div className="truncate font-semibold">{subscription.worker.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {subscription.worker.email}
                </div>
              </div>
              <div>
                {subscription.plan ? (
                  <>
                    <div className="font-medium">{subscription.plan.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {subscription.plan.durationMonths} mes
                      {subscription.plan.durationMonths > 1 ? "es" : ""}
                    </div>
                  </>
                ) : (
                  "—"
                )}
              </div>
              <div>
                <StatusChip
                  label={subscriptionLabel(subscription.worker.subscriptionStatus)}
                  tone={
                    subscription.worker.subscriptionStatus === "ACTIVE"
                      ? "success"
                      : subscription.worker.subscriptionStatus === "PAUSED"
                        ? "warning"
                        : "neutral"
                  }
                />
              </div>
              <div>
                <StatusChip
                  label={stripeStatusLabel(subscription.stripeStatus)}
                  tone={stripeStatusTone(subscription.stripeStatus)}
                />
              </div>
              <div>{formatDate(subscription.renewsAt ?? subscription.startsAt)}</div>
              <div>
                {subscription.currency} {subscription.price.toFixed(2)}
              </div>
            </div>
          ))
        )}
      </Card>
    </>
  );
}
