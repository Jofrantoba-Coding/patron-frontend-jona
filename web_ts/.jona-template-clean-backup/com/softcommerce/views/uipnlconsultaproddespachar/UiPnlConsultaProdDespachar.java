/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlconsultaproddespachar;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.BeanTipoDocVenta;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.MovProducto;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.conta.formularios.FormBuscarTipoDocVenta;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.MovProductoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnTipoDocVenta;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExportarToExcel;
import com.softcommerce.util.FormatObject;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JInternalFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.event.ChangeEvent;
import javax.swing.event.ChangeListener;
import javax.swing.event.DocumentEvent;
import javax.swing.event.DocumentListener;
import javax.swing.table.TableRowSorter;

/**
 *
 * @author Team Develtrex
 */
public class UiPnlConsultaProdDespachar extends JInternalFrame implements InterUiPnlConsultaProdDespachar, KeyListener, FocusListener, ActionListener, ChangeListener, MouseListener, DocumentListener {

    protected java.net.URL path;
    protected Main frmMain;
    protected Usuario usuario;
    protected Gif gif;
    protected JComboBox cboPtoVta;
    protected JComboBox cboAlmacen;
    protected JComboBox cboFamilia;
    protected JComboBox cboSubFamilia;
    protected JComboBox cboMarca;
    protected JComboBox cboUm;
    protected JComboBox cboTamano;
    protected JButton btnNuevo;
    protected JButton btnBuscar;
    protected JTextField txtIdItem;
    protected JTextField txtDescripcionItem;
    protected JDateChooser dc_fechafin;
    protected List<BeanFamilia> listFamilia;
    protected List<BeanSubFamilia> listSubFamilia;
    protected List<BeanMarca> listMarca;
    protected List<BeanUnidadMedida> listUm;
    protected List<BeanTamano> listTamano;
    protected List<PuntoVenta> listPtoVta;
    protected List<Almacen> listAlmacen;
    protected JTabbedPane tabb;
    protected MovProductoTableModel modelDespachar;
    protected TableRowSorter<MovProductoTableModel> modeloOrdenadoDespachar;
    protected CTable tableDespachar;
    protected MovProductoTableModel modelCliente;
    protected TableRowSorter<MovProductoTableModel> modeloOrdenadoCliente;
    protected CTable tableCliente;
    protected MovProductoTableModel modelItem;
    protected TableRowSorter<MovProductoTableModel> modeloOrdenadoItem;
    protected CTable tableItem;
    protected JTextField txtTipoDoc;
    protected JTextField txtTipoDocDesc;
    protected JTextField txtSerie;
    protected JTextField txtPreimpreso;
    protected JTextField txtAnexo;
    protected JTextField txtAnexoDesc;
    protected JButton btnSalir;
    protected JButton btnExportar;

    public UiPnlConsultaProdDespachar(String title, java.net.URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
        cargarDatos();
    }

    protected void inicialize() {
        gif = new Gif();
        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        getContentPane().add(pnlPrincipal);
        pnlPrincipal.add(getPnlFilter(), BorderLayout.NORTH);
        pnlPrincipal.add(getPnlCenter(), BorderLayout.CENTER);
        pnlPrincipal.add(getPnlOpciones(), BorderLayout.SOUTH);
        configurarInternal();
        pack();
    }

