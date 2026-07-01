import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateInvoice } from "@workspace/api-client-react";
import { Plus, Trash2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.coerce.number().min(1),
  unitPrice: z.coerce.number().min(0),
  total: z.number().optional()
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

export default function InvoiceTool() {
  const [showPreview, setShowPreview] = useState(false);
  const createInvoice = useCreateInvoice();

  const form = useForm<z.infer<typeof formSchema>>({
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

  // Calculate totals
  const items = form.watch("items");
  const taxRate = form.watch("tax");
  
  const subtotal = items.reduce((acc, item) => acc + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const total = subtotal + taxAmount;

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Fill in calculated totals for each item
    const itemsWithTotals = values.items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice
    }));

    createInvoice.mutate(
      { 
        data: {
          ...values,
          items: itemsWithTotals
        }
      },
      {
        onSuccess: () => {
          setShowPreview(true);
        },
      }
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const invoiceData = form.watch();

  return (
    <section id="invoice" className="py-24 bg-background">
      <div className="container px-4 mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 no-print"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Invoice Generator</h2>
          <div className="h-px w-24 bg-primary mx-auto opacity-50 mb-4" />
          <p className="text-foreground/70 font-light">Generate professional quotes and invoices instantly.</p>
        </motion.div>

        {!showPreview ? (
          <div className="bg-card border border-border p-8 no-print">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Client Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl><Input {...field} className="bg-background rounded-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Email</FormLabel>
                        <FormControl><Input {...field} type="email" className="bg-background rounded-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="clientPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Phone</FormLabel>
                        <FormControl><Input {...field} className="bg-background rounded-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <FormControl><Input {...field} className="bg-background rounded-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eventDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Date (Text)</FormLabel>
                        <FormControl><Input {...field} placeholder="e.g. 25 Dec 2024" className="bg-background rounded-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Rate (%)</FormLabel>
                        <FormControl><Input {...field} type="number" step="0.1" className="bg-background rounded-sm" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="h-px bg-border my-8" />

                {/* Items */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-serif text-2xl text-primary">Line Items</h3>
                  </div>
                  
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                      <FormField
                        control={form.control}
                        name={`items.${index}.description`}
                        render={({ field }) => (
                          <FormItem className="flex-1 w-full">
                            {index === 0 && <FormLabel>Description</FormLabel>}
                            <FormControl><Input {...field} placeholder="Service description" className="bg-background rounded-sm" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-24">
                            {index === 0 && <FormLabel>Qty</FormLabel>}
                            <FormControl><Input {...field} type="number" min="1" className="bg-background rounded-sm" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem className="w-full sm:w-32">
                            {index === 0 && <FormLabel>Price (₹)</FormLabel>}
                            <FormControl><Input {...field} type="number" min="0" className="bg-background rounded-sm" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="w-full sm:w-32 py-2 sm:py-0 h-10 flex items-center justify-end font-mono">
                        ₹ {((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0)).toLocaleString('en-IN')}
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                    className="mt-4 border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Item
                  </Button>
                </div>

                <div className="h-px bg-border my-8" />

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-3">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-mono">₹ {subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax ({taxRate}%)</span>
                      <span className="font-mono">₹ {taxAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-px bg-border my-2" />
                    <div className="flex justify-between font-serif text-2xl text-primary">
                      <span>Total</span>
                      <span>₹ {total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                  <Button 
                    type="submit" 
                    disabled={createInvoice.isPending}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm px-8"
                  >
                    {createInvoice.isPending ? "Generating..." : "Generate Invoice"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end gap-4 no-print">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Edit Invoice
              </Button>
              <Button onClick={handlePrint} className="bg-primary text-primary-foreground">
                <Printer className="w-4 h-4 mr-2" /> Print / PDF
              </Button>
            </div>

            {/* Printable Area */}
            <div className="bg-white text-black p-10 shadow-lg min-h-[1056px] w-full max-w-[816px] mx-auto print-only relative">
              {/* Header */}
              <div className="flex justify-between items-start mb-12 border-b-2 border-[#D4AF37] pb-8">
                <div>
                  <h1 className="text-4xl font-serif text-[#D4AF37] font-bold mb-2">Hi-tech Multimedia</h1>
                  <p className="text-gray-600 text-sm">Timeless Memories, Beautifully Captured</p>
                  <div className="mt-4 text-sm text-gray-700 space-y-1">
                    <p>Bokaro Steel City, Jharkhand, India</p>
                    <p>Phone: +91 99398 60818</p>
                    <p>Email: hitechbokaro@gmail.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl text-gray-300 font-light mb-4 uppercase tracking-widest">INVOICE</h2>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-bold mr-2">Date:</span> {new Date().toLocaleDateString('en-IN')}</p>
                    <p><span className="font-bold mr-2">Invoice #:</span> INV-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="mb-12 flex justify-between bg-gray-50 p-6 rounded-md">
                <div>
                  <h3 className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs mb-2">Bill To</h3>
                  <p className="font-bold text-lg">{invoiceData.clientName}</p>
                  <p className="text-gray-700">{invoiceData.clientEmail}</p>
                  {invoiceData.clientPhone && <p className="text-gray-700">{invoiceData.clientPhone}</p>}
                </div>
                {invoiceData.eventType && (
                  <div className="text-right">
                    <h3 className="text-[#D4AF37] font-bold uppercase tracking-wider text-xs mb-2">Event Details</h3>
                    <p className="font-bold text-lg">{invoiceData.eventType}</p>
                    {invoiceData.eventDate && <p className="text-gray-700">{invoiceData.eventDate}</p>}
                  </div>
                )}
              </div>

              {/* Items Table */}
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
                      <td className="py-4 text-gray-800 text-right">₹ {item.unitPrice?.toLocaleString('en-IN')}</td>
                      <td className="py-4 text-gray-800 text-right font-medium">
                        ₹ {((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-16">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹ {subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax ({invoiceData.tax}%)</span>
                    <span>₹ {taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t-2 border-[#D4AF37] my-4" />
                  <div className="flex justify-between text-2xl font-bold text-[#D4AF37]">
                    <span>Total</span>
                    <span>₹ {total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-10 left-10 right-10 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
                <p className="font-medium text-gray-800 mb-2">{invoiceData.notes}</p>
                <p>Please make cheques payable to Hi-tech Multimedia.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
