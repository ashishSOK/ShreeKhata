export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getTransactionTypeColor = (type) => {
    const colors = {
        expense: '#ef4444',
        purchase: '#f59e0b',
        income: '#10b981',
        credit_given: '#ec4899',
        credit_received: '#3b82f6',
    };
    return colors[type] || '#64748b';
};

export const getPaymentModeIcon = (mode) => {
    const icons = {
        cash: '💵',
        upi: '📱',
        bank: '🏦',
        card: '💳',
    };
    return icons[mode] || '💰';
};

export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};
