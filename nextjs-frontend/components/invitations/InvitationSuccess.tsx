'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function InvitationSuccess() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/master-controller/dashboard');
          return 0;
        }
        return prev - 1;
      });

      setProgress((prev) => Math.min(prev + 20, 100));
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Welcome Aboard!</CardTitle>
          <CardDescription className="text-center text-base">
            Your account has been successfully created and you're now logged in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-semibold text-sm mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Complete your profile in settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Explore the Master Controller dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Configure your notification preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Join your team and start collaborating</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Redirecting to dashboard in</span>
                <span className="font-semibold">{countdown} seconds</span>
              </div>
              <Progress value={progress} className="bg-green-500" />
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push('/master-controller/dashboard')}
          >
            Go to Dashboard Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <div className="text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/master-controller/settings')}
            >
              Complete Profile First
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
