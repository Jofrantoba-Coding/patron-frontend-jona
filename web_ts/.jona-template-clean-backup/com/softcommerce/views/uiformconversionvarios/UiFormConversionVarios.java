package com.softcommerce.views.uiformconversionvarios;

import com.softcommerce.views.uiregisteringreso.UiRegisterIngreso;


import com.softcommerce.gui.*;
import com.softcommerce.beans.BeanConversion;
import com.softcommerce.beans.BeanItem;
import com.softcommerce.beans.ItemConversion;
import com.softcommerce.beans.ItemItem;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.UsuarioCorrelativo;
import com.softcommerce.compras.formularios.FormBuscarItem;
import com.softcommerce.enums.TipoDocVentaEnum;
import com.softcommerce.enums.TipoMovInventarioEnum;
import com.softcommerce.formularios.Main;
import com.softcommerce.general.controles.DoubleDocument;
import com.softcommerce.general.controles.ObjectItem;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.ItemConversionTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicStock;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.reglasnegocio.RnConversion;
import com.softcommerce.reglasnegocio.RnCorrelativo;
import com.softcommerce.reglasnegocio.RnItem;
import com.softcommerce.reglasnegocio.RnStock;
import com.softcommerce.util.Constans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import com.softcommerce.util.combo.LoadCombo;
import com.softcommerce.util.combo.LoadComboItem;
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
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import javax.swing.table.JTableHeader;
import javax.swing.table.TableColumn;
import javax.swing.table.TableColumnModel;
import org.apache.log4j.Logger;

