import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { CreditTimelineResponse } from '@/types/api';

interface CreditTimelineProps {
  timeline: CreditTimelineResponse;
  selectedCreditId?: string;
  onSelect?: (creditId: string) => void;
}

function toMs(value: string) {
  return new Date(`${value}T00:00:00Z`).getTime();
}

export function CreditTimeline({ timeline, selectedCreditId, onSelect }: CreditTimelineProps) {
  const { locale, t } = useLanguage();
  const start = timeline.timelineRange.startDate ? toMs(timeline.timelineRange.startDate) : null;
  const end = timeline.timelineRange.endDate ? toMs(timeline.timelineRange.endDate) : null;
  const totalRange = start !== null && end !== null ? Math.max(end - start, 1) : 1;

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold">{t('credits.timeline')}</h3>
          {timeline.timelineRange.startDate && timeline.timelineRange.endDate ? (
            <p className="text-sm text-muted-foreground">
              {formatDate(timeline.timelineRange.startDate, locale)} -{' '}
              {formatDate(timeline.timelineRange.endDate, locale)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        {timeline.credits.map((credit) => {
          const rowStart = start === null ? 0 : ((toMs(credit.startDate) - start) / totalRange) * 100;
          const rowEnd = end === null ? 100 : ((toMs(credit.endDate) - start!) / totalRange) * 100;
          const width = Math.max(rowEnd - rowStart, 6);

          return (
            <button
              key={credit.creditId}
              type="button"
              onClick={() => onSelect?.(credit.creditId)}
              className={cn(
                'w-full rounded-2xl border border-border p-4 text-left transition hover:border-primary/40 hover:bg-muted/40',
                selectedCreditId === credit.creditId && 'border-primary bg-primary/5',
              )}
            >
              <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{credit.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(credit.monthlyPayment, locale)} · {credit.interestRate.toFixed(1)}%
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {credit.items.length} {t('credits.installments').toLowerCase()}
                </p>
              </div>

              <div className="relative h-14 rounded-2xl bg-muted">
                <div
                  className="absolute top-1/2 h-3 -translate-y-1/2 rounded-full bg-primary/25"
                  style={{ left: `${rowStart}%`, width: `${width}%` }}
                />

                {credit.items.map((item) => {
                  const position =
                    start === null ? 0 : ((toMs(item.dueDate) - start) / totalRange) * 100;

                  return (
                    <div
                      key={item.installmentId}
                      className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-primary shadow-sm"
                      style={{ left: `${position}%` }}
                      title={`${t('labels.installment')} ${item.installmentNumber}: ${formatDate(item.dueDate, locale)} · ${formatCurrency(item.amount, locale)}`}
                    />
                  );
                })}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
