package com.softcommerce.formularios;

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

public class RegisterLoteTransferencia
        extends JDialog implements ActionListener {

    private final URL path;
    private Gif gif;
    private final ContaItem bean;
    private JButton btnAceptar;
    private JButton btnCancelar;
    private JTable table;
    private TableModelLoteSalida modeltable;
    private final Logger logger = Logger.getLogger(RegisterLoteTransferencia.class);

    public RegisterLoteTransferencia(Main frame, URL path, ContaItem bean) {
        super(frame, true);
        this.bean = bean;
        this.path = path;
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

    private JPanel getPnlNorth() {
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
        table.getColumnModel().getColumn(7).setCellRenderer(new CellEditorCbUbicacionTrans(this.modeltable));
        table.getColumnModel().getColumn(7).setCellEditor(new CellEditorCbUbicacionTrans(this.modeltable));
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
            return logicLote.lotesConversion(bean.getId_item(), bean.getId_almacen());
        } catch (Exception e) {
            throw e;
        }
    }

    private void cargarData() {
        try {
            RnUbicacion rnUbicacion = new RnUbicacion(path);
            ArrayList<BeanUbicacion> listUbicacion = rnUbicacion.listarUbicacion(0, bean.getBeanAlmacenDestino().getIdAlmacen());
            BeanUbicacion ubicacionDefault = listUbicacion.isEmpty() ? null : listUbicacion.get(0);
            List<Lote> lotes = this.getLotesBd();
            ComboModelUbicacion comboModelUbicacion = this.getComboModelUbicacion(listUbicacion,
                    ubicacionDefault == null ? "" : ubicacionDefault.getDescripcion());
            for (Lote lote : lotes) {
                lote.setBeanUbicacionDestino(ubicacionDefault);
                lote.setModelUbicacion(comboModelUbicacion);
            }
            modeltable.clearTable();
            modeltable.agregarListLote(lotes);
            CTableFx.setAllColumnPreferredWidth(table);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private ComboModelUbicacion getComboModelUbicacion(ArrayList<BeanUbicacion> listUbicacion, String ubicacion) {
        ComboModelUbicacion modelUbicacion = new ComboModelUbicacion();
        modelUbicacion.setSelectedItem(ubicacion);
        modelUbicacion.setData(listUbicacion);
        return modelUbicacion;
    }

    private void initListener() {
        btnAceptar.addActionListener(this);
        btnCancelar.addActionListener(this);
    }

    private boolean isRegisterValid() {
        return this.validateCantidad();
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
        BigDecimal cantidad = this.getCantidadDevolver();
        bean.setCantidadLoteSalida(cantidad);
        bean.setCant_string(cantidad.toString());
        bean.setListaLotes(this.getLotes());
        this.dispose();
    }

    private ArrayList<Lote> getLotes() {
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
