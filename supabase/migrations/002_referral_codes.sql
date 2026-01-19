-- Add referral code support to payment methods
-- Platforms like Venmo, Cash App, and PayPal offer signup bonuses via referral codes/links

ALTER TABLE public.payment_methods
ADD COLUMN referral_code text,
ADD COLUMN referral_enabled boolean DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN public.payment_methods.referral_code IS 'Referral link (Venmo/PayPal) or code (Cash App) for signup bonuses';
COMMENT ON COLUMN public.payment_methods.referral_enabled IS 'Toggle to enable/disable referral display without deleting the code';
