import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitConsultation, type ServiceType } from "@/api/consultations";
import { GoldButton } from "@/components/brand/GoldButton";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().optional(),
  project_type: z.string().optional(),
  message: z.string().min(1, "Please tell us about your project"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-lg border border-border bg-card/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

export function BookingForm({ serviceType }: { serviceType: ServiceType }) {
  const { toast } = useToast();
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      await submitConsultation({
        name: values.name,
        email: values.email,
        phone: values.phone,
        project_type: values.project_type,
        message: values.message,
        service_type: serviceType,
      });
      setDone(true);
      reset();
      toast({ title: "Request sent", description: "We will be in touch shortly." });
    } catch {
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" });
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-card/60 p-10 text-center">
        <p className="font-heading text-2xl text-gold-light">Thank you.</p>
        <p className="mt-2 text-sm text-muted-foreground">Your request has been received — we'll reach out soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="bf-name" className="eyebrow mb-2 block text-muted-foreground">Full name</label>
        <input id="bf-name" className={inputClass} {...register("name")} />
        {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="bf-email" className="eyebrow mb-2 block text-muted-foreground">Email</label>
          <input id="bf-email" className={inputClass} {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="bf-phone" className="eyebrow mb-2 block text-muted-foreground">Phone (optional)</label>
          <input id="bf-phone" className={inputClass} {...register("phone")} />
        </div>
      </div>

      <div>
        <label htmlFor="bf-project" className="eyebrow mb-2 block text-muted-foreground">Project type (optional)</label>
        <input id="bf-project" className={inputClass} placeholder="New build, renovation, fit-out…" {...register("project_type")} />
      </div>

      <div>
        <label htmlFor="bf-message" className="eyebrow mb-2 block text-muted-foreground">Message</label>
        <textarea id="bf-message" rows={4} className={inputClass} {...register("message")} />
        {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
      </div>

      <GoldButton type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Sending…" : "Request a Consultation"}
      </GoldButton>
    </form>
  );
}
