"use client"

import { useState } from "react"
import { Navbar } from "@/components/ui/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, DownloadCloud, Calendar, Filter, Printer, ChevronDown, FileDown, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// Mock data for reports
const salesData = [
  { id: 1, date: "2023-05-01", amount: 1250.75, items: 15, customer: "Walk-in" },
  { id: 2, date: "2023-05-02", amount: 876.5, items: 8, customer: "Member #1024" },
  { id: 3, date: "2023-05-03", amount: 1432.25, items: 12, customer: "Member #1056" },
  { id: 4, date: "2023-05-04", amount: 965.0, items: 10, customer: "Walk-in" },
  { id: 5, date: "2023-05-05", amount: 2145.3, items: 22, customer: "Member #1078" },
]

const inventoryData = [
  { id: 1, name: "Organic Apples", category: "Produce", stock: 45, reorderLevel: 10, status: "In Stock" },
  { id: 2, name: "Whole Milk", category: "Dairy", stock: 12, reorderLevel: 15, status: "Low Stock" },
  { id: 3, name: "Whole Wheat Bread", category: "Bakery", stock: 30, reorderLevel: 8, status: "In Stock" },
  { id: 4, name: "Free Range Eggs", category: "Dairy", stock: 24, reorderLevel: 12, status: "In Stock" },
  { id: 5, name: "Organic Bananas", category: "Produce", stock: 5, reorderLevel: 10, status: "Low Stock" },
]

