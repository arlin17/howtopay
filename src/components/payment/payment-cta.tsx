"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PaymentMethod {
  id: string;
  type: string;
  label: string;
  value: string;
  icon?: ReactNode;
}

interface PaymentCTAProps {
  recipientName: string;
  recipientAvatar?: string;
  message?: string;
  paymentMethods: PaymentMethod[];
  onMethodSelect?: (method: PaymentMethod) => void;
}

export function PaymentCTA({
  recipientName,
  recipientAvatar,
  message,
  paymentMethods,
  onMethodSelect,
}: PaymentCTAProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header with recipient info */}
      <div className="text-center mb-8">
        {recipientAvatar ? (
          <img
            src={recipientAvatar}
            alt=""
            className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary-subtle shadow-lg"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-[#10b981] to-[#2dd4bf] flex items-center justify-center text-3xl font-bold text-[#030712] shadow-lg shadow-emerald-500/20"
            aria-hidden="true"
          >
            {recipientName.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="text-2xl font-bold text-[#f0fdf4] mb-1">
          Pay {recipientName}
        </h1>
        {message && (
          <p className="text-[#a7f3d0] text-sm">{message}</p>
        )}
      </div>

      {/* Payment methods */}
      <Card variant="elevated" padding="none" className="overflow-hidden">
        <div className="p-4 bg-[#111827] border-b border-[#1f2937]">
          <h2 className="text-sm font-medium text-[#a7f3d0]">
            Choose payment method
          </h2>
        </div>
        <div
          className="divide-y divide-[#1f2937]"
          role="list"
          aria-label="Available payment methods"
        >
          {paymentMethods.map((method) => (
            <PaymentMethodRow
              key={method.id}
              method={method}
              onSelect={() => onMethodSelect?.(method)}
            />
          ))}
        </div>
      </Card>

      {/* Trust indicators */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-foreground-subtle">
        <LockIcon />
        <span>Secure & private payment links</span>
      </div>
    </div>
  );
}

interface PaymentMethodRowProps {
  method: PaymentMethod;
  onSelect: () => void;
}

function PaymentMethodRow({ method, onSelect }: PaymentMethodRowProps) {
  const getMethodIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "venmo":
        return <VenmoIcon />;
      case "paypal":
        return <PayPalIcon />;
      case "cashapp":
        return <CashAppIcon />;
      case "zelle":
        return <ZelleIcon />;
      default:
        return <GenericPayIcon />;
    }
  };

  return (
    <button
      onClick={onSelect}
      className="
        w-full flex items-center gap-4 p-4
        hover:bg-[#111827]
        transition-colors duration-150
        focus-visible:outline-none focus-visible:bg-[#064e3b]
        group
      "
      role="listitem"
      aria-label={`Pay with ${method.label}`}
    >
      <span
        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center transition-all group-hover:scale-110"
        aria-hidden="true"
      >
        {method.icon || getMethodIcon(method.type)}
      </span>
      <span className="flex-1 text-left">
        <span className="block font-medium text-[#f0fdf4]">{method.label}</span>
        <span className="block text-sm text-[#a7f3d0] truncate">
          {method.value}
        </span>
      </span>
      <ArrowRightIcon />
    </button>
  );
}

function LockIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#6ee7b7] group-hover:text-[#10b981] group-hover:translate-x-1 transition-all"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

function VenmoIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3D95CE" aria-hidden="true">
      <path d="M19.5 3c.8 1.3 1.2 2.7 1.2 4.3 0 5.3-4.5 12.3-8.2 17.2H5.8L3 5.2l5.8-.6 1.4 11.3c1.3-2.2 2.9-5.5 2.9-7.8 0-1.5-.3-2.6-.8-3.5L19.5 3z" />
    </svg>
  );
}

function PayPalIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.166c-.566 0-.948.389-1.04.884l-.845 5.242a.641.641 0 01-.633.54l-1.572.34z" />
      <path fill="#009CDE" d="M20.16 7.53c-.01.06-.02.12-.03.18-.98 5.05-4.35 6.8-8.65 6.8H9.17c-.57 0-.95.39-1.04.88l-1.09 6.88-.31 1.96a.56.56 0 00.55.64h3.88c.5 0 .92-.36 1-.85l.04-.21.79-5.02.05-.28c.08-.49.5-.85 1-.85h.63c4.07 0 7.26-1.65 8.19-6.44.39-2-.19-3.67-1.33-4.84-.35-.36-.77-.66-1.27-.91z" />
    </svg>
  );
}

function CashAppIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00D632" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm2.833 6.25l-.75 1.917c-.042.125-.167.208-.292.208h-1.458v2.917h1.458c.125 0 .25.083.292.208l.75 1.917c.083.208-.042.417-.25.458l-1.75.375v1.917c0 .167-.125.333-.292.333h-1.083c-.167 0-.292-.166-.292-.333V16.25l-2.333-.5c-.208-.042-.333-.25-.292-.458l.417-1.75c.042-.167.208-.25.375-.208l1.833.375V11h-1.458c-.125 0-.25-.083-.292-.208l-.75-1.917c-.083-.208.042-.417.25-.458l1.75-.375V6.125c0-.167.125-.333.292-.333h1.083c.167 0 .292.166.292.333V8l2.333.5c.208.042.333.25.25.458z" />
    </svg>
  );
}

function ZelleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#6D1ED4" aria-hidden="true">
      <path d="M13.559 24h-2.88c-.163 0-.321-.078-.417-.21l-6.267-8.74a.522.522 0 01.424-.823h4.318l-4.622-6.57a.522.522 0 01.427-.825h2.88c.163 0 .321.078.417.21l6.267 8.74c.18.252.006.613-.303.613H9.485l4.622 6.57a.522.522 0 01-.427.825l-.12.21z" />
    </svg>
  );
}

function GenericPayIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
      />
    </svg>
  );
}
