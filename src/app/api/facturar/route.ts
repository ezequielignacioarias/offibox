import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Afip from '@afipsdk/afip.js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cliente, importe, puntoVenta, tipoComprobante } = body;

    // Rutas a los archivos dentro de la carpeta certs/
    const certPath = path.join(process.cwd(), 'certs', 'afip_cert.crt'); 
    const keyPath = path.join(process.cwd(), 'certs', 'private.key');

    const cert = fs.readFileSync(certPath, { encoding: 'utf8' });
    const key = fs.readFileSync(keyPath, { encoding: 'utf8' });

    // Instanciar Afip con tu CUIT, certificados y el Access Token de Afip SDK
    const afip = new Afip({
      CUIT: 20418596520,
      cert: cert,
      key: key,
      production: true, // Cambiar a false si usas entorno de homologación
      access_token: "JEEHkX3fltpMeNKIOBQSZsZJEVgjYCG8WBgSHghGCBIu9drTXXDnmdvJs5lQDAqw" // <--- Pega aquí el token de app.afipsdk.com
    });

    const ptoVta = 2; // El punto de venta 2 que habilitaste para Web Services
    const cbteTipo = tipoComprobante || 11; // 11 = Factura C (Monotributo)

    // 1. Obtener el último comprobante autorizado automáticamente
    const lastVoucher = await afip.ElectronicBilling.getLastVoucher(ptoVta, cbteTipo);
    const nextVoucher = (lastVoucher || 0) + 1;

    const fechaHoy = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));

    // 2. Armar los datos del comprobante
    const data = {
      CantReg: 1, 
      PtoVta: ptoVta, 
      CbteTipo: cbteTipo, 
      Concepto: 2, // 1 = Productos, 2 = Servicios, 3 = Productos y Servicios
      DocTipo: cliente?.tipoDoc || 99, // 80 = CUIT, 96 = DNI, 99 = Consumidor Final
      DocNro: cliente?.nroDoc || 0,
      CbteDesde: nextVoucher, 
      CbteHasta: nextVoucher,
      CbteFch: fechaHoy,
      // ⚠️ Obligatorios cuando el concepto es 2 (Servicios):
      FchServDesde: fechaHoy,
      FchServHasta: fechaHoy,
      FchVtoPago: fechaHoy,
      ImpTotal: importe,
      ImpTotConc: 0,
      ImpNeto: importe,
      ImpOpEx: 0,
      ImpTrib: 0,
      ImpIVA: 0,
      MonId: 'PES',
      MonCotiz: 1
    };

    // 3. Solicitar el CAE a ARCA
    const caeResult = await afip.ElectronicBilling.createVoucher(data);

    // 4. Retornar la respuesta con la estructura que espera el frontend
    return NextResponse.json({
      success: true,
      data: {
        cae: caeResult.CAE,
        voucherNumber: nextVoucher
      }
    });

  } catch (error: any) {
    console.error("Error al emitir factura en ARCA:", error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error desconocido' },
      { status: 500 }
    );
  }
}