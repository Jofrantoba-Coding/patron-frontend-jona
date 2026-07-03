package com.softcommerce.views.uipnldocumentossunat;


import com.softcommerce.formularios.sunat.*;
import com.softcommerce.formularios.*;
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

public class UiPnlDocumentosSunat
        extends JInternalFrame
        implements InterUiPnlDocumentosSunat, ActionListener, FocusListener {

    protected final URL path;
    protected final Main frmMain;
    protected final Usuario usuario;
    protected Gif gif;
    protected JComboBox cboMes;
    protected JTable tableDocSunat;
    protected DocumentoSunatTableModel modeltableDocSunat;
    protected TableRowSorter<DocumentoSunatTableModel> modeloOrdenadoDocSunat;
    protected JButton btnBuscar;
    protected JTextField txtSerie;
    protected JTextField txtPreimpreso;
    protected JButton btnExportar;
    protected JButton btnDetalle;
    protected final Logger logger = Logger.getLogger(UiPnlDocumentosSunat.class);

    public UiPnlDocumentosSunat(String title, URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
    }

    protected void inicialize() {
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

    protected void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(500, 500));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    protected void loadCombo() {
    }

    protected void loadComboMes() {
    }

    protected void initListener() {
    }

    protected JPanel getPnlDocumentosSunat() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(this.getPnlFiltrosDocumentoSunat(), BorderLayout.NORTH);
        pnl.add(getPnlTableDocSunat(), BorderLayout.CENTER);
        pnl.add(getPnlOpcDocSunat(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlOpcDocSunat() {
        return null;
    }

    protected JPanel getPnlTableDocSunat() {
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

    protected JPanel getPnlFiltrosDocumentoSunat() {
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

    protected void cargarDocumentoSunat() throws Exception {
    }

    protected List<DocumentoVenta> getListDocVenta() throws Exception {
        return null;
    }

    protected DocumentoQuery getDocumentByIdReferencia(DocumentoVenta docVenta, List<DocumentoQuery> listDocSunat) {
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

    protected List<DocumentoQuery> getListDocumentosSunat(String anio, Integer mes) {
        return null;
    }

    protected void filtrarDocSunat() {
    }

    protected RowFilter getFilterDocSunat() {
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

    protected void exportar(JTable tableExport, String nombreArxivo) {
    }

    protected void cargarDetalleSunat() {
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
