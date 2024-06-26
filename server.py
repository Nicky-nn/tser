from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import platform

# Condicional para importar las bibliotecas correctas según el sistema operativo
if platform.system() == "Windows":
    import win32print
    import win32api
elif platform.system() == "Linux":
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
    elif system == "Linux":
        conn = cups.Connection()
        printers = conn.getPrinters()
        # Selecciona la primera impresora
        printer_name = list(printers.keys())[0]
        conn.printFile(printer_name, file_path, "Python Print Job", {})
    elif system == "Darwin":  # macOS
        # Especifica el nombre de tu impresora
        os.system(f'lpr -P PDFwriter {file_path}')
    else:
        raise RuntimeError(f"Unsupported OS: {system}")


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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7777)
