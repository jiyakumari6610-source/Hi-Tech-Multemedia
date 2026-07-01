import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateBooking } from "@workspace/api-client-react";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.date({
    required_error: "Event date is required",
  }),
  message: z.string().optional(),
});

export default function Booking() {
  const [isSuccess, setIsSuccess] = useState(false);
  const createBooking = useCreateBooking();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      eventType: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createBooking.mutate(
      { 
        data: {
          ...values,
          eventDate: values.eventDate.toISOString()
        }
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          form.reset();
          setTimeout(() => setIsSuccess(false), 5000);
        },
      }
    );
  }

  return (
    <section id="booking" className="py-24 bg-card border-y border-border relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="container px-4 mx-auto max-w-3xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-primary mb-4">Book Your Session</h2>
          <div className="h-px w-24 bg-primary mx-auto opacity-50 mb-4" />
          <p className="text-foreground/70 font-light text-lg">Let's create something beautiful together.</p>
        </motion.div>

        <div className="bg-background border border-primary/20 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-3xl font-serif text-primary mb-4">Booking Received</h3>
                <p className="text-foreground/80 font-light max-w-md">
                  Thank you for choosing Hi-tech Multimedia. We will contact you shortly to confirm your booking and discuss the details.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => setIsSuccess(false)}
                >
                  Book Another Session
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90 uppercase tracking-widest text-xs">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Raj Singh" className="bg-transparent border-border focus-visible:ring-primary rounded-none" {...field} />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90 uppercase tracking-widest text-xs">Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 99398 60818" className="bg-transparent border-border focus-visible:ring-primary rounded-none" {...field} />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90 uppercase tracking-widest text-xs">Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="hello@example.com" type="email" className="bg-transparent border-border focus-visible:ring-primary rounded-none" {...field} />
                            </FormControl>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eventType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/90 uppercase tracking-widest text-xs">Event Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-transparent border-border focus-visible:ring-primary rounded-none">
                                  <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="wedding">Wedding</SelectItem>
                                <SelectItem value="pre-wedding">Pre-Wedding</SelectItem>
                                <SelectItem value="engagement">Engagement</SelectItem>
                                <SelectItem value="corporate">Corporate Event</SelectItem>
                                <SelectItem value="birthday">Birthday / Party</SelectItem>
                                <SelectItem value="portrait">Portrait Session</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-destructive text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="eventDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-foreground/90 uppercase tracking-widest text-xs">Event Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal bg-transparent border-border focus-visible:ring-primary rounded-none",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/90 uppercase tracking-widest text-xs">Additional Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us a little bit about your event..." 
                              className="resize-none bg-transparent border-border focus-visible:ring-primary rounded-none min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage className="text-destructive text-xs" />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={createBooking.isPending}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-serif text-lg py-6 rounded-none tracking-wider"
                    >
                      {createBooking.isPending ? "Submitting..." : "Submit Booking"}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
