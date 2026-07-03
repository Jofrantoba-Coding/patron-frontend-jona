/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipnlcotizacionadditem;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanCotizacionDet;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.BeanMoneda;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.BeanPedidoDet;
import com.softcommerce.beans.BeanPrecioItem;
import com.softcommerce.beans.BeanStock;
import com.softcommerce.beans.Usuario;
import com.softcommerce.comboboxmodel.ComboModelPrecio;
import com.softcommerce.general.controles.CButton;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.TableModelItemAlmacen;
import com.softcommerce.general.tablas.TableModelItemVenta;
import com.softcommerce.iconos.Gif;
import com.softcommerce.inputvalidator.PrecioMinimo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnParametro;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.util.editor.ComboBoxEditorPrecio;
import com.softcommerce.util.combo.LoadCombo;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.math.RoundingMode;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.table.TableRowSorter;
import javax.swing.text.JTextComponent;

/**
 *
 * @author Team Develtrex
 */
public class UiPnlCotizacionAddItem 
        extends JDialog 
        implements InterUiPnlCotizacionAddItem, KeyListener, FocusListener, ActionListener, ItemListener, MouseListener, ListSelectionListener {
    private int numeroDecimales;
    //private Frame frm;
    private Usuario beanUsuario;
    private JCheckBox checkAutorizado;
    private JComboBox cboMoneda;
    private JTextField txt_descripcion;
    private JTextField txt_iditem;
    private JButton btn_buscar;
    private JButton btnRefrescar;
    private CButton btn_agregar;
    private TableModelItemVenta mdl_producto;
    private TableRowSorter<TableModelItemVenta> modeloOrdenadoProducto;
    private CTable tbl_producto;
    private JTextField txt_cantidad;
    private JComboBox cbo_precio;
    private PrecioMinimo validPrecio;
    private ComboBoxEditorPrecio editorPrecio;
    private TableModelItemAlmacen mdl_almacen;
    private CTable tbl_almacen;
    private List<BeanMoneda> xMoneda=new ArrayList();
    //private Map<String, List<BeanStock>> mapAlmacen;
    private Map<String, BeanPrecioItem> mapPrecio;
    private ComboModelPrecio cboModelPrecio;
    private java.net.URL path;
    private Gif gif;
    private List<BeanCotizacionDet> listDetalle;
    private List<BeanPedidoDet> listDetallePedido;
    private JHDialog argPadre;
    private Component comp;

    public UiPnlCotizacionAddItem(JHDialog frm, String title, Usuario usuario, java.net.URL path, Component comp) {
        super(frm);
        //this.frm = frm;
        this.beanUsuario = usuario;
        this.path = path;
        this.argPadre = frm;
        this.comp = comp;
        inicialize();
        initListener();
    }

    private void inicialize() {
        checkAutorizado = new JCheckBox("AUT. PRECIO");
        gif = new Gif();

        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());

        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());

        pnlPrincipal.add(pnl, BorderLayout.CENTER);

        JPanel pnlNorth = new JPanel();
        pnlNorth.setLayout(new BorderLayout());
        pnlNorth.setBackground(new Color(245, 245, 245));
        JPanel pnlSouth = new JPanel();
        pnlSouth.setLayout(new BorderLayout());
        pnlSouth.setBackground(new Color(245, 245, 245));

        JPanel pnlFiltro = new JPanel();
        pnlNorth.add(pnlFiltro, BorderLayout.WEST);
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);


        pnl.add(pnlNorth, BorderLayout.NORTH);
        pnl.add(pnlSouth, BorderLayout.SOUTH);

        JLabel lbl_CodigoAlterno = new JLabel("COD");
        lbl_CodigoAlterno.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlFiltro.add(lbl_CodigoAlterno, gbc);

        txt_iditem = new JTextField();
        txt_iditem.setColumns(5);
        txt_iditem.setDocument(new IntegerDocument(6));
        txt_iditem.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 1;
        pnlFiltro.add(txt_iditem, gbc);

        JLabel lblItem = new JLabel("DESC");
        lblItem.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 2;
        pnlFiltro.add(lblItem, gbc);

        txt_descripcion = new JTextField();
        txt_descripcion.setFont(new Font("Helvetica", Font.BOLD, 13));
        txt_descripcion.setDocument(new UpperCaseNumberDocument());
        txt_descripcion.setColumns(15);
        gbc.gridx = 3;
        pnlFiltro.add(txt_descripcion, gbc);

        JLabel lblMoneda = new JLabel("MONEDA");
        lblMoneda.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 4;
        pnlFiltro.add(lblMoneda, gbc);

        cboMoneda = new JComboBox();
        cboMoneda.setFont(new Font("Helvetica", Font.BOLD, 13));
        gbc.gridx = 5;
        pnlFiltro.add(cboMoneda, gbc);

        btn_buscar = new JButton(gif.BUSCAR);
        btn_buscar.setFont(new Font("Helvetica", Font.BOLD, 13));
        btn_buscar.setHorizontalTextPosition(SwingConstants.LEFT);
        btn_buscar.setToolTipText("Buscar");
        btn_buscar.setContentAreaFilled(true);
        btn_buscar.setBorderPainted(true);
        btn_buscar.setFocusable(true);
        btn_buscar.setFocusPainted(false);
        gbc.gridx = 6;
        pnlFiltro.add(this.btn_buscar, gbc);

        btnRefrescar = new JButton(gif.REFRESH16);
        btnRefrescar.setToolTipText("Refrescar");
        btnRefrescar.setFont(new Font("Helvetica", Font.BOLD, 13));
        btnRefrescar.setHorizontalTextPosition(SwingConstants.LEFT);
        //btnRefrescar.setHorizontalAlignment(SwingConstants.LEFT);
        //btnRefrescar.setIconTextGap(10);
        //btnRefrescar.setFont(new Font("Verdana", 1, 10));
        btnRefrescar.setOpaque(false);
        btnRefrescar.setFocusPainted(false);
        btnRefrescar.setContentAreaFilled(true);
        btnRefrescar.setBorderPainted(true);
        //btnRefrescar.setBounds(600, 370, 120, 25);
        pnlNorth.add(btnRefrescar, BorderLayout.EAST);

        mdl_producto = new TableModelItemVenta();
        modeloOrdenadoProducto = new TableRowSorter(mdl_producto);
        tbl_producto = new CTable();

        tbl_producto.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_producto.setFont(new Font("Helvetica", Font.BOLD, 13));
        tbl_producto.setRowSorter(modeloOrdenadoProducto);
        tbl_producto.setModel(mdl_producto);
        tbl_producto.setNoVisibleColumn(4);
        tbl_producto.setNoVisibleColumn(6);
        tbl_producto.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                txt_cantidad.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        tbl_producto.setAllColumnNoResizable();
        tbl_producto.setRendererColumnZero();
        tbl_producto.setAllTableNoEditable();
        tbl_producto.setAllColumnPreferredWidthNvo(5);

        JPanel pnlCenter = new JPanel();
        pnlCenter.setLayout(new BorderLayout());
        pnlCenter.setBackground(new Color(245, 245, 245));

        pnl.add(pnlCenter, BorderLayout.CENTER);

        JPanel pnlProducto = new JPanel();
        pnlProducto.setLayout(new BorderLayout());
        pnlProducto.setBackground(new Color(245, 245, 245));
        JPanel pnlAlmacen = new JPanel();
        pnlAlmacen.setLayout(new BorderLayout());
        pnlAlmacen.setBackground(new Color(245, 245, 245));

        JPanel pnlProductoSouth = new JPanel(new FlowLayout(FlowLayout.LEADING, 14, 5));
        pnlProductoSouth.setBackground(new Color(245, 245, 245));

        pnlCenter.add(pnlProducto, BorderLayout.CENTER);
        pnlCenter.add(pnlAlmacen, BorderLayout.EAST);

        JScrollPane scrollViewProducto = new JScrollPane(tbl_producto);
        scrollViewProducto.setPreferredSize(new Dimension(600, 100));
        pnlProducto.add(scrollViewProducto, BorderLayout.CENTER);

        JLabel lbl_cantidad = new JLabel("CANT");
        lbl_cantidad.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(lbl_cantidad);

        txt_cantidad = new JTextField();
        txt_cantidad.setDocument(new DoubleDocument());
        txt_cantidad.setColumns(7);
        txt_cantidad.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(txt_cantidad);

        JLabel lbl_precio = new JLabel("PRECIO");
        lbl_precio.setFont(new Font("Helvetica", Font.BOLD, 13));
        pnlProductoSouth.add(lbl_precio);
        cbo_precio = new JComboBox();
        validPrecio = new PrecioMinimo(checkAutorizado, cbo_precio);
        cbo_precio.setEditable(true);
        editorPrecio = new ComboBoxEditorPrecio();
        cbo_precio.setEditor(editorPrecio);
        ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).setDocument(new DoubleDocument());
        ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).setInputVerifier(validPrecio);
        pnlProductoSouth.add(cbo_precio);
        //SubstanceLookAndFeel.setCurrentWatermark(new SubstanceMagneticFieldWatermark());
        //SubstanceLookAndFeel.setCurrentButtonShaper(new StandardButtonShaper());
        checkAutorizado.setForeground(Color.BLUE);
        checkAutorizado.setFont(new Font("Helvetica", Font.BOLD, 12));
        pnlProductoSouth.add(checkAutorizado);
        mdl_almacen = new TableModelItemAlmacen();
        tbl_almacen = new CTable();
        tbl_almacen.getTableHeader().setFont(new Font(Font.SANS_SERIF, 1, 11));
        tbl_almacen.setFont(new Font("Helvetica", Font.BOLD, 13));
        tbl_almacen.setModel(mdl_almacen);
        tbl_almacen.setAllColumnNoResizable();
        tbl_almacen.setAllTableNoEditable();
        CTableFx.alignRightColumnTable(tbl_almacen, 1);
        tbl_almacen.setAllColumnPreferredWidthNvo(5);

        JScrollPane scrollViewAlmacen = new JScrollPane(tbl_almacen);
        scrollViewAlmacen.setPreferredSize(new Dimension(300, 250));

        pnlAlmacen.add(scrollViewAlmacen, BorderLayout.CENTER);

        JPanel pnlVenta = new JPanel();
        pnlVenta.setLayout(new BorderLayout());
        pnlVenta.setOpaque(false);

        JPanel pnlOpc = new JPanel();
        pnlOpc.setLayout(new BorderLayout());
        pnlOpc.setOpaque(false);

        JPanel pnl_botones = new JPanel(new FlowLayout(FlowLayout.LEFT, 14, 5));
        pnlOpc.add(pnl_botones, BorderLayout.CENTER);
        pnlOpc.add(pnlProductoSouth, BorderLayout.WEST);
        pnl_botones.setOpaque(false);

        btn_agregar = new CButton("(F8) Agregar Item", gif.ADDORANGE, "Agregar Item", 'B');

        pnl_botones.add(btn_agregar);
        gbc.gridx = 9;
        pnlVenta.add(pnlOpc, BorderLayout.NORTH);
        pnlSouth.add(pnlVenta, BorderLayout.CENTER);
        getContentPane().add(pnlPrincipal);

        setResizable(true);
        setModal(true);
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);

    }

    private void initListener() {
        addKeyListener(this);
        addFocusListener(this);
        cbo_precio.addKeyListener(this);
        cbo_precio.addFocusListener(this);
        cbo_precio.addItemListener(itemListener);
        txt_iditem.addFocusListener(this);
        txt_iditem.addKeyListener(this);
        txt_descripcion.addFocusListener(this);
        txt_descripcion.addKeyListener(this);
        cboMoneda.addKeyListener(this);
        cboMoneda.addActionListener(this);
        btn_buscar.addActionListener(this);
        btnRefrescar.addActionListener(this);
        btn_buscar.addKeyListener(this);
        tbl_producto.addKeyListener(this);
        txt_cantidad.addKeyListener(this);
        txt_cantidad.addFocusListener(this);
        cbo_precio.addKeyListener(this);
        cbo_precio.addFocusListener(this);
        cbo_precio.setFont(new Font("Helvetica", Font.BOLD, 13));
        cbo_precio.addActionListener(this);
        tbl_almacen.addKeyListener(this);
        tbl_almacen.addMouseListener(this);
        cboMoneda.addItemListener(this);
        tbl_producto.getSelectionModel().addListSelectionListener(this);
        cbo_precio.addItemListener(this);
        tbl_almacen.getSelectionModel().addListSelectionListener(this);
        tbl_producto.addMouseListener(this);
        ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).addKeyListener(this);
        btn_agregar.addActionListener(this);
        btn_agregar.addKeyListener(this);
        tbl_almacen.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                procesoAgregar();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);
    }
    
     private String getParametroSistema(String idParametro){
        try {
            RnParametro regla = new RnParametro(path);
            List<BeanParametro> listaBeanParametro=regla.listarParametro(idParametro, "A");
            if(listaBeanParametro.isEmpty()){
                throw new Exception("Parámetro "+ idParametro +" no existe"); 
            }else{
                BeanParametro bean = listaBeanParametro.get(0);
                return bean.getValor();
            }              
        } catch (SQLException ex) {
           JOptionPane.showMessageDialog(null, ex.getMessage());
        } catch (Exception e){
            JOptionPane.showMessageDialog(null, e.getMessage());
        }
        return null;
    }

    public void cargarDatos() {
        try {
            cargarMoneda();
            cargarTabla();
            numeroDecimales=Integer.parseInt(getParametroSistema("00120"));
            txt_iditem.setText("");
            txt_descripcion.setText("");
            txt_cantidad.setText("0.0");
            cbo_precio.getEditor().setItem("0.0");
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarTabla() throws Exception {
        try {
            RnItem logic = new RnItem(path);
            mdl_producto.clearTable();
            List<BeanItem> lista;
            lista = logic.listarProductoVenta(beanUsuario.getCodlocalidad());
            mdl_producto.agregarListItem(lista);
            tbl_producto.setAllColumnPreferredWidthNvo(5);
            cargarProductoPrecioAll();
            mdl_almacen.clearTable();
            tbl_almacen.setAllColumnPreferredWidthNvo(5);
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarProductoPrecioAll() throws Exception {
        try {
            RnItem logic = new RnItem(path);
            List<BeanPrecioItem> lista;
            lista = logic.listarProductoPrecioVenta(beanUsuario.getCodlocalidad(),"");
            mapPrecio = new HashMap<String, BeanPrecioItem>();
            for (int i = 0; i < lista.size(); i++) {
                BeanPrecioItem beanPrecioItem = (BeanPrecioItem) lista.get(i);
                mapPrecio.put(beanPrecioItem.getIdItem(), beanPrecioItem);
            }
        } catch (Exception e) {
            throw e;
        }
    }

    private void filtrarTablaProducto() {
        modeloOrdenadoProducto.setRowFilter(getFilterProducto());
        tbl_producto.setAllColumnPreferredWidthNvo(5);
        if (tbl_producto.getRowCount() > 0) {
            tbl_producto.setRowSelectionInterval(0, 0);
            procesoCargarAlmacen();
            tbl_producto.requestFocus();
        }
    }

    private void procesoCargarAlmacen() {
        try {
            if (tbl_producto.getSelectedRow() >= 0) {
                mdl_almacen.clearTable();
                RnStock regla = new RnStock(path);
                List<BeanStock> lista = regla.listarStockVentas(beanUsuario.getCodempresa(), beanUsuario.getCodpuntoventa(), mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem(), beanUsuario.getCodlocalidad(), "S");
                mdl_almacen.agregarListStock(lista);
                tbl_almacen.setAllColumnPreferredWidthNvo(5);
                cargarPrecios(mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem());

                if (tbl_almacen.getRowCount() > 0) {
                    tbl_almacen.setRowSelectionInterval(0, 0);
                }
            } else if (tbl_almacen.getRowCount() > 0) {
                mdl_almacen.clearTable();
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void cargarPrecios(String id_item) {
        cbo_precio.removeAllItems();
        BeanPrecioItem beanPrecioItem = mapPrecio.get(id_item);
        Set precios = new HashSet();
        if (cboMoneda.getSelectedIndex() == 0) {
            if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 0) {
                precios.add(beanPrecioItem.getPrecio1());
            } else {
                if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio1());
                }
                if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio2());
                }
                if (beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio3());
                }
            }
        } else {
            if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 0) {
                precios.add(beanPrecioItem.getPrecio4());
            } else {
                if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio4());
                }
                if (beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio5());
                }
                if (beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 1) {
                    precios.add(beanPrecioItem.getPrecio6());
                }
            }
        }

        cboModelPrecio = new ComboModelPrecio(precios);
        cbo_precio.setModel(cboModelPrecio);
        if (cboMoneda.getSelectedIndex() == 0) {
            validPrecio.setPrecioMinimo((beanPrecioItem.getPrecio3()));
        } else {
            validPrecio.setPrecioMinimo((beanPrecioItem.getPrecio6()));
        }
        if (cbo_precio.getItemCount() > 0) {
            if (cboMoneda.getSelectedIndex() == 0) {
                if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio3().compareTo(BigDecimal.ZERO) == 0) {
                    cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio1());
                } else {
                    if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                        cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio1());
                    } else if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                        cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio2());
                    } else {
                        cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio3());
                    }
                }
            } else {
                if (beanPrecioItem.getPrecio4().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio5().compareTo(BigDecimal.ZERO) == 0 && beanPrecioItem.getPrecio6().compareTo(BigDecimal.ZERO) == 0) {
                    cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio4());
                } else {
                    if (beanPrecioItem.getPrecio1().compareTo(BigDecimal.ZERO) == 1) {
                        cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio1());
                    } else if (beanPrecioItem.getPrecio2().compareTo(BigDecimal.ZERO) == 1) {
                        cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio2());
                    } else {
                        cbo_precio.getEditor().setItem(beanPrecioItem.getPrecio3());
                    }
                }
            }

        }
    }

    private RowFilter getFilterProducto() {
        List filters = new ArrayList();
        if (cboMoneda.getSelectedIndex() >= 0) {
            filters.add(RowFilter.regexFilter(".*" + xMoneda.get(cboMoneda.getSelectedIndex()).getIdMoneda() + ".*", 6));
        }
        if (txt_iditem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_iditem.getText().trim() + ".*", 0));
        }
        if (txt_descripcion.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txt_descripcion.getText().trim() + ".*", 1));
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;
    }

    private void cargarMoneda() throws Exception {
        try {
            LoadCombo.loadMoneda(path, xMoneda, cboMoneda);
        } catch (Exception e) {
            throw e;
        }
    }

    private void valorCodItem() {
        String codItem = txt_iditem.getText().trim();
        int longitud = codItem.length();
        if (longitud <= 6) {
            for (int i = 0; i < 6 - longitud; i++) {
                codItem = "0" + codItem;
            }
            txt_iditem.setText(codItem);
        } else {
            JOptionPane.showMessageDialog(null, "Numero de caracteres debe ser menor o igual a 6");
        }
    }

    private void procesoVerificar() {
        tbl_producto.editCellAt(-1, -1);

        if (tbl_producto.getSelectedRow() == -1) {
            JOptionPane.showMessageDialog(this, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
        } else {
            if ((txt_cantidad.getText().trim().length() > 0) && (Double.valueOf(txt_cantidad.getText().trim()).doubleValue() > 0)) {
                if (tbl_almacen.getRowCount() > 0) {
                    if (tbl_almacen.getSelectedRow() == -1) {
                        tbl_almacen.setRowSelectionInterval(0, 0);
                        tbl_almacen.requestFocus();
                    } else {
                        tbl_almacen.requestFocus();
                    }
                } else {
                    JOptionPane.showMessageDialog(this, "El item no se encuentra disponible en ningun almacen", "No tiene almacen", JOptionPane.INFORMATION_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(this, "Debe especificar la cantidad del Item", "Espeficicar Cantidad", JOptionPane.INFORMATION_MESSAGE);
            }
        }
    }

    private boolean existeItem(String id_item, String id_almacen) throws Exception {
        try {
            if (listDetalle != null) {
                for (int i = 0; i < listDetalle.size(); i++) {
                    BeanCotizacionDet bean = (BeanCotizacionDet) listDetalle.get(i);
                    if (bean.getBeanItem().getIdItem().equals(id_item) & bean.getBeanAlmacen().getIdAlmacen().equals(id_almacen)) {
                        JOptionPane.showMessageDialog(this, "Producto ya se encuentra en la Cotizacion");
                        return true;
                    }
                }
            }
            if (listDetallePedido != null) {
                for (int i = 0; i < listDetallePedido.size(); i++) {
                    BeanPedidoDet bean = (BeanPedidoDet) listDetallePedido.get(i);
                    if (bean.getBeanItem().getIdItem().equals(id_item) & bean.getBeanAlmacen().getIdAlmacen().equals(id_almacen)) {
                        JOptionPane.showMessageDialog(this, "Producto ya se encuentra en el Pedido");
                        return true;
                    }
                }
            }
            return false;
        } catch (Exception e) {
            throw e;
        }
    }

    private void procesoAgregar() {
        try {
            tbl_producto.editCellAt(-1, -1);

            if (tbl_producto.getSelectedRow() == -1) {
                JOptionPane.showMessageDialog(this, "Debe seleccionar el Item a agregar", "Seleccionar Item", JOptionPane.INFORMATION_MESSAGE);
            }

            if ((txt_cantidad.getText().trim().length() > 0) && (Double.valueOf(txt_cantidad.getText().trim()).doubleValue() > 0)) {
                if (tbl_almacen.getRowCount() > 0) {
                    if (!existeItem(mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow())).getIdItem(), mdl_almacen.getStock(tbl_almacen.convertRowIndexToModel(tbl_almacen.getSelectedRow())).getBeanAlmacen().getIdAlmacen())) {
                        agregarItem(-1);
                    }
                    checkAutorizado.setSelected(false);
                    try {
                        cbo_precio.setSelectedIndex(1);
                        cbo_precio.getEditor().setItem(cbo_precio.getSelectedItem());
                    } catch (Exception ex) {
                    }
                    // }
                } else {
                    JOptionPane.showMessageDialog(this, "El item no se encuentra disponible en ningun almacen", "No tiene almacen", JOptionPane.INFORMATION_MESSAGE);
                }
            } else {
                JOptionPane.showMessageDialog(this, "Debe especificar la cantidad del Item", "Espeficicar Cantidad", JOptionPane.INFORMATION_MESSAGE);
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void agregarItem(double num) {
        BeanItem producto = mdl_producto.getItem(tbl_producto.convertRowIndexToModel(tbl_producto.getSelectedRow()));
        //System.out.println("Promocion = " + producto.getFlagPromocion());
        BigDecimal cantidad = new BigDecimal(txt_cantidad.getText().trim());
        BigDecimal precio = new BigDecimal(cbo_precio.getSelectedItem().toString().trim());
        //producto.setP_unit(BigDecimal.valueOf(Double.valueOf(cbo_precio.getSelectedItem().toString().trim())).setScale(2, RoundingMode.HALF_DOWN).doubleValue());
        BeanStock almacen = mdl_almacen.getStock(tbl_almacen.convertRowIndexToModel(tbl_almacen.getSelectedRow()));

        if (num != -1) {
            //producto.setCantidad_string(String.valueOf(Double.valueOf(producto.getCantidad_string()).doubleValue() + num));
            cantidad = cantidad.add(new BigDecimal(num));
        }
        //Calcular
        BigDecimal monto = new BigDecimal(BigInteger.ZERO);
        BigDecimal pigv = new BigDecimal(BigInteger.ZERO);
        BigDecimal migv = new BigDecimal(BigInteger.ZERO);
        BigDecimal mafecto = new BigDecimal(BigInteger.ZERO);
        BigDecimal mnoafecto = new BigDecimal(BigInteger.ZERO);
        monto = cantidad.multiply(precio);
        if (producto.getFlagIgv().equals("S")) {
            pigv = producto.getPigv().divide(new BigDecimal("100"));
            mafecto = monto.divide(pigv.add(BigDecimal.ONE), 2, RoundingMode.HALF_DOWN);
            migv = monto.subtract(mafecto);
        } else {
            mnoafecto = monto;
        }
        if (listDetalle != null) {
            BeanCotizacionDet beanCot = new BeanCotizacionDet();
            beanCot.setBeanItem(producto);
            beanCot.setBeanAlmacen(almacen.getBeanAlmacen());
            beanCot.setCantidad(cantidad);
            beanCot.setCantDesp(BigDecimal.ZERO);
            beanCot.setPrecio(precio);
            beanCot.setAfecto(mafecto);
            beanCot.setNoafecto(mnoafecto);
            beanCot.setPIgv(pigv);
            beanCot.setIgv(migv);
            beanCot.setMonto(monto);
            beanCot.setPesototal(producto.getPesobruto().multiply(cantidad));
            beanCot.setOperacion("I");
            beanCot.setFlagAutorizado(checkAutorizado.isSelected() ? "N" : "S");
            argPadre.setValueSearch(beanCot, comp);
        }

        if (listDetallePedido != null) {

            BeanPedidoDet beanPed = new BeanPedidoDet();
            beanPed.setBeanItem(producto);
            beanPed.setBeanAlmacen(almacen.getBeanAlmacen());
            beanPed.setCantidad(cantidad);
            beanPed.setCantDesp(BigDecimal.ZERO);
            beanPed.setPrecio(precio);
            beanPed.setAfecto(mafecto);
            beanPed.setNoafecto(mnoafecto);
            beanPed.setP_igv(pigv);
            beanPed.setIgv(migv);
            beanPed.setMonto(monto);
            beanPed.setPesototal(producto.getPesobruto().multiply(cantidad));
            beanPed.setOperacion("I");
            beanPed.setFlagAutorizado(checkAutorizado.isSelected() ? "N" : "S");
            argPadre.setValueSearch(beanPed, comp);
        }
        dispose();
    }

    public void setListDetalle(List<BeanCotizacionDet> listDetalle) {
        this.listDetalle = listDetalle;
    }

    public void setListDetallePedido(List<BeanPedidoDet> listDetallePedido) {
        this.listDetallePedido = listDetallePedido;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {
            if (e.getSource().equals(cbo_precio)) {
                txt_descripcion.requestFocus();
            }
            if (e.getSource() == cboMoneda) {
                btn_buscar.requestFocus();
            }
            if (e.getSource() == btn_buscar) {
                btn_agregar.requestFocus();
            }
            if ((e.getSource() == txt_descripcion)
                    || (e.getSource() == txt_iditem)) {
                if (txt_iditem.getText().trim().length() > 0) {
                    valorCodItem();
                }
                filtrarTablaProducto();
            }

            if (e.getSource() == txt_cantidad) {
                cbo_precio.getEditor().getEditorComponent().requestFocus();
            }

        }

        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyCode() == KeyEvent.VK_F10) {
            cargarDatos();
        }

        if (e.getKeyCode() == KeyEvent.VK_F9) {
            tbl_producto.editCellAt(-1, -1);
        }

        if (e.getKeyCode() == KeyEvent.VK_F8) {
            tbl_producto.editCellAt(-1, -1);
            btn_agregar.requestFocus();
            btn_agregar.doClick();
        }

        if (e.getKeyCode() == KeyEvent.VK_F5) {
            tbl_producto.editCellAt(-1, -1);
        }

        if (e.getKeyCode() == KeyEvent.VK_F6) {
            tbl_producto.editCellAt(-1, -1);
        }

        if (e.getKeyCode() == KeyEvent.VK_F7) {
            tbl_producto.editCellAt(-1, -1);
            btn_buscar.doClick();
        }

        if (e.getSource().equals((JTextComponent) cbo_precio.getEditor().getEditorComponent())) {
            if (KeyEvent.VK_ENTER == e.getKeyChar()) {
                procesoVerificar();
            }
        }

    }

    @Override
    public void keyReleased(KeyEvent e) {
        if ((e.getKeyCode() == KeyEvent.VK_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_UP)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_DOWN)
                || (e.getKeyCode() == KeyEvent.VK_PAGE_UP)) {
            tbl_producto.editCellAt(-1, -1);
            if (e.getSource() == tbl_producto) {
                procesoCargarAlmacen();
            }
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource().equals(cbo_precio)) {
            cbo_precio.getEditor().selectAll();
        }

        if (e.getSource() == txt_iditem) {
            txt_iditem.selectAll();
        }

        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }

        if (e.getSource() == txt_cantidad) {
            txt_cantidad.selectAll();
        }

        if (e.getSource() == cbo_precio.getEditor().getEditorComponent()) {
            cbo_precio.getEditor().selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_iditem && txt_iditem.getText().trim().length() > 0) {
            valorCodItem();
        }
        if (e.getSource() == txt_cantidad && txt_cantidad.getText().trim().length() == 0) {
            txt_cantidad.setText("0.0");
        }
        if (e.getSource().equals(cbo_precio)) {
            String valor = ((JTextComponent) cbo_precio.getEditor().getEditorComponent()).getText();
            int punto = valor.indexOf(".");
            if (valor.substring(punto).length() > 2) {
                //cuadro.CuadroAviso("Debe registrar máximo 2 dígitos decimales", JOptionPane.WARNING_MESSAGE);
                JOptionPane.showMessageDialog(this, "Debe registrar máximo 2 dígitos decimales", "Sistema", JOptionPane.WARNING_MESSAGE);
                cbo_precio.requestFocus();
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource() == btn_agregar) {
                procesoAgregar();
            }
            if (e.getSource() == btn_buscar) {
                filtrarTablaProducto();
            }
            if (e.getSource().equals(btnRefrescar)) {
                cargarTabla();
            }
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboMoneda)) {
            filtrarTablaProducto();
            cbo_precio.removeAllItems();
            cbo_precio.updateUI();
        }
        if (e.getSource().equals(cbo_precio)) {
            cbo_precio.getEditor().setItem(cbo_precio.getSelectedItem());
        }
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 1) {
            tbl_producto.editCellAt(-1, -1);

            if (e.getSource() == tbl_producto) {
                procesoCargarAlmacen();
            }
        }

        if (e.getClickCount() == 2) {
            tbl_producto.editCellAt(-1, -1);

            if (e.getSource() == tbl_producto) {
                int fila = tbl_producto.rowAtPoint(e.getPoint());
                int columna = tbl_producto.columnAtPoint(e.getPoint());

                if ((fila >= 0) && (columna == 5 || columna == 4)) {
                } else {
                    procesoAgregar();
                }
            }

            if (e.getSource() == tbl_almacen) {
                procesoAgregar();
            }
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
        if (e.getSource() == tbl_producto) {
            procesoCargarAlmacen();
        }
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }
    ItemListener itemListener = new ItemListener() {
        @Override
        public void itemStateChanged(ItemEvent e) {
            cbo_precio.getEditor().setItem(cbo_precio.getSelectedItem());
        }
    };

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }
}
