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

    private java.net.URL path;
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
    private JDateChooser dc_fechafin;
    private List<BeanFamilia> listFamilia;
    private List<BeanSubFamilia> listSubFamilia;
    private List<BeanMarca> listMarca;
    private List<BeanUnidadMedida> listUm;
    private List<BeanTamano> listTamano;
    private List<PuntoVenta> listPtoVta;
    private List<Almacen> listAlmacen;
    private JTabbedPane tabb;
    private MovProductoTableModel modelDespachar;
    private TableRowSorter<MovProductoTableModel> modeloOrdenadoDespachar;
    private CTable tableDespachar;
    private MovProductoTableModel modelCliente;
    private TableRowSorter<MovProductoTableModel> modeloOrdenadoCliente;
    private CTable tableCliente;
    private MovProductoTableModel modelItem;
    private TableRowSorter<MovProductoTableModel> modeloOrdenadoItem;
    private CTable tableItem;
    private JTextField txtTipoDoc;
    private JTextField txtTipoDocDesc;
    private JTextField txtSerie;
    private JTextField txtPreimpreso;
    private JTextField txtAnexo;
    private JTextField txtAnexoDesc;
    private JButton btnSalir;
    private JButton btnExportar;

    public UiPnlConsultaProdDespachar(String title, java.net.URL path, Main frm, Usuario usuario) {
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
        tabb.add("General", getPnlDespacho());
        tabb.add("Resumido por Cliente", getPnlCliente());
        tabb.add("Resumido por Item", getPnlItem());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlDespacho() {
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

    private JPanel getPnlItem() {
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

    private JPanel getPnlCliente() {
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

    private void cargarTablaDespacho() {
        try {
            RnConsultas logic = new RnConsultas(path);
            List<MovProducto> lista = logic.listarProductosDespachar(new java.sql.Date(dc_fechafin.getDate().getTime()));
            modelDespachar.agregarListMovProducto(lista);
            modeloOrdenadoDespachar.setRowFilter(getFilterDespacho());
            tableDespachar.setAllColumnPreferredWidth();
            if (txtAnexo.getText().trim().length() > 0 && txtAnexoDesc.getText().trim().length() > 0) {
                if (tableDespachar.getRowCount() == 0) {
                    JOptionPane.showMessageDialog(this, "No hay Datos para este Cliente");
                }
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTablaItem() {
        try {
            RnConsultas logic = new RnConsultas(path);
            List<MovProducto> lista = logic.listarProductosDespacharItem(new java.sql.Date(dc_fechafin.getDate().getTime()));
            modelItem.agregarListMovProducto(lista);
            modeloOrdenadoItem.setRowFilter(getFilterItem());
            tableItem.setAllColumnPreferredWidth();
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTablaCliente() {
        try {
            RnConsultas logic = new RnConsultas(path);
            List<MovProducto> lista = logic.listarProductosDespacharCliente(new java.sql.Date(dc_fechafin.getDate().getTime()));
            modelCliente.agregarListMovProducto(lista);
            modeloOrdenadoCliente.setRowFilter(getFilterCliente());
            tableCliente.setAllColumnPreferredWidth();
            if (txtAnexo.getText().trim().length() > 0 && txtAnexoDesc.getText().trim().length() > 0) {
                if (tableCliente.getRowCount() == 0) {
                    JOptionPane.showMessageDialog(this, "No hay Datos para este Cliente");
                }
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarDatos() {
        try {
            loadFamilia();
            loadMarca();
            loadUnidadMedida();
            loadTamano();
            loadPuntoVenta();
        } catch (Exception e) {
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

            listPtoVta.addAll(regla_PuntoVenta.listar("", "", "", "", "", "", "", "A"));

            cboPtoVta.removeAllItems();
            cboPtoVta.addItem("--- Seleccione un Punto de Venta ---");
            for (int i = 0; i < listPtoVta.size(); i++) {
                cboPtoVta.addItem(listPtoVta.get(i).getDescripcion_puntoventa());
            }

            cboPtoVta.setSelectedIndex(0);
        } catch (Exception e) {
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
        txtAnexoDesc.getDocument().addDocumentListener(this);
    }

    public void setValueSearch(Object valor, Component comp) {
        if (comp == txtAnexo) {
            txtAnexo.setText(((BeanAnexo) valor).getIdAnexo().trim());
            txtAnexoDesc.setText(((BeanAnexo) valor).getDescripcion());
        }
    }

    private void filtrarDespacho() {
        modeloOrdenadoDespachar.setRowFilter(getFilterDespacho());
        tableDespachar.setAllColumnPreferredWidth();
    }

    private void filtrarCliente() {
        modeloOrdenadoCliente.setRowFilter(getFilterCliente());
        tableCliente.setAllColumnPreferredWidth();
    }

    private void filtrarItem() {
        modeloOrdenadoItem.setRowFilter(getFilterItem());
        tableItem.setAllColumnPreferredWidth();
    }

    private RowFilter getFilterDespacho() {
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

    private RowFilter getFilterItem() {
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

    private RowFilter getFilterCliente() {
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

    private void buscarTipoDocVenta(JTextField txtTd, JTextField txtTdDesc) {
        try {
            RnTipoDocVenta logicTipoDocVenta = new RnTipoDocVenta(path);
            if (txtTd.getText().trim().length() > 0) {
                BeanTipoDocVenta beanTipoDocVenta = new BeanTipoDocVenta();
                beanTipoDocVenta = logicTipoDocVenta.getTipoDocVenta(txtTd.getText().trim(), "", "", "");
                if (beanTipoDocVenta != null) {
                    txtTdDesc.setText(beanTipoDocVenta.getDescripcion());
                    return;
                }
            }
            FormBuscarTipoDocVenta objBuscarTipoDocVenta = new FormBuscarTipoDocVenta(frmMain, this, path, txtTd, txtTdDesc, "", "", "");
            objBuscarTipoDocVenta.setVisible(true);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void buscarAnexo(JTextField txtAnexo, JTextField txtAnexoDesc, String id_tipo_anexo) {
        try {
            String id_anexo = "";
            RnAnexo logicAnexo = new RnAnexo(path);
            if (txtAnexo.getText().trim().length() > 0) {
                BeanAnexo beanAnexo = new BeanAnexo();
                if (txtAnexo.getText().trim().length() < 10 && txtAnexo.getText().trim().length() != 8) {
                    String id_anexoAnt = "0000000000" + txtAnexo.getText().trim();
                    id_anexo = id_anexoAnt.substring(id_anexoAnt.length() - 10, id_anexoAnt.length());
                } else {
                    id_anexo = txtAnexo.getText();
                }
                beanAnexo = logicAnexo.beanAnexoImp(id_tipo_anexo, "", "A", id_anexo.trim(), "");
                if (beanAnexo != null) {
                    txtAnexoDesc.setText(beanAnexo.getDescripcion());
                    txtAnexo.setText(beanAnexo.getIdAnexo());
                    return;
                }
            }
            //FormBuscarAnexo objBuscarAnexo = new FormBuscarAnexo(frmMain, this, path, txtAnexo, usuario, id_tipo_anexo, "UiPnlConsultaProdDespachar");
            FormBuscarAnexo objBuscarAnexo = new FormBuscarAnexo(frmMain, this, path, txtAnexo, txtAnexoDesc, usuario, id_tipo_anexo);
            objBuscarAnexo.setVisible(true);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void changeCliente() {
        if (tabb.getSelectedIndex() == 0) {
            filtrarDespacho();
        } else if (tabb.getSelectedIndex() == 1) {
            filtrarCliente();
        }
        if (modelDespachar.getRowCount() > 0) {
            if (txtAnexoDesc.getText().length() > 0) {
                if (tableDespachar.getRowCount() == 0) {
                    JOptionPane.showMessageDialog(this, "No hay Datos para este Cliente");
                }
            }
        }
    }

    private void changeTab() {
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

    private void searchBd() {
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

    private void filtrar() {
        switch (tabb.getSelectedIndex()) {
            case 0:
                filtrarDespacho();
                break;
            case 1:
                filtrarCliente();
                break;
            case 2:
                filtrarItem();
                break;
        }
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
