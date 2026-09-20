from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


OUTPUT = Path(__file__).resolve().parents[1] / "public" / "files" / "jane-doe-resume-placeholder.pdf"


def draw_rule(pdf: canvas.Canvas, y: float) -> None:
    pdf.setStrokeColor(HexColor("#D7D1C5"))
    pdf.setLineWidth(0.7)
    pdf.line(52, y, 543, y)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4)
    width, height = A4

    pdf.setFillColor(HexColor("#F8F6F0"))
    pdf.rect(0, 0, width, height, fill=1, stroke=0)

    pdf.setFillColor(HexColor("#211F1B"))
    pdf.setFont("Helvetica-Bold", 27)
    pdf.drawString(52, height - 68, "Jane Doe")
    pdf.setFont("Helvetica", 10)
    pdf.setFillColor(HexColor("#69645B"))
    pdf.drawString(52, height - 88, "Designer + Builder")
    pdf.drawRightString(width - 52, height - 68, "hello@example.com")
    pdf.drawRightString(width - 52, height - 88, "Portfolio resume placeholder")

    draw_rule(pdf, height - 112)

    pdf.setFillColor(HexColor("#211F1B"))
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(52, height - 148, "PROFILE")
    pdf.setFont("Helvetica", 11)
    pdf.setFillColor(HexColor("#514D46"))
    text = pdf.beginText(170, height - 148)
    text.setLeading(17)
    text.textLines(
        "Designer and front-end builder focused on making complex systems clear,\n"
        "useful, and pleasant to use. Replace this page with your current resume\n"
        "when final experience and project details are ready."
    )
    pdf.drawText(text)

    draw_rule(pdf, height - 220)

    sections = [
        ("EXPERIENCE", "Role / Company", "20XX - Present", "A concise description of your responsibilities, contribution, and measurable impact."),
        ("", "Previous Role / Company", "20XX - 20XX", "Add a second relevant role, emphasizing the decisions and outcomes that mattered."),
        ("EDUCATION", "Degree / Institution", "20XX", "Course of study, notable focus, or relevant distinction."),
    ]

    y = height - 258
    for label, title, date, description in sections:
        if label:
            pdf.setFillColor(HexColor("#211F1B"))
            pdf.setFont("Helvetica-Bold", 9)
            pdf.drawString(52, y, label)
        pdf.setFont("Helvetica-Bold", 11)
        pdf.drawString(170, y, title)
        pdf.setFont("Helvetica", 9)
        pdf.setFillColor(HexColor("#777168"))
        pdf.drawRightString(width - 52, y, date)
        pdf.setFont("Helvetica", 10)
        pdf.setFillColor(HexColor("#514D46"))
        pdf.drawString(170, y - 21, description)
        y -= 82

    draw_rule(pdf, y + 20)
    pdf.setFillColor(HexColor("#211F1B"))
    pdf.setFont("Helvetica-Bold", 9)
    pdf.drawString(52, y - 16, "CAPABILITIES")
    pdf.setFont("Helvetica", 10)
    pdf.setFillColor(HexColor("#514D46"))
    pdf.drawString(170, y - 16, "Product thinking / Interaction design / Visual systems")
    pdf.drawString(170, y - 35, "Prototyping / Front-end development / Creative direction")

    pdf.setFont("Helvetica-Oblique", 8)
    pdf.setFillColor(HexColor("#8A847A"))
    pdf.drawString(52, 40, "Placeholder resume - replace content and contact details before launch.")
    pdf.drawRightString(width - 52, 40, "Jane Doe's Portfolio")

    pdf.showPage()
    pdf.save()


if __name__ == "__main__":
    main()
