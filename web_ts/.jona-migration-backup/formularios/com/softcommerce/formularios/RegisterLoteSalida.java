package com.softcommerce.formularios;

import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.GuiaDevolucionProveedorTableModel;
import com.softcommerce.general.tablas.TableModelLoteSalida;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.math.BigDecimal;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.ListSelectionModel;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import javax.swing.table.AbstractTableModel;

public class RegisterLoteSalida
        extends JDialog 
        implements ActionListener {

    private final Main frmMain;
    private final URL path;
    private Gif gif;
    private JLabel lblItem;
    private final ContaItem bean;
    private final BigDecimal cantidadBean;
    private JButton btnAceptar;
    private JButton btnCancelar;
    private JTable table;
    private TableModelLoteSalida modeltable;
    private final AbstractTableModel modelGeneric;

    public RegisterLoteSalida(Main frame, URL path, ContaItem bean, BigDecimal cantidadBean,
            AbstractTableModel modelGeneric) {
        super(frame, true);
        this.frmMain = frame;
        this.bean = bean;
        this.path = path;
        this.cantidadBean = cantidadBean;
        this.modelGeneric = modelGeneric;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl = new JPanel();
        gif = new Gif();
        pnl.setLayout(new BorderLayout());
        pnl.add(getPnlNorth(), BorderLayout.NORTH);
        pnl.add(getPnlCenter(), BorderLayout.CENTER);
        pnl.add(getPnlSouth(), BorderLayout.SOUTH);
        this.getContentPane().add(pnl);
        setMinimumSize(new Dimension(500, 250));
        initListener();
        cargarData();
        this.setTitle("Lotes de Salida");
        this.pack();
    }

    private JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        lblItem = new JLabel(bean.getItem_descripcion());
        pnlPrinc.add(lblItem, BorderLayout.WEST);
        return pnlPrinc;
    }

    private JPanel getPnlCenter() {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        table = new JTable();
        table.setFont(new Font("Tahoma", Font.PLAIN, 10));
        modeltable = new TableModelLoteSalida();
        table.setModel(modeltable);
        table.setAutoResizeMode(JTable.AUTO_RESIZE_OFF);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setFont(new Font("Tahoma", Font.BOLD, 9));
        JScrollPane scroll = new JScrollPane(table);
        scroll.setPreferredSize(new Dimension(500, 120));
        pnl.add(scroll, BorderLayout.CENTER);
        return pnl;
    }

    private JPanel getPnlSouth() {
        JPanel pnlPrinc = new JPanel();
        btnAceptar = new JButton("Aceptar", gif.ADD16);
        pnlPrinc.add(btnAceptar);
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        pnlPrinc.add(btnCancelar);
        return pnlPrinc;
    }

    private List<Lote> getLotesBd() throws Exception {
        try {
            LogicLote logicLote = new LogicLote(path);
            if (modelGeneric instanceof GuiaDevolucionProveedorTableModel) {
                return logicLote.lotesDevolucionProveedor(bean.getId_item(), bean.getId_almacen(), bean.getId_regcontacab());
            }
            return logicLote.lotesConversion(bean.getId_item(), bean.getId_almacen());
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarData() {
        try {
            List<Lote> lotes = this.getLotesBd();
            modeltable.clearTable();
            modeltable.agregarListLote(lotes);
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private void initListener() {
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    private boolean isRegisterValid() {
        if (!this.validateCantidad()) {
            return false;
        }
        if (this.getCantidadDevolver().compareTo(cantidadBean) == 1) {
            JOptionPane.showMessageDialog(this, "Cantidad de devolucion no debe superar " + cantidadBean.toString());
            return false;
        }
        return true;
    }

    private boolean validateCantidad() {
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            Lote lote = modeltable.getLote(i);
            if (lote.isSwSelected() && lote.getCantidad().compareTo(BigDecimal.ZERO) == 0) {
                JOptionPane.showMessageDialog(this, "Ingrese Cantidad mayor que 0, Fila : " + (i + 1));
                return false;
            }
        }
        return true;
    }

    private BigDecimal getCantidadDevolver() {
        BigDecimal total = BigDecimal.ZERO;
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            Lote lote = modeltable.getLote(i);
            if (lote.isSwSelected()) {
                total = total.add(lote.getCantidad());
            }
        }
        return total;
    }

    private void cargarLotes() {
        if (!this.isRegisterValid()) {
            return;
        }
        bean.setCantidadLoteSalida(this.getCantidadDevolver());
        bean.setListaLotes(this.getLotes());
        this.dispose();
    }

    private ArrayList<Lote> getLotes() {
        ArrayList<Lote> lotes = new ArrayList();
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            Lote lote = modeltable.getLote(i);
            if (lote.isSwSelected()) {
                lotes.add(lote);
            }
        }
        return lotes;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource().equals(btnCancelar)) {
            this.dispose();
        }
        if (e.getSource().equals(btnAceptar)) {
            this.cargarLotes();
        }
    }

}
