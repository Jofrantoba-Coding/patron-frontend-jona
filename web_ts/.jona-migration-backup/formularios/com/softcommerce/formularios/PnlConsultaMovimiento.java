/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.formularios;

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
public class PnlConsultaMovimiento 
        extends JInternalFrame 
        implements KeyListener, FocusListener, ActionListener, ChangeListener, MouseListener {

    private URL path;
    private Main frmMain;
    private Usuario usuario;
    private Gif gif;
    private JComboBox cboPtoVta;
    private JComboBox cboAlmacen;
    private JComboBox cboFamilia;
    private JComboBox cboSubFamilia;
    private JComboBox cboMarca;
    private JComboBox cboUm;
    private JComboBox cboTamano;
    private JButton btnNuevo;
    private JButton btnBuscar;
    private JTextField txtIdItem;
    private JTextField txtDescripcionItem;
    private JDateChooser dc_fechaini;
    private JDateChooser dc_fechafin;
    private List<BeanFamilia> listFamilia;
    private List<BeanSubFamilia> listSubFamilia;
    private List<BeanMarca> listMarca;
    private List<BeanUnidadMedida> listUm;
    private List<BeanTamano> listTamano;
    private List<PuntoVenta> listPtoVta;
    private List<Almacen> listAlmacen;
    private JTabbedPane tabb;
    private MovProductoTableModel modelEntrada;
    private TableRowSorter<MovProductoTableModel> modeloOrdenadoEntrada;
    private CTable tableEntrada;
    private MovProductoTableModel modelSalida;
    private TableRowSorter<MovProductoTableModel> modeloOrdenadoSalida;
    private CTable tableSalida;
    private MovProductoTableModel modelTransferencia;
    private TableRowSorter<MovProductoTableModel> modeloOrdenadoTransferencia;
    private CTable tableTransferencia;
    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    private JTextField txtAnexo;
    private JTextField txtAnexoDesc;
    private JButton btnSalir;
    private JButton btnExportar;
    private JCheckBox chkTransferencia;

    public PnlConsultaMovimiento(String title, URL path, Main frm, Usuario usuario) {
        super(title);
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        inicialize();
        initListener();
        cargarDatos();
    }

    private void inicialize() {
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

    private JPanel getPnlOpciones() {
        JPanel pnl = new JPanel();
        //pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        btnSalir = new JButton("Salir", gif.CANCEL16);
        btnSalir.setMnemonic('C');
        btnSalir.setHorizontalAlignment(SwingConstants.LEFT);
        btnSalir.setIconTextGap(10);
        btnSalir.setFont(new Font("Verdana", 1, 10));
        btnSalir.setOpaque(false);
        btnSalir.setFocusPainted(false);
        pnl.add(btnSalir);

        btnExportar = new JButton("Exportar a excel", gif.EXCEL);
        btnExportar.setMnemonic('B');
        btnExportar.setHorizontalAlignment(SwingConstants.LEFT);
        btnExportar.setIconTextGap(10);
        btnExportar.setFont(new Font("Verdana", 1, 10));
        btnExportar.setOpaque(false);
        btnExportar.setFocusPainted(false);
        pnl.add(btnExportar);

        return pnl;
    }

    private JPanel getPnlCenter() {
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

    private JPanel getPnlEntrada() {
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

    private void cargarTablaEntrada() {
        try {
            RnConsultas logic = new RnConsultas(path);
            modelEntrada.clearTable();
            List<MovProducto> lista = logic.listarMovProducto(new java.sql.Date(dc_fechaini.getDate().getTime()), new java.sql.Date(dc_fechafin.getDate().getTime()), "E", "", (chkTransferencia.isSelected() ? "S" : "N"));
            modelEntrada.agregarListMovProducto(lista);
            tableEntrada.setAllColumnPreferredWidth();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTablaSalida() {
        try {
            RnConsultas logic = new RnConsultas(path);
            modelSalida.clearTable();
            List<MovProducto> lista = logic.listarMovProducto(new java.sql.Date(dc_fechaini.getDate().getTime()), new java.sql.Date(dc_fechafin.getDate().getTime()), "S", "", (chkTransferencia.isSelected() ? "S" : "N"));
            modelSalida.agregarListMovProducto(lista);
            tableSalida.setAllColumnPreferredWidth();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTablaTransferencia() {
        try {
            RnConsultas logic = new RnConsultas(path);
            modelTransferencia.clearTable();
            List<MovProducto> lista = logic.listarMovProducto(new java.sql.Date(dc_fechaini.getDate().getTime()), new java.sql.Date(dc_fechafin.getDate().getTime()), "", "S", "");
            modelTransferencia.agregarListMovProducto(lista);
            tableTransferencia.setAllColumnPreferredWidth();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private JPanel getPnlSalida() {
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

    private JPanel getPnlTransferencia() {
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

    private void cargarDatos() {
        try {
            loadFamilia();
            loadMarca();
            loadUnidadMedida();
            loadTamano();
            loadPuntoVenta();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadPuntoVenta() {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (listPtoVta != null) {
                listPtoVta.clear();
            } else {
                listPtoVta = new ArrayList<PuntoVenta>();
            }

            listPtoVta.addAll(regla_PuntoVenta.listar("", "", "", "", "", "", "", Constans.ESTADO_ACTIVO));

            cboPtoVta.removeAllItems();
            cboPtoVta.addItem("--- Seleccione un Punto de Venta ---");
            for (int i = 0; i < listPtoVta.size(); i++) {
                cboPtoVta.addItem(listPtoVta.get(i).getDescripcion_puntoventa());
            }

            cboPtoVta.setSelectedIndex(0);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadTamano() {
        try {
            RnTamano regla_Tamano = new RnTamano(path);
            if (listTamano != null) {
                listTamano.clear();
            } else {
                listTamano = new ArrayList<BeanTamano>();
            }

            listTamano.addAll(regla_Tamano.listarGeneral(usuario.getCodempresa()));

            cboTamano.removeAllItems();
            cboTamano.addItem("--- Seleccione un Tamaño ---");

            for (int i = 0; i < listTamano.size(); i++) {
                cboTamano.addItem(listTamano.get(i).getDescripcion());
            }

            cboTamano.setSelectedIndex(0);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void loadUnidadMedida() {
        try {
            RnUnidadMedida reglaUnidadMedida = new RnUnidadMedida(path);
            if (listUm != null) {
                listUm.clear();
            } else {
                listUm = new ArrayList<BeanUnidadMedida>();
            }

            listUm.addAll(reglaUnidadMedida.listar("", "", "", usuario.getCodempresa()));

            cboUm.removeAllItems();
            cboUm.addItem("--- Seleccione U.M. ---");

            for (Integer i = 0; i < listUm.size(); i++) {
                cboUm.addItem(listUm.get(i).getAbreviatura());
            }

            cboUm.setSelectedIndex(0);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadMarca() throws Exception {
        try {
            RnMarca regla_Marca = new RnMarca(path);
            if (listMarca != null) {
                listMarca.clear();
            } else {
                listMarca = new ArrayList<BeanMarca>(10);
            }

            listMarca.addAll(regla_Marca.listarGeneral(usuario.getCodempresa()));

            cboMarca.removeAllItems();
            cboMarca.addItem("--- Seleccione una Marca ---");

            for (int i = 0; i < listMarca.size(); i++) {
                cboMarca.addItem(listMarca.get(i).getDescripcion());
            }

            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadFamilia() throws Exception {
        try {
            RnFamilia regla_Familia = new RnFamilia(path);

            if (listFamilia != null) {
                listFamilia.clear();
            } else {
                listFamilia = new ArrayList<BeanFamilia>();
            }
            List lista = regla_Familia.listarFamiliaItem("S");
            //x_idfamilia.addAll(regla_Familia.listarGeneral(usuario.getCodempresa()));
            listFamilia.addAll(lista);

            cboFamilia.removeAllItems();
            cboFamilia.addItem("--- Seleccione una Familia ---");

            for (int i = 0; i < listFamilia.size(); i++) {
                cboFamilia.addItem(listFamilia.get(i).getDescripcion());
            }

            cboFamilia.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    public void loadAlmacen(String xcodPuntoventa) {
        try {
            RnAlmacen regla_Almacen = new RnAlmacen(path);

            if (listAlmacen != null) {
                listAlmacen.clear();
            } else {
                listAlmacen = new ArrayList<Almacen>();
            }

            listAlmacen.addAll(regla_Almacen.listar("", "", xcodPuntoventa));

            cboAlmacen.removeAllItems();
            cboAlmacen.addItem("--- Seleccione un Almacen ---");

            for (int i = 0; i < listAlmacen.size(); i++) {
                cboAlmacen.addItem(listAlmacen.get(i).getDescripcion());
            }

            cboAlmacen.setSelectedIndex(0);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadSubFamilia(String xcodfamilia) {
        try {
            BeanSubFamilia s = new BeanSubFamilia();
            BeanFamilia beanFamilia = new BeanFamilia();
            beanFamilia.setIdFamilia(xcodfamilia);
            s.setBeanFamilia(beanFamilia);

            RnSubFamilia regla_SubFamilia = new RnSubFamilia(path);

            if (listSubFamilia != null) {
                listSubFamilia.clear();
            } else {
                listSubFamilia = new ArrayList<BeanSubFamilia>();
            }

            listSubFamilia.addAll(regla_SubFamilia.listar(s));

            cboSubFamilia.removeAllItems();
            cboSubFamilia.addItem("--- Seleccione una SubFamilia ---");

            for (int i = 0; i < listSubFamilia.size(); i++) {
                cboSubFamilia.addItem(listSubFamilia.get(i).getDescripcion());
            }

            cboSubFamilia.setSelectedIndex(0);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private JPanel getPnlFilter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        pnl.add(getPnlFiltrosLeft(), BorderLayout.WEST);
        return pnl;
    }

    private JPanel getPnlFiltrosLeft() {
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

    private void configurarInternal() {
        pack();
        setMaximizable(true);
        setResizable(true);
        setClosable(true);
        setMinimumSize(new Dimension(800, 400));
        setMaximumSize(new Dimension(1355, 592));
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
    }

    private void initListener() {
        cboPtoVta.addActionListener(this);
        cboAlmacen.addActionListener(this);
        cboTamano.addActionListener(this);
        cboFamilia.addActionListener(this);
        cboSubFamilia.addActionListener(this);
        cboMarca.addActionListener(this);
        cboUm.addActionListener(this);
        tabb.addChangeListener(this);
        btnBuscar.addActionListener(this);
        btnNuevo.addActionListener(this);
        btnSalir.addActionListener(this);
        btnExportar.addActionListener(this);
        txtIdItem.addKeyListener(this);
        txtIdItem.addFocusListener(this);
        txtDescripcionItem.addKeyListener(this);
        txtDescripcionItem.addFocusListener(this);
        txtTipoDoc.addKeyListener(this);
        txtTipoDoc.addMouseListener(this);
        txtTipoDoc.addFocusListener(this);
        txtSerie.addKeyListener(this);
        txtSerie.addFocusListener(this);
        txtPreimpreso.addKeyListener(this);
        txtPreimpreso.addFocusListener(this);
        txtAnexo.addKeyListener(this);
        txtAnexo.addMouseListener(this);
        txtAnexo.addFocusListener(this);
    }

    public void setValueSearch(Object valor, Component comp) {
        if (comp == txtAnexo) {
            txtAnexo.setText(((BeanAnexo) valor).getIdAnexo().trim());
            txtAnexoDesc.setText(((BeanAnexo) valor).getDescripcion());
        }
    }

    private void filtrarEntrada() {
        modeloOrdenadoEntrada.setRowFilter(getFilterEntrada());
        tableEntrada.setAllColumnPreferredWidth();
    }

    private void filtrarSalida() {
        modeloOrdenadoSalida.setRowFilter(getFilterEntrada());
        tableSalida.setAllColumnPreferredWidth();
    }

    private void filtrarTransferencia() {
        modeloOrdenadoTransferencia.setRowFilter(getFilterEntrada());
        tableTransferencia.setAllColumnPreferredWidth();
    }

    private RowFilter getFilterEntrada() {
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

    private void changeTab() {
        if (tabb.getSelectedIndex() == 2) {
            chkTransferencia.setVisible(false);
        } else {
            chkTransferencia.setVisible(true);
        }
    }
    
    private void cargarData() {
        switch (tabb.getSelectedIndex()) {
            case 0:
                this.cargarTablaEntrada();
                break;
            case 1:
                this.cargarTablaSalida();
                break;
            case 2:
                this.cargarTablaTransferencia();
                break;
        }
        this.filtrar();
    }

    private void filtrar() {
        switch (tabb.getSelectedIndex()) {
            case 0:
                filtrarEntrada();
                break;
            case 1:
                filtrarSalida();
                break;
            case 2:
                filtrarTransferencia();
                break;
        }
    }

    private void searchEvent(InputEvent e) {
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
