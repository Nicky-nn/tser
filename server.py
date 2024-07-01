from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import platform
import requests

# Importar bibliotecas según el sistema operativo
if platform.system() == "Windows":
    import win32print
    import win32api
else:
    import cups

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas


def print_pdf(file_path):
    system = platform.system()
    if system == "Windows":
        printer_name = win32print.GetDefaultPrinter()
        win32api.ShellExecute(
            0,
            "print",
            file_path,
            f'/d:"{printer_name}"',
            ".",
            0
        )
    else:
        conn = cups.Connection()
        printers = conn.getPrinters()
        if not printers:
            raise RuntimeError("No printers available")
        # Selecciona la primera impresora
        printer_name = list(printers.keys())[0]
        conn.printFile(printer_name, file_path, "Python Print Job", {})


@app.route('/print', methods=['POST'])
def print_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Guardar el archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        file.save(temp.name)
        temp.close()

    # Imprimir el archivo
    try:
        print_pdf(temp.name)
    finally:
        os.remove(temp.name)

    return jsonify({"message": "Printing started"}), 200


@app.route('/printPDF', methods=['POST'])
def print_pdfURL():
    data = request.get_json()
    pdf_url = data.get('pdf_url')

    if not pdf_url:
        return jsonify({"error": "No se ha proporcionado la URL del PDF"}), 400

    # Descargar el archivo PDF de la URL
    try:
        response = requests.get(pdf_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to download PDF: {str(e)}"}), 400

    # Guardar el archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        temp.write(response.content)

    # Imprimir el archivo
    try:
        print_pdf(temp.name)
    except Exception as e:
        return jsonify({"error": f"Error printing PDF: {str(e)}"}), 500
    finally:
        os.remove(temp.name)

    return jsonify({"message": "Se ha iniciado la impresión del PDF"}), 200


@app.route('/printers', methods=['GET'])
def get_printers():
    system = platform.system()
    printers = []

    if system == "Windows":
        for printer in win32print.EnumPrinters(win32print.PRINTER_ENUM_LOCAL, None, 1):
            printers.append(printer[2])
    else:
        conn = cups.Connection()
        printers = list(conn.getPrinters().keys())
        if system == "Darwin":  # macOS
            printers = [printer for printer in printers if 'inactive' not in conn.getPrinterAttributes(printer)[
                'printer-state-message']]

    return jsonify({"printers": printers}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7777)
