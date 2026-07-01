import { useState } from "react";
import {
  useListBookings,
  useUpdateBooking,
  useDeleteBooking,
  useCreateBooking,
  getListBookingsQueryKey,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EMPTY_BOOKING = {
  name: "",
  phone: "",
  email: "",
  eventType: "",
  eventDate: "",
  message: "",
};

function AddBookingDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_BOOKING);
  const createBooking = useCreateBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createBooking.mutate(
      { data: form },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
          setOpen(false);
          setForm(EMPTY_BOOKING);
          toast({ title: "Booking added" });
        },
        onError: () => {
          toast({ title: "Failed to add booking", variant: "destructive" });
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" /> Add Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-400">Customer Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-zinc-400">Phone</Label>
            <Input
              id="phone"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-400">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventType" className="text-zinc-400">Event Type</Label>
            <Input
              id="eventType"
              required
              placeholder="e.g. Wedding, Pre-Wedding, Corporate"
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="eventDate" className="text-zinc-400">Event Date</Label>
            <Input
              id="eventDate"
              type="date"
              required
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="bg-zinc-900 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message" className="text-zinc-400">Notes (optional)</Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="bg-zinc-900 border-zinc-800 resize-none"
            />
          </div>
          <Button type="submit" className="w-full" disabled={createBooking.isPending}>
            {createBooking.isPending ? "Adding..." : "Add Booking"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function BookingsTab() {
  const { data: bookings, isLoading } = useListBookings();
  const updateBooking = useUpdateBooking();
  const deleteBooking = useDeleteBooking();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleStatusChange = (id: number, status: string) => {
    updateBooking.mutate(
      { id, data: { status: status as any } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
          toast({ title: "Status updated" });
        },
        onError: () => {
          toast({ title: "Failed to update status", variant: "destructive" });
        },
      }
    );
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    deleteBooking.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBookingsQueryKey() });
          toast({ title: "Booking deleted" });
        },
      }
    );
  };

  if (isLoading || !bookings) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AddBookingDialog />
      </div>
      <div className="rounded-md border border-zinc-800 bg-zinc-950 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400">Name</TableHead>
            <TableHead className="text-zinc-400">Contact</TableHead>
            <TableHead className="text-zinc-400">Event details</TableHead>
            <TableHead className="text-zinc-400">Date</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-right text-zinc-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id} className="border-zinc-800 hover:bg-zinc-900/50">
              <TableCell className="font-medium text-white">{booking.name}</TableCell>
              <TableCell className="text-zinc-300">
                <div>{booking.phone}</div>
                <div className="text-xs text-zinc-500">{booking.email}</div>
              </TableCell>
              <TableCell className="text-zinc-300">
                <Badge variant="outline" className="border-zinc-700 bg-zinc-900 font-normal">
                  {booking.eventType}
                </Badge>
              </TableCell>
              <TableCell className="text-zinc-300">
                {format(new Date(booking.eventDate), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>
                <Select
                  defaultValue={booking.status}
                  onValueChange={(val) => handleStatusChange(booking.id, val)}
                >
                  <SelectTrigger className="w-[130px] h-8 bg-zinc-900 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:text-red-400 hover:bg-red-400/10"
                  onClick={() => handleDelete(booking.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {bookings.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-32 text-zinc-500">
                No bookings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