    protected JPanel getPnlOpciones() {
        return null;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        tabb = new JTabbedPane();
        tabb.add("General", getPnlDespacho());
        tabb.add("Resumido por Cliente", getPnlCliente());
        tabb.add("Resumido por Item", getPnlItem());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlDespacho() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modelDespachar = new MovProductoTableModel();
        tableDespachar = new CTable();
        tableDespachar.setModel(modelDespachar);
        tableDespachar.setAllTableNoEditable();
        modeloOrdenadoDespachar = new TableRowSorter(modelDespachar);
        tableDespachar.setRowSorter(modeloOrdenadoDespachar);
        //tbl_inventario.setModel(modelStock);
        tableDespachar.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableDespachar.setNoVisibleColumn(2);
        tableDespachar.setNoVisibleColumn(4);
        tableDespachar.setNoVisibleColumn(6);
        tableDespachar.setNoVisibleColumn(8);
        tableDespachar.setNoVisibleColumn(10);
        tableDespachar.setNoVisibleColumn(14);
        tableDespachar.setNoVisibleColumn(15);
        tableDespachar.setNoVisibleColumn(16);
        tableDespachar.setNoVisibleColumn(17);
        tableDespachar.setNoVisibleColumn(22);
        tableDespachar.setNoVisibleColumn(24);
        tableDespachar.setNoVisibleColumn(26);
        tableDespachar.setNoVisibleColumn(27);
        tableDespachar.setNoVisibleColumn(28);
        tableDespachar.setNoVisibleColumn(29);
        tableDespachar.setNoVisibleColumn(30);
        tableDespachar.setNoVisibleColumn(31);
        tableDespachar.setNoVisibleColumn(32);
        JScrollPane jsp = new JScrollPane(tableDespachar);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlItem() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modelItem = new MovProductoTableModel();
        tableItem = new CTable();
        tableItem.setModel(modelItem);
        tableItem.setAllTableNoEditable();
        modeloOrdenadoItem = new TableRowSorter(modelItem);
        tableItem.setRowSorter(modeloOrdenadoItem);
        //tbl_inventario.setModel(modelStock);
        tableItem.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableItem.setNoVisibleColumn(2);
        tableItem.setNoVisibleColumn(4);
        tableItem.setNoVisibleColumn(6);
        tableItem.setNoVisibleColumn(8);
        tableItem.setNoVisibleColumn(10);
        tableItem.setNoVisibleColumn(12);
        tableItem.setNoVisibleColumn(13);
        tableItem.setNoVisibleColumn(14);
        tableItem.setNoVisibleColumn(15);
        tableItem.setNoVisibleColumn(16);
        tableItem.setNoVisibleColumn(17);
        tableItem.setNoVisibleColumn(18);
        tableItem.setNoVisibleColumn(20);
        tableItem.setNoVisibleColumn(21);
        tableItem.setNoVisibleColumn(22);
        tableItem.setNoVisibleColumn(24);
        tableItem.setNoVisibleColumn(26);
        tableItem.setNoVisibleColumn(27);
        tableItem.setNoVisibleColumn(28);
        tableItem.setNoVisibleColumn(29);
        tableItem.setNoVisibleColumn(30);
        tableItem.setNoVisibleColumn(31);
        tableItem.setNoVisibleColumn(32);
        JScrollPane jsp = new JScrollPane(tableItem);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlCliente() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modelCliente = new MovProductoTableModel();
        tableCliente = new CTable();
        tableCliente.setModel(modelCliente);
        tableCliente.setAllTableNoEditable();
        modeloOrdenadoCliente = new TableRowSorter(modelCliente);
        tableCliente.setRowSorter(modeloOrdenadoCliente);
        //tbl_inventario.setModel(modelStock);
        tableCliente.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableCliente.setNoVisibleColumn(2);
        tableCliente.setNoVisibleColumn(4);
        tableCliente.setNoVisibleColumn(6);
        tableCliente.setNoVisibleColumn(8);
        tableCliente.setNoVisibleColumn(10);
        tableCliente.setNoVisibleColumn(12);
        tableCliente.setNoVisibleColumn(13);
        tableCliente.setNoVisibleColumn(14);
        tableCliente.setNoVisibleColumn(15);
        tableCliente.setNoVisibleColumn(16);
        tableCliente.setNoVisibleColumn(17);
        tableCliente.setNoVisibleColumn(20);
        tableCliente.setNoVisibleColumn(21);
        tableCliente.setNoVisibleColumn(22);
        tableCliente.setNoVisibleColumn(23);
        tableCliente.setNoVisibleColumn(24);
        tableCliente.setNoVisibleColumn(25);
        tableCliente.setNoVisibleColumn(26);
        tableCliente.setNoVisibleColumn(27);
        tableCliente.setNoVisibleColumn(28);
        tableCliente.setNoVisibleColumn(29);
        tableCliente.setNoVisibleColumn(30);
        tableCliente.setNoVisibleColumn(31);
        tableCliente.setNoVisibleColumn(32);
        JScrollPane jsp = new JScrollPane(tableCliente);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected void cargarTablaDespacho() {
    }

    protected void cargarTablaItem() {
    }

    protected void cargarTablaCliente() {
    }

    protected void cargarDatos() {
    }

    protected void loadPuntoVenta() {
    }

    protected void loadTamano() {
    }

    protected void loadUnidadMedida() {
    }

    public void loadMarca() throws Exception {
    }

    protected void loadFamilia() throws Exception {
    }

    public void loadAlmacen(String xcodPuntoventa) {
    }

    public void loadSubFamilia(String xcodfamilia) {
    }

    protected JPanel getPnlFilter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        pnl.add(getPnlFiltrosLeft(), BorderLayout.WEST);
        return pnl;
    }

