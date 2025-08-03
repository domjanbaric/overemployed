from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jinja2 import Template
from fpdf import FPDF
import markdown

from .. import schemas, models
from ..deps import get_db, get_current_user

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

DEFAULT_TEMPLATE = Template(
    """# {{ persona.title }}\n\n{{ persona.summary or '' }}\n\n"""
    "{% if persona.tags %}**Tags:** {{ persona.tags|join(', ') }}{% endif %}\n"
)

router = APIRouter(prefix="/export", tags=["export"])


@router.post("/{persona_id}", response_model=schemas.ExportResponse)
def export_persona(
    persona_id: str,
    request: schemas.ExportRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    persona = (
        db.query(models.Persona)
        .filter(models.Persona.id == persona_id, models.Persona.user_id == current_user.id)
        .first()
    )
    if not persona:
        raise HTTPException(status_code=404, detail="Persona not found")

    template = DEFAULT_TEMPLATE
    if request.template_id:
        tmpl = db.query(models.Template).filter(models.Template.id == request.template_id).first()
        if not tmpl:
            raise HTTPException(status_code=404, detail="Template not found")
        if tmpl.engine == models.TemplateEngine.jinja:
            template = Template(tmpl.config.get("template", DEFAULT_TEMPLATE.source))
        else:  # markdown engine
            template = Template(tmpl.config.get("template", DEFAULT_TEMPLATE.source))

    markdown_text = template.render(persona=persona)

    filename = f"{uuid4()}"
    if request.format == schemas.ExportFormat.md:
        path = UPLOAD_DIR / f"{filename}.md"
        path.write_text(markdown_text)
    else:
        html = markdown.markdown(markdown_text)
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)
        pdf.set_font("Arial", size=12)
        for line in html.splitlines():
            pdf.multi_cell(0, 10, line)
        path = UPLOAD_DIR / f"{filename}.pdf"
        pdf.output(str(path))

    return schemas.ExportResponse(file_url=f"/uploads/{path.name}")
