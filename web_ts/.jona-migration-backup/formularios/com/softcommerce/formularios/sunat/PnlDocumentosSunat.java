package com.softcommerce.formularios.sunat;

import com.google.gson.Gson;
import com.softcommerce.beans.Usuario;
import com.softcommerce.enums.MesEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.formularios.ReadProperties;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.sunat.DocumentoSunatTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.util.ColumnGroup;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadComboItem;
import com.softcommerce.util.render.CellRender;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Arrays;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;
import java.lang.reflect.Type;
import com.google.gson.reflect.TypeToken;
import com.softcommerce.beans.sunat.DocumentoQuery;
import com.softcommerce.beans.sunat.DocumentoVenta;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.util.ExportarToExcel;
import com.softcommerce.util.FormatObject;
import com.softcommerce.util.GroupableTableHeaderLabel;
import java.awt.HeadlessException;
import java.awt.Insets;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.table.TableColumnModel;

public class PnlDocumentosSunat
        extends JInternalFrame
        implements ActionListener, FocusListener {

    private final URL path;
    private final Main frmMain;
    private final Usuario usuario;
    private Gif gif;
    private JComboBox cboMes;
    private JTable tableDocSunat;
    private DocumentoSunatTableModel modeltableDocSunat;
    private TableRowSorter<DocumentoSunatTableModel> modeloOrdenadoDocSunat;
    private JButton btnBuscar;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    private JButton btnExportar;
    private JButton btnDetalle;
    private final Logger logger = Logger.getLogger(PnlDocumentosSunat.class);

    public PnlDocumentosSunat(String title, URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    private void inicialize() {
        gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        JTabbedPane tabb = new JTabbedPane();
        tabb.add("Consulta Sunat", this.getPnlDocumentosSunat());
        pnl.add(tabb, BorderLayout.CENTER);
        this.getContentPane().add(pnl);
        configurarInternal();
        loadCombo();
        pack();
    }

    private void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(500, 500));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private void loadCombo() {
        try {
            this.loadComboMes();
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadComboMes() {
        MesEnum[] listMes = MesEnum.values();
        for (MesEnum estMes : listMes) {
            cboMes.addItem(new ObjectItem(estMes.name(), estMes.getValue()));
        }
    }

    private void initListener() {
        btnBuscar.addActionListener(this);
        btnExportar.addActionListener(this);
        btnDetalle.addActionListener(this);
        txtPreimpreso.addFocusListener(this);
        txtSerie.addFocusListener(this);
    }

    private JPanel getPnlDocumentosSunat() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(this.getPnlFiltrosDocumentoSunat(), BorderLayout.NORTH);
        pnl.add(getPnlTableDocSunat(), BorderLayout.CENTER);
        pnl.add(getPnlOpcDocSunat(), BorderLayout.SOUTH);
        return pnl;
    }

    private JPanel getPnlOpcDocSunat() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnlOpc = new JPanel();
        btnExportar = new JButton("Exportar", gif.EXCEL);
        pnlOpc.add(btnExportar);
        btnDetalle = new JButton("Detalle", gif.DETAIL16);
        pnlOpc.add(btnDetalle);
        return pnlOpc;
    }

    private JPanel getPnlTableDocSunat() {
        JPanel pnlTable = new JPanel(new BorderLayout());
        pnlTable.setLayout(new BorderLayout(0, 0));
        pnlTable.setBackground(new Color(245, 245, 245));
        modeltableDocSunat = new DocumentoSunatTableModel();
        modeloOrdenadoDocSunat = new TableRowSorter(modeltableDocSunat);
        tableDocSunat = new JTable();
        tableDocSunat.setFont(new Font("Tahoma", Font.PLAIN, 11));
        tableDocSunat.setRowHeight(19);
        tableDocSunat.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        tableDocSunat.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        tableDocSunat.setRowSorter(modeloOrdenadoDocSunat);
        tableDocSunat.setModel(modeltableDocSunat);
        TableColumnModel cm = tableDocSunat.getColumnModel();
        GroupableTableHeaderLabel header = new GroupableTableHeaderLabel(cm);
        String nombreGrupoSunat = "DATOS SUNAT";
        ColumnGroup gNameSunat = new ColumnGroup(nombreGrupoSunat);
        gNameSunat.add(cm.getColumn(12));
        gNameSunat.add(cm.getColumn(13));
        gNameSunat.add(cm.getColumn(14));
        gNameSunat.add(cm.getColumn(15));
        gNameSunat.add(cm.getColumn(16));
        gNameSunat.add(cm.getColumn(17));
        gNameSunat.add(cm.getColumn(18));
        header.addColumnGroup(gNameSunat);
        tableDocSunat.setTableHeader(header);
        tableDocSunat.getColumnModel().getColumn(11).setCellRenderer(new CellRender());
        List<Integer> listColumns = Arrays.asList(1, 2, 3);
        CTableFx.minimizeWidthColumn(tableDocSunat, listColumns);
        JScrollPane scrollCxC = new JScrollPane(tableDocSunat);
        scrollCxC.setPreferredSize(new Dimension(1200, 250));
        pnlTable.add(scrollCxC, BorderLayout.CENTER);
        return pnlTable;
    }

    private JPanel getPnlFiltrosDocumentoSunat() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnlPrinc.add(pnl, BorderLayout.WEST);
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();
        Border border = BorderFactory.createTitledBorder(null, "Filtros",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JLabel lblMes = new JLabel("Mes");
        pnl.add(lblMes, gbc);

        gbc.gridx = 1;
        gbc.gridwidth = 2;
        cboMes = new JComboBox();
        pnl.add(cboMes, gbc);
        gbc.gridwidth = 1;

        gbc.gridx = 3;
        btnBuscar = new JButton("Buscar", gif.SEARCH16);
        pnl.add(btnBuscar, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblNumDoc = new JLabel("N° Doc");
        pnl.add(lblNumDoc, gbc);

        gbc.gridx = 1;
        txtSerie = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerie);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtSerie, gbc);

        gbc.gridx = 2;
        txtPreimpreso = new JTextField();
        txtPreimpreso.setDocument(new IntegerDocument(10));
        txtPreimpreso.setColumns(7);
        gbc.insets = new Insets(2, 0, 2, 2);
        pnl.add(txtPreimpreso, gbc);

        gbc.insets = new Insets(2, 2, 2, 2);

        return pnlPrinc;
    }

    private void cargarDocumentoSunat() throws Exception {
        try {
            modeltableDocSunat.clearTable();
            modeltableDocSunat.agregarListDocumentosVentas(this.getListDocVenta());
            //modeloOrdenadoDocSunat.setRowFilter(getFilterCxC());
            modeltableDocSunat.fireTableDataChanged();
            CTableFx.setAllColumnPreferredWidth(tableDocSunat);
        } catch (Exception e) {
            throw e;
        }
    }

    private List<DocumentoVenta> getListDocVenta() throws Exception {
        try {
            RnConsultas logicConsulta = new RnConsultas(path);
            String mes = LoadComboItem.getIdCombo(cboMes);
            List<DocumentoVenta> listDocsLocal = logicConsulta.listarDocumentosSunat(frmMain.getAnio(), mes);
            List<DocumentoQuery> listDocSunat = this.getListDocumentosSunat(frmMain.getAnio(), Integer.parseInt(mes));
            if (listDocSunat == null) {
                return listDocsLocal;
            }
            for (DocumentoVenta docVenta : listDocsLocal) {
                docVenta.setDocumentoQuery(getDocumentByIdReferencia(docVenta, listDocSunat));
            }
            return listDocsLocal;
        } catch (Exception e) {
            throw e;
        }
    }

    private DocumentoQuery getDocumentByIdReferencia(DocumentoVenta docVenta, List<DocumentoQuery> listDocSunat) {
        //logger.info("listDocSunat.size(): " + listDocSunat.size());
        Iterator<DocumentoQuery> i = listDocSunat.iterator();
        while (i.hasNext()) {
            DocumentoQuery doc = i.next();
            if (doc.getIdReferencia().equals(docVenta.getIdRegconta())) {
                i.remove();
                return doc;
            }
        }
        return null;
    }

    private List<DocumentoQuery> getListDocumentosSunat(String anio, Integer mes) {
        HttpURLConnection conn = null;
        try {
            ReadProperties r = ReadProperties.Instance(path);
            String servicioSunat = r.SERVICIO_SUNAT;
            URL url = new URL(servicioSunat + "consulta/documento/list?anio=" + anio + "&mes=" + mes);
            conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("GET");
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
            logger.info(msg);
            Type listType = new TypeToken<ArrayList<DocumentoQuery>>() {
            }.getType();
            List<DocumentoQuery> lstDocSunat = new Gson().fromJson(msg, listType);
            logger.info(lstDocSunat.size());
            return lstDocSunat;
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

    private void filtrarDocSunat() {
        modeloOrdenadoDocSunat.setRowFilter(getFilterDocSunat());
        CTableFx.setAllColumnPreferredWidth(tableDocSunat);
    }

    private RowFilter getFilterDocSunat() {
        List filters = new ArrayList();
        if (txtSerie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtSerie.getText().trim() + ".*", 2));
        }
        if (txtPreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtPreimpreso.getText().trim() + ".*", 3));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private void exportar(JTable tableExport, String nombreArxivo) {
        try {
            if (tableExport.getRowCount() == 0) {
                return;
            }
            File archivo = File.createTempFile(nombreArxivo + (new Date()).getTime(), ".xlsx");
            archivo.deleteOnExit();
            ExportarToExcel export = new ExportarToExcel(archivo, tableExport);
            if (export.exportarJTableToExcel()) {
                JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
            }
        } catch (IOException | HeadlessException e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarDetalleSunat() {
        if (tableDocSunat.getRowCount() == 0 || tableDocSunat.getSelectedRow() < 0) {
            return;
        }
        int visibleRowIndex = tableDocSunat.getSelectedRow();
        if (visibleRowIndex < 0) {
            return;
        }
        int realRowIndex = tableDocSunat.convertRowIndexToModel(visibleRowIndex);
        //PnlCxcCancelacion objCxcCanc = new PnlCxcCancelacion(frmMain, path, usuario, modeltableCxC.getCxC(realRowIndex));
        //objCxcCanc.setVisible(true);
        DocumentoVenta docVenta = modeltableDocSunat.getDocumentoVenta(realRowIndex);
        FrmDetalleDocSunat frmDetalle = new FrmDetalleDocSunat(path, frmMain, this.usuario);
        frmDetalle.setDocVenta(docVenta);
        frmDetalle.loadDataVenta();
        frmDetalle.setVisible(true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnBuscar)) {
                this.cargarDocumentoSunat();
            }
            if (e.getSource().equals(btnExportar)) {
                exportar(tableDocSunat, "DocumentosSunat");
            }
            if (e.getSource().equals(btnDetalle)) {
                this.cargarDetalleSunat();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txtSerie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
            filtrarDocSunat();
        }
        if (e.getSource().equals(txtPreimpreso)) {
            FormatObject.formatPreimpreso((JTextField) e.getSource());
            filtrarDocSunat();
        }
    }
}
