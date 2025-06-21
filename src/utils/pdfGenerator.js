import jsPDF from 'jspdf';

// PDF Generator for reports and certificates
class PDFGenerator {
  constructor() {
    this.defaultOptions = {
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    };
  }

  // Generate vault backup report
  generateVaultReport(vaultItems, userInfo) {
    const doc = new jsPDF(this.defaultOptions);
    
    // Header
    this.addHeader(doc, 'SentriVault - Vault Backup Report');
    
    // User info
    let yPosition = 40;
    doc.setFontSize(12);
    doc.text(`Generated for: ${userInfo.name}`, 20, yPosition);
    doc.text(`Email: ${userInfo.email}`, 20, yPosition + 7);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 14);
    doc.text(`Total Items: ${vaultItems.length}`, 20, yPosition + 21);
    
    // Items by type
    yPosition += 35;
    const itemsByType = this.groupItemsByType(vaultItems);
    
    doc.setFontSize(14);
    doc.text('Items by Category:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    Object.entries(itemsByType).forEach(([type, items]) => {
      doc.text(`${this.capitalizeFirst(type)}: ${items.length} items`, 25, yPosition);
      yPosition += 5;
    });
    
    // Security notice
    yPosition += 15;
    doc.setFontSize(12);
    doc.setTextColor(255, 0, 0);
    doc.text('SECURITY NOTICE:', 20, yPosition);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    yPosition += 7;
    doc.text('This report contains sensitive information. Store securely and delete after use.', 20, yPosition);
    doc.text('Passwords and sensitive data are not included in this report for security.', 20, yPosition + 5);
    
    // Footer
    this.addFooter(doc);
    
    return doc;
  }

  // Generate security report
  generateSecurityReport(securityData, userInfo) {
    const doc = new jsPDF(this.defaultOptions);
    
    // Header
    this.addHeader(doc, 'SentriVault - Security Report');
    
    let yPosition = 40;
    
    // User info
    doc.setFontSize(12);
    doc.text(`Security Report for: ${userInfo.name}`, 20, yPosition);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 7);
    yPosition += 20;
    
    // Security alerts
    doc.setFontSize(14);
    doc.text('Security Alerts Summary:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Alerts: ${securityData.alerts.length}`, 25, yPosition);
    doc.text(`Unresolved: ${securityData.alerts.filter(a => !a.resolved).length}`, 25, yPosition + 5);
    doc.text(`Critical: ${securityData.alerts.filter(a => a.severity === 'critical').length}`, 25, yPosition + 10);
    yPosition += 20;
    
    // Recent activities
    doc.setFontSize(14);
    doc.text('Recent Activities:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    securityData.activities.slice(0, 10).forEach(activity => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${new Date(activity.timestamp).toLocaleDateString()}: ${activity.details}`, 25, yPosition);
      yPosition += 5;
    });
    
    // Footer
    this.addFooter(doc);
    
    return doc;
  }

  // Generate verification certificate
  generateVerificationCertificate(verificationData) {
    const doc = new jsPDF(this.defaultOptions);
    
    // Certificate border
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 277);
    doc.setLineWidth(1);
    doc.rect(15, 15, 180, 267);
    
    // Header
    doc.setFontSize(24);
    doc.setTextColor(0, 100, 0);
    doc.text('VERIFICATION CERTIFICATE', 105, 40, { align: 'center' });
    
    // Logo area (text-based)
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('SentriVault', 105, 55, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Blockchain-Backed Verification System', 105, 62, { align: 'center' });
    
    // Certificate content
    let yPosition = 80;
    doc.setFontSize(12);
    doc.text('This certifies that the document with the following details', 105, yPosition, { align: 'center' });
    doc.text('has been verified using our blockchain verification system:', 105, yPosition + 7, { align: 'center' });
    
    yPosition += 25;
    
    // Verification details
    const details = [
      ['Verification ID:', verificationData.verificationId],
      ['Document Hash:', verificationData.hash.substring(0, 32) + '...'],
      ['Verification Date:', new Date(verificationData.timestamp).toLocaleDateString()],
      ['Authenticity Status:', verificationData.isAuthentic ? 'VERIFIED' : 'QUESTIONABLE'],
      ['Confidence Score:', `${verificationData.confidence}%`]
    ];
    
    details.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 30, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(value, 80, yPosition);
      yPosition += 10;
    });
    
    // Status indicator
    yPosition += 10;
    if (verificationData.isAuthentic) {
      doc.setTextColor(0, 150, 0);
      doc.setFontSize(16);
      doc.text('✓ DOCUMENT VERIFIED', 105, yPosition, { align: 'center' });
    } else {
      doc.setTextColor(200, 100, 0);
      doc.setFontSize(16);
      doc.text('⚠ VERIFICATION CONCERNS', 105, yPosition, { align: 'center' });
    }
    
    // Issues (if any)
    if (verificationData.issues && verificationData.issues.length > 0) {
      yPosition += 20;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.text('Issues Detected:', 30, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      verificationData.issues.forEach(issue => {
        doc.text(`• ${issue}`, 35, yPosition);
        yPosition += 5;
      });
    }
    
    // Certificate footer
    yPosition = 250;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('This certificate is generated by SentriVault verification system.', 105, yPosition, { align: 'center' });
    doc.text('For verification, visit: https://sentrivault.com/verify', 105, yPosition + 7, { align: 'center' });
    doc.text(`Certificate ID: ${verificationData.verificationId}`, 105, yPosition + 14, { align: 'center' });
    
    return doc;
  }

  // Generate privacy request report
  generatePrivacyReport(requests, userInfo) {
    const doc = new jsPDF(this.defaultOptions);
    
    // Header
    this.addHeader(doc, 'SentriVault - Privacy Requests Report');
    
    let yPosition = 40;
    
    // User info
    doc.setFontSize(12);
    doc.text(`Privacy Report for: ${userInfo.name}`, 20, yPosition);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition + 7);
    yPosition += 20;
    
    // Summary
    doc.setFontSize(14);
    doc.text('Privacy Requests Summary:', 20, yPosition);
    yPosition += 10;
    
    doc.setFontSize(10);
    doc.text(`Total Requests: ${requests.length}`, 25, yPosition);
    doc.text(`Completed: ${requests.filter(r => r.status === 'completed').length}`, 25, yPosition + 5);
    doc.text(`Pending: ${requests.filter(r => r.status === 'pending').length}`, 25, yPosition + 10);
    doc.text(`In Progress: ${requests.filter(r => r.status === 'in_progress').length}`, 25, yPosition + 15);
    yPosition += 25;
    
    // Request details
    doc.setFontSize(14);
    doc.text('Request Details:', 20, yPosition);
    yPosition += 10;
    
    requests.forEach((request, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${request.company}`, 25, yPosition);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(10);
      
      yPosition += 7;
      doc.text(`Type: ${this.getRequestTypeLabel(request.type)}`, 30, yPosition);
      yPosition += 5;
      doc.text(`Status: ${request.status.toUpperCase()}`, 30, yPosition);
      yPosition += 5;
      doc.text(`Submitted: ${new Date(request.submittedDate).toLocaleDateString()}`, 30, yPosition);
      
      if (request.responseDate) {
        yPosition += 5;
        doc.text(`Responded: ${new Date(request.responseDate).toLocaleDateString()}`, 30, yPosition);
      }
      
      yPosition += 5;
      doc.text(`Description: ${request.description}`, 30, yPosition);
      yPosition += 10;
    });
    
    // Footer
    this.addFooter(doc);
    
    return doc;
  }

  // Helper methods
  addHeader(doc, title) {
    // Logo area
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('SentriVault', 20, 20);
    
    // Title
    doc.setFontSize(16);
    doc.text(title, 20, 30);
    
    // Line
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
  }

  addFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
      doc.text('Generated by SentriVault - Secure Digital Privacy Platform', 105, 290, { align: 'center' });
    }
  }

  groupItemsByType(items) {
    return items.reduce((groups, item) => {
      const type = item.type || 'other';
      if (!groups[type]) groups[type] = [];
      groups[type].push(item);
      return groups;
    }, {});
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  getRequestTypeLabel(type) {
    const labels = {
      access: 'Data Access Request',
      delete: 'Data Deletion Request',
      portability: 'Data Portability Request',
      rectification: 'Data Correction Request'
    };
    return labels[type] || type;
  }

  // Save PDF
  savePDF(doc, filename) {
    doc.save(filename);
  }

  // Get PDF as blob
  getPDFBlob(doc) {
    return doc.output('blob');
  }

  // Get PDF as data URL
  getPDFDataURL(doc) {
    return doc.output('dataurlstring');
  }
}

// Create singleton instance
const pdfGenerator = new PDFGenerator();

// Export functions
export const generateVaultReport = (vaultItems, userInfo) => 
  pdfGenerator.generateVaultReport(vaultItems, userInfo);

export const generateSecurityReport = (securityData, userInfo) => 
  pdfGenerator.generateSecurityReport(securityData, userInfo);

export const generateVerificationCertificate = (verificationData) => 
  pdfGenerator.generateVerificationCertificate(verificationData);

export const generatePrivacyReport = (requests, userInfo) => 
  pdfGenerator.generatePrivacyReport(requests, userInfo);

export const savePDF = (doc, filename) => pdfGenerator.savePDF(doc, filename);

export const getPDFBlob = (doc) => pdfGenerator.getPDFBlob(doc);

export const getPDFDataURL = (doc) => pdfGenerator.getPDFDataURL(doc);

export default pdfGenerator;