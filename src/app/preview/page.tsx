import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";
import { PaymentCTA } from "@/components/payment/payment-cta";

export default function PreviewPage() {
  const mockPaymentMethods = [
    { id: "1", type: "venmo", label: "Venmo", value: "@johndoe" },
    { id: "2", type: "paypal", label: "PayPal", value: "john@example.com" },
    { id: "3", type: "cashapp", label: "Cash App", value: "$johndoe" },
    { id: "4", type: "zelle", label: "Zelle", value: "john@example.com" },
  ];

  return (
    <div className="min-h-screen py-12 bg-[#030712] text-[#f0fdf4]">
      <Container size="xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            HowToPay Design System
          </h1>
          <p className="text-foreground-muted">
            Bold & Modern • AI-Forward • WCAG 2.1 AA Compliant
          </p>
        </div>

        <div className="grid gap-12">
          {/* Buttons Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Buttons</h2>
            <Card>
              <CardContent>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
                <div className="flex flex-wrap gap-4 mb-6">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button loading>Loading</Button>
                  <Button disabled>Disabled</Button>
                  <Button fullWidth>Full Width</Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Cards Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Cards</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default</CardTitle>
                  <CardDescription>Standard card style</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted">Card content goes here.</p>
                </CardContent>
              </Card>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated</CardTitle>
                  <CardDescription>With shadow</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted">Card content goes here.</p>
                </CardContent>
              </Card>
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Outlined</CardTitle>
                  <CardDescription>Strong border</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted">Card content goes here.</p>
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Glass</CardTitle>
                  <CardDescription>Frosted effect</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted">Card content goes here.</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Inputs Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Inputs</h2>
            <Card>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <Input
                    label="Default Input"
                    placeholder="Enter text..."
                    helperText="This is helper text"
                  />
                  <Input
                    label="With Error"
                    placeholder="Enter text..."
                    error="This field is required"
                  />
                  <Input
                    label="Disabled"
                    placeholder="Can't edit this"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Badges Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Badges</h2>
            <Card>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default">Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Skeleton Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Loading States</h2>
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton width="60%" height={20} />
                  <Skeleton width="40%" height={16} />
                  <Skeleton width="80%" height={16} />
                  <div className="flex items-center gap-4 mt-6">
                    <Skeleton variant="circular" width={48} height={48} />
                    <div className="flex-1 space-y-2">
                      <Skeleton width="30%" height={16} />
                      <Skeleton width="50%" height={14} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Payment CTA Section */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Payment CTA</h2>
            <div className="bg-[#0a0f1a] rounded-2xl p-8 border border-[#1f2937]">
              <PaymentCTA
                recipientName="John Doe"
                message="Split dinner from last night"
                paymentMethods={mockPaymentMethods}
              />
            </div>
          </section>

          {/* Color Palette */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">Color Palette</h2>
            <Card>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <ColorSwatch name="Primary" className="bg-primary" />
                  <ColorSwatch name="Primary Hover" className="bg-primary-hover" />
                  <ColorSwatch name="Accent" className="bg-accent" />
                  <ColorSwatch name="Secondary" className="bg-secondary" />
                  <ColorSwatch name="Success" className="bg-success" />
                  <ColorSwatch name="Warning" className="bg-warning" />
                  <ColorSwatch name="Error" className="bg-error" />
                  <ColorSwatch name="Background" className="bg-background border border-border" />
                  <ColorSwatch name="Subtle" className="bg-background-subtle" />
                  <ColorSwatch name="Muted" className="bg-background-muted" />
                  <ColorSwatch name="Border" className="bg-border" />
                  <ColorSwatch name="Foreground" className="bg-foreground" />
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </Container>
    </div>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="text-center">
      <div className={`w-full h-16 rounded-lg mb-2 ${className}`} />
      <span className="text-xs text-foreground-muted">{name}</span>
    </div>
  );
}
