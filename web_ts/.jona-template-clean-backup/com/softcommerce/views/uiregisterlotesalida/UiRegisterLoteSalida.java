package com.softcommerce.views.uiregisterlotesalida;


import com.softcommerce.formularios.*;
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

public class UiRegisterLoteSalida
        extends JDialog 
        implements InterUiRegisterLoteSalida, ActionListener {

    protected final Main frmMain;
    protected final URL path;
    protected Gif gif;
    protected JLabel lblItem;
    protected final ContaItem bean;
    protected final BigDecimal cantidadBean;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected JTable table;
    protected TableModelLoteSalida modeltable;
    protected final AbstractTableModel modelGeneric;

    public UiRegisterLoteSalida(Main frame, URL path, ContaItem bean, BigDecimal cantidadBean,
            AbstractTableModel modelGeneric) {
        super(frame, true);
        this.frmMain = frame;
        this.bean = bean;
        this.path = path;
        this.cantidadBean = cantidadBean;
        this.modelGeneric = modelGeneric;
        inicialize();
    }

    protected void inicialize() {
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

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        lblItem = new JLabel(bean.getItem_descripcion());
        pnlPrinc.add(lblItem, BorderLayout.WEST);
        return pnlPrinc;
    }

    protected JPanel getPnlCenter() {
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

    protected JPanel getPnlSouth() {
        JPanel pnlPrinc = new JPanel();
        btnAceptar = new JButton("Aceptar", gif.ADD16);
        pnlPrinc.add(btnAceptar);
        btnCancelar = new JButton("Cancelar", gif.CANCEL16);
        pnlPrinc.add(btnCancelar);
        return pnlPrinc;
    }

    protected List<Lote> getLotesBd() throws Exception {
        return null;
    }

    protected void cargarData() {
    }

    protected void initListener() {
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    protected boolean isRegisterValid() {
        return false;
    }

    protected boolean validateCantidad() {
        return false;
    }

    protected BigDecimal getCantidadDevolver() {
        BigDecimal total = BigDecimal.ZERO;
        for (int i = 0; i < modeltable.getRowCount(); i++) {
            Lote lote = modeltable.getLote(i);
            if (lote.isSwSelected()) {
                total = total.add(lote.getCantidad());
            }
        }
        return total;
    }

    protected void cargarLotes() {
    }

    protected ArrayList<Lote> getLotes() {
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
