package com.fsad.opm.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.xhtmlrenderer.pdf.ITextRenderer;
import java.io.ByteArrayOutputStream;
import com.fsad.opm.dto.ReportResponse;


@Service
@RequiredArgsConstructor
public class ReportPdfService {

    private final SpringTemplateEngine templateEngine;

    public byte[] generatePdfFromReport(ReportResponse reportResponse) {
        Context context = new Context();
        context.setVariable("report", reportResponse);

        String htmlContent = templateEngine.process("report-template", context);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(htmlContent);
            renderer.layout();
            renderer.createPDF(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }
}
