import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';
import Link from "next/link";
import {Checkbox} from "@/components/ui/checkbox";

export function AuthForm({
  action,
  children,
  defaultEmail = '',
                           isSignup = true,
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
  isSignup?: boolean;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>

      {isSignup && (


          <div className="flex items-start gap-2 mt-2">
        <Checkbox id="consent" name="consent" required className="mt-1" />
        <Label htmlFor="consent" className="text-sm text-zinc-600 font-normal dark:text-zinc-400 leading-tight">
          I agree to the{" "}
          <Link href="https://www.neurosecure.ai/terms" className="text-primary font-bold underline " target="_blank">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="https://www.neurosecure.ai/privacy" className="text-primary font-bold underline " target="_blank">
            Privacy Policy
          </Link>
          {" "}
          and{" "}
          <Link href="https://www.neurosecure.ai/refund" className="text-primary font-bold underline " target="_blank">
            Refund Policy
          </Link>
        </Label>
      </div>
      )}

      {children}
    </Form>
  );
}
