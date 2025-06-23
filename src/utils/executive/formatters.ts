
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  } else {
    return `$${amount.toLocaleString()}`;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'on_track': return 'text-green-600 bg-green-100';
    case 'at_risk': return 'text-yellow-600 bg-yellow-100';
    case 'delayed': return 'text-red-600 bg-red-100';
    case 'completed': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'low': return 'text-gray-600 bg-gray-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'high': return 'text-orange-600 bg-orange-100';
    case 'critical': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}
