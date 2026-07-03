package com.softcommerce.views.uiregisterlotetransferencia;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanUbicacion;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Lote;
import com.softcommerce.comboboxmodel.ComboModelUbicacion;
import com.softcommerce.general.herramientas.CTableFx;
import com.softcommerce.general.tablas.TableModelLoteSalida;
import com.softcommerce.iconos.Gif;
import com.softcommerce.logic.LogicLote;
import com.softcommerce.reglasnegocio.RnUbicacion;
import com.softcommerce.util.editor.CellEditorCbUbicacionTrans;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
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
import javax.swing.JTextField;
import org.apache.log4j.Logger;

public class UiRegisterLoteTransferencia
        extends JDialog implements InterUiRegisterLoteTransferencia, ActionListener {

    protected final URL path;
    protected Gif gif;
    protected final ContaItem bean;
    protected JButton btnAceptar;
    protected JButton btnCancelar;
    protected JTable table;
    protected TableModelLoteSalida modeltable;
    protected final Logger logger = Logger.getLogger(UiRegisterLoteTransferencia.class);

    public UiRegisterLoteTransferencia(Main frame, URL path, ContaItem bean) {
        super(frame, true);
        this.bean = bean;
        this.path = path;
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
        setMinimumSize(new Dimension(650, 300));
        initListener();
        cargarData();
        this.setTitle("Lotes de Transferencias");
        this.pack();
    }
    
    public void setSelectedData() {
        modeltable.setSelectedLote(bean.getListaLotes());
        modeltable.fireTableDataChanged();
    }

    protected JPanel getPnlNorth() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel(new GridBagLayout());
        pnlPrinc.add(pnl, BorderLayout.WEST);
        GridBagConstraints gbc = LayoutUtil.getGbc();
        pnl.add(new JLabel("Item"), gbc);
        gbc.gridx = 1;
        JTextField txtItem = new JTextField(bean.getItem_descripcion());
        txtItem.setColumns(30);
        txtItem.setEnabled(false);
        pnl.add(txtItem, gbc);
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnl.add(new JLabel("Almacen Origen"), gbc);
        gbc.gridx = 1;
        JTextField txtAlmacenOrigen = new JTextField(bean.getAlmacen());
        txtAlmacenOrigen.setColumns(30);
        txtAlmacenOrigen.setEnabled(false);
        pnl.add(txtAlmacenOrigen, gbc);
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnl.add(new JLabel("Almacen Destino"), gbc);
        gbc.gridx = 1;
        JTextField txtAlmacenDestino = new JTextField(bean.getBeanAlmacenDestino().getDescripcion());
        txtAlmacenDestino.setColumns(30);
        txtAlmacenDestino.setEnabled(false);
        pnl.add(txtAlmacenDestino, gbc);
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
        table.getColumnModel().getColumn(7).setCellRenderer(new CellEditorCbUbicacionTrans(this.modeltable));
        table.getColumnModel().getColumn(7).setCellEditor(new CellEditorCbUbicacionTrans(this.modeltable));
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

    protected ComboModelUbicacion getComboModelUbicacion(ArrayList<BeanUbicacion> listUbicacion, String ubicacion) {
        ComboModelUbicacion modelUbicacion = new ComboModelUbicacion();
        modelUbicacion.setSelectedItem(ubicacion);
        modelUbicacion.setData(listUbicacion);
        return modelUbicacion;
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
                lote.setIdUbicacion(lote.getBeanUbicacionDestino() == null ? 0 : lote.getBeanUbicacionDestino().getIdUbicacion());
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
