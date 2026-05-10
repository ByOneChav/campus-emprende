# README Exportacion

## Markdown a DOCX o PDF
- Opcion recomendada: Pandoc.
- Ejemplo DOCX: `pandoc Documentacion/Informe_EV2_Campus_Emprende.md -o Informe_EV2_Campus_Emprende.docx`
- Ejemplo PDF: `pandoc Documentacion/Informe_EV2_Campus_Emprende.md -o Informe_EV2_Campus_Emprende.pdf`

## CSV a XLSX
- Abrir el `.csv` en Excel o LibreOffice Calc y guardar como `.xlsx`.
- Mantener UTF-8 y separador coma.

## Presentacion Markdown a PowerPoint
- Convertir `Documentacion/Presentacion_EV2_Campus_Emprende.md` con Pandoc:
- `pandoc Documentacion/Presentacion_EV2_Campus_Emprende.md -t pptx -o Presentacion_EV2_Campus_Emprende.pptx`
- Revisar manualmente tipografia, tamanos y capturas antes de exponer.

## Compresion final
- Nombre sugerido: `EP_TPY1101_8_008V.rar`
- Incluir la carpeta completa `Entrega_EV2_TPY1101_Grupo8`.

## Archivos que requieren capturas reales antes de entregar
- `Documentacion/Evidencias_Web/README_CAPTURAS.md`
- `Documentacion/Evidencias_Web/lista_capturas_requeridas.csv`
- `Producto/Evidencia_Software/checklist_funcionalidades.csv`
- `Documentacion/QA/Evidencia_Pruebas.md`
