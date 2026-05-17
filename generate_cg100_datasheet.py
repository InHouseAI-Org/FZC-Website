#!/usr/bin/env python3
"""
Professional PDF Datasheet Generator for CG 100
Enhanced design with better spacing, alignment, and typography
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, inch
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak, KeepTogether
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Page dimensions
PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 20*mm

# Brand colors
INMARCO_RED = colors.HexColor('#e31e24')
INMARCO_DARK = colors.HexColor('#2b2a29')
INMARCO_BROWN = colors.HexColor('#554f4a')
LIGHT_GRAY = colors.HexColor('#f5f5f5')
MEDIUM_GRAY = colors.HexColor('#888888')
BORDER_GRAY = colors.HexColor('#d0d0d0')

class DatasheetCanvas(canvas.Canvas):
    """Custom canvas for header and footer with improved design"""

    def __init__(self, *args, **kwargs):
        canvas.Canvas.__init__(self, *args, **kwargs)
        self.pages = []

    def showPage(self):
        self.pages.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        page_count = len(self.pages)
        for page_num, page in enumerate(self.pages, 1):
            self.__dict__.update(page)
            self.draw_page_elements(page_num, page_count)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_elements(self, page_num, page_count):
        """Draw header and footer on each page with improved alignment"""

        # === HEADER ===
        header_height = 50

        # Dark background for header
        self.setFillColor(INMARCO_DARK)
        self.rect(0, PAGE_HEIGHT - header_height, PAGE_WIDTH, header_height, fill=True, stroke=False)

        # Red accent line at bottom of header
        self.setFillColor(INMARCO_RED)
        self.rect(0, PAGE_HEIGHT - header_height - 3, PAGE_WIDTH, 3, fill=True, stroke=False)

        # Logo - left aligned with proper padding
        logo_path = 'src/assets/inmarco-tagline-logo.webp'
        if os.path.exists(logo_path):
            try:
                self.drawImage(
                    logo_path,
                    MARGIN,
                    PAGE_HEIGHT - header_height + 12,
                    width=50*mm,
                    height=12*mm,
                    preserveAspectRatio=True,
                    mask='auto'
                )
            except Exception as e:
                print(f"Logo error: {e}")

        # ISO Badge - right aligned with padding
        badge_width = 45
        badge_height = 22
        badge_x = PAGE_WIDTH - MARGIN - badge_width
        badge_y = PAGE_HEIGHT - header_height + 14

        self.setFillColor(colors.white)
        self.roundRect(badge_x, badge_y, badge_width, badge_height, 3, fill=True, stroke=False)

        self.setFillColor(INMARCO_DARK)
        self.setFont('Helvetica-Bold', 7)
        self.drawCentredString(badge_x + badge_width/2, badge_y + 13, 'ISO 9001')
        self.setFont('Helvetica', 6)
        self.drawCentredString(badge_x + badge_width/2, badge_y + 5, 'CERTIFIED')

        # === FOOTER ===
        footer_height = 45

        # Dark background for footer
        self.setFillColor(INMARCO_DARK)
        self.rect(0, 0, PAGE_WIDTH, footer_height, fill=True, stroke=False)

        # Red accent line at top of footer
        self.setFillColor(INMARCO_RED)
        self.rect(0, footer_height, PAGE_WIDTH, 3, fill=True, stroke=False)

        # Company name
        self.setFillColor(colors.white)
        self.setFont('Helvetica-Bold', 9)
        self.drawString(MARGIN, footer_height - 12, 'INMARCO FZC')

        # Contact details - proper line spacing
        self.setFont('Helvetica', 7)
        self.drawString(MARGIN, footer_height - 22, 'P.O. Box 120284, Sharjah Airport International Free Zone (SAIF-Zone), Sharjah, UAE')
        self.drawString(MARGIN, footer_height - 31, 'Tel: +971 6 5578378  |  Fax: +971 6 5578948  |  Email: info@inmarco.ae')

        # Website - right aligned
        self.setFillColor(INMARCO_RED)
        self.setFont('Helvetica-Bold', 9)
        self.drawRightString(PAGE_WIDTH - MARGIN, footer_height - 22, 'www.inmarco.ae')

        # Page number - bottom right
        self.setFillColor(colors.white)
        self.setFont('Helvetica', 7)
        self.drawRightString(PAGE_WIDTH - MARGIN, 8, f'Page {page_num} of {page_count}')

def create_section_header(title):
    """Create a section header with red left accent bar"""
    header_style = ParagraphStyle(
        'HeaderText',
        fontSize=12,
        textColor=INMARCO_DARK,
        fontName='Helvetica-Bold',
        leading=18,
    )

    header_table = Table([[' ', Paragraph(title, header_style)]], colWidths=[4*mm, 166*mm])
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), INMARCO_RED),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (0, 0), 0),
        ('LEFTPADDING', (1, 0), (1, 0), 10),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    return header_table

def create_datasheet():
    """Generate the professional datasheet PDF with improved styling"""

    output_file = 'public/datasheets/CG-100-Datasheet.pdf'
    os.makedirs('public/datasheets', exist_ok=True)

    # Create document with proper margins
    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        topMargin=60,  # Space for header
        bottomMargin=55,  # Space for footer
        leftMargin=MARGIN,
        rightMargin=MARGIN
    )

    # Styles
    styles = getSampleStyleSheet()

    # === CUSTOM STYLES ===

    # Document type badge
    doc_type_style = ParagraphStyle(
        'DocType',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.white,
        fontName='Helvetica-Bold',
        alignment=TA_CENTER,
        leading=14,
        backColor=INMARCO_RED,
        leftIndent=8,
        rightIndent=8,
        spaceBefore=0,
        spaceAfter=0
    )

    # Subtitle
    subtitle_style = ParagraphStyle(
        'Subtitle',
        parent=styles['Normal'],
        fontSize=13,
        textColor=MEDIUM_GRAY,
        fontName='Helvetica',
        alignment=TA_CENTER,
        leading=16,
        spaceAfter=4
    )

    # Main title
    title_style = ParagraphStyle(
        'Title',
        parent=styles['Heading1'],
        fontSize=26,
        textColor=INMARCO_RED,
        fontName='Helvetica-Bold',
        alignment=TA_CENTER,
        leading=30,
        spaceAfter=20,
        spaceBefore=0
    )

    # Section headers - redesigned with icon-style left bar
    section_header_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Normal'],
        fontSize=12,
        textColor=INMARCO_DARK,
        fontName='Helvetica-Bold',
        alignment=TA_LEFT,
        leading=18,
        leftIndent=15,
        spaceBefore=18,
        spaceAfter=12,
        borderWidth=0,
        borderPadding=0
    )

    # Body text
    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9.5,
        textColor=INMARCO_DARK,
        fontName='Helvetica',
        alignment=TA_JUSTIFY,
        leading=13,
        spaceAfter=10
    )

    # Bullet list style
    bullet_style = ParagraphStyle(
        'Bullet',
        parent=styles['Normal'],
        fontSize=9.5,
        textColor=INMARCO_DARK,
        fontName='Helvetica',
        alignment=TA_LEFT,
        leading=13,
        leftIndent=15,
        bulletIndent=5,
        spaceAfter=6
    )

    # Build content
    story = []

    # === TITLE SECTION ===
    # Badge
    badge_table = Table([[Paragraph('TECHNICAL DATA SHEET', doc_type_style)]], colWidths=[90*mm])
    badge_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), INMARCO_RED),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    story.append(badge_table)
    story.append(Spacer(1, 12))

    # Titles
    story.append(Paragraph('Expanded Graphite Non Metallic Packing', subtitle_style))
    story.append(Paragraph('100FX', title_style))

    # Product Image with proper sizing
    image_path = 'FZC Inmarco Product Shoot/CG 100/CG100_Edited_1.webp'
    if os.path.exists(image_path):
        try:
            img = Image(image_path, width=100*mm, height=70*mm)
            img.hAlign = 'CENTER'

            # Center image in a table
            img_table = Table([[img]], colWidths=[170*mm])
            img_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ]))
            story.append(img_table)
            story.append(Spacer(1, 15))
        except Exception as e:
            print(f"Image error: {e}")
            story.append(Spacer(1, 10))

    # === DESCRIPTION SECTION ===
    story.append(Spacer(1, 10))
    story.append(create_section_header('Description'))
    story.append(Spacer(1, 10))

    desc1 = """<b>STYLE 100FX</b> Expanded flexible pure graphite fibre (purity 99% minimum) braided packing reinforced with non metallic filament. The packing is extrusion resistant and capable of withstanding higher pressure both in dynamic and static condition."""
    story.append(Paragraph(desc1, body_style))

    desc2 = """<b>STYLE 100FX</b> packing is also impregnated with proprietary hi-therm dispersion to fill the leak paths between the braids. Under gland pressure it becomes a homogeneous mass."""
    story.append(Paragraph(desc2, body_style))

    # === OPERATIONAL PARAMETERS SECTION ===
    story.append(Spacer(1, 10))
    story.append(create_section_header('Operational Parameters'))
    story.append(Spacer(1, 10))

    # Table data - improved layout
    table_data = [
        ['Property', 'Specification'],
        ['pH Range', '0 - 14'],
        ['Temperature (°C)', '-200 to +650 (2700°C in non-oxidizing media)'],
        ['Pressure (BAR)', '35 / 80 / 100'],
        ['Velocity (m/s)', '20 / 10 / ---'],
        ['Size Range', '3sq mm to 50sq mm'],
    ]

    # Create table with two columns
    col_widths = [80*mm, 90*mm]
    table = Table(table_data, colWidths=col_widths)

    table.setStyle(TableStyle([
        # Header row
        ('BACKGROUND', (0, 0), (-1, 0), INMARCO_DARK),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'LEFT'),

        # All data cells
        ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 1), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9.5),
        ('TEXTCOLOR', (0, 1), (-1, -1), INMARCO_DARK),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),

        # Highlight pressure and velocity values
        ('TEXTCOLOR', (1, 3), (1, 4), INMARCO_RED),
        ('FONTNAME', (1, 3), (1, 4), 'Helvetica-Bold'),

        # Borders
        ('BOX', (0, 0), (-1, -1), 1.5, INMARCO_DARK),
        ('LINEBELOW', (0, 0), (-1, 0), 2, INMARCO_RED),
        ('INNERGRID', (0, 1), (-1, -1), 0.5, BORDER_GRAY),

        # Vertical alignment
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),

        # Padding
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),

        # Alternating row colors for data
        ('BACKGROUND', (0, 2), (-1, 2), LIGHT_GRAY),
        ('BACKGROUND', (0, 4), (-1, 4), LIGHT_GRAY),
    ]))

    story.append(table)

    # === ADVANTAGES SECTION ===
    story.append(Spacer(1, 10))
    story.append(create_section_header('Advantages'))
    story.append(Spacer(1, 10))

    advantages = [
        "Self generating lubrication accommodates and aids self adjustment on stem upon tightening of gland.",
        "Most effective sealing performance & no scoring of sleeve, plunger or stem.",
        "Hi-therm lubrication developed by us, in-house R & D prevents the body and shaft leakage on static or dynamic equipment.",
        "Suits for high mechanical & cylindrical load.",
        "Excellent sealing during long duration."
    ]

    for adv in advantages:
        story.append(Paragraph(f'<bullet>•</bullet> {adv}', bullet_style))

    story.append(Spacer(1, 8))

    # === TYPICAL APPLICATIONS SECTION ===
    story.append(Spacer(1, 10))
    story.append(create_section_header('Typical Applications'))
    story.append(Spacer(1, 10))
    story.append(Paragraph('Pumps, Valves, Dryers, Reactors, etc.', body_style))

    # === SERVICE MEDIA SECTION ===
    story.append(Spacer(1, 10))
    story.append(create_section_header('Service Media'))
    story.append(Spacer(1, 10))
    media_text = """Superheated & Saturated steam, Gases, Petrochemicals, Hydrocarbon, Thermic fluid, Hot oil, Acids & Alkalis, Solvents, Organic chemicals, Emissive fluids, etc."""
    story.append(Paragraph(media_text, body_style))

    story.append(Spacer(1, 20))

    # === DISCLAIMER ===
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=7,
        textColor=MEDIUM_GRAY,
        fontName='Helvetica',
        fontStyle='italic',
        alignment=TA_JUSTIFY,
        leading=9,
        leftIndent=10,
        rightIndent=10,
        borderWidth=1,
        borderColor=BORDER_GRAY,
        borderPadding=8,
        backColor=LIGHT_GRAY
    )

    disclaimer_text = """All information and recommendations given in this technical data sheet are correct to the best of our knowledge. However, in view of the wide variety of application and operating conditions one cannot draw the final conclusion in all application cases regarding the behavior of compounds. The above information can only serve as a guideline."""

    story.append(Paragraph(disclaimer_text, disclaimer_style))

    # Build PDF with custom canvas
    doc.build(story, canvasmaker=DatasheetCanvas)

    print(f"✅ Professional PDF datasheet created: {output_file}")
    print(f"📄 File size: {os.path.getsize(output_file) / 1024:.1f} KB")
    return output_file

if __name__ == '__main__':
    create_datasheet()
