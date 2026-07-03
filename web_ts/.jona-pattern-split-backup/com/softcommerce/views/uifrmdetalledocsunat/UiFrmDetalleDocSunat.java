package com.softcommerce.views.uifrmdetalledocsunat;


import com.softcommerce.formularios.sunat.*;
import com.softcommerce.formularios.*;
import com.google.gson.Gson;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.sunat.AnuladoQuery;
import com.softcommerce.beans.sunat.DocumentoGralQuery;
import com.softcommerce.beans.sunat.DocumentoQuery;
import com.softcommerce.beans.sunat.DocumentoVenta;
import com.softcommerce.beans.sunat.ResultSfs;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.formularios.ReadProperties;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.sunat.ConvertDataSunat;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnRegconta;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.LayoutUtil;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import org.apache.log4j.Logger;

public class UiFrmDetalleDocSunat
        extends JDialog
        implements InterUiFrmDetalleDocSunat, ActionListener {

    private final URL path;
    private final Usuario usuario;
    private Gif gif;
    private JTextField txtCodigo;
    private JDateChooser dcFechaEmision;
    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    private JTextField txtDocCliente;
    private JTextField txtNombreCliente;
    private JTextField txtMoneda;
    private JTextField txtEstado;
    private JTextField txtMonto;
    private JCheckBox chkEnviadoFacturador;
    private JCheckBox chkAnuladoSunat;
    private JCheckBox chkXmlSunat;
    private JCheckBox chkXmlFirmadoSunat;
    private JCheckBox chkEnviadoSunat;
    private JCheckBox chkAceptadoSunat;
    private JCheckBox chkPdfSunat;
    private JCheckBox chkCorreoEnviadoSunat;
    private JCheckBox chkRegistroDuplicadoSunat;
    private JTextField txtObservacionesSunat;
    private JTextField txtCorreoClienteSunat;
    private JTextField txtNroIntentoEnvioSunat;
    private JTextField txtDocumentoAnulado;
    private JDateChooser dcFechaAnulado;
    private JCheckBox chkXmlAnulado;
    private JCheckBox chkXmlFirmadoAnulado;
    private JCheckBox chkEnviadoAnulado;
    private JCheckBox chkAceptadoAnulado;
    private JTextField txtObservacionesAnulado;
    private JTextField txtNroTicketAnulado;
    private JTextField txtDocumentoResumen;
    private JDateChooser dcFechaResumen;
    private JCheckBox chkXmlResumen;
    private JCheckBox chkXmlFirmadoResumen;
    private JCheckBox chkEnviadoResumen;
    private JCheckBox chkAceptadoResumen;
    private JTextField txtObservacionesResumen;
    private JTextField txtNroTicketResumen;
    private JButton btnPdf;
    private JButton btnEnvioDocumento;
    private JButton btnReintentoAnulado;
    private JButton btnResumen;
    private JButton btnReiniciarEnvio;
    private JButton btnReenvioDocumento;
    private DocumentoVenta docVenta;
    private final Logger logger = Logger.getLogger(UiFrmDetalleDocSunat.class);
    private int httpCode = 0;
    private JPanel pnlSunat;
    private JPanel pnlAnuladoSunat;
    private JPanel pnlResumenSunat;
    private Long idDocumentoSunat;

    public UiFrmDetalleDocSunat(URL path, Main frm, Usuario usuario) {
        super(frm, true);
        this.path = path;
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl = new JPanel();
        gif = new Gif();
        this.setTitle("Detalle de Documento Sunat");
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlDatos(), BorderLayout.NORTH);
        pnlSunat = getPnlDatosSunat();
        pnl.add(pnlSunat, BorderLayout.CENTER);
        pnl.add(getPnlOpciones(), BorderLayout.SOUTH);
        this.getContentPane().add(pnl);
        setMinimumSize(new Dimension(500, 250));
        initListener();
        //loadCombo();
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        btnPdf.setVisible(false);
        btnReintentoAnulado.setVisible(false);
        btnEnvioDocumento.setVisible(false);
        btnResumen.setVisible(false);
        btnReiniciarEnvio.setVisible(false);
        btnReenvioDocumento.setVisible(false);
        btnPdf.addActionListener(this);
        btnReintentoAnulado.addActionListener(this);
        btnEnvioDocumento.addActionListener(this);
        btnResumen.addActionListener(this);
        btnReiniciarEnvio.addActionListener(this);
        btnReenvioDocumento.addActionListener(this);
    }

    private JPanel getPnlDatos() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();
        Border border = BorderFactory.createTitledBorder(null, "Datos Generales", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);

        JLabel lblCodigo = new JLabel("Codigo");
        pnl.add(lblCodigo, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtCodigo = new JTextField();
        txtCodigo.setEnabled(false);
        txtCodigo.setColumns(10);
        pnl.add(txtCodigo, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblFecha = new JLabel("Fecha Emision");
        pnl.add(lblFecha, gbc);

        gbc.gridx = 4;
        dcFechaEmision = new JDateChooser();
        dcFechaEmision.setEnabled(false);
        gbc.gridwidth = 2;
        pnl.add(dcFechaEmision, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblTipoDoc = new JLabel("T. Doc.");
        gbc.insets = new Insets(2, 0, 2, 1);
        pnl.add(lblTipoDoc, gbc);

        txtTipoDoc = new JTextField();
        //txtTipoDoc.setDocument(new UpperCaseNumberDocument(2));
        txtTipoDoc.setEnabled(false);
        txtTipoDoc.setColumns(2);
        gbc.gridx = 1;
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtTipoDoc, gbc);

        gbc.gridx = 2;
        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setEnabled(false);
        txtTipoDocDesc.setColumns(15);
        gbc.insets = new Insets(2, 0, 2, 5);
        pnl.add(txtTipoDocDesc, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lblDoc = new JLabel("Documento");
        gbc.gridx = 3;
        pnl.add(lblDoc, gbc);

        gbc.gridx = 4;
        txtSerie = new JTextField();
        txtSerie.setEnabled(false);
        FormatObject.formatJTextFieldSerie(txtSerie);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtSerie, gbc);

        gbc.gridx = 5;
        txtPreimpreso = new JTextField();
        txtPreimpreso.setColumns(7);
        txtPreimpreso.setEnabled(false);
        pnl.add(txtPreimpreso, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblNumDoc = new JLabel("Doc Cliente");
        pnl.add(lblNumDoc, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtDocCliente = new JTextField();
        txtDocCliente.setColumns(10);
        txtDocCliente.setEnabled(false);
        pnl.add(txtDocCliente, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblMoneda = new JLabel("Moneda");
        pnl.add(lblMoneda, gbc);

        gbc.gridx = 4;
        txtMoneda = new JTextField();
        txtMoneda.setColumns(10);
        txtMoneda.setEnabled(false);
        gbc.gridwidth = 2;
        pnl.add(txtMoneda, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblCliente = new JLabel("Cliente");
        pnl.add(lblCliente, gbc);

        gbc.gridx = 1;
        txtNombreCliente = new JTextField();
        txtNombreCliente.setEnabled(false);
        gbc.gridwidth = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtNombreCliente, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 4;
        JLabel lblMonto = new JLabel("Monto");
        pnl.add(lblMonto, gbc);

        gbc.gridx = 1;
        txtMonto = new JTextField();
        txtMonto.setColumns(10);
        txtMonto.setEnabled(false);
        gbc.gridwidth = 2;
        pnl.add(txtMonto, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        JLabel lblEstado = new JLabel("Estado");
        pnl.add(lblEstado, gbc);

        gbc.gridx = 4;
        txtEstado = new JTextField();
        txtEstado.setColumns(10);
        txtEstado.setEnabled(false);
        gbc.gridwidth = 2;
        pnl.add(txtEstado, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 1;
        gbc.gridy = 5;
        chkEnviadoFacturador = new JCheckBox("Enviado Facturador");
        chkEnviadoFacturador.setEnabled(false);
        gbc.gridwidth = 2;
        pnl.add(chkEnviadoFacturador, gbc);
        gbc.gridwidth = 1;

        return pnlPrinc;
    }

    private JPanel getPnlDatosSunat() {
        JPanel pnl = new JPanel();
        gif = new Gif();
        pnl.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Datos Sunat", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        pnl.add(getPnlDatosDocumentoSunat(), BorderLayout.NORTH);
        pnl.add(getPnlAnuladoReferenciaSunat(), BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlAnuladoReferenciaSunat() {
        JPanel pnl = new JPanel();
        gif = new Gif();
        pnl.setLayout(new BorderLayout());
        pnlAnuladoSunat = getPnlDatosAnuladoSunat();
        pnl.add(pnlAnuladoSunat, BorderLayout.WEST);
        pnlResumenSunat = getPnlDatosResumenSunat();
        pnl.add(pnlResumenSunat, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlOpciones() {
        JPanel pnl = new JPanel();
        btnPdf = new JButton("PDF", gif.ExportPdf);
        pnl.add(btnPdf);
        btnEnvioDocumento = new JButton("Enviar sunat", gif.REFRESH16);
        pnl.add(btnEnvioDocumento);
        btnReintentoAnulado = new JButton("Enviar Anular", gif.REFRESH16);
        pnl.add(btnReintentoAnulado);
        btnResumen = new JButton("Enviar Resumen", gif.UP);
        pnl.add(btnResumen);
        btnReiniciarEnvio = new JButton("Reiniciar Envio", gif.UP);
        pnl.add(btnReiniciarEnvio);
        btnReenvioDocumento = new JButton("Reenviar sunat", gif.REFRESH16);
        pnl.add(btnReenvioDocumento);
        return pnl;
    }

    private JPanel getPnlDatosAnuladoSunat() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, "Anulado Sunat", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();

        JLabel lblDocumento = new JLabel("Documento");
        pnl.add(lblDocumento, gbc);

        gbc.gridx = 1;
        txtDocumentoAnulado = new JTextField();
        txtDocumentoAnulado.setEnabled(false);
        txtDocumentoAnulado.setColumns(12);
        pnl.add(txtDocumentoAnulado, gbc);

        gbc.gridx = 2;
        JLabel lblFecha = new JLabel("Fecha");
        pnl.add(lblFecha, gbc);

        gbc.gridx = 3;
        dcFechaAnulado = new JDateChooser();
        dcFechaAnulado.setEnabled(false);
        pnl.add(dcFechaAnulado, gbc);

        gbc.gridy = 1;
        gbc.gridx = 0;
        chkXmlAnulado = new JCheckBox("Xml");
        chkXmlAnulado.setEnabled(false);
        pnl.add(chkXmlAnulado, gbc);

        gbc.gridx = 1;
        chkXmlFirmadoAnulado = new JCheckBox("Xml Firmado");
        chkXmlFirmadoAnulado.setEnabled(false);
        pnl.add(chkXmlFirmadoAnulado, gbc);

        gbc.gridx = 2;
        chkEnviadoAnulado = new JCheckBox("Enviado");
        chkEnviadoAnulado.setEnabled(false);
        pnl.add(chkEnviadoAnulado, gbc);

        gbc.gridx = 3;
        chkAceptadoAnulado = new JCheckBox("Aceptado");
        chkAceptadoAnulado.setEnabled(false);
        pnl.add(chkAceptadoAnulado, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblObservacion = new JLabel("Observaciones");
        pnl.add(lblObservacion, gbc);

        gbc.gridx = 1;
        txtObservacionesAnulado = new JTextField();
        txtObservacionesAnulado.setEnabled(false);
        txtObservacionesAnulado.setColumns(20);
        gbc.gridwidth = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtObservacionesAnulado, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblTicket = new JLabel("Nro Ticket");
        pnl.add(lblTicket, gbc);

        gbc.gridx = 1;
        txtNroTicketAnulado = new JTextField();
        txtNroTicketAnulado.setEnabled(false);
        txtNroTicketAnulado.setColumns(10);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtNroTicketAnulado, gbc);
        gbc.fill = GridBagConstraints.NONE;

        return pnlPrinc;
    }

    private JPanel getPnlDatosResumenSunat() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, "Resumen Sunat", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnl.setBorder(border);
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();

        JLabel lblDocumento = new JLabel("Documento");
        pnl.add(lblDocumento, gbc);

        gbc.gridx = 1;
        txtDocumentoResumen = new JTextField();
        txtDocumentoResumen.setEnabled(false);
        txtDocumentoResumen.setColumns(12);
        pnl.add(txtDocumentoResumen, gbc);

        gbc.gridx = 2;
        JLabel lblFecha = new JLabel("Fecha");
        pnl.add(lblFecha, gbc);

        gbc.gridx = 3;
        dcFechaResumen = new JDateChooser();
        dcFechaResumen.setEnabled(false);
        pnl.add(dcFechaResumen, gbc);

        gbc.gridy = 1;
        gbc.gridx = 0;
        chkXmlResumen = new JCheckBox("Xml");
        chkXmlResumen.setEnabled(false);
        pnl.add(chkXmlResumen, gbc);

        gbc.gridx = 1;
        chkXmlFirmadoResumen = new JCheckBox("Xml Firmado");
        chkXmlFirmadoResumen.setEnabled(false);
        pnl.add(chkXmlFirmadoResumen, gbc);

        gbc.gridx = 2;
        chkEnviadoResumen = new JCheckBox("Enviado");
        chkEnviadoResumen.setEnabled(false);
        pnl.add(chkEnviadoResumen, gbc);

        gbc.gridx = 3;
        chkAceptadoResumen = new JCheckBox("Aceptado");
        chkAceptadoResumen.setEnabled(false);
        pnl.add(chkAceptadoResumen, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblObservacion = new JLabel("Observaciones");
        pnl.add(lblObservacion, gbc);

        gbc.gridx = 1;
        txtObservacionesResumen = new JTextField();
        txtObservacionesResumen.setEnabled(false);
        txtObservacionesResumen.setColumns(20);
        gbc.gridwidth = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtObservacionesResumen, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        gbc.gridx = 0;
        gbc.gridy = 3;
        JLabel lblTicket = new JLabel("Nro Ticket");
        pnl.add(lblTicket, gbc);

        gbc.gridx = 1;
        txtNroTicketResumen = new JTextField();
        txtNroTicketResumen.setEnabled(false);
        txtNroTicketResumen.setColumns(10);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtNroTicketResumen, gbc);
        gbc.fill = GridBagConstraints.NONE;

        return pnlPrinc;
    }

    private JPanel getPnlDatosDocumentoSunat() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();

        gbc.gridx = 1;
        chkAnuladoSunat = new JCheckBox("Anulado");
        chkAnuladoSunat.setEnabled(false);
        pnl.add(chkAnuladoSunat, gbc);

        gbc.gridx = 2;
        chkXmlSunat = new JCheckBox("Xml");
        chkXmlSunat.setEnabled(false);
        pnl.add(chkXmlSunat, gbc);

        gbc.gridx = 3;
        chkXmlFirmadoSunat = new JCheckBox("Xml Firmado");
        chkXmlFirmadoSunat.setEnabled(false);
        pnl.add(chkXmlFirmadoSunat, gbc);

        gbc.gridx = 4;
        chkEnviadoSunat = new JCheckBox("Enviado");
        chkEnviadoSunat.setEnabled(false);
        pnl.add(chkEnviadoSunat, gbc);

        gbc.gridx = 5;
        chkAceptadoSunat = new JCheckBox("Aceptado");
        chkAceptadoSunat.setEnabled(false);
        pnl.add(chkAceptadoSunat, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblObservacion = new JLabel("Observaciones");
        pnl.add(lblObservacion, gbc);

        gbc.gridx = 1;
        txtObservacionesSunat = new JTextField();
        txtObservacionesSunat.setEnabled(false);
        txtObservacionesSunat.setColumns(40);
        gbc.gridwidth = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtObservacionesSunat, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        gbc.gridy = 2;
        gbc.gridx = 0;
        JLabel lblCorreoCliente = new JLabel("Correo Cliente");
        pnl.add(lblCorreoCliente, gbc);

        gbc.gridx = 1;
        txtCorreoClienteSunat = new JTextField();
        txtCorreoClienteSunat.setEnabled(false);
        gbc.gridwidth = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtCorreoClienteSunat, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        gbc.gridx = 4;
        JLabel lblNroIntento = new JLabel("Nro Envios");
        pnl.add(lblNroIntento, gbc);

        gbc.gridx = 5;
        txtNroIntentoEnvioSunat = new JTextField();
        txtNroIntentoEnvioSunat.setEnabled(false);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtNroIntentoEnvioSunat, gbc);
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridy = 3;
        gbc.gridx = 1;
        chkPdfSunat = new JCheckBox("Pdf");
        chkPdfSunat.setEnabled(false);
        pnl.add(chkPdfSunat, gbc);

        gbc.gridx = 2;
        chkCorreoEnviadoSunat = new JCheckBox("Correo Enviado");
        chkCorreoEnviadoSunat.setEnabled(false);
        pnl.add(chkCorreoEnviadoSunat, gbc);

        gbc.gridx = 3;
        chkRegistroDuplicadoSunat = new JCheckBox("Reg Duplicado");
        chkRegistroDuplicadoSunat.setEnabled(false);
        pnl.add(chkRegistroDuplicadoSunat, gbc);

        return pnlPrinc;
    }

    private void envioDocumentoSunat() throws Exception {
        try {
            btnEnvioDocumento.setEnabled(false);
            String idRegconta = docVenta.getIdRegconta();
            RnRegconta logic = new RnRegconta(path);
            ContaCab contaCab = logic.detalleVentaFe(idRegconta);
            ConvertDataSunat sunat = new ConvertDataSunat(path, usuario);
            ResultSfs resultSfs = sunat.sendDataSunat(idRegconta, contaCab);
            if (resultSfs != null) {
                JOptionPane.showMessageDialog(this, "Documento enviado correctamente");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void reenvioDocumentoSunat() throws Exception {
        try {
            btnReenvioDocumento.setEnabled(false);
            String idRegconta = docVenta.getIdRegconta();
            RnRegconta logic = new RnRegconta(path);
            ContaCab contaCab = logic.detalleVentaFe(idRegconta);
            ConvertDataSunat sunat = new ConvertDataSunat(path, usuario);
            ResultSfs resultSfs = sunat.reenvioDataSunat(idRegconta, contaCab);
            if (resultSfs != null) {
                JOptionPane.showMessageDialog(this, "Documento reenviado correctamente");
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void getPdfDocumento() throws Exception {
        try {
            ConvertDataSunat sunat = new ConvertDataSunat(path, usuario);
            String nameFile = docVenta.getIdTipoDoc() + "-" + docVenta.getSerie() + "-" + docVenta.getPreimpreso() + ".pdf";
            sunat.getPdfDocument(docVenta.getIdRegconta(), docVenta.getUrlPdf(), nameFile);
        } catch (Exception e) {
            throw e;
        }
    }

    private void reinicioDocumentoSunat() throws MalformedURLException, IOException, Exception {
        btnReiniciarEnvio.setEnabled(false);
        logger.info("ReinicioDocumentoSunat");
        String resource = "facturacion/reiniciarIntentoEnvioSunat?idDocumento=" + this.idDocumentoSunat;
        try {
            String rpta = this.callServiceRest(resource, "PUT");
            logger.info("Reintento Documento " + rpta);
        } catch (Exception e) {
            throw e;
        }
    }

    private void resumenDocumentoSunat() throws MalformedURLException, IOException, Exception {
        btnResumen.setEnabled(false);
        logger.info("resumenDocumentoSunat");
        String resource = "facturacion/resumenDocumento?idRegconta=" + docVenta.getIdRegconta();
        try {
            String rpta = this.callServiceRest(resource, "GET");
            logger.info("Resumen Documento " + rpta);
        } catch (Exception e) {
            throw e;
        }
    }

    private void anularDocumentoSunat() throws MalformedURLException, IOException, Exception {
        btnReintentoAnulado.setEnabled(false);
        logger.info("anularDocumentoSunat");
        String resource = "facturacion/anularDocumento?idRegconta=" + docVenta.getIdRegconta() + "&isCorreo=false";
        try {
            String rpta = this.callServiceRest(resource, "GET");
            logger.info("Anular Documento " + rpta);
        } catch (Exception e) {
            throw e;
        }
    }

    private String callServiceRest(String resource, String method) throws MalformedURLException, IOException, Exception {
        HttpURLConnection conn = null;
        try {
            ReadProperties r = ReadProperties.Instance(path);
            String servicioSunat = r.SERVICIO_SUNAT;
            URL url = new URL(servicioSunat + resource);
            conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod(method);
            if (conn.getResponseCode() != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : "
                        + conn.getResponseCode());
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));

            String output;
            String msg = "";
            while ((output = br.readLine()) != null) {
                msg += output;
            }
            return msg;
        } catch (MalformedURLException e) {
            throw e;
        } catch (IOException e) {
            throw e;
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnPdf)) {
                this.getPdfDocumento();
            }
            if (e.getSource().equals(btnEnvioDocumento)) {
                this.envioDocumentoSunat();
            }
            if (e.getSource().equals(btnReenvioDocumento)) {
                this.reenvioDocumentoSunat();
            }
            if (e.getSource().equals(btnReiniciarEnvio)) {
                this.reinicioDocumentoSunat();
            }
            if (e.getSource().equals(btnResumen)) {
                this.resumenDocumentoSunat();
            }
            if (e.getSource().equals(btnReintentoAnulado)) {
                this.anularDocumentoSunat();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    public void setDocVenta(DocumentoVenta docVenta) {
        this.docVenta = docVenta;
    }

    public void loadDataVenta() {
        if (this.docVenta == null) {
            return;
        }
        String idRegconta = docVenta.getIdRegconta();
        txtCodigo.setText(idRegconta);
        dcFechaEmision.setDate(docVenta.getFechaEmision());
        txtTipoDoc.setText(docVenta.getIdTipoDoc());
        txtSerie.setText(docVenta.getSerie());
        txtPreimpreso.setText(docVenta.getPreimpreso());
        txtDocCliente.setText(docVenta.getNumeroDocumento());
        txtNombreCliente.setText(docVenta.getNombreCliente());
        txtMoneda.setText(docVenta.getMoneda());
        txtMonto.setText(docVenta.getMonto().toString());
        txtEstado.setText(docVenta.getEstado());
        chkEnviadoFacturador.setSelected(docVenta.isEnviadoSunat());
        this.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc);
        this.loadDataSunat(idRegconta);
        this.pack();
    }

    private void hiddenSunat() {
        btnPdf.setVisible(false);
        btnReintentoAnulado.setVisible(false);
        btnEnvioDocumento.setVisible(false);
        btnResumen.setVisible(false);
        btnReiniciarEnvio.setVisible(false);
        btnReenvioDocumento.setVisible(false);
        pnlSunat.setVisible(false);
        this.pack();
    }

    private void loadDataSunat(String idRegconta) {
        DocumentoGralQuery docGral = this.getDocumentoGralSunat(idRegconta);
        if (this.httpCode != HttpURLConnection.HTTP_OK) {
            this.hiddenSunat();
            return;
        }
        if (docGral == null) {
            this.hiddenSunat();
            return;
        }
        DocumentoQuery docQuery = docGral.getDocumentoQuery();
        if (docQuery == null) {
            this.hiddenSunat();
            btnEnvioDocumento.setVisible(true);
            return;
        }
        this.idDocumentoSunat = docQuery.getIdDocumento();
        chkAnuladoSunat.setSelected(docQuery.isIsAnulado());
        chkXmlSunat.setSelected(docQuery.isIsXml());
        chkXmlFirmadoSunat.setSelected(docQuery.isIsXmlFirmado());
        chkEnviadoSunat.setSelected(docQuery.isIsEnviadoSunat());
        chkAceptadoSunat.setSelected(docQuery.isIsAceptado());
        chkPdfSunat.setSelected(docQuery.isIsPdf());
        chkCorreoEnviadoSunat.setSelected(docQuery.isIsCorreoEnviado());
        chkRegistroDuplicadoSunat.setSelected(docGral.isSwDocDuplicado());
        chkRegistroDuplicadoSunat.setVisible(docGral.isSwDocDuplicado());
        txtObservacionesSunat.setText(docQuery.getObservaciones());
        txtCorreoClienteSunat.setText(docQuery.getCorreoCliente());
        txtNroIntentoEnvioSunat.setText(String.valueOf(docQuery.getNumeroIntentoEnvio()));
        btnPdf.setVisible(docQuery.isIsPdf());
        btnEnvioDocumento.setVisible(false);
        this.loadDataAnulado(docGral.getAnulado(), docQuery.isIsAnulado(), docVenta.getEstado().trim(), docQuery);
        this.loadDataResumen(docGral.getResumen(), docQuery);
        this.showHiddenReintentoEnvio(docQuery);
    }

    private void showHiddenReintentoEnvio(DocumentoQuery docQuery) {
        this.setVisibleBtnReenvio();
        if (docQuery.isIsAceptado()) {
            btnReiniciarEnvio.setVisible(false);
            btnReenvioDocumento.setVisible(false);
            return;
        }
        Date now = new Date();
        int diferenciaDias = numeroDiasEntreDosFechas(docVenta.getFechaEmision(), now);
        if (diferenciaDias > 7) {
            btnReiniciarEnvio.setVisible(false);
            btnReenvioDocumento.setVisible(false);
            return;
        }
        boolean isVisible = docQuery.getNumeroIntentoEnvio() > 20;
        btnReiniciarEnvio.setVisible(isVisible);
        if (isVisible) {
            this.setVisibleBtnReenvio();
        }
    }

    private void setVisibleBtnReenvio() {
        String resource = "consulta/documento/totalfallosenvio?idReferencia=" + docVenta.getIdRegconta();
        try {
            String rpta = this.callServiceRest(resource, "GET");
            logger.info("TotalErroresEnvio " + rpta);
            Long total=new Long(rpta);
            if (total>0){
                btnReenvioDocumento.setVisible(true);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
        }
    }

    public static int numeroDiasEntreDosFechas(Date fecha1, Date fecha2) {
        long startTime = fecha1.getTime();
        long endTime = fecha2.getTime();
        long diffTime = endTime - startTime;
        long diffDays = diffTime / (1000 * 60 * 60 * 24);
        return (int) diffDays;
    }

    private void loadDataAnulado(AnuladoQuery anulado, boolean isDocAnulado, String estado, DocumentoQuery docQuery) {
        if (anulado == null) {
            pnlAnuladoSunat.setVisible(false);
            if (isDocAnulado || estado.equals("ANU")) {
                btnReintentoAnulado.setVisible(true);
            }
            return;
        }
        if (!anulado.isIsEnvioDirecto()) {
            pnlAnuladoSunat.setVisible(false);
            if ((isDocAnulado || estado.equals("ANU")) && docQuery.isIsEnvioDirecto()) {
                btnReintentoAnulado.setVisible(true);
            }
            return;
        }
        btnReintentoAnulado.setVisible(false);
        txtDocumentoAnulado.setText(anulado.getTipoDoc() + "-" + anulado.getFechaSerie() + "-" + anulado.getCorrelativo());
        dcFechaAnulado.setDate(anulado.getFechaRef());
        txtObservacionesAnulado.setText(anulado.getObservaciones());
        txtNroTicketAnulado.setText(anulado.getNroTicket());
        chkXmlAnulado.setSelected(anulado.isIsXml());
        chkXmlFirmadoAnulado.setSelected(anulado.isIsXmlFirmado());
        chkEnviadoAnulado.setSelected(anulado.isIsEnviadoSunat());
        chkAceptadoAnulado.setSelected(anulado.isIsAceptado());
    }

    private void loadDataResumen(AnuladoQuery resumen, DocumentoQuery docQuery) {
        if (resumen == null) {
            pnlResumenSunat.setVisible(false);
            this.showHiddenResumen(docQuery);
            return;
        }
        btnResumen.setVisible(false);
        txtDocumentoResumen.setText(resumen.getTipoDoc() + "-" + resumen.getFechaSerie() + "-" + resumen.getCorrelativo());
        dcFechaResumen.setDate(resumen.getFechaRef());
        txtObservacionesResumen.setText(resumen.getObservaciones());
        txtNroTicketResumen.setText(resumen.getNroTicket());
        chkXmlResumen.setSelected(resumen.isIsXml());
        chkXmlFirmadoResumen.setSelected(resumen.isIsXmlFirmado());
        chkEnviadoResumen.setSelected(resumen.isIsEnviadoSunat());
        chkAceptadoResumen.setSelected(resumen.isIsAceptado());
    }

    private void showHiddenResumen(DocumentoQuery docQuery) {
        if (!docVenta.getIdTipoDoc().equals(TipoDocVentaEnum.BOLETA.getValue())) {
            btnResumen.setVisible(false);
            return;
        }
        if (docQuery.isIsAceptado()) {
            btnResumen.setVisible(false);
            return;
        }
        btnResumen.setVisible(true);
    }

    private DocumentoGralQuery getDocumentoGralSunat(String idRegconta) {
        HttpURLConnection conn = null;
        try {
            ReadProperties r = ReadProperties.Instance(path);
            String servicioSunat = r.SERVICIO_SUNAT;
            URL url = new URL(servicioSunat + "consulta/documento/general?idReferencia=" + idRegconta);
            conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("GET");
            this.httpCode = conn.getResponseCode();
            logger.info("httpCode: " + httpCode);
            if (this.httpCode != HttpURLConnection.HTTP_OK) {
                throw new RuntimeException("Failed : HTTP error code : "
                        + conn.getResponseCode());
            }
            BufferedReader br = new BufferedReader(new InputStreamReader(
                    (conn.getInputStream())));
            String output;
            String msg = "";
            while ((output = br.readLine()) != null) {
                msg += output;
            }
            logger.info(msg);
            DocumentoGralQuery DocGral = new Gson().fromJson(msg, DocumentoGralQuery.class);
            return DocGral;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return null;
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private void buscarTipoDocVenta(JTextField txtTd, JTextField txtTdDesc) {
        try {
            RnTipoDocVenta logicTipoDocVenta = new RnTipoDocVenta(path);
            if (txtTd.getText().trim().length() > 0) {
                BeanTipoDocVenta beanTipoDocVenta = logicTipoDocVenta.getTipoDocVenta(txtTd.getText().trim(), "", "", "");
                if (beanTipoDocVenta != null) {
                    txtTdDesc.setText(beanTipoDocVenta.getDescripcion());
                }
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

}