public class UiFormConversionVarios
        extends JPanel
        implements InterUiFormConversionVarios, ActionListener, ItemListener, TableModelListener {

    protected final Logger logger = Logger.getLogger(UiFormConversionVarios.class);
    protected final URL path;
    protected Gif gif;
    protected JComboBox cboAlmacen;
    protected JComboBox cboSerieNi;
    protected JComboBox cboSerieNs;
    protected JDateChooser dcFechaEmision;
    protected JTextField txtPreimpresoNi;
    protected JTextField txtPreimpresoNs;
    protected JTextField txtItem;
    protected JTextField txtItemDesc;
    protected JTextField txtStock;
    protected JTextField txtUm;
    protected JTextField txtCantidad;
    protected JButton btnConvertir;
    protected JButton btnBuscarItem;
    protected JTable table;
    protected ItemConversionTableModel modeltable;
    protected final Main frmMain;
    protected final Usuario usuario;
    protected final UiRegisterIngreso UiRegisterIngreso;
    protected boolean isChangeHeader = false;

    public UiFormConversionVarios(URL path, Main frm, Usuario usuario, UiRegisterIngreso UiRegisterIngreso) {
        super();
        this.path = path;
        this.frmMain = frm;
        this.usuario = usuario;
        this.UiRegisterIngreso = UiRegisterIngreso;
        inicialize();
    }

    protected void inicialize() {
        gif = new Gif();
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnl.add(this.getPnlCenter(), BorderLayout.CENTER);
        pnl.add(this.getPnlSouth(), BorderLayout.SOUTH);
        this.add(pnl);
        setMinimumSize(new Dimension(600, 250));
        initListener();
    }

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblAlmacen = new JLabel("Almacen");
        pnl.add(lblAlmacen, gbc);
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        cboAlmacen = new JComboBox();
        pnl.add(cboAlmacen, gbc);
        gbc.gridwidth = 1;
        gbc.gridx = 3;
        JLabel lblFecha = new JLabel("Fecha de Ingreso");
        pnl.add(lblFecha, gbc);
        gbc.gridx = 4;
        gbc.gridwidth = 2;
        dcFechaEmision = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        pnl.add(dcFechaEmision, gbc);
        gbc.gridwidth = 1;

        gbc.gridy = 1;
        gbc.gridx = 0;
        JLabel lblIngreso = new JLabel("Doc Ingreso");
        pnl.add(lblIngreso, gbc);

        gbc.gridx = 1;
        cboSerieNi = new JComboBox();
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(cboSerieNi, gbc);

        gbc.gridx = 2;
        gbc.insets = new Insets(2, 0, 2, 0);
        txtPreimpresoNi = new JTextField();
        txtPreimpresoNi.setColumns(10);
        pnl.add(txtPreimpresoNi, gbc);
        txtPreimpresoNi.setEnabled(false);
        gbc.insets = new Insets(2, 2, 2, 2);

        gbc.gridx = 3;
        JLabel lblSalida = new JLabel("Doc Salida");
        pnl.add(lblSalida, gbc);

        gbc.gridx = 4;
        cboSerieNs = new JComboBox();
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(cboSerieNs, gbc);

        gbc.gridx = 5;
        gbc.insets = new Insets(2, 0, 2, 0);
        txtPreimpresoNs = new JTextField();
        txtPreimpresoNs.setColumns(10);
        txtPreimpresoNs.setEnabled(false);
        pnl.add(txtPreimpresoNs, gbc);
        gbc.insets = new Insets(2, 2, 2, 2);
        return pnlPrinc;
    }

    protected JPanel getPnlCenter() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.add(this.getPnlItemOrigen(), BorderLayout.NORTH);

        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        modeltable = new ItemConversionTableModel();
        table.setModel(modeltable);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 10));
        JScrollPane scroll = new JScrollPane(table);
        scroll.setPreferredSize(new Dimension(1000, 240));
        pnlPrinc.add(scroll, BorderLayout.CENTER);
        return pnlPrinc;
    }

    protected JPanel getPnlItemOrigen() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        Border border = BorderFactory.createTitledBorder(null, "Item Origen",
                TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        pnlPrinc.setBorder(border);
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblItem = new JLabel("Item");
        pnl.add(lblItem, gbc);

        gbc.gridx = 1;
        txtItem = new JTextField();
        txtItem.setColumns(6);
        txtItem.setEnabled(false);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnl.add(txtItem, gbc);

        gbc.gridx = 2;
        gbc.insets = new Insets(2, 0, 2, 0);
        txtItemDesc = new JTextField();
        txtItemDesc.setColumns(30);
        txtItemDesc.setEnabled(false);
        gbc.gridwidth = 2;
        pnl.add(txtItemDesc, gbc);
        gbc.gridwidth = 1;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.gridx = 4;
        btnBuscarItem = new JButton(gif.SEARCH16);
        pnl.add(btnBuscarItem, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblUm = new JLabel("UM");
        pnl.add(lblUm, gbc);
        gbc.gridx = 1;
        txtUm = new JTextField();
        txtUm.setEnabled(false);
        gbc.gridwidth = 2;
        gbc.fill = GridBagConstraints.HORIZONTAL;
        pnl.add(txtUm, gbc);
        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;

        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblStock = new JLabel("Stock");
        pnl.add(lblStock, gbc);

        gbc.gridx = 1;
        txtStock = new JTextField();
        txtStock.setColumns(6);
        txtStock.setEnabled(false);
        pnl.add(txtStock, gbc);

        gbc.gridx = 2;
        JLabel lblCantidad = new JLabel("Cantidad");
        pnl.add(lblCantidad, gbc);

        gbc.gridx = 3;
        txtCantidad = new JTextField();
        txtCantidad.setColumns(6);
        txtCantidad.setDocument(new DoubleDocument());
        pnl.add(txtCantidad, gbc);
        return pnlPrinc;
    }

    protected JPanel getPnlSouth() {
        JPanel pnlPrinc = new JPanel();
        btnConvertir = new JButton("Convertir", gif.SAVE16);
        pnlPrinc.add(btnConvertir, BorderLayout.SOUTH);
        return pnlPrinc;
    }

    protected void initListener() {
        btnConvertir.addActionListener(this);
        btnBuscarItem.addActionListener(this);
        cboSerieNi.addItemListener(this);
        cboSerieNs.addItemListener(this);
        cboAlmacen.addItemListener(this);
        modeltable.addTableModelListener(this);
    }

    public void loadDatos() {
    }

    protected String getPreimpresoSerie(JComboBox cboSerie) {
        return null;
    }

    protected void loadSerie(JComboBox cboSerie, String idTipoDoc) throws Exception {
    }

    protected boolean isRegisterValid() {
        return false;
    }

    protected void guardarConversion() throws Exception {
    }

    protected BeanConversion getBeanConversion() throws Exception {
        return null;
    }

    protected List<BeanItem> getItemDestino() throws Exception {
        return null;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        try {
            if (e.getSource().equals(btnBuscarItem)) {
                FormBuscarItem objBuscarItem = new FormBuscarItem(this.frmMain, this.UiRegisterIngreso, path, btnBuscarItem,
                        usuario, true);
                objBuscarItem.setVisible(true);
            }
            if (e.getSource().equals(btnConvertir)) {
                this.guardarConversion();
            }
        } catch (Exception ex) {
            ExceptionHandler.handleException(ex, logger);
            JOptionPane.showMessageDialog(this, ex.getMessage());
        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        if (e.getSource().equals(cboSerieNi)) {
            txtPreimpresoNi.setText(this.getPreimpresoSerie(cboSerieNi));
        }
        if (e.getSource().equals(cboSerieNs)) {
            txtPreimpresoNs.setText(this.getPreimpresoSerie(cboSerieNs));
        }
        if (e.getSource().equals(cboAlmacen)) {
            this.loadStock();
        }
    }

    public JButton getBtnBuscarItem() {
        return btnBuscarItem;
    }

    public void loadItemSearch(BeanItem beanItem) {
    }

    protected void changeColumnHeader() {
        if (!isChangeHeader) {
            return;
        }
        this.changeColumnHeader("Total: " + modeltable.getTotalOrigen() + " " + modeltable.getUm());
    }

    protected void changeColumnHeader(String value) {
        JTableHeader th = table.getTableHeader();
        TableColumnModel tcm = th.getColumnModel();
        TableColumn tc = tcm.getColumn(9);
        tc.setHeaderValue(value);
        th.repaint();
    }

    protected void loadItemDestino() {
    }

    protected void loadStock() {
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource().equals(modeltable)) {
            this.changeColumnHeader();
        }
    }

}

