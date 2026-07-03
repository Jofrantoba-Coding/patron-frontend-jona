package com.softcommerce.views.uiregistersalidamasivainventario;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.BeanMarca;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.StockAlmacen;
import com.softcommerce.beans.BeanSubFamilia;
import com.softcommerce.beans.BeanTamano;
import com.softcommerce.beans.BeanUnidadMedida;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHInternalDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.StockHistoricoTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnMarca;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.reglasnegocio.RnSubFamilia;
import com.softcommerce.reglasnegocio.RnTamano;
import com.softcommerce.reglasnegocio.RnUnidadMedida;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExportarToExcel;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
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
import java.beans.PropertyVetoException;
import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;
import javax.swing.JTextField;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiRegisterSalidaMasivaInventario
        extends JHInternalDialog
        implements InterUiRegisterSalidaMasivaInventario, KeyListener, ActionListener,
        FocusListener {

    private static final long serialVersionUID = 1L;
    protected JComboBox cboMarca;
    protected List<BeanMarca> xMarca;
    protected JComboBox cboMonto;
    protected JComboBox cboFamilia;
    protected List<BeanFamilia> xFamilia;
    protected JComboBox cboSubFamilia;
    protected List<BeanSubFamilia> xSubFamilia;
    protected JComboBox cboAlmacen;
    protected List<Almacen> xAlmacen;
    protected JComboBox cboPuntoVenta;
    protected List<PuntoVenta> xPuntoVenta;
    protected JComboBox cboLocalidad;
    protected List<Localidad> xLocalidad;
    protected JTextField txtDescripcionItem;
    protected JTextField txtIdItem;
    protected JTextField txtMonto;
    protected JButton btnNuevo;
    protected JButton btnBuscar;
    protected JButton btnRecalculaStock;
    protected JButton btnExportarExcel;
    protected JButton btnSalir;
    protected StockHistoricoTableModel mdl_stock2;
    protected TableRowSorter<StockHistoricoTableModel> modeloOrdenadoStockHist;
    protected CTable tbl_inventario2;
    protected final Main frm;
    protected Gif gif;
    protected Usuario usuario = new Usuario();
    protected JDateChooser dcFechaFin;
    protected JTabbedPane tabb;
    protected JComboBox cboUm;
    protected List<BeanUnidadMedida> xUm;
    protected List<BeanTamano> xtamano;
    protected JComboBox cboTamano;
    protected final Logger logger = Logger.getLogger(UiRegisterSalidaMasivaInventario.class);

    public UiRegisterSalidaMasivaInventario(String title, Main frm, JDesktopPane jdp, Usuario usuario) {
        super(title);
        this.frm = frm;
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        addKeyListener(this);

        gif = new Gif();

        JPanel pnlPrincipal = new JPanel();
        pnlPrincipal.setLayout(new BorderLayout());
        pnlPrincipal.add(getpnlFiltro(), BorderLayout.NORTH);
        pnlPrincipal.add(getPnlOpciones(), BorderLayout.SOUTH);
        pnlPrincipal.add(getPnlCenter(), BorderLayout.CENTER);
        setResizable(true);
        setClosable(true);
        setSize(1020, 555);
        setIconifiable(true);
        setLocation(((Toolkit.getDefaultToolkit().getScreenSize().width - getSize().width) / 2), (Toolkit.getDefaultToolkit().getScreenSize().height - getSize().height) / 20);
        setPanel(pnlPrincipal);
    }

    protected JPanel getpnlFiltro() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        pnl.add(getPnlFiltrosLeft(), BorderLayout.WEST);
        return pnl;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(245, 245, 245));
        tabb = new JTabbedPane();
        tabb.add("STOCK", getPnlCenterStock());
        pnl.add(tabb, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlCenterStock() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        mdl_stock2 = new StockHistoricoTableModel();
        tbl_inventario2 = new CTable();
        tbl_inventario2.setModel(mdl_stock2);
        modeloOrdenadoStockHist = new TableRowSorter(mdl_stock2);
        tbl_inventario2.setRowSorter(modeloOrdenadoStockHist);
        tbl_inventario2.setFont(new Font(Font.SANS_SERIF, 0, 11));
        tbl_inventario2.setAllTableNoEditable();
        tbl_inventario2.setNoVisibleColumn(1);
        tbl_inventario2.setNoVisibleColumn(4);
        tbl_inventario2.setNoVisibleColumn(6);
        tbl_inventario2.setNoVisibleColumn(8);
        tbl_inventario2.setNoVisibleColumn(10);
        tbl_inventario2.setNoVisibleColumn(12);
        tbl_inventario2.setNoVisibleColumn(15);
        tbl_inventario2.setAllColumnPreferredWidth();

        JScrollPane jsp = new JScrollPane(tbl_inventario2);
        pnl.add(jsp, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlOpciones() {
        return null;
    }

    protected JPanel getPnlFiltrosLeft() {
        JPanel pnlFiltro = new JPanel();
        pnlFiltro.setLayout(new GridBagLayout());
        pnlFiltro.setBackground(new Color(245, 245, 245));
        GridBagConstraints gbc = new GridBagConstraints();

        cboLocalidad = new JComboBox();
        cboLocalidad.addActionListener(this);
        cboLocalidad.setEnabled(false);
        cboLocalidad.setVisible(false);

        JLabel lblPuntoVenta = new JLabel("P.Venta");
        lblPuntoVenta.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.anchor = GridBagConstraints.WEST;
        gbc.insets = new Insets(2, 2, 2, 2);
        pnlFiltro.add(lblPuntoVenta, gbc);

        cboPuntoVenta = new JComboBox();
        cboPuntoVenta.addActionListener(this);
        cboPuntoVenta.addKeyListener(this);
        gbc.gridx = 1;
        gbc.gridwidth = 3;
        pnlFiltro.add(cboPuntoVenta, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Almacen = new JLabel("Almacén");
        lbl_Almacen.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lbl_Almacen, gbc);

        cboAlmacen = new JComboBox();
        cboAlmacen.addActionListener(this);
        cboAlmacen.addKeyListener(this);
        gbc.gridx = 5;
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
        btnNuevo.addActionListener(this);
        btnNuevo.addKeyListener(this);
        gbc.gridx = 6;
        pnlFiltro.add(this.btnNuevo, gbc);

        btnBuscar = new JButton(gif.SEARCH16);
        btnBuscar.setHorizontalTextPosition(SwingConstants.LEFT);
        btnBuscar.setToolTipText("Ver Detalle");
        btnBuscar.setContentAreaFilled(true);
        btnBuscar.setBorderPainted(true);
        btnBuscar.setFocusable(true);
        btnBuscar.setFocusPainted(false);
        btnBuscar.addActionListener(this);
        btnBuscar.addKeyListener(this);
        gbc.gridx = 7;
        gbc.anchor = GridBagConstraints.WEST;
        pnlFiltro.add(this.btnBuscar, gbc);

        JLabel lbl_familia = new JLabel("Familia");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlFiltro.add(lbl_familia, gbc);

        cboFamilia = new JComboBox();
        cboFamilia.addActionListener(this);
        cboFamilia.addKeyListener(this);
        gbc.gridwidth = 3;
        gbc.gridx = 1;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboFamilia, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        JLabel lbl_subfamilia = new JLabel("SubFamilia");
        lbl_subfamilia.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lbl_subfamilia, gbc);

        cboSubFamilia = new JComboBox();
        cboSubFamilia.addActionListener(this);
        cboSubFamilia.addKeyListener(this);
        gbc.gridx = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboSubFamilia, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblMarca = new JLabel("Marca");
        lblMarca.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 6;
        pnlFiltro.add(lblMarca, gbc);

        cboMarca = new JComboBox();
        cboMarca.addKeyListener(this);
        cboMarca.addActionListener(this);
        gbc.gridx = 7;
        pnlFiltro.add(cboMarca, gbc);

        JLabel lbl_CodigoItem = new JLabel("Código");
        lbl_CodigoItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlFiltro.add(lbl_CodigoItem, gbc);

        txtIdItem = new JTextField();
        txtIdItem.addKeyListener(this);
        txtIdItem.addFocusListener(this);
        if (Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
            txtIdItem.setDocument(new UpperCaseNumberDocument(30));
        } else {
            txtIdItem.setDocument(new IntegerDocument(6));
        }
        txtIdItem.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(txtIdItem, gbc);
        gbc.fill = GridBagConstraints.NONE;
        gbc.gridwidth = 1;

        JLabel lblUm = new JLabel("U.M.");
        lblUm.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lblUm, gbc);

        cboUm = new JComboBox();
        cboUm.addActionListener(this);
        gbc.gridx = 5;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(cboUm, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblItem = new JLabel("Desc.");
        lblItem.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 6;
        pnlFiltro.add(lblItem, gbc);

        txtDescripcionItem = new JTextField();
        txtDescripcionItem.setFont(new Font("Garamond", 0, 14));
        txtDescripcionItem.setDocument(new UpperCaseNumberDocument(255));
        txtDescripcionItem.addFocusListener(this);
        txtDescripcionItem.addKeyListener(this);
        gbc.gridx = 7;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnlFiltro.add(txtDescripcionItem, gbc);
        gbc.fill = GridBagConstraints.NONE;

        JLabel lblMonto = new JLabel("Cant Fisica");
        lblMonto.setDisplayedMnemonic('o');
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlFiltro.add(lblMonto, gbc);

        cboMonto = new JComboBox();
        cboMonto.addItem("=");
        cboMonto.addItem("<>");
        cboMonto.addItem("<");
        cboMonto.addItem("<=");
        cboMonto.addItem(">");
        cboMonto.addItem(">=");
        cboMonto.addActionListener(this);
        gbc.gridx = 1;
        pnlFiltro.add(cboMonto, gbc);

        txtMonto = new JTextField();
        txtMonto.addKeyListener(this);
        txtMonto.setColumns(3);
        txtMonto.setDocument(new DoubleDocument());
        txtMonto.addFocusListener(this);
        txtMonto.addKeyListener(this);
        txtMonto.setFont(new Font("Garamond", 0, 14));
        gbc.gridx = 2;
        pnlFiltro.add(txtMonto, gbc);

        JLabel lblTamano = new JLabel("Tamaño");
        lblTamano.setFont(new Font("Verdana", 0, 11));
        gbc.gridx = 4;
        pnlFiltro.add(lblTamano, gbc);

        cboTamano = new JComboBox();
        cboTamano.addKeyListener(this);
        cboTamano.addActionListener(this);
        gbc.gridx = 5;
        pnlFiltro.add(cboTamano, gbc);

        JLabel lblFechaFin = new JLabel("F FIN");
        lblFechaFin.setDisplayedMnemonic('a');
        gbc.gridx = 6;
        pnlFiltro.add(lblFechaFin, gbc);

        dcFechaFin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaFin.getJCalendar().addFocusListener(this);
        dcFechaFin.getJCalendar().addKeyListener(this);
        dcFechaFin.getCalendarButton().addActionListener(this);
        dcFechaFin.addKeyListener(this);
        dcFechaFin.addFocusListener(this);
        ((JTextField) dcFechaFin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dcFechaFin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        gbc.gridx = 7;
        pnlFiltro.add(dcFechaFin, gbc);

        return pnlFiltro;
    }

    protected void loadUnidadMedida() {
    }

    protected void loadTamano() {
    }

    protected void loadLocalidad(String xcodEmpres) {
    }

    protected void loadPuntoVenta(String xcodLocalidad) {
    }

    public void loadAlmacen(String xcodPuntoventa) {
    }

    public void loadFamilia() {
    }

    public void loadSubFamilia(String xcodfamilia) {
    }

    public void loadMarca() {
    }

    protected void regularizarStock() {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txtIdItem && txtIdItem.getText().trim().length() > 0) {
            if (!Constans.IS_BUSQUEDA_ITEM_ALTERNO) {
                String serie = "000000" + txtIdItem.getText().trim();
                String nuevaserie = serie.substring(serie.length() - 6, serie.length());
                txtIdItem.setText(nuevaserie);
            }
            this.filtrarGeneral();
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getSource().equals(btnRecalculaStock)) {
            this.regularizarStock();
        }

        if (e.getSource() == dcFechaFin.getCalendarButton()) {
            Calendar inicioCal = Calendar.getInstance();
            inicioCal.set(Integer.parseInt(frm.getAnio()), 0, 1, 0, 0);
            Calendar finCal = Calendar.getInstance();
            finCal.set(Integer.parseInt(frm.getAnio()), 11, 31, 23, 59);
            dcFechaFin.setSelectableDateRange(inicioCal.getTime(), finCal.getTime());
        }

        if (cboFamilia == e.getSource()) {
            if (cboFamilia.getItemCount() > 0) {
                if (cboFamilia.getSelectedIndex() == 0) {
                    cboSubFamilia.removeAllItems();
                    cboSubFamilia.setEnabled(false);
                } else {
                    cboSubFamilia.setEnabled(true);
                    loadSubFamilia(xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia());
                }
                this.filtrarGeneral();
            }
        }

        if (cboSubFamilia == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboMarca == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboUm == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboTamano == e.getSource()) {
            this.filtrarGeneral();
        }
        if (cboAlmacen == e.getSource()) {
            if (tabb.getSelectedIndex() == 0) {
                filtrarStockHistorico();
            }
        }
        if (cboMonto == e.getSource()) {
            if (tabb.getSelectedIndex() == 0) {
                filtrarStockHistorico();
            }
        }

        if (cboLocalidad == e.getSource()) {
            if (cboLocalidad.getItemCount() > 0) {
                if (cboLocalidad.getSelectedIndex() == 0) {
                    cboPuntoVenta.removeAllItems();
                    cboAlmacen.removeAllItems();
                } else {
                    loadPuntoVenta(xLocalidad.get(cboLocalidad.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }

        if (cboPuntoVenta == e.getSource()) {
            if (cboPuntoVenta.getItemCount() > 0) {
                if (cboPuntoVenta.getSelectedIndex() == 0) {
                    cboAlmacen.removeAllItems();
                    cboAlmacen.setEnabled(false);
                } else {
                    cboAlmacen.setEnabled(true);
                    loadAlmacen(xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta());
                }
                if (tabb.getSelectedIndex() == 0) {
                    filtrarStockHistorico();
                }
            }
        }

        if (e.getSource().equals(btnExportarExcel)) {
            this.exportarExcel();
        }

        if (e.getSource() == btnSalir) {
            dispose();
            doDefaultCloseAction();
        }

        if (e.getSource() == btnBuscar) {
            if (tabb.getSelectedIndex() == 0) {
                cargarTabla();
            }
        }

        if (e.getSource() == btnNuevo) {
            limpiarFiltro();
        }
    }

    protected void exportarExcel() {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    protected void cargarTabla() {
    }

    public void cargarLocalidad(String xcodiLocalidad) {
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
    }

    protected void filtrarStockHistorico() {
    }
    
    protected RowFilter getFilterStockHist() {
        List filters = new ArrayList();
        if (txtIdItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtIdItem.getText().trim() + ".*", 0));
        }
        if (txtDescripcionItem.getText().trim().length() > 0) {
            filters.add(RowFilter.regexFilter(".*" + txtDescripcionItem.getText().trim() + ".*", 3));
        }
        if (cboPuntoVenta.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xPuntoVenta.get(cboPuntoVenta.getSelectedIndex() - 1).getId_punto_venta() + ".*", 15));
        }
        if (cboAlmacen.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xAlmacen.get(cboAlmacen.getSelectedIndex() - 1).getIdAlmacen() + ".*", 1));
        }
        if (cboMarca.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xMarca.get(cboMarca.getSelectedIndex() - 1).getIdMarca() + ".*", 4));
        }
        if (cboFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xFamilia.get(cboFamilia.getSelectedIndex() - 1).getIdFamilia() + ".*", 6));
        }
        if (cboSubFamilia.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xSubFamilia.get(cboSubFamilia.getSelectedIndex() - 1).getIdSubFamilia() + ".*", 8));
        }
        if (cboUm.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xUm.get(cboUm.getSelectedIndex() - 1).getIdUm() + ".*", 10));
        }
        if (cboTamano.getSelectedIndex() > 0) {
            filters.add(RowFilter.regexFilter(".*" + xtamano.get(cboTamano.getSelectedIndex() - 1).getIdTamano() + ".*", 12));
        }
        if (txtMonto.getText().trim().length() > 0) {
            BigDecimal saldo = new BigDecimal(txtMonto.getText().trim());
            if (cboMonto.getSelectedIndex() == 0) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.EQUAL, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 1) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.NOT_EQUAL, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 2) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.BEFORE, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 3) {
            } else if (cboMonto.getSelectedIndex() == 4) {
                filters.add(RowFilter.numberFilter(RowFilter.ComparisonType.AFTER, saldo, 14));
            } else if (cboMonto.getSelectedIndex() == 5) {
            }
        }
        RowFilter fooBarFilter = RowFilter.andFilter(filters);
        return fooBarFilter;

    }

    public void cargarDatos() {
    }

    public void limpiarFiltro() {
    }
    
    @Override
    public void selectInternalFrame() {
        try {
            setSelected(true);
        } catch (PropertyVetoException e) {
        }
    }

    protected void filtrarGeneral() {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if (e.getSource() == txtDescripcionItem || e.getSource() == txtIdItem) {
                this.filtrarGeneral();
            }
            if (e.getSource() == txtMonto) {
                if (tabb.getSelectedIndex() == 0) {
                    filtrarStockHistorico();
                }
            }
        }
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }
    
}
