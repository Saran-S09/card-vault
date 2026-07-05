import jsPDF from "jspdf";

// Helper to convert SVG Data URI or any image to standard PNG Base64
// to prevent jsPDF addImage parsing crashes.
const convertImageToPngBase64 = (imgUrl) => {
  return new Promise((resolve) => {
    // If it's already a standard Base64 JPEG/PNG, we can use it directly
    if (imgUrl.startsWith("data:image/jpeg") || imgUrl.startsWith("data:image/png")) {
      resolve(imgUrl);
      return;
    }

    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // Use standard high-definition dimensions for crisp PDF rendering
      canvas.width = 800;
      canvas.height = 500;
      const ctx = canvas.getContext("2d");
      
      // Fill canvas background with white to avoid transparent PNG black artifacts in PDFs
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => {
      resolve(imgUrl); // Return fallback
    };
  });
};

export const downloadPdf = async (card) => {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // 1. Draw outer double borders (like certificates/formal files)
    pdf.setDrawColor(30, 41, 59); // Dark slate
    pdf.setLineWidth(0.8);
    pdf.rect(8, 8, pageWidth - 16, pageHeight - 16);
    pdf.setDrawColor(71, 85, 105); // Lighter slate
    pdf.setLineWidth(0.2);
    pdf.rect(9.5, 9.5, pageWidth - 19, pageHeight - 19);

    // 2. Draw Brand Header Bar
    pdf.setFillColor(15, 23, 42); // Deep navy blue
    pdf.rect(10, 10, pageWidth - 20, 26, "F");

    // Brand Title text in header
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("CARD VAULT SECURE ARCHIVE", 16, 21);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(148, 163, 184); // Muted slate text
    pdf.text("OFFLINE DIGITAL DOCUMENT SAFE COPY", 16, 28);

    // Verified Seal on the right of the header
    pdf.setFillColor(16, 185, 129); // Emerald green
    pdf.rect(pageWidth - 48, 15, 32, 16);
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.text("VERIFIED SAFE", pageWidth - 44, 21);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.text("BROWSER ENCRYPTED", pageWidth - 44, 25);
    pdf.text("100% OFFLINE DATA", pageWidth - 44, 28);

    // 3. Document Details Box
    pdf.setFillColor(248, 250, 252); // slate-50 light background
    pdf.rect(14, 46, pageWidth - 28, 50, "F");
    pdf.setDrawColor(203, 213, 225); // slate-300 borders
    pdf.setLineWidth(0.3);
    pdf.rect(14, 46, pageWidth - 28, 50);

    pdf.setTextColor(15, 23, 42); // slate-900

    // Metadata items layout
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Document Title:", 20, 56);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(card.title, 56, 56);

    pdf.setFont("helvetica", "bold");
    pdf.text("Vault Number:", 20, 64);
    pdf.setFont("helvetica", "normal");
    pdf.text(card.number, 56, 64);

    pdf.setFont("helvetica", "bold");
    pdf.text("Category:", 20, 72);
    pdf.setFont("helvetica", "normal");
    const categoryLabel = card.category ? card.category.toUpperCase() : "OTHER";
    pdf.text(categoryLabel, 56, 72);

    pdf.setFont("helvetica", "bold");
    pdf.text("Exported On:", 20, 80);
    pdf.setFont("helvetica", "normal");
    pdf.text(new Date().toLocaleString(), 56, 80);

    pdf.setFont("helvetica", "bold");
    pdf.text("Vault Remarks:", 20, 88);
    pdf.setFont("helvetica", "normal");
    const notesContent = card.notes || "No secure remarks attached to this item copy.";
    const splitNotes = pdf.splitTextToSize(notesContent, pageWidth - 80);
    pdf.text(splitNotes, 56, 88);

    // 4. Card Copy Image
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(15, 23, 42);
    pdf.text("DOCUMENT IMAGE ATTACHMENT", 14, 108);

    // Draw card background placeholder
    pdf.setFillColor(241, 245, 249); // slate-100
    pdf.rect(14, 114, pageWidth - 28, 110, "F");
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(14, 114, pageWidth - 28, 110);

    // Convert SVG/Image to PNG to add
    const pngImage = await convertImageToPngBase64(card.image);

    // Fit image inside placeholder nicely with 5mm padding
    const targetWidth = pageWidth - 38; // 172mm
    const targetHeight = 100; // 100mm
    pdf.addImage(pngImage, "PNG", 19, 119, targetWidth, targetHeight);

    // 5. Security stamp footer disclaimer
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.4);
    pdf.line(14, pageHeight - 24, pageWidth - 14, pageHeight - 24);

    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(7.5);
    pdf.setTextColor(100, 116, 139); // slate-500
    
    const disclaimerText = [
      "Disclaimer: This document is an offline digital locker printout generated from Card Vault.",
      "All image assets and metadata coordinates are encrypted and saved strictly inside the user's browser sandbox.",
      "The service works 100% offline, keeping your personal credentials, driving codes, and identification records strictly safe."
    ];
    pdf.text(disclaimerText[0], 14, pageHeight - 18);
    pdf.text(disclaimerText[1], 14, pageHeight - 14);
    pdf.text(disclaimerText[2], 14, pageHeight - 10);

    // Save PDF file named securely
    const secureFileName = `${card.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_secure_copy.pdf`;
    pdf.save(secureFileName);
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("An error occurred during PDF creation. Please try again.");
  }
};