const memberData = [
  { id: 1, name: "John Doe", email: "john@example.com", joinDate: "2023-01-15", purchases: 24, points: 240 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", joinDate: "2023-02-20", purchases: 18, points: 180 },
  { id: 3, name: "Robert Johnson", email: "robert@example.com", joinDate: "2023-03-10", purchases: 32, points: 320 },
  { id: 4, name: "Emily Davis", email: "emily@example.com", joinDate: "2023-04-05", purchases: 15, points: 150 },
  { id: 5, name: "Michael Wilson", email: "michael@example.com", joinDate: "2023-05-12", purchases: 28, points: 280 },
]

const creditData = [
  { id: 1, member: "John Doe", balance: 450.0, limit: 1000.0, lastPayment: "2023-04-28", status: "Good Standing" },
  { id: 2, member: "Jane Smith", balance: 750.0, limit: 1000.0, lastPayment: "2023-04-15", status: "Good Standing" },
  { id: 3, member: "Robert Johnson", balance: 950.0, limit: 1000.0, lastPayment: "2023-04-10", status: "Near Limit" },
  { id: 4, member: "Emily Davis", balance: 200.0, limit: 500.0, lastPayment: "2023-04-22", status: "Good Standing" },
  { id: 5, member: "Michael Wilson", balance: 0.0, limit: 1000.0, lastPayment: "2023-04-30", status: "Paid in Full" },
]

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState("sales")
  const [timeRange, setTimeRange] = useState("week")
  const [format, setFormat] = useState("pdf")
  const [activeTab, setActiveTab] = useState("generate")

  // Sample report types
  const reportTypes = [
    { value: "sales", label: "Sales Report" },
    { value: "inventory", label: "Inventory Report" },
    { value: "members", label: "Member Report" },
    { value: "credit", label: "Credit Report" },
  ]

  // Sample time ranges
  const timeRanges = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "quarter", label: "This Quarter" },
    { value: "year", label: "This Year" },
    { value: "custom", label: "Custom Range" },
  ]

  // Sample formats
  const formats = [
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" },
    { value: "csv", label: "CSV" },
  ]

  // Function to generate and print report
  const generateReport = () => {
    let reportContent = ""
    let reportTitle = ""
    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const reportTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Create report content based on selected report type
    if (reportType === "sales") {
      reportTitle = "Sales Report"
      reportContent = `
        <div class="report-section">
          <div class="report-meta">
            <div class="meta-item"><span>Report Type:</span> Sales Report</div>
            <div class="meta-item"><span>Time Range:</span> ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</div>
            <div class="meta-item"><span>Generated:</span> ${reportDate} at ${reportTime}</div>
          </div>
        
          <div class="report-summary">
            <div class="summary-card">
              <h3>Total Sales</h3>
              <p class="summary-value">₱${salesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h3>Total Items</h3>
              <p class="summary-value">${salesData.reduce((sum, item) => sum + item.items, 0)}</p>
            </div>
            <div class="summary-card">
              <h3>Transactions</h3>
              <p class="summary-value">${salesData.length}</p>
            </div>
          </div>
        </div>

        <div class="report-data">
          <h3 class="table-title">Transaction Details</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Items</th>
                <th>Customer</th>
              </tr>
            </thead>
            <tbody>
              ${salesData
                .map(
                  (item) => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.date}</td>
                  <td>₱${item.amount.toFixed(2)}</td>
                  <td>${item.items}</td>
                  <td>${item.customer}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"><strong>Total</strong></td>
                <td><strong>₱${salesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</strong></td>
                <td><strong>${salesData.reduce((sum, item) => sum + item.items, 0)}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="report-analysis">
          <h3 class="analysis-title">Data Analysis</h3>
          
          <div class="analysis-section">
            <h4>Customer Breakdown</h4>
            <p>
              ${salesData.filter(item => item.customer.includes("Member")).length} out of ${salesData.length} transactions (${Math.round(salesData.filter(item => item.customer.includes("Member")).length / salesData.length * 100)}%) were from members, 
              while ${salesData.filter(item => item.customer === "Walk-in").length} transactions (${Math.round(salesData.filter(item => item.customer === "Walk-in").length / salesData.length * 100)}%) were from walk-in customers.
            </p>
            <p>
              Member transactions accounted for ₱${salesData.filter(item => item.customer.includes("Member")).reduce((sum, item) => sum + item.amount, 0).toFixed(2)} in sales (${Math.round(salesData.filter(item => item.customer.includes("Member")).reduce((sum, item) => sum + item.amount, 0) / salesData.reduce((sum, item) => sum + item.amount, 0) * 100)}% of total).
            </p>
          </div>
          
          <div class="analysis-section">
            <h4>Transaction Insights</h4>
            <p>
              Average transaction value: ₱${(salesData.reduce((sum, item) => sum + item.amount, 0) / salesData.length).toFixed(2)}
            </p>
            <p>
              Average items per transaction: ${(salesData.reduce((sum, item) => sum + item.items, 0) / salesData.length).toFixed(1)}
            </p>
            <p>
              Highest transaction: ₱${Math.max(...salesData.map(item => item.amount)).toFixed(2)} (${salesData.find(item => item.amount === Math.max(...salesData.map(s => s.amount)))?.customer})
            </p>
          </div>
        </div>
      `
    } else if (reportType === "inventory") {
      reportTitle = "Inventory Report"
      reportContent = `
        <div class="report-section">
          <div class="report-meta">
            <div class="meta-item"><span>Report Type:</span> Inventory Report</div>
            <div class="meta-item"><span>Status:</span> Current Stock</div>
            <div class="meta-item"><span>Generated:</span> ${reportDate} at ${reportTime}</div>
          </div>
        
          <div class="report-summary">
            <div class="summary-card">
              <h3>Total Products</h3>
              <p class="summary-value">${inventoryData.length}</p>
            </div>
            <div class="summary-card">
              <h3>Low Stock Items</h3>
              <p class="summary-value">${inventoryData.filter((item) => item.status === "Low Stock").length}</p>
            </div>
            <div class="summary-card">
              <h3>Categories</h3>
              <p class="summary-value">${new Set(inventoryData.map((item) => item.category)).size}</p>
            </div>
          </div>
        </div>

        <div class="report-data">
          <h3 class="table-title">Inventory Status</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${inventoryData
                .map(
                  (item) => `
                <tr ${item.status === "Low Stock" ? 'class="low-stock"' : ""}>
                  <td>${item.id}</td>
                  <td>${item.name}</td>
                  <td>${item.category}</td>
                  <td>${item.stock}</td>
                  <td>${item.reorderLevel}</td>
                  <td>${item.status}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
    } else if (reportType === "members") {
      reportTitle = "Member Report"
      reportContent = `
        <div class="report-section">
          <div class="report-meta">
            <div class="meta-item"><span>Report Type:</span> Member Activity Report</div>
            <div class="meta-item"><span>Time Range:</span> ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</div>
            <div class="meta-item"><span>Generated:</span> ${reportDate} at ${reportTime}</div>
          </div>
        
          <div class="report-summary">
            <div class="summary-card">
              <h3>Total Members</h3>
              <p class="summary-value">${memberData.length}</p>
            </div>
            <div class="summary-card">
              <h3>Total Purchases</h3>
              <p class="summary-value">${memberData.reduce((sum, item) => sum + item.purchases, 0)}</p>
            </div>
            <div class="summary-card">
              <h3>Total Points</h3>
              <p class="summary-value">${memberData.reduce((sum, item) => sum + item.points, 0)}</p>
            </div>
          </div>
        </div>

        <div class="report-data">
          <h3 class="table-title">Member Activity</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Join Date</th>
                <th>Purchases</th>
                <th>Loyalty Points</th>
              </tr>
            </thead>
            <tbody>
              ${memberData
                .map(
                  (item) => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.name}</td>
                  <td>${item.email}</td>
                  <td>${item.joinDate}</td>
                  <td>${item.purchases}</td>
                  <td>${item.points}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
    } else if (reportType === "credit") {
      reportTitle = "Credit Report"
      reportContent = `
        <div class="report-section">
          <div class="report-meta">
            <div class="meta-item"><span>Report Type:</span> Member Credit Report</div>
            <div class="meta-item"><span>Status:</span> Current Balances</div>
            <div class="meta-item"><span>Generated:</span> ${reportDate} at ${reportTime}</div>
          </div>
        
          <div class="report-summary">
            <div class="summary-card">
              <h3>Total Credit</h3>
              <p class="summary-value">₱${creditData.reduce((sum, item) => sum + item.balance, 0).toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h3>Near Limit</h3>
              <p class="summary-value">${creditData.filter((item) => item.status === "Near Limit").length}</p>
            </div>
            <div class="summary-card">
              <h3>Paid in Full</h3>
              <p class="summary-value">${creditData.filter((item) => item.status === "Paid in Full").length}</p>
            </div>
          </div>
        </div>

        <div class="report-data">
          <h3 class="table-title">Credit Status</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Member</th>
                <th>Balance</th>
                <th>Credit Limit</th>
                <th>Last Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${creditData
                .map(
                  (item) => `
                <tr ${item.status === "Near Limit" ? 'class="near-limit"' : ""}>
                  <td>${item.id}</td>
                  <td>${item.member}</td>
                  <td>₱${item.balance.toFixed(2)}</td>
                  <td>₱${item.limit.toFixed(2)}</td>
                  <td>${item.lastPayment}</td>
                  <td>${item.status}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="report-analysis">
          <h3 class="analysis-title">Credit Analysis</h3>
          
          <div class="analysis-section">
            <h4>Credit Utilization</h4>
            <p>
              Overall credit utilization: ${Math.round(creditData.reduce((sum, c) => sum + c.balance, 0) / creditData.reduce((sum, c) => sum + c.limit, 0) * 100)}%
            </p>
            <p>
              ${creditData.filter(c => c.balance / c.limit > 0.8).length} members have utilized over 80% of their credit limit.
            </p>
            <p>
              Average credit balance: ₱${(creditData.reduce((sum, c) => sum + c.balance, 0) / creditData.length).toFixed(2)}
            </p>
          </div>
          
          <div class="analysis-section">
            <h4>Payment Patterns</h4>
            <p>
              ${creditData.filter(c => {
                const paymentDate = new Date(c.lastPayment);
                const now = new Date();
                return (now.getTime() - paymentDate.getTime()) < (30 * 24 * 60 * 60 * 1000);
              }).length} members made payments in the last 30 days.
            </p>
            <p>
              ${creditData.filter(c => c.status === "Paid in Full").length} members (${Math.round(creditData.filter(c => c.status === "Paid in Full").length / creditData.length * 100)}%) have fully paid their balances.
            </p>
          </div>
        </div>
      `
    }

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>${reportTitle} - Pandol Cooperative</title>
          <style>
            @page {
              size: A4;
              margin: 1.5cm;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              margin: 0;
              padding: 0;
              color: #333;
              line-height: 1.5;
              background-color: #fff;
            }
            .report-container {
              max-width: 100%;
              margin: 0 auto;
            }
            .logo-container {
              text-align: center;
              margin-bottom: 10px;
            }
            .logo {
              max-width: 150px;
              height: auto;
            }
            .report-header {
              position: relative;
              margin-bottom: 20px;
              padding-bottom: 15px;
              border-bottom: 2px solid #1a365d;
              text-align: center;
            }
            .company-info {
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #1a365d;
              margin: 0;
              letter-spacing: 0.5px;
            }
            .company-address {
              font-size: 14px;
              color: #4a5568;
              margin: 5px 0;
            }
            .company-contact {
              font-size: 12px;
              color: #4a5568;
              margin: 2px 0;
            }
            .report-title {
              margin: 25px 0 30px;
              color: #1a365d;
              font-size: 22px;
              text-align: center;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 1px;
              position: relative;
            }
            .report-title::after {
              content: '';
              position: absolute;
              width: 80px;
              height: 2px;
              background-color: #e2e8f0;
              bottom: -10px;
              left: 50%;
              transform: translateX(-50%);
            }
            .report-section {
              margin-bottom: 30px;
            }
            .report-meta {
              display: flex;
              flex-wrap: wrap;
              margin-bottom: 20px;
              font-size: 12px;
              color: #4a5568;
              border: 1px solid #e2e8f0;
              padding: 10px;
              background-color: #f8fafc;
            }
            .meta-item {
              margin-right: 30px;
              margin-bottom: 5px;
            }
            .meta-item span {
              font-weight: bold;
              color: #1a365d;
            }
            .report-summary {
              display: flex;
              justify-content: space-between;
              gap: 20px;
              margin-bottom: 30px;
            }
            .summary-card {
              flex: 1;
              padding: 15px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              text-align: center;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .summary-card h3 {
              margin: 0 0 10px 0;
              font-size: 14px;
              color: #4a5568;
              font-weight: normal;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .summary-value {
              font-size: 22px;
              font-weight: bold;
              color: #1a365d;
              margin: 0;
            }
            .report-data {
              margin-bottom: 30px;
            }
            .table-title {
              font-size: 16px;
              margin: 0 0 15px 0;
              color: #1a365d;
              font-weight: bold;
            }
            .report-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              border: 1px solid #e2e8f0;
            }
            .report-table th, .report-table td {
              padding: 10px;
              text-align: left;
              border-bottom: 1px solid #e2e8f0;
            }
            .report-table th {
              background-color: #f1f5f9;
              font-weight: 600;
              color: #1a365d;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 0.5px;
            }
            .report-table tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .report-table tfoot {
              font-weight: bold;
              background-color: #f1f5f9;
            }
            .low-stock {
              color: #e53e3e;
            }
            .near-limit {
              color: #dd6b20;
            }
            .report-analysis {
              margin-top: 40px;
              padding: 20px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
            }
            .analysis-title {
              font-size: 18px;
              margin: 0 0 20px 0;
              color: #1a365d;
              font-weight: bold;
              padding-bottom: 10px;
              border-bottom: 1px solid #e2e8f0;
            }
            .analysis-section {
              margin-bottom: 20px;
            }
            .analysis-section h4 {
              font-size: 14px;
              margin: 0 0 10px 0;
              color: #4a5568;
              font-weight: bold;
            }
            .analysis-section p {
              margin: 5px 0;
              font-size: 12px;
              line-height: 1.5;
              color: #4a5568;
            }
            .footer {
              margin-top: 40px;
              padding-top: 15px;
              border-top: 1px solid #e2e8f0;
              font-size: 11px;
              color: #718096;
              text-align: center;
            }
            .footer p {
              margin: 3px 0;
            }
            .signature-section {
              margin-top: 60px;
              display: flex;
              justify-content: space-between;
            }
            .signature-line {
              width: 30%;
              border-top: 1px solid #718096;
              padding-top: 5px;
              text-align: center;
              font-size: 12px;
              color: #4a5568;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="logo-container">
              <img src="/pandol-logo.png" alt="Pandol Cooperative Logo" class="logo">
            </div>
            
            <div class="report-header">
              <div class="company-info">
                <h1 class="company-name">Pandol Cooperative</h1>
                <p class="company-address">123 Cooperative Avenue, Quezon City, Metro Manila</p>
                <p class="company-contact">Tel: (02) 8123-4567 | Email: info@pandolcoop.com</p>
              </div>
            </div>
            
            <h2 class="report-title">${reportTitle}</h2>
            
            ${reportContent}
            
            <div class="signature-section">
              <div class="signature-line">Prepared by</div>
              <div class="signature-line">Reviewed by</div>
              <div class="signature-line">Approved by</div>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Pandol Cooperative. All rights reserved.</p>
              <p>This is an official document generated by the Pandol Cooperative Management System.</p>
              <p>Generated on: ${reportDate} at ${reportTime}</p>
            </div>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()

      // Trigger print dialog after content is loaded
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar userType="admin" userName="Admin User" />

      <main className="pt-16 pb-20">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-serif text-gray-900">Reports</h1>
              <p className="text-gray-600 text-sm">Generate and manage reports</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                <Clock className="h-4 w-4 mr-1" /> Recent Reports
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                <FileDown className="h-4 w-4 mr-1" /> Scheduled Reports
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 border-b border-gray-200 w-full justify-start rounded-none bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="generate" 
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Generate Report
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-amber-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Report Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="mt-0">
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-lg text-gray-800 font-medium">Generate Report</CardTitle>
                  <CardDescription>Configure your report parameters</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Report Type</label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          {reportTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Time Range</label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                          <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeRanges.map((range) => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Format</label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger className="border-gray-300 focus:ring-amber-500 focus:border-amber-500">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          {formats.map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-8">
                    <p className="text-sm text-gray-500">
                      The report will include data from {timeRange === "day" ? "today" : timeRange === "week" ? "the current week" : timeRange === "month" ? "the current month" : timeRange === "quarter" ? "the current quarter" : "the current year"}.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-gray-300">
                        <DownloadCloud className="h-4 w-4 mr-2" />
                        Save Template
                      </Button>
                      <Button
                        className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                        onClick={generateReport}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="mt-0">
              <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg text-gray-800 font-medium">
                        {reportType === "sales" ? "Sales Report" : 
                         reportType === "inventory" ? "Inventory Report" : 
                         reportType === "members" ? "Member Report" : "Credit Report"}
                      </CardTitle>
                      <CardDescription>
                        {timeRange === "day" ? "Today" : 
                         timeRange === "week" ? "This Week" : 
                         timeRange === "month" ? "This Month" : 
                         timeRange === "quarter" ? "This Quarter" : "This Year"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                        <Filter className="h-4 w-4 mr-1" /> Filter
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-600 border-gray-300">
                        <Calendar className="h-4 w-4 mr-1" /> Date Range
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {reportType === "sales" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                ₱{salesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{timeRange === "day" ? "Today" : timeRange === "week" ? "This week" : timeRange === "month" ? "This month" : timeRange === "quarter" ? "This quarter" : "This year"}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Items</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                {salesData.reduce((sum, item) => sum + item.items, 0)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Units sold</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">{salesData.length}</p>
                              <p className="text-xs text-gray-500 mt-1">Total processed</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Separator className="my-6" />

                      <div className="mb-2 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">Transaction Details</h3>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      
                      <div className="rounded-md border border-gray-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">ID</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Date</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Amount</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Items</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Customer</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {salesData.map((sale) => (
                              <TableRow key={sale.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="text-gray-700 font-medium">{sale.id}</TableCell>
                                <TableCell className="text-gray-600">{sale.date}</TableCell>
                                <TableCell className="text-gray-700">₱{sale.amount.toFixed(2)}</TableCell>
                                <TableCell className="text-gray-600">{sale.items}</TableCell>
                                <TableCell className="text-gray-600">{sale.customer}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="mt-6 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Showing {salesData.length} transactions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-700">
                            Total Sales:{" "}
                            <span className="text-amber-600 font-bold">
                              ₱{salesData.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                            </span>
                          </p>
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            Total Items:{" "}
                            <span className="text-amber-600 font-bold">{salesData.reduce((sum, item) => sum + item.items, 0)}</span>
                          </p>
                        </div>
                      </div>

                      <Separator className="my-6" />

                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-6">
                        <h3 className="text-base font-medium text-gray-800 mb-3">Data Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Customer Breakdown</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {salesData.filter(item => item.customer.includes("Member")).length} out of {salesData.length} transactions ({Math.round(salesData.filter(item => item.customer.includes("Member")).length / salesData.length * 100)}%) were from members, 
                              while {salesData.filter(item => item.customer === "Walk-in").length} transactions ({Math.round(salesData.filter(item => item.customer === "Walk-in").length / salesData.length * 100)}%) were from walk-in customers.
                            </p>
                            <p className="text-sm text-gray-600">
                              Member transactions accounted for ₱{salesData.filter(item => item.customer.includes("Member")).reduce((sum, item) => sum + item.amount, 0).toFixed(2)} in sales (${Math.round(salesData.filter(item => item.customer.includes("Member")).reduce((sum, item) => sum + item.amount, 0) / salesData.reduce((sum, item) => sum + item.amount, 0) * 100)}% of total).
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Transaction Insights</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Average transaction value: ₱{(salesData.reduce((sum, item) => sum + item.amount, 0) / salesData.length).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Average items per transaction: {(salesData.reduce((sum, item) => sum + item.items, 0) / salesData.length).toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Highest transaction: ₱{Math.max(...salesData.map(item => item.amount)).toFixed(2)} (${salesData.find(item => item.amount === Math.max(...salesData.map(s => s.amount)))?.customer})
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportType === "inventory" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Products</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">{inventoryData.length}</p>
                              <p className="text-xs text-gray-500 mt-1">Items in inventory</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Low Stock Items</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                {inventoryData.filter((item) => item.status === "Low Stock").length}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Need reordering</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Categories</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                {new Set(inventoryData.map((item) => item.category)).size}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Product categories</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Separator className="my-6" />

                      <div className="mb-2 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">Inventory Status</h3>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      
                      <div className="rounded-md border border-gray-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">ID</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Product Name</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Category</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Current Stock</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Reorder Level</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {inventoryData.map((item) => (
                              <TableRow key={item.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="text-gray-700 font-medium">{item.id}</TableCell>
                                <TableCell className="text-gray-700">{item.name}</TableCell>
                                <TableCell className="text-gray-600">{item.category}</TableCell>
                                <TableCell className="text-gray-700">{item.stock}</TableCell>
                                <TableCell className="text-gray-600">{item.reorderLevel}</TableCell>
                                <TableCell className={item.status === "Low Stock" ? "text-red-600 font-medium" : "text-green-600"}>
                                  {item.status}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <Separator className="my-6" />

                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-6">
                        <h3 className="text-base font-medium text-gray-800 mb-3">Inventory Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Stock Level Analysis</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {inventoryData.filter(item => item.status === "Low Stock").length} out of {inventoryData.length} products ({Math.round(inventoryData.filter(item => item.status === "Low Stock").length / inventoryData.length * 100)}%) are currently low in stock.
                            </p>
                            <p className="text-sm text-gray-600">
                              {inventoryData.filter(item => item.stock < item.reorderLevel).length} products are below their reorder threshold and require immediate attention.
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Category Distribution</h4>
                            {Array.from(new Set(inventoryData.map(item => item.category))).map(category => (
                              <p key={category} className="text-sm text-gray-600 mb-1">
                                {category}: {inventoryData.filter(item => item.category === category).length} products 
                                ({Math.round(inventoryData.filter(item => item.category === category).length / inventoryData.length * 100)}% of inventory)
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportType === "members" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Members</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">{memberData.length}</p>
                              <p className="text-xs text-gray-500 mt-1">Active members</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Purchases</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                {memberData.reduce((sum, item) => sum + item.purchases, 0)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Lifetime transactions</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Points</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                {memberData.reduce((sum, item) => sum + item.points, 0)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Loyalty points</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Separator className="my-6" />

                      <div className="mb-2 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">Member Activity</h3>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      
                      <div className="rounded-md border border-gray-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">ID</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Name</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Email</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Join Date</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Purchases</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Loyalty Points</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {memberData.map((member) => (
                              <TableRow key={member.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="text-gray-700 font-medium">{member.id}</TableCell>
                                <TableCell className="text-gray-700">{member.name}</TableCell>
                                <TableCell className="text-gray-600">{member.email}</TableCell>
                                <TableCell className="text-gray-600">{member.joinDate}</TableCell>
                                <TableCell className="text-gray-700">{member.purchases}</TableCell>
                                <TableCell className="text-gray-600">{member.points}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <Separator className="my-6" />

                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-6">
                        <h3 className="text-base font-medium text-gray-800 mb-3">Member Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Membership Overview</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {memberData.filter(m => {
                                const joinDate = new Date(m.joinDate);
                                const now = new Date();
                                return (now.getTime() - joinDate.getTime()) < (90 * 24 * 60 * 60 * 1000);
                              }).length} new members joined in the last 90 days.
                            </p>
                            <p className="text-sm text-gray-600">
                              Average membership duration: {Math.round(memberData.reduce((sum, m) => {
                                const joinDate = new Date(m.joinDate);
                                const now = new Date();
                                return sum + (now.getTime() - joinDate.getTime()) / (24 * 60 * 60 * 1000);
                              }, 0) / memberData.length)} days
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Activity Metrics</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Average purchases per member: {(memberData.reduce((sum, m) => sum + m.purchases, 0) / memberData.length).toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              Average points per member: {(memberData.reduce((sum, m) => sum + m.points, 0) / memberData.length).toFixed(1)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Most active member: {memberData.reduce((max, m) => m.purchases > max.purchases ? m : max, memberData[0] || { purchases: 0, name: 'None' }).name} ({memberData.reduce((max, m) => m.purchases > max.purchases ? m : max, memberData[0] || { purchases: 0, name: 'None' }).purchases} purchases)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportType === "credit" && (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Credit</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                ₱{creditData.reduce((sum, item) => sum + item.balance, 0).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Outstanding balance</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Near Limit</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                {creditData.filter((item) => item.status === "Near Limit").length}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Members approaching limit</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                          <CardContent className="p-0">
                            <div className="bg-amber-50 p-3 border-b border-gray-200">
                              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Paid in Full</h3>
                            </div>
                            <div className="p-4">
                              <p className="text-2xl font-bold text-amber-600">
                                {creditData.filter((item) => item.status === "Paid in Full").length}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">Zero balance</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Separator className="my-6" />

                      <div className="mb-2 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-800">Credit Status</h3>
                        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      
                      <div className="rounded-md border border-gray-200 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">ID</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Member</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Balance</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Credit Limit</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Last Payment</TableHead>
                              <TableHead className="font-medium text-xs uppercase tracking-wider text-gray-500">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {creditData.map((credit) => (
                              <TableRow key={credit.id} className="hover:bg-gray-50 border-b border-gray-100">
                                <TableCell className="text-gray-700 font-medium">{credit.id}</TableCell>
                                <TableCell className="text-gray-700">{credit.member}</TableCell>
                                <TableCell className="text-gray-700">₱{credit.balance.toFixed(2)}</TableCell>
                                <TableCell className="text-gray-600">₱{credit.limit.toFixed(2)}</TableCell>
                                <TableCell className="text-gray-600">{credit.lastPayment}</TableCell>
                                <TableCell className={credit.status === "Near Limit" ? "text-orange-600 font-medium" : credit.status === "Paid in Full" ? "text-green-600 font-medium" : "text-gray-600"}>
                                  {credit.status}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      <Separator className="my-6" />

                      <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mt-6">
                        <h3 className="text-base font-medium text-gray-800 mb-3">Credit Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Credit Utilization</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              Overall credit utilization: {Math.round(creditData.reduce((sum, c) => sum + c.balance, 0) / creditData.reduce((sum, c) => sum + c.limit, 0) * 100)}%
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                              {creditData.filter(c => c.balance / c.limit > 0.8).length} members have utilized over 80% of their credit limit.
                            </p>
                            <p className="text-sm text-gray-600">
                              Average credit balance: ₱{(creditData.reduce((sum, c) => sum + c.balance, 0) / creditData.length).toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Payment Patterns</h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {creditData.filter(c => {
                                const paymentDate = new Date(c.lastPayment);
                                const now = new Date();
                                return (now.getTime() - paymentDate.getTime()) < (30 * 24 * 60 * 60 * 1000);
                              }).length} members made payments in the last 30 days.
                            </p>
                            <p className="text-sm text-gray-600">
                              {creditData.filter(c => c.status === "Paid in Full").length} members ({Math.round(creditData.filter(c => c.status === "Paid in Full").length / creditData.length * 100)}%) have fully paid their balances.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end">
                    <Button variant="outline" className="mr-3 border-gray-300">
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                      onClick={generateReport}
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
