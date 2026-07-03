package com.softcommerce.views.uiformlotemovimiento;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.LoteMovimiento;
import com.softcommerce.beans.StockLaboratorio;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.LoteMovTableModel;
import com.softcommerce.general.tablas.ReservaTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.toedter.calendar.JDateChooser;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.URL;
import java.util.Date;
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
import org.apache.log4j.Logger;

public class UiFormLoteMovimiento
        extends JDialog
        implements InterUiFormLoteMovimiento, ActionListener {

    protected Gif gif;
    protected final URL path;
    protected JButton btnCerrar;
    protected JTable table;
    protected LoteMovTableModel modeltable;
    protected ReservaTableModel modelReserva;
    protected final Logger logger = Logger.getLogger(UiFormLoteMovimiento.class);
    protected final StockLaboratorio stockLaboratorio;
    protected final Date fechaEmision;
    protected final String tipoForm;

    public UiFormLoteMovimiento(Main frame, URL path, StockLaboratorio stockLaboratorio,
            Date fechaEmision, String tipoForm) {
        super(frame);
        this.tipoForm = tipoForm;
        this.stockLaboratorio = stockLaboratorio;
        this.path = path;
        this.fechaEmision = fechaEmision;
        inicialize();
    }

    protected void inicialize() {
        gif = new Gif();
        setMinimumSize(new Dimension(400, 250));
        if (tipoForm.equalsIgnoreCase("M")) {
            this.setTitle("Detalle de Movimientos de Lotes");
        }else if(tipoForm.equalsIgnoreCase("R")){
            this.setTitle("Detalle de Reserva de Lotes");
        }        
        JPanel pnl = new JPanel(new BorderLayout());
        pnl.add(this.getPnlNorth(), BorderLayout.NORTH);
        pnl.add(this.getPnlCenter(), BorderLayout.CENTER);
        pnl.add(this.getPnlSouth(), BorderLayout.SOUTH);
        getContentPane().add(pnl);
        this.initListener();
        this.pack();
        this.setModal(true);
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel(new BorderLayout());
        JPanel pnl = new JPanel(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        JLabel lblProducto = new JLabel("Producto");
        pnl.add(lblProducto, gbc);
        gbc.gridx = 1;
        JTextField txtProducto = new JTextField(stockLaboratorio.getBeanStockAlmacen().getProducto());
        txtProducto.setEditable(false);
        txtProducto.setColumns(50);
        pnl.add(txtProducto, gbc);
        gbc.gridx = 2;
        JLabel lblFecha = new JLabel("Fecha Fin");
        pnl.add(lblFecha, gbc);
        gbc.gridx = 3;
        JDateChooser dcFechaFin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        dcFechaFin.setEnabled(false);
        dcFechaFin.setDate(fechaEmision);
        pnl.add(dcFechaFin, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        JLabel lblAlmacen = new JLabel("Almacen");
        pnl.add(lblAlmacen, gbc);
        gbc.gridx = 1;
        JTextField txtAlmacen = new JTextField(stockLaboratorio.getBeanStockAlmacen().getAlmacen());
        txtAlmacen.setEditable(false);
        txtAlmacen.setColumns(50);
        pnl.add(txtAlmacen, gbc);
        gbc.gridx = 2;
        JLabel lblUbicacion = new JLabel("Ubicacion");
        pnl.add(lblUbicacion, gbc);
        gbc.gridx = 3;
        JTextField txtUbicacion = new JTextField(stockLaboratorio.getBeanUbicacion().getDescripcion());
        txtUbicacion.setEditable(false);
        txtUbicacion.setColumns(20);
        pnl.add(txtUbicacion, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblLaboratorio = new JLabel("Laboratorio");
        pnl.add(lblLaboratorio, gbc);
        gbc.gridx = 1;
        JTextField txtLaboratorio = new JTextField(stockLaboratorio.getBeanLaboratorioClinico().getDescripcion());
        txtLaboratorio.setEditable(false);
        txtLaboratorio.setColumns(50);
        pnl.add(txtLaboratorio, gbc);
        gbc.gridx = 2;
        JLabel lblNumero = new JLabel("Numero");
        pnl.add(lblNumero, gbc);
        gbc.gridx = 3;
        JTextField txtNumero = new JTextField(stockLaboratorio.getNumeroLote());
        txtNumero.setEditable(false);
        txtNumero.setColumns(20);
        pnl.add(txtNumero, gbc);
        return pnlPrinc;
    }

    protected JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 11));
        table.setRowHeight(19);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        if (tipoForm.equalsIgnoreCase("M")) {
            modeltable = new LoteMovTableModel();
            table.setModel(modeltable);
        } else if (tipoForm.equalsIgnoreCase("R")) {
            modelReserva = new ReservaTableModel();
            table.setModel(modelReserva);
        }
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 11));
        JScrollPane scroll = new JScrollPane(table);
        CTableFx.setAllColumnPreferredWidth(table);
        scroll.setPreferredSize(new Dimension(1000, 400));
        pnl.add(scroll, BorderLayout.CENTER);
        return pnl;
    }

    protected JPanel getPnlSouth() {
        JPanel pnlAccion = new JPanel();
        btnCerrar = new JButton("Cerrar", gif.CANCEL16);
        btnCerrar.setMnemonic('C');
        btnCerrar.setHorizontalAlignment(SwingConstants.LEFT);
        btnCerrar.setIconTextGap(10);
        btnCerrar.setFont(new Font("Verdana", 1, 10));
        btnCerrar.setOpaque(false);
        btnCerrar.setFocusPainted(false);
        pnlAccion.add(btnCerrar);
        return pnlAccion;
    }

    protected void initListener() {
        btnCerrar.addActionListener(this);
    }

    public void loadData() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnCerrar)) {
            this.dispose();
        }
    }
}
