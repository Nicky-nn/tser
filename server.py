from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import platform
import requests
import logging
import cups

# Configurar logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas


def send_cut_command(printer_name):
    logging.debug(f"Sending cut command to printer: {printer_name}")
    
    # Comando para avanzar 5 líneas
    feed_command = b"\x1B\x64\x05"
    
    # Comando de corte de papel
    cut_command = b"\x1D\x56\x00"
    
    # Combinar comandos: primero avanzar, luego cortar
    full_command = feed_command + cut_command

    try:
        with tempfile.NamedTemporaryFile(delete=False) as temp:
            temp.write(full_command)
            temp_path = temp.name

        conn = cups.Connection()
        conn.printFile(printer_name, temp_path, "Feed and Cut Command", {})
        os.remove(temp_path)
        logging.debug("Feed and cut command sent successfully")
    except Exception as e:
        logging.error(f"Error sending feed and cut command: {str(e)}")
        raise


def print_pdf(file_path, printer_name):
    logging.debug(f"Attempting to print file: {
                  file_path} on printer: {printer_name}")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"El archivo {file_path} no existe")

    logging.debug("Using CUPS print system")
    conn = cups.Connection()
    if printer_name not in conn.getPrinters():
        raise RuntimeError(f"Printer {printer_name} not found")

    try:
        job_id = conn.printFile(printer_name, file_path,
                                "Python Print Job", {})
        logging.debug(f"Print job sent successfully. Job ID: {job_id}")
    except Exception as e:
        logging.error(f"Error during CUPS print: {str(e)}")
        raise

    # Enviar comando de corte después de imprimir
    try:
        send_cut_command(printer_name)
    except Exception as e:
        logging.error(f"Error sending cut command: {str(e)}")


@app.route('/print', methods=['POST'])
def print_document():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    printer_name = request.form.get('printer')
    if not printer_name:
        return jsonify({"error": "No printer specified"}), 400

    # Guardar el archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        file.save(temp.name)
        temp_path = temp.name

    logging.debug(f"Temporary file saved at: {temp_path}")

    # Imprimir el archivo
    try:
        print_pdf(temp_path, printer_name)
    except Exception as e:
        logging.error(f"Error during printing: {str(e)}")
        return jsonify({"error": f"Error printing: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            logging.debug(f"Temporary file removed: {temp_path}")
        else:
            logging.warning(
                f"Temporary file not found for removal: {temp_path}")

    return jsonify({"message": "Printing started"}), 200


@app.route('/printPDF', methods=['POST'])
def print_pdfURL():
    data = request.get_json()
    pdf_url = data.get('pdf_url')
    printer_name = data.get('printer')

    if not pdf_url:
        return jsonify({"error": "No se ha proporcionado la URL del PDF"}), 400

    if not printer_name:
        return jsonify({"error": "No se ha especificado una impresora"}), 400

    # Descargar el archivo PDF de la URL
    try:
        response = requests.get(pdf_url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logging.error(f"Failed to download PDF: {str(e)}")
        return jsonify({"error": f"Failed to download PDF: {str(e)}"}), 400

    # Guardar el archivo temporalmente
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp:
        temp.write(response.content)
        temp_path = temp.name

    logging.debug(f"Temporary file saved at: {temp_path}")

    # Imprimir el archivo
    try:
        print_pdf(temp_path, printer_name)
    except Exception as e:
        logging.error(f"Error during printing: {str(e)}")
        return jsonify({"error": f"Error printing PDF: {str(e)}"}), 500
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            logging.debug(f"Temporary file removed: {temp_path}")
        else:
            logging.warning(
                f"Temporary file not found for removal: {temp_path}")

    return jsonify({"message": "Se ha iniciado la impresión del PDF"}), 200


@app.route('/printers', methods=['GET'])
def get_printers():
    conn = cups.Connection()
    printers = list(conn.getPrinters().keys())
    if platform.system() == "Darwin":  # macOS
        printers = [printer for printer in printers if 'inactive' not in conn.getPrinterAttributes(printer)[
            'printer-state-message']]

    return jsonify({"printers": printers}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=7777)
