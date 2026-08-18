'use client';

import { Modal } from '@/components/dashboard/ui';
import type { VisitorLog } from '@/lib/dashboard/types';
import { RawPane } from './RawPane';

function metaRows(visitor: VisitorLog): [string, string][] {
  return [
    ['Time', new Date(visitor.createdAt).toLocaleString()],
    ['IP', visitor.ipAddress],
    ['Location', [visitor.city, visitor.region, visitor.country].filter(Boolean).join(', ') || 'Unknown'],
    ['Page', visitor.page || '/'],
    ['Source', visitor.source ? `${visitor.source}${visitor.sourceDetail ? ` / ${visitor.sourceDetail}` : ''}` : '—'],
    ['Referrer', visitor.referrer || '—'],
    ['ISP', visitor.isp || '—']
  ];
}

export function RawHttpDialog({ visitor, onClose }: { visitor: VisitorLog; onClose: () => void }) {
  return (
    <Modal title="Raw HTTP exchange" onClose={onClose} maxWidthCls="max-w-3xl">
      <div className="space-y-5">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
          {metaRows(visitor).map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="font-mono text-[10px] tracking-widest uppercase opacity-40">{k}</dt>
              <dd className="truncate font-mono text-[11px] opacity-80" title={v}>{v}</dd>
            </div>
          ))}
        </dl>

        <RawPane label="Request" body={visitor.rawRequest} />
        <RawPane label="Response" body={visitor.rawResponse} />

        <p className="font-mono text-[10px] leading-relaxed opacity-40">
          Credential-bearing headers (cookie, authorization, …) are redacted at capture time and long bodies
          are truncated. The protocol version shown is nominal — the runtime does not expose the version
          actually negotiated upstream.
        </p>
      </div>
    </Modal>
  );
}
