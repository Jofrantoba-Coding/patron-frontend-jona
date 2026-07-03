/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlconsultamovimiento;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.MovProducto;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.MovProductoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnConsultas;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
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
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JCheckBox;
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
import javax.swing.table.TableRowSorter;
import java.net.URL;
import com.softcommerce.util.Constans;
import com.softcommerce.util.FxAnexo;
import com.softcommerce.util.FxTipoDocVenta;
import java.awt.event.InputEvent;

/**
 *
 * @author Team Develtrex
 */
public class UiPnlConsultaMovimiento 
        extends JInternalFrame 
        implements InterUiPnlConsultaMovimiento, KeyListener, FocusListener, ActionListener, ChangeListener, MouseListener {

    protected URL path;
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
    protected JDateChooser dc_fechaini;
    protected JDateChooser dc_fechafin;
    protected List<BeanFamilia> listFamilia;
    protected List<BeanSubFamilia> listSubFamilia;
    protected List<BeanMarca> listMarca;
    protected List<BeanUnidadMedida> listUm;
    protected List<BeanTamano> listTamano;
    protected List<PuntoVenta> listPtoVta;
    protected List<Almacen> listAlmacen;
    protected JTabbedPane tabb;
    protected MovProductoTableModel modelEntrada;
    protected TableRowSorter<MovProductoTableModel> modeloOrdenadoEntrada;
    protected CTable tableEntrada;
    protected MovProductoTableModel modelSalida;
    protected TableRowSorter<MovProductoTableModel> modeloOrdenadoSalida;
    protected CTable tableSalida;
    protected MovProductoTableModel modelTransferencia;
    protected TableRowSorter<MovProductoTableModel> modeloOrdenadoTransferencia;
    protected CTable tableTransferencia;
    protected JTextField txtTipoDoc;
    protected JTextField txtTipoDocDesc;
    protected JTextField txtSerie;
    protected JTextField txtPreimpreso;
    protected JTextField txtAnexo;
    protected JTextField txtAnexoDesc;
    protected JButton btnSalir;
    protected JButton btnExportar;
    protected JCheckBox chkTransferencia;

    public UiPnlConsultaMovimiento(String title, URL path, Main frm, Usuario usuario) {
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
        tabb.add("ENTRADAS", getPnlEntrada());
        tabb.add("SALIDAS", getPnlSalida());
        tabb.add("TRANSFERENCIA", getPnlTransferencia());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlEntrada() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modelEntrada = new MovProductoTableModel();
        tableEntrada = new CTable();
        tableEntrada.setModel(modelEntrada);
        tableEntrada.setAllTableNoEditable();
        modeloOrdenadoEntrada = new TableRowSorter(modelEntrada);
        tableEntrada.setRowSorter(modeloOrdenadoEntrada);
        //tbl_inventario.setModel(modelStock);
        tableEntrada.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableEntrada.setNoVisibleColumn(2);
        tableEntrada.setNoVisibleColumn(4);
        tableEntrada.setNoVisibleColumn(6);
        tableEntrada.setNoVisibleColumn(8);
        tableEntrada.setNoVisibleColumn(10);
        tableEntrada.setNoVisibleColumn(14);
        tableEntrada.setNoVisibleColumn(15);
        tableEntrada.setNoVisibleColumn(16);
        tableEntrada.setNoVisibleColumn(17);
        //tableEntrada.setNoVisibleColumn(20);
        tableEntrada.setNoVisibleColumn(21);
        tableEntrada.setNoVisibleColumn(22);
        tableEntrada.setNoVisibleColumn(24);
        tableEntrada.setNoVisibleColumn(26);
        tableEntrada.setNoVisibleColumn(27);
        tableEntrada.setNoVisibleColumn(32);
        JScrollPane jsp = new JScrollPane(tableEntrada);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected void cargarTablaEntrada() {
    }

    protected void cargarTablaSalida() {
    }

    protected void cargarTablaTransferencia() {
    }

    protected JPanel getPnlSalida() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modelSalida = new MovProductoTableModel();
        tableSalida = new CTable();
        tableSalida.setModel(modelSalida);
        tableSalida.setAllTableNoEditable();
        modeloOrdenadoSalida = new TableRowSorter(modelSalida);
        tableSalida.setRowSorter(modeloOrdenadoSalida);
        //tbl_inventario.setModel(modelStock);
        tableSalida.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableSalida.setNoVisibleColumn(2);
        tableSalida.setNoVisibleColumn(4);
        tableSalida.setNoVisibleColumn(6);
        tableSalida.setNoVisibleColumn(8);
        tableSalida.setNoVisibleColumn(10);
        tableSalida.setNoVisibleColumn(14);
        tableSalida.setNoVisibleColumn(15);
        tableSalida.setNoVisibleColumn(16);
        tableSalida.setNoVisibleColumn(17);
        //tableSalida.setNoVisibleColumn(20);
        tableSalida.setNoVisibleColumn(21);
        tableSalida.setNoVisibleColumn(22);
        tableSalida.setNoVisibleColumn(24);
        tableSalida.setNoVisibleColumn(26);
        tableSalida.setNoVisibleColumn(27);
        tableSalida.setNoVisibleColumn(28);
        tableSalida.setNoVisibleColumn(29);
        tableSalida.setNoVisibleColumn(32);
        JScrollPane jsp = new JScrollPane(tableSalida);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlTransferencia() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        modelTransferencia = new MovProductoTableModel();
        tableTransferencia = new CTable();
        tableTransferencia.setModel(modelTransferencia);
        tableTransferencia.setAllTableNoEditable();
        modeloOrdenadoTransferencia = new TableRowSorter(modelTransferencia);
        tableTransferencia.setRowSorter(modeloOrdenadoTransferencia);
        tableTransferencia.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tableTransferencia.setNoVisibleColumn(2);
        tableTransferencia.setNoVisibleColumn(4);
        tableTransferencia.setNoVisibleColumn(6);
        tableTransferencia.setNoVisibleColumn(8);
        tableTransferencia.setNoVisibleColumn(10);
        tableTransferencia.setNoVisibleColumn(14);
        tableTransferencia.setNoVisibleColumn(15);
        tableTransferencia.setNoVisibleColumn(16);
        tableTransferencia.setNoVisibleColumn(17);
        tableTransferencia.setNoVisibleColumn(20);
        tableTransferencia.setNoVisibleColumn(21);
        tableTransferencia.setNoVisibleColumn(22);
        tableTransferencia.setNoVisibleColumn(24);
        tableTransferencia.setNoVisibleColumn(28);
        tableTransferencia.setNoVisibleColumn(29);
        tableTransferencia.setNoVisibleColumn(30);
        tableTransferencia.setNoVisibleColumn(31);
        tableTransferencia.setNoVisibleColumn(32);
        JScrollPane jsp = new JScrollPane(tableTransferencia);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
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

        JLabel lblFechaIni = new JLabel("F INICIO");
        //lblFechaIni.setDisplayedMnemonic('a');
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblFechaIni, gbc);

        dc_fechaini = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechaini.setDate(frmMain.getFechaInicio());
        gbc.gridx = 1;
        pnlFiltro.add(dc_fechaini, gbc);

        JLabel lblFechaFin = new JLabel("F FIN");
        gbc.gridx = 3;
        pnlFiltro.add(lblFechaFin, gbc);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dc_fechafin.setDate(frmMain.getFechaFin());
        gbc.gridx = 4;
        pnlFiltro.add(dc_fechafin, gbc);

        btnNuevo = new JButton(gif.NEW16);
        btnNuevo.setHorizontalTextPosition(SwingConstants.LEFT);
        btnNuevo.setToolTipText("Filtrar");
        btnNuevo.setContentAreaFilled(true);
        btnNuevo.setBorderPainted(true);
        btnNuevo.setFocusable(true);
        btnNuevo.setFocusPainted(false);
        gbc.gridx = 5;
        pnlFiltro.add(this.btnNuevo, gbc);

        btnBuscar = new JButton(gif.SEARCH16);
        btnBuscar.setHorizontalTextPosition(SwingConstants.LEFT);
        btnBuscar.setToolTipText("Ver Detalle Kardex");
        btnBuscar.setContentAreaFilled(true);
        btnBuscar.setBorderPainted(true);
        btnBuscar.setFocusable(true);
        btnBuscar.setFocusPainted(false);
        gbc.gridx = 6;
        gbc.anchor = GridBagConstraints.WEST;
        pnlFiltro.add(this.btnBuscar, gbc);

        JLabel lblTipoDoc = new JLabel("T. Doc.");
        //lblFechaIni.setDisplayedMnemonic('a');
        gbc.gridx = 7;
        pnlFiltro.add(lblTipoDoc, gbc);

        txtTipoDoc = new JTextField();
        txtTipoDoc.setDocument(new UpperCaseNumberDocument(2));
        txtTipoDoc.setColumns(2);
        gbc.gridx = 8;
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlFiltro.add(txtTipoDoc, gbc);

        txtTipoDocDesc = new JTextField();
        txtTipoDocDesc.setEnabled(false);
        txtTipoDocDesc.setColumns(15);
        gbc.gridwidth = 2;
        gbc.gridx = 9;
        gbc.insets = new Insets(2, 0, 2, 5);
        pnlFiltro.add(txtTipoDocDesc, gbc);
        gbc.gridwidth = 1;
        //
        JLabel lblNumDoc = new JLabel("N° Doc");
        gbc.gridx = 11;
        gbc.insets = new Insets(2, 2, 2, 1);
        pnlFiltro.add(lblNumDoc, gbc);
        //
        txtSerie = new JTextField();
        //txtSerie.setDocument(new IntegerDocument(3));
        //txtSerie.setColumns(2);
        FormatObject.formatJTextFieldSerie(txtSerie);
        gbc.gridx = 12;
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlFiltro.add(txtSerie, gbc);
        //
        txtPreimpreso = new JTextField();
        //txtPreimpreso.setDocument(new IntegerDocument(10));
        //txtPreimpreso.setColumns(7);
        FormatObject.formatJTextFieldPreimpreso(txtPreimpreso);
        gbc.gridx = 13;
        gbc.insets = new Insets(2, 0, 2, 2);
        pnlFiltro.add(txtPreimpreso, gbc);

        gbc.insets = new Insets(2, 2, 2, 2);

        JLabel lblPuntoVenta = new JLabel("P.Venta");
        lblPuntoVenta.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblPuntoVenta, gbc);

        cboPtoVta = new JComboBox();
        gbc.gridwidth = 2;
        gbc.gridx = 1;
        pnlFiltro.add(cboPtoVta, gbc);
        gbc.gridwidth = 1;

        JLabel lblAlmacen = new JLabel("Almacén");
        lblAlmacen.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 3;
        pnlFiltro.add(lblAlmacen, gbc);

        cboAlmacen = new JComboBox();
        gbc.gridx = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboAlmacen, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblTamano = new JLabel("Tamaño");
        lblTamano.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 5;
        pnlFiltro.add(lblTamano, gbc);

        cboTamano = new JComboBox();
        gbc.gridx = 6;
        pnlFiltro.add(cboTamano, gbc);

        JLabel lblAnexoPadre = new JLabel("Anexo");
        gbc.gridx = 7;
        gbc.insets = new Insets(2, 0, 2, 1);
        pnlFiltro.add(lblAnexoPadre, gbc);

        txtAnexo = new JTextField();
        txtAnexo.setDocument(new IntegerDocument(11));
        txtAnexo.setColumns(7);
        gbc.gridx = 8;
        gbc.insets = new Insets(2, 1, 2, 0);
        gbc.gridwidth = 2;
        pnlFiltro.add(txtAnexo, gbc);

        //
        txtAnexoDesc = new JTextField();
        txtAnexoDesc.setEnabled(false);
        //gbc.gridwidth = 6;
        gbc.gridx = 10;
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
        gbc.gridy = 2;
        pnlFiltro.add(lbl_familia, gbc);

        cboFamilia = new JComboBox();
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridwidth = 2;
        pnlFiltro.add(cboFamilia, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 3;
        pnlFiltro.add(lbl_subfamilia, gbc);

        cboSubFamilia = new JComboBox();
        gbc.gridx = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboSubFamilia, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 5;
        pnlFiltro.add(lblMarca, gbc);

        cboMarca = new JComboBox();
        gbc.gridx = 6;
        pnlFiltro.add(cboMarca, gbc);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlFiltro.add(lbl_CodigoItem, gbc);

        txtIdItem = new JTextField();
        txtIdItem.setFont(new Font("Garamond", 0, 14));
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txtIdItem.setDocument(new UpperCaseNumberDocument(30));
            txtIdItem.setColumns(8);
        } else {
            txtIdItem.setDocument(new IntegerDocument(6));
            txtIdItem.setColumns(6);
        }
        gbc.gridx = 1;
        //gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(txtIdItem, gbc);
        //gbc.fill = GridBagConstraints.NONE;
        //gbc.gridwidth = 1;

        chkTransferencia = new JCheckBox("Transferencia");
        gbc.gridx = 2;
        pnlFiltro.add(chkTransferencia, gbc);

        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 3;
        pnlFiltro.add(lblItem, gbc);

        txtDescripcionItem = new JTextField();
        txtDescripcionItem.setFont(new Font("Garamond", 0, 14));
        txtDescripcionItem.setDocument(new UpperCaseNumberDocument(255));
        txtDescripcionItem.setColumns(17);
        gbc.gridx = 4;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(txtDescripcionItem, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblUm = new JLabel("U.M.");
        lblUm.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 5;
        pnlFiltro.add(lblUm, gbc);

        cboUm = new JComboBox();
        gbc.gridx = 6;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboUm, gbc);
        gbc.fill = GridBagConstraints.NONE;

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

    protected void filtrarEntrada() {
    }

    protected void filtrarSalida() {
    }

    protected void filtrarTransferencia() {
    }

    protected RowFilter getFilterEntrada() {
        List filters = new ArrayList();
        if (txtAnexo.getText().trim().length() > 0) {
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
            filters.add(RowFilter.regexFilter(".*" + listPtoVta.get(cboPtoVta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 22));
        }
        if (cboAlmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + listAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 24));
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

    protected void changeTab() {
        if (tabb.getSelectedIndex() == 2) {
            chkTransferencia.setVisible(false);
        } else {
            chkTransferencia.setVisible(true);
        }
    }
    
    protected void cargarData() {
    }

    protected void filtrar() {
    }

    protected void searchEvent(InputEvent e) {
        if (e.getSource() == txtTipoDoc) {
            FxTipoDocVenta.buscarTipoDocVenta(txtTipoDoc, txtTipoDocDesc, true, frmMain, path, this);
        }
        if (e.getSource() == txtAnexo) {
            FxAnexo.buscarAnexo(txtAnexo, txtAnexoDesc, "2", frmMain, path, usuario, this);
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            searchEvent(e);
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
            if (e.getSource() == txtDescripcionItem || e.getSource() == txtIdItem || e.getSource() == txtSerie || e.getSource() == txtPreimpreso || e.getSource() == txtTipoDoc) {
                filtrar();
            }
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
            filtrar();
        }
        if (e.getSource() == txtPreimpreso) {
            FormatObject.formatPreimpreso((JTextField) e.getSource());
            filtrar();
        }

        if (e.getSource() == txtTipoDoc) {
            filtrar();
        }
        if (e.getSource() == txtAnexo) {
            filtrar();
        }
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
                filtrar();
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
            filtrar();
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
            this.cargarData();
        }

        if (e.getSource() == btnSalir) {
            dispose();
            doDefaultCloseAction();
        }

        if (e.getSource() == btnExportar) {
            try {
                File archivo = File.createTempFile("Reporte" + (tabb.getSelectedIndex() == 0 ? "Entrada" : (tabb.getSelectedIndex() == 1 ? "Salida" : "Transferencia")) + (new Date(Main.fechaActualServer.getTime())).getTime(), ".xlsx");
                archivo.deleteOnExit();
                ExportarToExcel export = null;
                Map parameters = new HashMap();
                parameters.put(0, usuario.getDescriempresa());
                parameters.put(1, "Ruc: " + usuario.getRuc());
                if (tabb.getSelectedIndex() == 0) {
                    parameters.put(2, "Reporte Entrada");
                    export = new ExportarToExcel(archivo, tableEntrada, parameters);
                } else if (tabb.getSelectedIndex() == 1) {
                    parameters.put(2, "Reporte Salida");
                    export = new ExportarToExcel(archivo, tableSalida, parameters);
                } else if (tabb.getSelectedIndex() == 2) {
                    parameters.put(2, "Reporte Transferencia");
                    export = new ExportarToExcel(archivo, tableTransferencia, parameters);
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
            searchEvent(e);
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
}
