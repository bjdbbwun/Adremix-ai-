import os
from pathlib import Path
from models.schemas import FullCampaignResult

# Import ReportLab flowables and styles
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Custom canvas to compute total page count and add professional footers/headers."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        
        # Color codes
        primary_color = colors.HexColor("#0f172a") # Slate 900
        accent_color = colors.HexColor("#10b981")  # Emerald 500
        border_color = colors.HexColor("#e2e8f0")  # Slate 200
        
        # Page dimensions
        width, height = letter
        
        # Header - Draw on all pages except cover/first page
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(primary_color)
            self.drawString(54, height - 36, "ADREMIX AI - MARKETING COMPLIANCE & INTELLIGENCE REPORT")
            self.setStrokeColor(border_color)
            self.setLineWidth(0.5)
            self.line(54, height - 42, width - 54, height - 42)
            
        # Footer - Draw on all pages
        self.setStrokeColor(border_color)
        self.setLineWidth(0.5)
        self.line(54, 50, width - 54, 50)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b")) # Slate 500
        self.drawString(54, 36, "CONFIDENTIAL - FOR INTERNAL MARKETING USE ONLY")
        
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(width - 54, 36, page_str)
        
        self.restoreState()


def generate_report_pdf(data: FullCampaignResult, output_path: str) -> str:
    """
    Generates a beautifully typeset PDF report from a FullCampaignResult using ReportLab.
    """
    pdf_dir = Path(output_path).parent
    pdf_dir.mkdir(parents=True, exist_ok=True)
    
    # Page setup
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=72
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    c_primary = colors.HexColor("#0f172a")   # Slate 900
    c_secondary = colors.HexColor("#1e293b") # Slate 800
    c_accent = colors.HexColor("#10b981")    # Emerald 500
    c_amber = colors.HexColor("#f59e0b")     # Amber 500
    c_body = colors.HexColor("#334155")      # Slate 700
    c_bg_light = colors.HexColor("#f8fafc")  # Slate 50
    c_border = colors.HexColor("#e2e8f0")    # Slate 200

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.white,
        spaceAfter=10,
        alignment=0
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#94a3b8"), # Slate 400
        spaceAfter=15,
        alignment=0
    )
    
    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=20,
        textColor=c_primary,
        spaceBefore=18,
        spaceAfter=8,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=c_secondary,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=c_body,
        spaceAfter=6
    )
    
    body_bold = ParagraphStyle(
        'BodyBoldCustom',
        parent=body_style,
        fontName='Helvetica-Bold',
        textColor=c_primary
    )
    
    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.white,
        alignment=0
    )
    
    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=c_body
    )
    
    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold',
        textColor=c_primary
    )

    story = []

    # ==========================================
    # 1. Header Banner / Cover Section
    # ==========================================
    header_content = [
        [Paragraph("ADREMIX AI campaign audit", title_style)],
        [Paragraph(f"Product: {data.product_name} | Target: {getattr(data, 'target_audience', 'عام')} | Channel: {data.platform}", subtitle_style)]
    ]
    header_table = Table(header_content, colWidths=[doc.width])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_primary),
        ('PADDING', (0,0), (-1,-1), 18),
        ('BOTTOMPADDING', (0,1), (-1,1), 22),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))

    # ==========================================
    # 2. Executive Scorecard Panel
    # ==========================================
    scorecard_data = [
        [
            Paragraph("<b>Diagnostic Score</b>", body_style),
            Paragraph("<b>Success Probability</b>", body_style),
            Paragraph("<b>Overall Score</b>", body_style)
        ],
        [
            Paragraph(f"<font size=20 color='#10b981'><b>{data.diagnosis.total_score}</b></font>/50", body_style),
            Paragraph(f"<font size=20 color='#10b981'><b>{data.prediction.success_probability}</b></font>", body_style),
            Paragraph(f"<font size=20 color='#f59e0b'><b>{data.prediction.overall_score}</b></font>/100", body_style)
        ]
    ]
    scorecard_table = Table(scorecard_data, colWidths=[doc.width/3.0]*3)
    scorecard_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
    ]))
    story.append(scorecard_table)
    story.append(Spacer(1, 15))

    # ==========================================
    # 3. Ad Doctor (Diagnostic Report)
    # ==========================================
    story.append(Paragraph("1. Microscopic Creative Audit (Ad Doctor)", h1_style))
    story.append(Paragraph(f"<b>Final Verdict:</b> {data.diagnosis.final_verdict}", body_style))
    
    # Priority Fix box
    prio_data = [[
        Paragraph("<font color='#f59e0b'><b>CRITICAL PRIORITY ACTION REQUIRED:</b></font>", body_style),
        Paragraph(data.diagnosis.top_priority_fix, body_style)
    ]]
    prio_table = Table(prio_data, colWidths=[160, doc.width - 170])
    prio_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#fffbeb")), # Warm Amber background
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#fef3c7")),
        ('PADDING', (0,0), (-1,-1), 10),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(prio_table)
    story.append(Spacer(1, 10))

    # Doctor metrics table
    doctor_table_data = [
        [
            Paragraph("Audit Dimension", table_header_style),
            Paragraph("Score", table_header_style),
            Paragraph("Diagnosis", table_header_style),
            Paragraph("Prescription", table_header_style)
        ]
    ]
    
    dimensions = [
        ("Hook Quality", data.diagnosis.hook),
        ("Value Clarity", data.diagnosis.value_clarity),
        ("Emotional Pull", data.diagnosis.emotional_pull),
        ("Platform Fit", data.diagnosis.platform_fit),
        ("CTA Strength", data.diagnosis.cta_power)
    ]
    
    for name, metric in dimensions:
        score_val = metric.get('score', 0)
        score_text = f"<b>{score_val}</b>/10"
        if score_val >= 8:
            score_text = f"<font color='#10b981'><b>{score_val}</b></font>/10"
        elif score_val <= 5:
            score_text = f"<font color='#ef4444'><b>{score_val}</b></font>/10"

        doctor_table_data.append([
            Paragraph(name, table_cell_bold),
            Paragraph(score_text, table_cell_style),
            Paragraph(metric.get('diagnosis', ''), table_cell_style),
            Paragraph(metric.get('prescription', ''), table_cell_style)
        ])
        
    doctor_table = Table(doctor_table_data, colWidths=[90, 45, 175, 194])
    doctor_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), c_secondary),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, c_bg_light]),
    ]))
    story.append(doctor_table)
    story.append(Spacer(1, 15))

    # ==========================================
    # 4. Strategic Gap Analysis Section
    # ==========================================
    story.append(PageBreak()) # Clean break to keep gap analysis structured
    story.append(Paragraph("2. Competitive Creative Gap Analysis", h1_style))
    story.append(Paragraph(f"<b>Top Recommendation:</b> {data.gap_analysis.top_recommendation}", body_style))
    story.append(Paragraph(f"<b>Strategic Reason:</b> {data.gap_analysis.reason}", body_style))
    
    # Fatigue scale
    fatigue_bar = "■ " * data.gap_analysis.fatigue_level + "□ " * (10 - data.gap_analysis.fatigue_level)
    story.append(Paragraph(f"<b>Market Angle Fatigue Level:</b> <font color='#ef4444'><b>{data.gap_analysis.fatigue_level}/10</b></font> ({fatigue_bar})", body_style))
    story.append(Spacer(1, 10))

    # Overused and Unused Angles
    grid_data = [
        [
            Paragraph("<b>Saturated Angles (Competitor Over-use)</b>", h2_style),
            Paragraph("<b>Blue Ocean Gaps (Untapped Creative Fields)</b>", h2_style)
        ],
        [
            Paragraph("<br/>".join([f"• {angle}" for angle in data.gap_analysis.typical_angles]), body_style),
            Table(
                [[Paragraph(f"<b>{ang.get('angle', '')}:</b> {ang.get('why_unused', ang.get('whyUnused', ''))}", table_cell_style)] for ang in data.gap_analysis.unused_angles],
                colWidths=[240],
                style=[
                    ('BOX', (0,0), (-1,-1), 0.5, c_border),
                    ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
                    ('PADDING', (0,0), (-1,-1), 5),
                ]
            )
        ]
    ]
    grid_table = Table(grid_data, colWidths=[240, 260])
    grid_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (0,-1), 15),
    ]))
    story.append(grid_table)
    story.append(Spacer(1, 12))

    # Contrarian Angle Callout
    contrarian_content = [
        [Paragraph("<b>BOLD CONTRARIAN ATTACK VECTOR:</b>", body_bold)],
        [Paragraph(f"<b>Angle:</b> {data.gap_analysis.contrarian_angle.get('angle', '')}", body_style)],
        [Paragraph(f"<b>Risk Profile:</b> {data.gap_analysis.contrarian_angle.get('risk_level', data.gap_analysis.contrarian_angle.get('riskLevel', ''))} | <b>Potential Return:</b> {data.gap_analysis.contrarian_angle.get('potential_reward', data.gap_analysis.contrarian_angle.get('potentialReward', ''))}", body_style)]
    ]
    contrarian_table = Table(contrarian_content, colWidths=[doc.width])
    contrarian_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#faf5ff")), # Purple background
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#f3e8ff")),
        ('PADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(contrarian_table)
    story.append(Spacer(1, 15))

    # ==========================================
    # 5. Performance Forecasting (Predictor)
    # ==========================================
    story.append(Paragraph("3. Programmatic Performance Simulation & Forecast", h1_style))
    story.append(Paragraph(f"<b>Engine Recommendation:</b> {data.prediction.recommendation}", body_style))
    
    forecast_data = [
        [
            Paragraph("Reach & Virality", h2_style),
            Paragraph("Interaction Estimates", h2_style),
            Paragraph("ROI / Direct Purchase", h2_style)
        ],
        [
            Paragraph(
                f"<b>Estimated Reach:</b><br/>{data.prediction.reach.get('estimated_reach', data.prediction.reach.get('estimatedReach', ''))}<br/><br/>"
                f"<b>Virality Score:</b><br/>{data.prediction.reach.get('viral_potential', data.prediction.reach.get('viralPotential', 0))}/10<br/><br/>"
                f"<b>Virality Rationale:</b><br/>{data.prediction.reach.get('reason_for_viral_score', data.prediction.reach.get('reasonForViralScore', ''))}",
                body_style
            ),
            Paragraph(
                f"<b>Engagement Rate:</b> {data.prediction.engagement.get('estimated_engagement_rate', data.prediction.engagement.get('estimatedEngagementRate', ''))}<br/><br/>"
                f"<b>Likes Estimate:</b> {data.prediction.engagement.get('likes_estimate', data.prediction.engagement.get('likesEstimate', ''))}<br/>"
                f"<b>Shares Estimate:</b> {data.prediction.engagement.get('shares_estimate', data.prediction.engagement.get('sharesEstimate', ''))}<br/>"
                f"<b>Comments Estimate:</b> {data.prediction.engagement.get('comments_estimate', data.prediction.engagement.get('commentsEstimate', ''))}<br/>"
                f"<b>Saves Estimate:</b> {data.prediction.engagement.get('saves_estimate', data.prediction.engagement.get('savesEstimate', ''))}",
                body_style
            ),
            Paragraph(
                f"<b>Projected CTR:</b> {data.prediction.sales.get('estimated_ctr', data.prediction.sales.get('estimatedCTR', ''))}<br/><br/>"
                f"<b>Direct Purchase Rate:</b> {data.prediction.sales.get('estimated_conversion_rate', data.prediction.sales.get('estimatedConversionRate', ''))}<br/><br/>"
                f"<b>ROI / Sales Value:</b><br/><font color='#10b981'><b>{data.prediction.sales.get('estimated_sales_value', data.prediction.sales.get('estimatedSalesValue', ''))}</b></font>",
                body_style
            )
        ]
    ]
    forecast_table = Table(forecast_data, colWidths=[168, 168, 168])
    forecast_table.setStyle(TableStyle([
        ('BACKGROUND', (0,1), (-1,-1), c_bg_light),
        ('BOX', (0,1), (-1,-1), 1, c_border),
        ('INNERGRID', (0,1), (-1,-1), 0.5, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(forecast_table)
    story.append(Spacer(1, 12))

    # Strongest vs Weakest Element Summary
    elements_data = [
        [
            Paragraph("<b>Strongest Accelerator (+)</b>", body_style),
            Paragraph("<b>Main Friction Element (-)</b>", body_style)
        ],
        [
            Paragraph(f"<font color='#10b981'><b>{data.prediction.strongest_element}</b></font>", body_style),
            Paragraph(f"<font color='#ef4444'><b>{data.prediction.weakest_element}</b></font>", body_style)
        ]
    ]
    elements_table = Table(elements_data, colWidths=[doc.width/2.0]*2)
    elements_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
        ('BOX', (0,0), (-1,-1), 1, c_border),
        ('PADDING', (0,0), (-1,-1), 8),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(elements_table)

    # ==========================================
    # 6. AI-Generated High-Converting Ad Copy Options
    # ==========================================
    if getattr(data, 'generated_ads', None):
        story.append(PageBreak())
        story.append(Paragraph("4. AI-Generated High-Converting Ad Copy Options", h1_style))
        story.append(Paragraph("The following alternative ad variants were optimized to utilize the creative gaps and behavioral angles identified in section 2.", body_style))
        story.append(Spacer(1, 10))
        
        for idx, ad in enumerate(data.generated_ads, 1):
            ad_content = [
                [Paragraph(f"<b>VARIATION {idx}: {ad.get('title', 'Ad Copy')}</b>", body_bold)],
                [Paragraph(f"<b>Hook:</b> {ad.get('hook', '')}", body_style)],
                [Paragraph(f"<b>Script/Body:</b><br/>{ad.get('body', '').replace(chr(10), '<br/>')}", body_style)],
                [Paragraph(f"<b>Call To Action:</b> {ad.get('cta', '')}", body_style)]
            ]
            ad_table = Table(ad_content, colWidths=[doc.width])
            ad_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
                ('BOX', (0,0), (-1,-1), 1, c_border),
                ('PADDING', (0,0), (-1,-1), 10),
            ]))
            story.append(ad_table)
            story.append(Spacer(1, 12))

    # Build the document
    doc.build(story, canvasmaker=NumberedCanvas)
    return output_path