    protected JPanel getPnlFiltrosLeft() {
        JPanel pnlFiltro = new JPanel();
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();

        JLabel lblPuntoVenta = new JLabel("P.Venta");
        lblPuntoVenta.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblPuntoVenta, gbc);

        cboPtoVta = new JComboBox();
        gbc.gridx = 1;
        pnlFiltro.add(cboPtoVta, gbc);

        JLabel lblAlmacen = new JLabel("Almacén");
        lblAlmacen.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnlFiltro.add(lblAlmacen, gbc);

        cboAlmacen = new JComboBox();
        gbc.gridx = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboAlmacen, gbc);
        gbc.fill = GridBagConstraints.NONE;

        btnNuevo = new JButton(gif.NEW16);
        btnNuevo.setHorizontalTextPosition(SwingConstants.LEFT);
        btnNuevo.setToolTipText("Filtrar");
        btnNuevo.setContentAreaFilled(true);
        btnNuevo.setBorderPainted(true);
        btnNuevo.setFocusable(true);
        btnNuevo.setFocusPainted(false);
        gbc.gridx = 4;
        pnlFiltro.add(this.btnNuevo, gbc);

        btnBuscar = new JButton(gif.SEARCH16);
        btnBuscar.setHorizontalTextPosition(SwingConstants.LEFT);
        btnBuscar.setToolTipText("Buscar");
        btnBuscar.setContentAreaFilled(true);
        btnBuscar.setBorderPainted(true);
        btnBuscar.setFocusable(true);
        btnBuscar.setFocusPainted(false);
        gbc.gridx = 5;
        gbc.anchor = GridBagConstraints.WEST;
        pnlFiltro.add(this.btnBuscar, gbc);

        JLabel lblAnexoPadre = new JLabel("Cliente");
        gbc.gridx = 6;
        gbc.insets = new Insets(2, 0, 2, 1);
        pnlFiltro.add(lblAnexoPadre, gbc);

        txtAnexo = new JTextField();
        txtAnexo.setBackground(Color.YELLOW);
        txtAnexo.setDocument(new IntegerDocument(11));
        txtAnexo.setColumns(7);
        gbc.gridx = 7;
        gbc.insets = new Insets(2, 1, 2, 0);
        gbc.gridwidth = 2;
        pnlFiltro.add(txtAnexo, gbc);

        //
        txtAnexoDesc = new JTextField();
        txtAnexoDesc.setEnabled(false);
        //gbc.gridwidth = 6;
        gbc.gridx = 9;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridwidth = 4;
        pnlFiltro.add(txtAnexoDesc, gbc);
        gbc.gridwidth = 1;

        gbc.fill = GridBagConstraints.NONE;
        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lbl_familia = new JLabel("Familia");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlFiltro.add(lbl_familia, gbc);

        cboFamilia = new JComboBox();
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboFamilia, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnlFiltro.add(lbl_subfamilia, gbc);

        cboSubFamilia = new JComboBox();
        gbc.gridx = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboSubFamilia, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lblMarca, gbc);

        cboMarca = new JComboBox();
        gbc.gridx = 5;
        pnlFiltro.add(cboMarca, gbc);

        JLabel lblTipoDoc = new JLabel("T. Doc.");
        //lblFechaIni.setDisplayedMnemonic('a');
        gbc.gridx = 6;
        pnlFiltro.add(lblTipoDoc, gbc);

        txtTipoDoc = new JTextField();
        txtTipoDoc.setDocument(new UpperCaseNumberDocument(2));
        txtTipoDoc.setColumns(2);
        gbc.gridx = 7;
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlFiltro.add(txtTipoDoc, gbc);

        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setEnabled(false);
        txtTipoDocDesc.setColumns(15);
        gbc.gridwidth = 2;
        gbc.gridx = 8;
        gbc.insets = new Insets(2, 0, 2, 5);
        pnlFiltro.add(txtTipoDocDesc, gbc);
        gbc.gridwidth = 1;
        //
        JLabel lblNumDoc = new JLabel("N° Doc");
        gbc.gridx = 10;
        gbc.insets = new Insets(2, 2, 2, 1);
        pnlFiltro.add(lblNumDoc, gbc);
        //
        txtSerie = new JTextField();
        FormatObject.formatJTextFieldSerie(txtSerie);
        gbc.gridx = 11;
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlFiltro.add(txtSerie, gbc);
        //
        txtPreimpreso = new JTextField();
        txtPreimpreso.setDocument(new IntegerDocument(10));
        txtPreimpreso.setColumns(7);
        gbc.gridx = 12;
        gbc.insets = new Insets(2, 0, 2, 2);
        pnlFiltro.add(txtPreimpreso, gbc);

        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlFiltro.add(lbl_CodigoItem, gbc);

        txtIdItem = new JTextField();
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txtIdItem.setDocument(new UpperCaseNumberDocument(30));
            txtIdItem.setColumns(10);
        } else {
            txtIdItem.setDocument(new IntegerDocument(6));
            txtIdItem.setColumns(6);
        }
        txtIdItem.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        pnlFiltro.add(txtIdItem, gbc);

        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 2;
        pnlFiltro.add(lblItem, gbc);

        txtDescripcionItem = new JTextField();
        txtDescripcionItem.setFont(new Font("Garamond", 0, 14));
        txtDescripcionItem.setDocument(new UpperCaseNumberDocument(255));
        txtDescripcionItem.setColumns(17);
        gbc.gridx = 3;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(txtDescripcionItem, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblUm = new JLabel("U.M.");
        lblUm.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lblUm, gbc);

        cboUm = new JComboBox();
        gbc.gridx = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboUm, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblTamano = new JLabel("Tamaño");
        lblTamano.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlFiltro.add(lblTamano, gbc);

        cboTamano = new JComboBox();
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboTamano, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblFechaFin = new JLabel("F FIN");
        gbc.gridx = 2;
        //gbc.anchor = GridBagConstraints.WEST;
        //gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblFechaFin, gbc);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.setDate(frmMain.getFechaFin());
        gbc.gridx = 3;
        pnlFiltro.add(dc_fechafin, gbc);

        return pnlFiltro;
    }

    protected void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(800, 400));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    protected void initListener() {
    }

    public void setValueSearch(Object valor, Component comp) {
    }

    protected void filtrarDespacho() {
    }

    protected void filtrarCliente() {
    }

    protected void filtrarItem() {
    }

    protected RowFilter getFilterDespacho() {
        List filters = new ArrayList();
        if (txtAnexo.getText().trim().length() > 0 && txtAnexoDesc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtAnexo.getText().trim() + ".*", 17));
        }
        if (txtTipoDoc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtTipoDoc.getText().trim() + ".*", 14));
        }
        if (txtSerie.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtSerie.getText().trim() + ".*", 15));
        }
        if (txtPreimpreso.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtPreimpreso.getText().trim() + ".*", 16));
        }
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 1));
        }
        if (cboPtoVta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listPtoVta.get(cboPtoVta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 24));
        }
        if (cboAlmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 26));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 2));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 4));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 6));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 10));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listTamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 8));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected RowFilter getFilterItem() {
        List filters = new ArrayList();
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 1));
        }
        if (cboPtoVta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listPtoVta.get(cboPtoVta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 24));
        }
        if (cboAlmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 26));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 2));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 4));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 6));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 10));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listTamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 8));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected RowFilter getFilterCliente() {
        List filters = new ArrayList();
        if (txtAnexo.getText().trim().length() > 0 && txtAnexoDesc.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtAnexo.getText().trim() + ".*", 17));
        }
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 1));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 2));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 4));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 6));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 10));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listTamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 8));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    protected void buscarTipoDocVenta(JTextField txtTd, JTextField txtTdDesc) {
    }

    protected void buscarAnexo(JTextField txtAnexo, JTextField txtAnexoDesc, String id_tipo_anexo) {
    }

    protected void changeCliente() {
    }

    protected void changeTab() {
        if (tabb.getSelectedIndex() == 0) {
            cboPtoVta.setEnabled(true);
            cboAlmacen.setEnabled(true);
            txtTipoDoc.setEnabled(true);
            txtSerie.setEnabled(true);
            txtPreimpreso.setEnabled(true);
            txtAnexo.setEnabled(true);
        } else if (tabb.getSelectedIndex() == 1) {
            cboPtoVta.setEnabled(false);
            cboAlmacen.setEnabled(false);
            txtTipoDoc.setEnabled(false);
            txtSerie.setEnabled(false);
            txtPreimpreso.setEnabled(false);
            txtAnexo.setEnabled(true);
        } else if (tabb.getSelectedIndex() == 2) {
            cboPtoVta.setEnabled(true);
            cboAlmacen.setEnabled(true);
            txtTipoDoc.setEnabled(false);
            txtSerie.setEnabled(false);
            txtPreimpreso.setEnabled(false);
            txtAnexo.setEnabled(false);
        }
    }

    protected void searchBd() {
        switch (tabb.getSelectedIndex()) {
            case 0:
                this.cargarTablaDespacho();
                break;
            case 1:
                this.cargarTablaCliente();
                break;
            case 2:
                this.cargarTablaItem();
                break;
        }
    }

    protected void filtrar() {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtTipoDoc) {
                buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc);
            }
            if (e.getSource() == txtAnexo) {
                buscarAnexo(txtAnexo, txtAnexoDesc, "2");
            }
        }
        if (e.getKeyChar() == KeyEvent.VK_DELETE || e.getKeyChar() == KeyEvent.VK_BACK_SPACE) {
            if (e.getSource() == txtTipoDoc) {
                txtTipoDocDesc.setText("");
            }
            if (e.getSource() == txtAnexo) {
                txtAnexoDesc.setText("");
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if (e.getSource() == txtDescripcionItem || e.getSource() == txtIdItem || e.getSource() == txtSerie
                    || e.getSource() == txtPreimpreso || e.getSource() == txtTipoDoc) {
                filtrar();
            }
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txtDescripcionItem) {
            txtDescripcionItem.selectAll();
        }
        if (e.getSource() == txtIdItem) {
            txtIdItem.selectAll();
        }
        if (e.getSource() == txtTipoDoc) {
            txtTipoDoc.selectAll();
        }
        if (e.getSource() == txtSerie) {
            txtSerie.selectAll();
        }
        if (e.getSource() == txtPreimpreso) {
            txtPreimpreso.selectAll();
        }
        if (e.getSource() == txtAnexo) {
            txtAnexo.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdItem) {
            /*if (txtIdItem.getText().trim().length() > 0) {
                String serie = "000000" + txtIdItem.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 6, serie.length());
                txtIdItem.setText(nuevaserie);
            }*/
            filtrar();
        }
        if (e.getSource() == txtSerie) {
            FormatObject.formatSerie((JTextField) e.getSource());
            if (tabb.getSelectedIndex() == 0) {
                filtrarDespacho();
            }
        }
        if (e.getSource() == txtPreimpreso) {
            if (txtPreimpreso.getText().trim().length() > 0) {
                String serie = "0000000000" + txtPreimpreso.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 10, serie.length());
                txtPreimpreso.setText(nuevaserie);
            }
            if (tabb.getSelectedIndex() == 0) {
                filtrarDespacho();
            }
        }

        if (e.getSource() == txtTipoDoc) {
            if (tabb.getSelectedIndex() == 0) {
                filtrarDespacho();
            }
        }
        /*if (e.getSource() == txtAnexo) {
         if (tabb.getSelectedIndex() == 0) {
         filtrarDespacho();
         }
         }*/
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cboPtoVta == e.getSource()) {
            if (cboPtoVta.getItemCount() > 0) {
                if (cboPtoVta.getSelectedIndex() == 0) {
                    cboAlmacen.removeAllItems();
                    cboAlmacen.setEnabled(false);
                } else {
                    cboAlmacen.setEnabled(true);
                    loadAlmacen(listPtoVta.get(cboPtoVta.getSelectedIndex() - 1).getId_punto_venta());
                }
                if (tabb.getSelectedIndex() == 0) {
                    filtrarDespacho();
                } else if (tabb.getSelectedIndex() == 2) {
                    filtrarItem();
                }
            }
        }

        if (cboFamilia == e.getSource()) {
            if (cboFamilia.getItemCount() > 0) {
                if (cboFamilia.getSelectedIndex() == 0) {
                    cboSubFamilia.removeAllItems();
                    cboSubFamilia.setEnabled(false);
                } else {
                    cboSubFamilia.setEnabled(true);
                    loadSubFamilia(listFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia());
                }
                filtrar();
            }
        }
        if (e.getSource() == cboAlmacen) {
            if (tabb.getSelectedIndex() == 0) {
                filtrarDespacho();
            } else if (tabb.getSelectedIndex() == 2) {
                filtrarItem();
            }
        }
        if (e.getSource() == cboTamano) {
            filtrar();
        }
        if (e.getSource() == cboSubFamilia) {
            filtrar();
        }
        if (e.getSource() == cboMarca) {
            filtrar();
        }
        if (e.getSource() == cboUm) {
            filtrar();
        }
        if (e.getSource() == btnBuscar) {
            this.searchBd();
            filtrar();
        }

        if (e.getSource() == btnSalir) {
            dispose();
            doDefaultCloseAction();
        }

        if (e.getSource() == btnExportar) {
            try {
                File archivo = File.createTempFile("ProdDespachar" + (new Date(Main.fechaActualServer.getTime())).getTime(), ".xlsx");
                archivo.deleteOnExit();
                ExportarToExcel export = null;
                Map parameters = new HashMap();
                parameters.put(0, usuario.getDescriempresa());
                parameters.put(1, "Ruc: " + usuario.getRuc());
                //parameters.put(2, "Reporte Productos por Despachar ");
                SimpleDateFormat dt1 = new SimpleDateFormat("dd/MM/yyyy");
                parameters.put(3, "Hasta " + dt1.format(dc_fechafin.getDate()));
                if (tabb.getSelectedIndex() == 0) {
                    parameters.put(2, "Reporte Productos por Despachar ");
                    export = new ExportarToExcel(archivo, tableDespachar, parameters);
                } else if (tabb.getSelectedIndex() == 1) {
                    parameters.put(2, "Reporte Productos por Despachar - Resumido Por Cliente");
                    export = new ExportarToExcel(archivo, tableCliente, parameters);
                } else if (tabb.getSelectedIndex() == 2) {
                    parameters.put(2, "Reporte Productos por Despachar - Resumido Por Item");
                    export = new ExportarToExcel(archivo, tableItem, parameters);
                }
                if (export.exportarJTableToExcelParam()) {
                    JOptionPane.showMessageDialog(null, "Reporte Generado Correctamente");
                }
            } catch (IOException ex) {
                JOptionPane.showMessageDialog(null, ex.getMessage());
            }
        }
    }

    @Override
    public void stateChanged(ChangeEvent e) {
        if (e.getSource() == tabb) {
            changeTab();
            filtrar();
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 2) {
            if (e.getSource() == txtTipoDoc) {
                buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc);
            }
            if (e.getSource() == txtAnexo) {
                buscarAnexo(txtAnexo, txtAnexoDesc, "2");
            }
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void insertUpdate(DocumentEvent e) {
        changeCliente();
    }

    @Override
    public void removeUpdate(DocumentEvent e) {
        changeCliente();
    }

    @Override
    public void changedUpdate(DocumentEvent e) {
        changeCliente();
    }
}
