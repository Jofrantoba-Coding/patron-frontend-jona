package com.softcommerce.views.uiformloteventa;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanRegcontaItem;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.TableModelLoteVenta;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.Util;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.ListSelectionModel;
import javax.swing.SwingConstants;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import org.apache.log4j.Logger;

public class UiFormLoteVenta
        extends JDialog
        implements InterUiFormLoteVenta, ActionListener, TableModelListener {

    protected Gif gif;
    protected final URL path;
    protected JTable table;
    protected TableModelLoteVenta modeltable;
    protected BeanRegcontaItem beanRci;
    protected ContaItem beanGuia;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected final Logger logger = Logger.getLogger(UiFormLoteVenta.class);
    protected JTextField txtTotal;
    protected JTextField txtCantidad;
    protected final Object objPadre;
    protected final Component comp;
    protected boolean validateCantidadTotal = false;

    public UiFormLoteVenta(Main frame, URL path, BeanRegcontaItem beanRci, Object objPadre, Component comp) {
        super(frame);
        this.path = path;
        this.beanRci = beanRci;
        this.objPadre = objPadre;
        this.comp = comp;
        inicialize();
    }

    public UiFormLoteVenta(Main frame, URL path, ContaItem beanGuia, Object objPadre, Component comp) {
        super(frame);
        this.path = path;
        this.beanGuia = beanGuia;
        this.objPadre = objPadre;
        this.comp = comp;
        inicialize();
    }

    protected void inicialize() {
        gif = new Gif();
        setMinimumSize(new Dimension(400, 250));
        this.setTitle("Seleccion de Lotes");
        JPanel pnl = new JPanel(new BorderLayout());
        pnl.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnl.add(this.getPnlCenter(), BorderLayout.CENTER);
        pnl.add(this.getPnlSouth(), BorderLayout.SOUTH);
        getContentPane().add(pnl);
        this.initListener();
        //setMinimumSize(new Dimension(400, 250));
        this.pack();
        this.setModal(true);
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void initListener() {
        modeltable.addTableModelListener(this);
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    protected String getItemDesc() {
        if (beanRci != null) {
            return beanRci.getBeanItem().getDescripcion();
        }
        return beanGuia.getItem_descripcion();
    }

    protected String getAlmacenDesc() {
        if (beanRci != null) {
            return beanRci.getBeanAlmacen().getDescripcion();
        }
        return beanGuia.getAlmacen();
    }

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        JPanel pnl = new JPanel(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblProducto = new JLabel("Producto");
        pnl.add(lblProducto, gbc);
        gbc.gridx = 1;
        JTextField txtProducto = new JTextField(this.getItemDesc());
        txtProducto.setEditable(false);
        txtProducto.setColumns(50);
        pnl.add(txtProducto, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblAlmacen = new JLabel("Almacen");
        pnl.add(lblAlmacen, gbc);
        gbc.gridx = 1;
        JTextField txtAlmacen = new JTextField(this.getAlmacenDesc());
        txtAlmacen.setEditable(false);
        txtAlmacen.setColumns(50);
        pnl.add(txtAlmacen, gbc);
        return pnlPrinc;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        modeltable = new TableModelLoteVenta();
        table.setModel(modeltable);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        JScrollPane scroll = new JScrollPane(table);
        CTableFx.setAllColumnPreferredWidth(table);
        scroll.setPreferredSize(new Dimension(800, 200));
        pnl.add(scroll, BorderLayout.CENTER);
        pnl.add(this.getPnlCantidad(), BorderLayout.SOUTH);
        return pnl;
    }

    protected JPanel getPnlCantidad() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        JPanel pnl = new JPanel(new FlowLayout(FlowLayout.LEADING, 5, 5));
        pnlPrinc.add(pnl, BorderLayout.EAST);
        JLabel lblCantidad = new JLabel("Cantidad");
        pnl.add(lblCantidad);
        txtCantidad = new JTextField();
        txtCantidad.setColumns(6);
        txtCantidad.setEditable(false);
        pnl.add(txtCantidad);
        JLabel lblTotal = new JLabel("Total");
        pnl.add(lblTotal);
        txtTotal = new JTextField();
        txtTotal.setColumns(6);
        txtTotal.setEditable(false);
        pnl.add(txtTotal);
        return pnlPrinc;
    }

    protected JPanel getPnlSouth() {
        JPanel pnlAccion = new JPanel();
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        btnCancelar.setMnemonic('C');
        btnCancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btnCancelar.setIconTextGap(10);
        btnCancelar.setFont(new Font("Verdana", 1, 10));
        btnCancelar.setOpaque(false);
        btnCancelar.setFocusPainted(false);
        pnlAccion.add(btnCancelar);
        btnAceptar = new JButton("Aceptar", gif.SAVE16);
        btnAceptar.setMnemonic('A');
        btnAceptar.setHorizontalAlignment(SwingConstants.LEFT);
        btnAceptar.setIconTextGap(10);
        btnAceptar.setFont(new Font("Verdana", 1, 10));
        btnAceptar.setOpaque(false);
        btnAceptar.setFocusPainted(false);
        pnlAccion.add(btnAceptar);
        return pnlAccion;
    }

    public void loadData() {
    }

    public void loadDataNotaSalida() {
    }

    public void loadDataGuia(boolean isEditableCantidad) {
    }

    public void setCantidadIngreso(BigDecimal cantidadIngreso) {
        txtCantidad.setText(cantidadIngreso.toString());
    }

    public void setCantidadIngreso(String cantidad) {
        txtCantidad.setText(cantidad);
    }

    public void setSelectedData() {
        modeltable.setSelectedLote(beanRci.getListLoteVenta());
        modeltable.fireTableDataChanged();
    }

    public void setSelectedDataNotaSalida() {
        modeltable.setSelectedLote(beanGuia.getListaLotes());
        modeltable.fireTableDataChanged();
    }

    protected boolean isValidData() {
        return false;
    }

    protected void obtenerDatos() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnCancelar)) {
            this.dispose();
        }
        if (e.getSource().equals(btnAceptar)) {
            obtenerDatos();
        }
    }

    @Override
    public void tableChanged(TableModelEvent e) {
        if (e.getSource().equals(modeltable)) {
            txtTotal.setText(Util.getNumberFormatEnUS(modeltable.getCantidadTotal()));
        }
    }

    public void setValidateCantidadTotal(boolean validateCantidadTotal) {
        this.validateCantidadTotal = validateCantidadTotal;
    }

}
