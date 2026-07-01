import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useListInvoices,
  useCreateInvoice,
  getListInvoicesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format } from "date-fns";
import { Plus, Trash2, Printer, ArrowLeft, FileText } from "lucide-react";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
  total: z.number().optional(),
});

const formSchema = z.object({
  clientName: z.string().min(2, "Client Name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientPhone: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  tax: z.coerce.number().min(0).max(100),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

function getStatusColor(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "sent":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-500 border-red-500/20";
    default:
      return "bg-zinc-800 text-zinc-400 border-zinc-700";
  }
}

function InvoiceCreator({ onBack }: { onBack: () => void }) {
  const [showPreview, setShowPreview] = useState(false);
  const queryClient = useQueryClient();
  const createInvoice = useCreateInvoice();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      eventType: "",
      eventDate: "",
      tax: 18,
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      notes: "Thank you for choosing Hi-tech Multimedia.",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const items = form.watch("items");
  const taxRate = form.watch("tax");
  const subtotal = items.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const total = subtotal + taxAmount;

  function onSubmit(values: FormValues) {
    const itemsWithTotals = values.items.map((item) => ({
      ...item,
      total: item.quantity * item.unitPrice,
    }));
    createInvoice.mutate(
      { data: { ...values, items: itemsWithTotals } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListInvoicesQueryKey() });
          setShowPreview(true);
        },
      }
    );
  }

  const invoiceData = form.watch();

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between no-print">
          <Button
            variant="outline"
            onClick={() => setShowPreview(false)}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Edit Invoice
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Back to List
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-[#D4AF37] text-black hover:bg-[#C9A84C]"
            >
              <Printer className="w-4 h-4 mr-2" /> Print / PDF
            </Button>
          </div>
        </div>

        {/* Printable Invoice */}
        <div className="bg-white text-black p-10 shadow-lg min-h-[1056px] w-full max-w-[816px] mx-auto relative">
          <div className="flex justify-between items-start mb-12 border-b-2 border-[#D4AF37] pb-8">
            <div>
              <h1 className="text-4xl font-serif text-[#D4AF37] font-bold mb-2">
                Hi-tech Multimedia
              </h1>
              <p className="text-gray-600 text-sm">
                Timeless Memories, Beautifully Captured
              </p>
              <div className="mt-4 text-sm text-gray-700 space-y-1">
                <p>Bokaro Steel City, Jharkhand, India</p>
                <p>Phone: +91 99398 60818</p>
                <p>Email: hitechbokaro@gmail.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl text-gray-400 font-light mb-4 uppercase tracking-widest">
                INVOICE
              </h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <span className="font-bold mr-2">Date:</span>{" "}
                  {new Date().toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12 flex justify-between bg-gray-50 p-6 rounded-md">
            <div>
              <h3 className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs mb-2">
                Bill To
              </h3>
              <p className="font-bold text-lg">{invoiceData.clientName}</p>
              <p className="text-gray-700">{invoiceData.clientEmail}</p>
              {invoiceData.clientPhone && (
                <p className="text-gray-700">{invoiceData.clientPhone}</p>
              )}
            </div>
            {invoiceData.eventType && (
              <div className="text-right">
                <h3 className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs mb-2">
                  Event Details
                </h3>
                <p className="font-bold text-lg">{invoiceData.eventType}</p>
                {invoiceData.eventDate && (
                  <p className="text-gray-700">{invoiceData.eventDate}</p>
                )}
              </div>
            )}
          </div>

          <table className="w-full mb-12 text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 font-bold text-gray-800">Description</th>
                <th className="py-3 font-bold text-gray-800 text-right w-24">Qty</th>
                <th className="py-3 font-bold text-gray-800 text-right w-32">Price</th>
                <th className="py-3 font-bold text-gray-800 text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-4 text-gray-800">{item.description}</td>
                  <td className="py-4 text-gray-800 text-right">{item.quantity}</td>
                  <td className="py-4 text-gray-800 text-right">
                    ₹ {item.unitPrice?.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 text-gray-800 text-right font-medium">
                    ₹{" "}
                    {((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹ {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST ({invoiceData.tax}%)</span>
                <span>₹ {taxAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="border-t-2 border-[#D4AF37] my-4" />
              <div className="flex justify-between text-2xl font-bold text-[#D4AF37]">
                <span>Total</span>
                <span>₹ {total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            <p className="font-medium text-gray-800 mb-2">{invoiceData.notes}</p>
            <p>Please make cheques/UPI payable to Hi-tech Multimedia.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">New Invoice</h2>
        <Button
          variant="outline"
          onClick={onBack}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Invoices
        </Button>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Client Info */}
            <div>
              <h3 className="text-[#D4AF37] font-semibold mb-4 text-sm uppercase tracking-wider">
                Client Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Client Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-zinc-950 border-zinc-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="bg-zinc-950 border-zinc-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="clientPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-zinc-950 border-zinc-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Event Type</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. Wedding"
                          className="bg-zinc-950 border-zinc-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">Event Date</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. 25 Dec 2026"
                          className="bg-zinc-950 border-zinc-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">GST Rate (%)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          step="0.1"
                          className="bg-zinc-950 border-zinc-700 text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Line Items */}
            <div>
              <h3 className="text-[#D4AF37] font-semibold mb-4 text-sm uppercase tracking-wider">
                Line Items
              </h3>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex flex-col sm:flex-row gap-3 items-start sm:items-end"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex-1 w-full">
                          {index === 0 && (
                            <FormLabel className="text-zinc-400">Description</FormLabel>
                          )}
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Service description"
                              className="bg-zinc-950 border-zinc-700 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-20">
                          {index === 0 && (
                            <FormLabel className="text-zinc-400">Qty</FormLabel>
                          )}
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              className="bg-zinc-950 border-zinc-700 text-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem className="w-full sm:w-32">
                          {index === 0 && (
                            <FormLabel className="text-zinc-400">Price (₹)</FormLabel>
                          )}
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
                              className="bg-zinc-950 border-zinc-700 text-white"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="w-full sm:w-32 h-10 flex items-center justify-end font-mono text-zinc-300 text-sm">
                      ₹{" "}
                      {(
                        (items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)
                      ).toLocaleString("en-IN")}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="text-red-400 hover:text-red-300 hover:bg-red-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                  className="mt-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Item
                </Button>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Totals */}
            <div className="flex flex-col sm:flex-row justify-between gap-6">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-zinc-400">Notes</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-zinc-950 border-zinc-700 text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full sm:w-64 space-y-3 bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>Subtotal</span>
                  <span className="font-mono">₹ {subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-zinc-400 text-sm">
                  <span>GST ({taxRate}%)</span>
                  <span className="font-mono">₹ {taxAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex justify-between text-[#D4AF37] font-bold text-lg">
                  <span>Total</span>
                  <span>₹ {total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createInvoice.isPending}
                className="bg-[#D4AF37] text-black hover:bg-[#C9A84C] px-8"
              >
                {createInvoice.isPending ? "Generating..." : "Generate Invoice"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default function InvoicesTab() {
  const [view, setView] = useState<"list" | "create">("list");
  const { data: invoices, isLoading } = useListInvoices();

  if (view === "create") {
    return <InvoiceCreator onBack={() => setView("list")} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Invoices</h2>
        <Button
          onClick={() => setView("create")}
          className="bg-[#D4AF37] text-black hover:bg-[#C9A84C]"
        >
          <FileText className="w-4 h-4 mr-2" /> New Invoice
        </Button>
      </div>

      {isLoading || !invoices ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-zinc-800" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-zinc-800 bg-zinc-950 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Invoice #</TableHead>
                <TableHead className="text-zinc-400">Client</TableHead>
                <TableHead className="text-zinc-400">Event</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-right text-zinc-400">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="border-zinc-800 hover:bg-zinc-900/50"
                >
                  <TableCell className="font-mono text-zinc-400 text-sm">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {invoice.clientName}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {invoice.eventType || "-"}
                  </TableCell>
                  <TableCell className="text-zinc-300 text-sm">
                    {invoice.eventDate
                      ? format(new Date(invoice.eventDate), "MMM dd, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`font-normal ${getStatusColor(invoice.status)}`}
                    >
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium text-white">
                    ₹{invoice.total?.toLocaleString("en-IN") || 0}
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center h-32 text-zinc-500"
                  >
                    No invoices yet. Create your first one.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
