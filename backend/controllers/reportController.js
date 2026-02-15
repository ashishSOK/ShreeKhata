import Transaction from '../models/Transaction.js';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

// @desc    Generate monthly report
// @route   GET /api/reports/monthly
// @access  Private
export const getMonthlyReport = async (req, res) => {
    try {
        const { month, year } = req.query;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const transactions = await Transaction.find({
            user: req.user._id,
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        let totalIncome = 0;
        let totalExpense = 0;

        const categoryWise = {};
        const paymentModeWise = {};

        transactions.forEach((txn) => {
            if (txn.type === 'income' || txn.type === 'credit_received') {
                totalIncome += txn.amount;
            } else {
                totalExpense += txn.amount;

                // Category wise
                if (!categoryWise[txn.category]) {
                    categoryWise[txn.category] = 0;
                }
                categoryWise[txn.category] += txn.amount;

                // Payment mode wise
                if (!paymentModeWise[txn.paymentMode]) {
                    paymentModeWise[txn.paymentMode] = 0;
                }
                paymentModeWise[txn.paymentMode] += txn.amount;
            }
        });

        res.json({
            period: { month, year, startDate, endDate },
            summary: {
                totalIncome,
                totalExpense,
                netBalance: totalIncome - totalExpense,
                transactionCount: transactions.length
            },
            categoryWise,
            paymentModeWise,
            transactions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate vendor report
// @route   GET /api/reports/vendor
// @access  Private
export const getVendorReport = async (req, res) => {
    try {
        const { vendor, startDate, endDate } = req.query;

        const query = { user: req.user._id };

        if (vendor) {
            query.vendor = { $regex: vendor, $options: 'i' };
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });

        // Group by vendor
        const vendorWise = {};
        transactions.forEach((txn) => {
            if (txn.vendor) {
                if (!vendorWise[txn.vendor]) {
                    vendorWise[txn.vendor] = {
                        totalAmount: 0,
                        transactionCount: 0,
                        transactions: []
                    };
                }
                vendorWise[txn.vendor].totalAmount += txn.amount;
                vendorWise[txn.vendor].transactionCount++;
                vendorWise[txn.vendor].transactions.push(txn);
            }
        });

        res.json({
            vendorWise,
            totalTransactions: transactions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Generate category report
// @route   GET /api/reports/category
// @access  Private
export const getCategoryReport = async (req, res) => {
    try {
        const { category, startDate, endDate } = req.query;

        const query = { user: req.user._id };

        if (category) {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });

        // Group by category
        const categoryWise = {};
        transactions.forEach((txn) => {
            if (!categoryWise[txn.category]) {
                categoryWise[txn.category] = {
                    totalAmount: 0,
                    transactionCount: 0,
                    transactions: []
                };
            }
            categoryWise[txn.category].totalAmount += txn.amount;
            categoryWise[txn.category].transactionCount++;
            categoryWise[txn.category].transactions.push(txn);
        });

        res.json({
            categoryWise,
            totalTransactions: transactions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export to PDF
// @route   GET /api/reports/export/pdf
// @access  Private
export const exportToPDF = async (req, res) => {
    try {
        const { startDate, endDate, title } = req.query;

        const query = { user: req.user._id };
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query).sort({ date: 1 });

        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
            bufferPages: true
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=shreekhata-report.pdf`);

        doc.pipe(res);

        // Modern Header with Background
        doc.rect(0, 0, doc.page.width, 120).fillAndStroke('#6366f1', '#6366f1');

        // ShreeKhata Logo/Title
        doc.fontSize(28)
            .fillColor('#ffffff')
            .font('Helvetica-Bold')
            .text('ShreeKhata', 50, 30);

        doc.fontSize(12)
            .fillColor('#e0e7ff')
            .font('Helvetica')
            .text('Digital Ledger', 50, 65);

        // Report Title
        doc.fontSize(18)
            .fillColor('#ffffff')
            .font('Helvetica-Bold')
            .text(title || 'Financial Report', 50, 90, { align: 'right' });

        // Reset position after header
        doc.y = 140;

        // Period Information Box
        if (startDate && endDate) {
            doc.roundedRect(50, doc.y, doc.page.width - 100, 60, 8)
                .fillAndStroke('#f0f9ff', '#93c5fd');

            doc.fontSize(10)
                .fillColor('#1e40af')
                .font('Helvetica')
                .text('Report Period', 70, doc.y + 15);

            doc.fontSize(14)
                .fillColor('#1e3a8a')
                .font('Helvetica-Bold')
                .text(
                    `${new Date(startDate).toLocaleDateString('en-IN')} — ${new Date(endDate).toLocaleDateString('en-IN')}`,
                    70,
                    doc.y + 35
                );
        }

        doc.moveDown(4);

        // Calculate totals first
        let totalIncome = 0;
        let totalExpense = 0;
        transactions.forEach((txn) => {
            if (txn.type === 'income' || txn.type === 'credit_received') {
                totalIncome += txn.amount;
            } else {
                totalExpense += txn.amount;
            }
        });

        // Summary Cards
        const cardY = doc.y;
        const cardWidth = (doc.page.width - 150) / 3;

        // Total Expense Card
        doc.roundedRect(50, cardY, cardWidth, 70, 8)
            .fillAndStroke('#fee2e2', '#fca5a5');
        doc.fontSize(10)
            .fillColor('#991b1b')
            .font('Helvetica')
            .text('Total Expense', 60, cardY + 15, { width: cardWidth - 20 });
        doc.fontSize(18)
            .fillColor('#ef4444')
            .font('Helvetica-Bold')
            .text(`₹${totalExpense.toLocaleString('en-IN')}`, 60, cardY + 35, { width: cardWidth - 20 });

        // Total Income Card
        const incomeX = 60 + cardWidth;
        doc.roundedRect(incomeX, cardY, cardWidth, 70, 8)
            .fillAndStroke('#d1fae5', '#6ee7b7');
        doc.fontSize(10)
            .fillColor('#065f46')
            .font('Helvetica')
            .text('Total Income', incomeX + 10, cardY + 15, { width: cardWidth - 20 });
        doc.fontSize(18)
            .fillColor('#10b981')
            .font('Helvetica-Bold')
            .text(`₹${totalIncome.toLocaleString('en-IN')}`, incomeX + 10, cardY + 35, { width: cardWidth - 20 });

        // Net Balance Card
        const netX = incomeX + cardWidth;
        const netBalance = totalIncome - totalExpense;
        const isProfit = netBalance >= 0;
        doc.roundedRect(netX, cardY, cardWidth, 70, 8)
            .fillAndStroke(isProfit ? '#dbeafe' : '#fee2e2', isProfit ? '#93c5fd' : '#fca5a5');
        doc.fontSize(10)
            .fillColor(isProfit ? '#1e40af' : '#991b1b')
            .font('Helvetica')
            .text('Net Balance', netX + 10, cardY + 15, { width: cardWidth - 20 });
        doc.fontSize(18)
            .fillColor(isProfit ? '#3b82f6' : '#ef4444')
            .font('Helvetica-Bold')
            .text(`₹${netBalance.toLocaleString('en-IN')}`, netX + 10, cardY + 35, { width: cardWidth - 20 });

        doc.y = cardY + 90;
        doc.moveDown(2);

        // Transactions Section Header
        doc.fontSize(16)
            .fillColor('#1e293b')
            .font('Helvetica-Bold')
            .text('Transaction Details', 50, doc.y);

        doc.moveDown(1.5);

        // Table Header with Background
        const tableTop = doc.y;
        doc.rect(50, tableTop, doc.page.width - 100, 25).fillAndStroke('#f1f5f9', '#cbd5e1');

        doc.fontSize(9)
            .fillColor('#334155')
            .font('Helvetica-Bold');

        doc.text('Date', 60, tableTop + 8, { width: 70 });
        doc.text('Type', 135, tableTop + 8, { width: 60 });
        doc.text('Category', 200, tableTop + 8, { width: 85 });
        doc.text('Amount', 290, tableTop + 8, { width: 70, align: 'right' });
        doc.text('Mode', 385, tableTop + 8, { width: 70 });
        doc.text('Vendor', 460, tableTop + 8, { width: 75 });

        let y = tableTop + 35;

        // Transaction Rows
        transactions.forEach((txn, index) => {
            if (y > 700) {
                doc.addPage();
                y = 50;

                // Repeat header on new page
                doc.rect(50, y, doc.page.width - 100, 25).fillAndStroke('#f1f5f9', '#cbd5e1');
                doc.fontSize(9)
                    .fillColor('#334155')
                    .font('Helvetica-Bold');
                doc.text('Date', 60, y + 8, { width: 70 });
                doc.text('Type', 135, y + 8, { width: 60 });
                doc.text('Category', 200, y + 8, { width: 85 });
                doc.text('Amount', 290, y + 8, { width: 70, align: 'right' });
                doc.text('Mode', 385, y + 8, { width: 70 });
                doc.text('Vendor', 460, y + 8, { width: 75 });
                y += 30;
            }

            // Alternate row background
            if (index % 2 === 0) {
                doc.rect(50, y - 5, doc.page.width - 100, 22).fillAndStroke('#f8fafc', '#f8fafc');
            }

            const isIncome = txn.type === 'income' || txn.type === 'credit_received';

            doc.fontSize(8)
                .fillColor('#475569')
                .font('Helvetica');

            doc.text(new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }), 60, y, { width: 70 });

            // Type with color coding
            doc.fillColor(isIncome ? '#10b981' : '#ef4444')
                .font('Helvetica-Bold')
                .text(txn.type.charAt(0).toUpperCase() + txn.type.slice(1), 135, y, { width: 60 });

            doc.fillColor('#475569')
                .font('Helvetica')
                .text(txn.category, 200, y, { width: 85 });

            // Amount with color coding
            doc.fillColor(isIncome ? '#10b981' : '#ef4444')
                .font('Helvetica-Bold')
                .text(`₹${txn.amount.toLocaleString('en-IN')}`, 290, y, { width: 70, align: 'right' });

            doc.fillColor('#475569')
                .font('Helvetica')
                .text(txn.paymentMode || '-', 385, y, { width: 70 });
            doc.text(txn.vendor || '-', 460, y, { width: 75 });

            y += 22;
        });

        // Footer with page numbers
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8)
                .fillColor('#94a3b8')
                .font('Helvetica')
                .text(
                    `Page ${i + 1} of ${range.count} | Generated on ${new Date().toLocaleDateString('en-IN')}`,
                    50,
                    doc.page.height - 30,
                    { align: 'center', width: doc.page.width - 100 }
                );
        }

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Export to Excel
// @route   GET /api/reports/export/excel
// @access  Private
export const exportToExcel = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const query = { user: req.user._id };
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(query).sort({ date: 1 });

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'ShreeKhata';
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet('Transactions', {
            properties: { tabColor: { argb: 'FF6366F1' } },
            views: [{ state: 'frozen', ySplit: 3 }]
        });

        // Title Row
        worksheet.mergeCells('A1:H1');
        const titleCell = worksheet.getCell('A1');
        titleCell.value = 'ShreeKhata - Financial Report';
        titleCell.font = { name: 'Calibri', size: 20, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF6366F1' }
        };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.getRow(1).height = 35;

        // Period Row
        if (startDate && endDate) {
            worksheet.mergeCells('A2:H2');
            const periodCell = worksheet.getCell('A2');
            periodCell.value = `Period: ${new Date(startDate).toLocaleDateString('en-IN')} — ${new Date(endDate).toLocaleDateString('en-IN')}`;
            periodCell.font = { name: 'Calibri', size: 11, color: { argb: 'FF1E40AF' } };
            periodCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFF0F9FF' }
            };
            periodCell.alignment = { vertical: 'middle', horizontal: 'center' };
            worksheet.getRow(2).height = 25;
        }

        // Empty row for spacing
        worksheet.addRow([]);

        // Column headers
        const headerRow = worksheet.addRow([
            'Date',
            'Type',
            'Category',
            'Amount',
            'Payment Mode',
            'Vendor',
            'Notes',
            'Balance'
        ]);

        // Style header row with gradient
        headerRow.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'gradient',
            gradient: 'angle',
            degree: 90,
            stops: [
                { position: 0, color: { argb: 'FF6366F1' } },
                { position: 1, color: { argb: 'FF8B5CF6' } }
            ]
        };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;

        // Set column widths
        worksheet.columns = [
            { key: 'date', width: 15 },
            { key: 'type', width: 12 },
            { key: 'category', width: 18 },
            { key: 'amount', width: 15 },
            { key: 'paymentMode', width: 15 },
            { key: 'vendor', width: 22 },
            { key: 'notes', width: 35 },
            { key: 'balance', width: 15 }
        ];

        // Add transactions with styling
        let totalIncome = 0;
        let totalExpense = 0;
        let rowIndex = 5; // Starting after header

        transactions.forEach((txn, index) => {
            const isIncome = txn.type === 'income' || txn.type === 'credit_received';

            const row = worksheet.addRow({
                date: new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                type: txn.type.charAt(0).toUpperCase() + txn.type.slice(1),
                category: txn.category,
                amount: txn.amount,
                paymentMode: txn.paymentMode || '-',
                vendor: txn.vendor || '-',
                notes: txn.notes || '-',
                balance: txn.balance
            });

            // Alternate row coloring
            if (index % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF8FAFC' }
                };
            }

            // Style type column with color
            const typeCell = row.getCell(2);
            typeCell.font = {
                bold: true,
                color: { argb: isIncome ? 'FF10B981' : 'FFEF4444' }
            };

            // Style amount column with color and number format
            const amountCell = row.getCell(4);
            amountCell.font = {
                bold: true,
                color: { argb: isIncome ? 'FF10B981' : 'FFEF4444' }
            };
            amountCell.numFmt = '₹#,##0.00';
            amountCell.alignment = { horizontal: 'right' };

            // Style balance column
            const balanceCell = row.getCell(8);
            balanceCell.numFmt = '₹#,##0.00';
            balanceCell.alignment = { horizontal: 'right' };

            // Center align date and payment mode
            row.getCell(1).alignment = { horizontal: 'center' };
            row.getCell(5).alignment = { horizontal: 'center' };

            if (isIncome) {
                totalIncome += txn.amount;
            } else {
                totalExpense += txn.amount;
            }

            rowIndex++;
        });

        // Add empty rows for spacing
        worksheet.addRow([]);
        worksheet.addRow([]);

        // Summary Section Header
        const summaryHeaderRow = worksheet.addRow(['', '', '', '', '', 'FINANCIAL SUMMARY', '', '']);
        worksheet.mergeCells(`F${summaryHeaderRow.number}:H${summaryHeaderRow.number}`);
        const summaryHeaderCell = worksheet.getCell(`F${summaryHeaderRow.number}`);
        summaryHeaderCell.font = { name: 'Calibri', size: 14, bold: true, color: { argb: 'FF1E293B' } };
        summaryHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
        summaryHeaderCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE2E8F0' }
        };
        summaryHeaderRow.height = 30;

        // Total Income Row
        const incomeRow = worksheet.addRow(['', '', '', '', '', 'Total Income:', totalIncome, '']);
        const incomeLabelCell = incomeRow.getCell(6);
        incomeLabelCell.font = { bold: true, size: 11 };
        incomeLabelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD1FAE5' }
        };
        const incomeValueCell = incomeRow.getCell(7);
        incomeValueCell.font = { bold: true, size: 12, color: { argb: 'FF10B981' } };
        incomeValueCell.numFmt = '₹#,##0.00';
        incomeValueCell.alignment = { horizontal: 'right' };
        incomeValueCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD1FAE5' }
        };

        // Total Expense Row
        const expenseRow = worksheet.addRow(['', '', '', '', '', 'Total Expense:', totalExpense, '']);
        const expenseLabelCell = expenseRow.getCell(6);
        expenseLabelCell.font = { bold: true, size: 11 };
        expenseLabelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEE2E2' }
        };
        const expenseValueCell = expenseRow.getCell(7);
        expenseValueCell.font = { bold: true, size: 12, color: { argb: 'FFEF4444' } };
        expenseValueCell.numFmt = '₹#,##0.00';
        expenseValueCell.alignment = { horizontal: 'right' };
        expenseValueCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFEE2E2' }
        };

        // Net Balance Row
        const netBalance = totalIncome - totalExpense;
        const isProfit = netBalance >= 0;
        const netRow = worksheet.addRow(['', '', '', '', '', 'Net Balance:', netBalance, '']);
        const netLabelCell = netRow.getCell(6);
        netLabelCell.font = { bold: true, size: 12 };
        netLabelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: isProfit ? 'FFDBEAFE' : 'FFFEE2E2' }
        };
        const netValueCell = netRow.getCell(7);
        netValueCell.font = {
            bold: true,
            size: 14,
            color: { argb: isProfit ? 'FF3B82F6' : 'FFEF4444' }
        };
        netValueCell.numFmt = '₹#,##0.00';
        netValueCell.alignment = { horizontal: 'right' };
        netValueCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: isProfit ? 'FFDBEAFE' : 'FFFEE2E2' }
        };
        netRow.height = 25;

        // Add border to all cells with data
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 3) { // Skip title and period rows
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
                        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
                    };
                });
            }
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=shreekhata-report.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
