"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Search, 
  Plus, 
  FilePlus, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  ExternalLink,
  ArrowLeft,
  Package,
  History
} from "lucide-react";
import { 
  fetchAdminProducts, 
  fetchPurchaseOrders, 
  createPurchaseOrder, 
  uploadDocument,
  type Product, 
  type PurchaseOrder 
} from "@/lib/api-service";
import { formatIDR, cn } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default function PurchaseOrderPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Create PO Form State
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  const [totalItemsOnReceipt, setTotalItemsOnReceipt] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [selectedItems, setSelectedItems] = useState<Array<{ product: Product; quantity: number }>>([]);
  
  // Product Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalInputQty = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedItems]);

  const isQtyMismatch = totalInputQty !== totalItemsOnReceipt;
  const isFormValid = receiptUrl && totalItemsOnReceipt > 0 && selectedItems.length > 0 && (!isQtyMismatch || (isQtyMismatch && notes.trim().length > 0));

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  async function loadPurchaseOrders() {
    try {
      setLoading(true);
      const data = await fetchPurchaseOrders();
      setPurchaseOrders(data);
    } catch (error) {
      console.error("Failed to load POs:", error);
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  }

  // Handle Product Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await fetchAdminProducts({ search: searchQuery, limit: 5 });
        setSearchResults(response.products);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("File format not supported. Use PNG, JPG, or PDF.");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadDocument(file);
      setReceiptUrl(res.url);
      toast.success("Receipt uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload receipt");
    } finally {
      setIsUploading(false);
    }
  };

  const addItem = (product: Product) => {
    if (selectedItems.find(item => item.product.id === product.id)) {
      toast.error("Product already in the list");
      return;
    }
    setSelectedItems(prev => [...prev, { product, quantity: 1 }]);
    setSearchQuery("");
    setSearchResults([]);
  };

  const removeItem = (productId: number) => {
    setSelectedItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty < 1) return;
    setSelectedItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity: qty } : item
    ));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    try {
      setIsCreating(true);
      await createPurchaseOrder({
        receiptUrl,
        totalItemsOnReceipt,
        notes: notes || undefined,
        items: selectedItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      });

      toast.success("Purchase Order saved successfully");
      resetForm();
      setShowCreateForm(false);
      loadPurchaseOrders();
    } catch (error: any) {
      console.error("Submit failed:", error);
      toast.error(error.message || "Failed to save Purchase Order");
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setReceiptUrl("");
    setTotalItemsOnReceipt(0);
    setNotes("");
    setSelectedItems([]);
    setSearchQuery("");
  };

  const getImageUrl = (url?: string) => {
    if (!url) return "/no-image.svg";
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${url}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-zinc-400 font-medium animate-pulse">Loading incoming goods report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showCreateForm && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowCreateForm(false)}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              {showCreateForm ? "Create New Purchase Order" : "Purchase Orders"}
            </h1>
            <p className="text-zinc-400 text-sm">
              {showCreateForm 
                ? "Input receipt and incoming items for automatic stock updates." 
                : "Manage and track all incoming stock receipts."}
            </p>
          </div>
        </div>
        
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)} className="gap-2 shadow-lg shadow-primary/20">
            <FilePlus className="h-4 w-4" />
            Add New PO
          </Button>
        )}
      </div>

      {showCreateForm ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Main Form Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-zinc-800 bg-zinc-900/30">
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Incoming Item Details
                </CardTitle>
                <CardDescription className="text-zinc-500">
                  Select items and adjust quantity according to the receipt.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Product Search */}
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input 
                      placeholder="Search SKU or Product Name (must be created in Manage Products first)..." 
                      className="pl-10 bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl focus:ring-primary/20 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {/* Search Results Overlay */}
                    {isSearching && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    )}

                    {searchResults.length > 0 && (
                      <Card className="absolute z-50 w-full mt-2 bg-zinc-900 border-zinc-700 shadow-2xl overflow-hidden">
                        <div className="max-h-60 overflow-y-auto">
                          {searchResults.map(product => (
                            <div 
                              key={product.id}
                              className="p-3 hover:bg-zinc-800 cursor-pointer flex items-center justify-between border-b border-zinc-800 last:border-0"
                              onClick={() => addItem(product)}
                            >
                              <div className="flex items-center gap-3">
                                <img src={getImageUrl(product.images?.[0])} className="w-10 h-10 rounded object-cover border border-zinc-700" alt="" />
                                <div>
                                  <p className="text-sm font-bold text-white leading-tight">{product.name}</p>
                                  <p className="text-[10px] text-zinc-500 font-mono uppercase">{product.sku} • {product.brand}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>

                  {/* Empty State / Link to Catalog */}
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-zinc-500 italic">
                      Product not found? <Link href="/admin/catalog/new" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1 font-bold">Create in Manage Products <ExternalLink className="h-3 w-3" /></Link>
                    </p>
                  </div>
                </div>

                {/* Selected Items Table */}
                <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950/30">
                  <Table>
                    <TableHeader className="bg-zinc-900/50">
                      <TableRow className="border-zinc-800 hover:bg-transparent">
                        <TableHead className="text-zinc-400">Item</TableHead>
                        <TableHead className="text-zinc-400 text-center w-24">Current Stock</TableHead>
                        <TableHead className="text-zinc-400 text-center w-32">Inbound Qty</TableHead>
                        <TableHead className="text-zinc-400 text-right w-16 px-4"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="h-32 text-center text-zinc-600 italic">
                            <p>No items selected yet.</p>
                            <p className="text-[10px] mt-1">Search for products above to add them.</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedItems.map((item) => (
                          <TableRow key={item.product.id} className="border-zinc-800/50 transition-colors hover:bg-white/5">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-zinc-900 w-8 h-8 rounded border border-zinc-800 flex items-center justify-center shrink-0">
                                  <img src={getImageUrl(item.product.images?.[0])} className="w-full h-full object-cover rounded" alt="" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-bold text-zinc-200 truncate">{item.product.name}</p>
                                  <p className="text-[10px] text-zinc-500 font-mono">{item.product.sku}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-400">
                                {item.product.stock}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Input 
                                  inputMode="numeric"
                                  value={item.quantity === 0 ? "" : item.quantity}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || /^\d+$/.test(val)) {
                                      updateQuantity(item.product.id, parseInt(val) || 0);
                                    }
                                  }}
                                  onFocus={(e) => e.target.select()}
                                  className="w-20 h-9 bg-zinc-900 border-zinc-800 text-center text-sm font-bold focus-visible:ring-primary/30"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right px-4">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => removeItem(item.product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Section: Receipt and Validation */}
          <div className="space-y-6">
            {/* Receipt Upload Card */}
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-zinc-800 bg-zinc-900/30">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Receipt (PNG/PDF)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileUpload}
                  accept=".png,.jpg,.jpeg,.pdf"
                />
                
                {receiptUrl ? (
                  <div className="relative group rounded-xl overflow-hidden border border-primary/20 aspect-video bg-zinc-950 flex items-center justify-center">
                    {receiptUrl.endsWith('.pdf') ? (
                       <div className="text-center p-4">
                          <FileText className="h-10 w-10 text-primary mx-auto mb-2" />
                          <p className="text-[10px] text-zinc-400 break-all">{receiptUrl.split('/').pop()}</p>
                       </div>
                    ) : (
                      <img src={getImageUrl(receiptUrl)} alt="Receipt" className="w-full h-full object-contain" />
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.open(getImageUrl(receiptUrl), '_blank')}>
                         View
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setReceiptUrl("")}>
                         Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full h-32 border-dashed border-zinc-700 bg-zinc-950/50 hover:bg-primary/5 hover:border-primary/50 transition-all flex-col gap-2"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-zinc-500" />
                        <span className="text-xs text-zinc-400">Upload Receipt</span>
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Validation and Summary Card */}
            <Card className="bg-zinc-900/50 border-zinc-800 shadow-xl overflow-hidden border-l-4 border-l-primary">
              <CardHeader className="p-4 border-b border-zinc-800 bg-zinc-900/30">
                <CardTitle className="text-sm font-bold text-white">Validation Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total Qty on Receipt</label>
                  <Input 
                    inputMode="numeric"
                    value={totalItemsOnReceipt === 0 ? "" : totalItemsOnReceipt}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d+$/.test(val)) {
                        setTotalItemsOnReceipt(parseInt(val) || 0);
                      }
                    }}
                    onFocus={(e) => e.target.select()}
                    className="bg-zinc-950 border-zinc-800 font-bold text-center h-12 text-lg focus:ring-primary/20"
                  />
                  <p className="text-[10px] text-zinc-500 italic">*Input the total items written on the physical receipt paper</p>
                </div>

                <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Total Items Input:</span>
                    <span className="font-bold text-white">{totalInputQty} Pcs</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Receipt Target:</span>
                    <span className="font-bold text-white">{totalItemsOnReceipt} Pcs</span>
                  </div>
                  <div className="pt-2 border-t border-zinc-800">
                    {totalItemsOnReceipt > 0 && (
                      <div className={cn(
                        "flex items-center gap-2 font-bold text-[11px] py-1 px-2 rounded-md",
                        isQtyMismatch ? "bg-amber-500/10 text-amber-500" : "bg-green-500/10 text-green-500"
                      )}>
                        {isQtyMismatch ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                        {isQtyMismatch ? "Jumlah Tidak Sesuai" : "Jumlah Sesuai"}
                      </div>
                    )}
                  </div>
                </div>

                {isQtyMismatch && (
                  <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] uppercase font-bold text-amber-500 tracking-wider">Note (Required if Mismatched)</label>
                    <Textarea 
                      placeholder="Why does the input qty differ from the receipt? (e.g., rejected items, typo on receipt, etc.)"
                      className="bg-zinc-950 border-amber-500/30 text-xs min-h-[80px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                )}
                
                {!isQtyMismatch && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Note (Optional)</label>
                    <Textarea 
                      placeholder="Add additional notes if necessary..."
                      className="bg-zinc-950 border-zinc-800 text-xs min-h-[60px]"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                )}

                <Button 
                  className="w-full h-11 transition-all" 
                  disabled={!isFormValid || isCreating}
                  onClick={handleSubmit}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      PROCESSING...
                    </>
                  ) : (
                    "SAVE PURCHASE ORDER"
                  )}
                </Button>
                
                {!isFormValid && (
                  <p className="text-[9px] text-center text-zinc-500 mt-2">
                    Please complete the file, target qty, and items list.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Purchase Order List Section */
        <div className="space-y-6">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
             <CardHeader className="p-4 border-b border-zinc-800/60 bg-zinc-900/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <History className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Incoming Goods Report</CardTitle>
                    <CardDescription className="text-[10px] uppercase tracking-tighter">Purchase Order Transaction History</CardDescription>
                  </div>
                </div>
             </CardHeader>
             <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-zinc-950/40">
                    <TableRow className="border-zinc-800/60 hover:bg-transparent">
                      <TableHead className="text-zinc-500 text-[10px] uppercase font-black px-6 py-3">PO ID</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] uppercase font-black py-3">Inbound Date</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] uppercase font-black text-center py-3">Total Qty</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] uppercase font-black py-3">Receipt</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] uppercase font-black py-3 max-w-[200px]">Notes</TableHead>
                      <TableHead className="text-zinc-500 text-[10px] uppercase font-black text-right px-6 py-3"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-64 text-center">
                           <div className="flex flex-col items-center justify-center opacity-30">
                              <FilePlus className="h-12 w-12 mb-2" />
                                <p className="text-sm font-medium">No purchase order history yet</p>
                           </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      purchaseOrders.map((po) => (
                        <TableRow key={po.id} className="border-zinc-800/40 hover:bg-white/5 transition-colors group">
                          <TableCell className="px-6 font-mono text-xs text-primary font-bold">#PO-{po.id.toString().padStart(4, '0')}</TableCell>
                          <TableCell className="text-zinc-300 text-xs">{format(new Date(po.createdAt), "dd MMM yyyy, HH:mm")}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="bg-zinc-800 text-zinc-100 font-bold border-zinc-700">
                              {po.items.reduce((sum, i) => sum + i.quantity, 0)} Pcs
                            </Badge>
                            {po.items.reduce((sum, i) => sum + i.quantity, 0) !== po.totalItemsOnReceipt && (
                              <Badge className="ml-2 bg-amber-500/20 text-amber-500 border-amber-500/30 text-[9px] h-4">Mismatch</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Link 
                              href={getImageUrl(po.receiptUrl)} 
                              target="_blank"
                              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 rounded-md transition-all border border-zinc-800"
                            >
                               {po.receiptUrl.endsWith('.pdf') ? <FileText className="h-3 w-3" /> : <Upload className="h-3 w-3" />}
                               <span>View</span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <p className="text-[11px] text-zinc-500 line-clamp-1 max-w-[200px]" title={po.notes || "-"}>
                              {po.notes || "-"}
                            </p>
                          </TableCell>
                          <TableCell className="text-right px-6">
                             <Dialog>
                               <DialogTrigger asChild>
                                 <Button variant="ghost" size="sm" className="h-8 text-zinc-400 hover:text-white group-hover:bg-zinc-800">
                                   Detail
                                 </Button>
                               </DialogTrigger>
                               <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-w-2xl">
                                 <DialogHeader>
                                   <DialogTitle className="flex items-center gap-2">
                                     Purchase Order Detail <Badge className="font-mono">#PO-{po.id}</Badge>
                                   </DialogTitle>
                                   <DialogDescription className="text-zinc-500">
                                      Recorded on {format(new Date(po.createdAt), "eeee, dd MMMM yyyy HH:mm 'WIB'")}
                                   </DialogDescription>
                                 </DialogHeader>
                                 
                                 <div className="space-y-6 pt-4">
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                                         <p className="text-zinc-500 mb-1 uppercase font-black text-[9px]">Receipt Summary</p>
                                         <div className="flex justify-between items-center mb-1">
                                            <span>Receipt Target:</span>
                                            <span className="font-bold">{po.totalItemsOnReceipt} Pcs</span>
                                         </div>
                                         <div className="flex justify-between items-center">
                                            <span>Total Validated:</span>
                                            <span className="font-bold text-primary">{po.items.reduce((sum, i) => sum + i.quantity, 0)} Pcs</span>
                                         </div>
                                      </div>
                                      <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                                         <p className="text-zinc-500 mb-1 uppercase font-black text-[9px]">Document</p>
                                         <Link 
                                          href={getImageUrl(po.receiptUrl)} 
                                          target="_blank"
                                          className="flex items-center gap-2 text-primary font-bold hover:underline"
                                         >
                                           <FileText className="h-4 w-4" />
                                            Open Original Receipt
                                         </Link>
                                      </div>
                                    </div>

                                    {po.notes && (
                                      <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                                        <p className="text-amber-500 font-bold mb-1 uppercase text-[9px]">Admin Notes</p>
                                        <p className="text-xs text-zinc-300 italic">"{po.notes}"</p>
                                      </div>
                                    )}

                                    <div className="space-y-2">
                                       <p className="text-zinc-400 font-bold text-[10px] uppercase">Incoming Goods List:</p>
                                       <div className="rounded-xl border border-zinc-800 overflow-hidden">
                                        <Table>
                                          <TableHeader className="bg-zinc-950">
                                            <TableRow className="border-zinc-800">
                                              <TableHead className="text-[10px] h-8">Product</TableHead>
                                              <TableHead className="text-[10px] h-8 text-center">SKU</TableHead>
                                              <TableHead className="text-[10px] h-8 text-right px-4">Qty</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {po.items.map((item) => (
                                              <TableRow key={item.id} className="border-zinc-800/50 h-10">
                                                <TableCell className="py-2 text-[11px] font-bold">{item.product?.name || "Unknown Product"}</TableCell>
                                                <TableCell className="py-2 text-[11px] text-center font-mono opacity-60 uppercase">{item.product?.sku || "-"}</TableCell>
                                                <TableCell className="py-2 text-right px-4 text-[11px] font-black">{item.quantity} pcs</TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                       </div>
                                    </div>
                                 </div>
                               </DialogContent>
                             </Dialog>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
