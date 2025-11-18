"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { useEffect, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";

import { InvoiceFormData, invoiceSchema } from "@/app/utils/zodSchema";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateInvoiceAction } from "../invoices/create/action";

interface InvoiceData {
  id: string;
  invoiceName: string;
  invoiceNumber: number;
  status: "PAID" | "PENDING";
  currency: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  date: Date;
  dueDate: number;
  invoiceItemDescription: string;
  invoiceItemquantity: number;
  invoiceItemRate: number;
  total: number;
  note: string;
}

interface EditInvoiceProps {
  invoiceData: InvoiceData;
}

export default function EditInvoiceComponent({
  invoiceData,
}: EditInvoiceProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<InvoiceFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(invoiceSchema) as any,
    defaultValues: {
      invoiceName: invoiceData.invoiceName,
      invoiceNumber: invoiceData.invoiceNumber,
      status: invoiceData.status,
      currency: invoiceData.currency,

      // ✅ Get everything from invoiceData
      fromName: invoiceData.fromName,
      fromEmail: invoiceData.fromEmail,
      fromAddress: invoiceData.fromAddress,

      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      clientAddress: invoiceData.clientAddress,

      date: invoiceData.date
        ? new Date(invoiceData.date).toISOString().split("T")[0]
        : "",
      dueDate: invoiceData.dueDate,

      invoiceItemDescription: invoiceData.invoiceItemDescription,
      invoiceItemquantity: invoiceData.invoiceItemquantity.toString(),
      invoiceItemRate: invoiceData.invoiceItemRate.toString(),

      total: invoiceData.total,
      note: invoiceData.note || "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  // eslint-disable-next-line react-hooks/incompatible-library
  const quantity = form.watch("invoiceItemquantity");
  const rate = form.watch("invoiceItemRate");

  useEffect(() => {
    const qtyNum = Number(quantity) || 0;
    const rateNum = Number(rate) || 0;
    const amount = qtyNum * rateNum;
    setValue("total", amount);
  }, [quantity, rate, setValue]);

  const onSubmit = async (data: InvoiceFormData) => {
    startTransition(async () => {
      try {
        const result = await updateInvoiceAction(invoiceData.id, data);

        if (result.success) {
          toast.success("Invoice updated successfully!", {
            description: `Invoice has been updated.`,
            duration: 5000,
          });
          router.push("/dashboard/invoices");
        } else {
          if (result.status === "validation_error") {
            toast.error("Validation Error", {
              description: "Please check the form for errors.",
              duration: 6000,
            });
          } else {
            toast.error("Failed to update invoice", {
              description: result.message,
              duration: 6000,
            });
          }
        }
      } catch {
        toast.error("Unexpected Error", {
          description: "An unexpected error occurred. Please try again.",
          duration: 6000,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full max-w-full mx-auto">
        <CardContent className="p-6">
          {/* HEADER */}
          <div className="flex flex-col gap-1 w-fit mb-5">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">Editing</Badge>
              <Input placeholder="Invoice Name" {...register("invoiceName")} />
            </div>
            {errors.invoiceName && (
              <p className="text-red-500 text-sm">
                {errors.invoiceName.message}
              </p>
            )}
          </div>

          {/* Rest of your form remains exactly the same */}
          {/* INVOICE NUMBER + CURRENCY */}
          <div className="grid md:grid-cols-3 gap-6 mb-5">
            <div className="space-y-2.5">
              <Label>Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                  #
                </span>
                <Input
                  type="number"
                  className="rounded-l-none"
                  {...register("invoiceNumber", { valueAsNumber: true })}
                />
              </div>
              {errors.invoiceNumber && (
                <p className="text-red-500 text-sm">
                  {errors.invoiceNumber.message}
                </p>
              )}
            </div>

            {/* Currency Select */}
            <div className="space-y-2.5">
              <Label>Currency</Label>

              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="LKR">LKR</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="INR">INR</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.currency && (
                <p className="text-red-500 text-sm">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          {/* FROM + TO */}
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            {/* FROM */}
            <div>
              <Label className="mb-3 block">From</Label>
              <div className="space-y-3">
                <Input placeholder="Your Name" {...register("fromName")} />
                <Input placeholder="Your Email" {...register("fromEmail")} />
                <Input
                  placeholder="Your Address"
                  {...register("fromAddress")}
                />
              </div>
              {errors.fromName && (
                <p className="text-red-500">{errors.fromName.message}</p>
              )}
              {errors.fromEmail && (
                <p className="text-red-500">{errors.fromEmail.message}</p>
              )}
              {errors.fromAddress && (
                <p className="text-red-500">{errors.fromAddress.message}</p>
              )}
            </div>

            {/* TO */}
            <div>
              <Label className="mb-3 block">To</Label>
              <div className="space-y-3">
                <Input placeholder="Client Name" {...register("clientName")} />
                <Input
                  placeholder="Client Email"
                  {...register("clientEmail")}
                />
                <Input
                  placeholder="Client Address"
                  {...register("clientAddress")}
                />
              </div>
            </div>
          </div>

          {/* DATE + DUE DATE */}
          <div className="grid md:grid-cols-2 gap-6 mb-5">
            {/* DATE PICKER */}
            <div className="flex flex-col space-y-2">
              <Label>Date</Label>

              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(new Date(field.value), "PPP")
                          : "Pick a date"}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(value) =>
                          value && field.onChange(value.toISOString())
                        }
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date.message}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="flex flex-col space-y-2">
              <Label>Invoice Due</Label>

              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Select
                    defaultValue={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select due date" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="0">Due on receipt</SelectItem>
                      <SelectItem value="15">Net 15</SelectItem>
                      <SelectItem value="30">Net 30</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.dueDate && (
                <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          {/* INVOICE ITEMS */}
          <div>
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <p className="col-span-6">Description</p>
              <p className="col-span-2">Quantity</p>
              <p className="col-span-2">Rate</p>
              <p className="col-span-2">Amount</p>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-4">
              <Textarea
                className="col-span-6"
                {...register("invoiceItemDescription")}
                placeholder="Item Name & Description"
              />

              <Input
                className="col-span-2"
                type="number"
                {...register("invoiceItemquantity")}
              />

              <Input
                className="col-span-2"
                type="number"
                {...register("invoiceItemRate")}
              />

              {/* Amount is fixed for now */}
              <Input
                className="col-span-2"
                disabled
                value={form.watch("total")}
                {...register("total")}
              />
            </div>
            <div className="flex justify-end mb-4">
              <div className="w-1/3">
                <div className="flex justify-between py-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-semibold">
                    {form.watch("total")}
                    {form.watch("currency")}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-t border-border">
                  <span className="text-base font-semibold">
                    Total {form.watch("currency")}
                  </span>
                  <span className="text-lg font-bold">
                    {form.watch("total")}
                  </span>
                  {/* Hidden input to include total in form submission */}
                </div>
              </div>
            </div>
          </div>

          {/* NOTES */}
          <div>
            <Label className="mb-2">Notes</Label>
            <Textarea placeholder="Add notes..." {...register("note")} />
          </div>

          {/* SUBMIT */}
          <div className="flex items-center justify-end mt-8">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
