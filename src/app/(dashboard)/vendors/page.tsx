"use client";

import { useVendors } from "@/hooks/useVendors";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateVendorFormData, createVendorSchema } from "@/schemas/vendor.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Users, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VendorsPage() {
  const { vendors, isLoading, createVendor, isCreating } = useVendors();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateVendorFormData>({
    resolver: zodResolver(createVendorSchema),
    defaultValues: {
      name: "",
      upi_id: "",
      bank_account: "",
      ifsc: "",
    },
  });

  const onSubmit = async (data: CreateVendorFormData) => {
    try {
      await createVendor(data);
      setOpen(false);
      form.reset();
    } catch {
      // Error is handled cleanly inside the hook via sonner toast.
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="text-zinc-500 mt-1">Manage platform beneficiaries and their financial details.</p>
        </div>

        {user?.role === "OPS" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Vendor</DialogTitle>
                <DialogDescription>
                  Ops strictly require vendor name. Bank logic is strictly regex mapped to RBI standard specifications.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Legal Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="upi_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Optional (e.g., name@bank)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="bank_account"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account No.</FormLabel>
                          <FormControl>
                            <Input placeholder="Optional digits" maxLength={18} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ifsc"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IFSC Code</FormLabel>
                          <FormControl>
                            <Input placeholder="SBIN0001234" maxLength={11} className="uppercase" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={isCreating}>
                      {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Vendor Details
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 overflow-hidden flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading active vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
             <Users className="h-12 w-12 mb-4 text-zinc-300 dark:text-zinc-700" />
             <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No vendors found</h3>
             <p className="mt-1">Add a vendor to get started with payouts.</p>
           </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Payment Identifiers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Added On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                     <div className="flex flex-col space-y-1 py-1">
                         {vendor.upi_id && <span className="text-xs text-zinc-500 font-mono">UPI: {vendor.upi_id}</span>}
                         {vendor.bank_account && <span className="text-xs text-zinc-500 font-mono">A/C: {vendor.bank_account} • IFSC: {vendor.ifsc}</span>}
                         {!vendor.upi_id && !vendor.bank_account && <span className="text-xs italic text-zinc-400">No payment methods</span>}
                     </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 hover:bg-emerald-50">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-zinc-500 text-sm">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
